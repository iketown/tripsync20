import moment from "moment";
import { useCallback } from "react";

import { useGroupCtx } from "../components/group/GroupCtx";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useTravelCtx } from "../contexts/travelCtx/TravelCtx";
import { convertTraxoSegToTLeg } from "../forms/smartTravels/smartTravelHelpers";
import { TravelEmail } from "../forms/smartTravels/travelEmail.types";
import { Event } from "../types/Event";
import { TravelLeg } from "../types/travel.types";
import { useEventsCtx } from "../contexts/eventsCtx/EventsCtx";
//
//
export const useTravel = () => {
  const { group } = useGroupCtx();
  const { firestore, firebase } = useFirebaseCtx();
  const { travelObj, travels } = useTravelCtx();

  const getOrCreateTravel = useCallback(
    async ({ event }: { event: Event }) => {
      if (travelObj && travelObj[event.id]) return travelObj[event.id];
      if (!group || !group.id) return;
      const travelRef = firestore?.doc(
        `groups/${group.id}/travels/${event.id}`
      );
      const travel =
        travelRef &&
        (await travelRef
          .get()
          .then(doc => doc.exists && { id: doc.id, ...doc.data() }));
      if (travel) return travel;
      const { startUnix } = event;
      const newEventInfo = { toEventId: event.id, startUnix };
      return travelRef
        ?.set(newEventInfo, { merge: true })
        .then(() => {
          return { ...newEventInfo, id: event.id };
        })
        .catch(err => {
          return err;
        });
    },
    [firestore, group, travelObj]
  );

  const updateTravelLeg = ({
    travelId,
    leg,
    update
  }: {
    travelId: string;
    leg: string;
    update: { [field: string]: any };
  }) => {};

  const deleteTravelLeg = ({
    travelId,
    leg
  }: {
    travelId: string;
    leg: string;
  }) => {
    if (!group) return null;
    const travelLoc = `groups/${group.id}/travels/${travelId}`;
    const fieldName = "legs." + leg;
    firestore?.doc(travelLoc).update(
      //@ts-ignore
      { [fieldName]: firebase.firestore.FieldValue.delete() }
    );
  };

  const createTravel = async (values: any) => {
    if (!group || !group.id) return null;
    const { startUnix, endUnix } = getStartEndUnix(values);
    const travelsRef = firestore?.collection(`groups/${group.id}/travels`);
    await travelsRef?.add({ ...values, startUnix, endUnix });
  };

  const addItineraryToTravel = async ({
    itinerary,
    travelId
  }: {
    itinerary: TravelEmail;
    travelId: string;
  }) => {
    if (!group || !group.id) return null;
    const itinsRef = firestore?.doc(
      `groups/${group.id}/travels/${travelId}/itineraries/${itinerary.id}`
    );
    itinsRef?.update(itinerary);
  };

  const addEmailToTravel = async ({
    email,
    travelId
  }: {
    email: TravelEmail;
    travelId: string;
  }) => {
    if (!group || !group.id) return;
    // 1. parse email for pertinent info
    const _legs = email.segments.reduce(
      (obj: { [legId: string]: TravelLeg }, seg) => {
        const response = convertTraxoSegToTLeg(seg);
        if (!response) return obj;
        const { leg, legId } = response;
        obj[`legs.${legId}`] = leg;
        return obj;
      },
      {}
    );
    // 2. add parsed info to travel
    // 3. mark email as imported
    const updateObj: any = {
      [`travelEmails.${email.id}.imported`]: true,
      ..._legs
    };

    const travelRef = firestore?.doc(`groups/${group.id}/travels/${travelId}`);
    await travelRef?.update(updateObj);
  };

  return {
    createTravel,
    addItineraryToTravel,
    getOrCreateTravel,
    addEmailToTravel,
    deleteTravelLeg,
    updateTravelLeg
  };
};

// other fxns

interface ILegs {
  legs: { startDate: string; endDate: string }[];
}
const getStartEndUnix = (
  values: ILegs
): { startUnix: number; endUnix: number } => {
  const firstLeg = values.legs[0];
  const lastLeg = values.legs[values.legs.length - 1];
  const startUnix = moment(firstLeg.startDate).unix();
  const endUnix = moment(lastLeg.endDate).unix();
  if (!startUnix || !endUnix || startUnix > endUnix)
    throw new Error(`problem w unix - - start: ${startUnix} end: ${endUnix}`);
  return { startUnix, endUnix };
};
