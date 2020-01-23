import React, { useState, useEffect, useCallback } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useGroupCtx } from "../components/group/GroupCtx";
import {
  TravelBasic,
  TravelLeg,
  TravelType,
  TravelForm
} from "../types/travel.types";
import { useEventsCtx } from "../contexts/eventsCtx/EventsCtx";
import moment from "moment";

export const useTravel = () => {
  const { group } = useGroupCtx();
  const { firestore } = useFirebaseCtx();

  const updateTravel = async (
    {
      toEventId,
      fromEventId,
      startDate = ""
    }: {
      toEventId: string;
      fromEventId: string;
      startDate?: string;
    },
    travelId?: string
  ) => {
    if (!group || !group.id || !firestore) return null;
    const travelsRef = firestore.collection(`groups/${group.id}/travels`);
    let newTravelId = travelId;
    if (!travelId) {
      newTravelId = await travelsRef
        ?.add({ toEventId, fromEventId, startDate })
        .then(ref => ref.id);
    } else {
      await travelsRef
        .doc(travelId)
        .set({ toEventId, fromEventId, startDate }, { merge: true });
    }
    return newTravelId;
  };

  const addLegToTravel = async (legInfo: TravelForm, travelId?: string) => {
    const { toEventId, fromEventId, ...restLegInfo } = legInfo;
    const startDate = legInfo.startDate;
    let newTravelId = await updateTravel(
      { toEventId, fromEventId, startDate },
      travelId
    );
    if (newTravelId && group && group.id) {
      const response = await firestore
        ?.collection(`groups/${group.id}/travels/${newTravelId}/legs`)
        .add(restLegInfo);
      console.log("response", response);
    }
  };

  return { addLegToTravel };
};
