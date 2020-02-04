import { useEffect, useState, useCallback } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useGroupCtx } from "../components/group/GroupCtx";
import { Event, EventTypeOption } from "../types/Event";
import { useField } from "react-final-form";
import { useEventsCtx } from "../contexts/eventsCtx/EventsCtx";

export const useEventFxns = () => {
  const { group } = useGroupCtx();
  const { firestore } = useFirebaseCtx();
  const { eventsObj } = useEventsCtx();

  const deleteEvent = async (eventId: string, cb?: () => void) => {
    if (!group || !group.id) return null;
    const eventRef = firestore?.doc(`groups/${group.id}/events/${eventId}`);
    await eventRef?.delete();
    cb && cb();
  };

  const getNearbyAirports = useCallback(
    async (eventId: string) => {
      const locId = eventsObj && eventsObj[eventId]?.locId;
      const loc =
        locId &&
        (await firestore
          ?.doc(`locations/${locId}`)
          .get()
          .then(doc => doc.data()));
      return loc && loc.nearbyAirports;
    },
    [eventsObj, firestore]
  );
  return { deleteEvent, getNearbyAirports };
};
