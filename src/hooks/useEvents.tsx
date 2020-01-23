import { useEffect, useState, useCallback } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useGroupCtx } from "../components/group/GroupCtx";
import { Event, EventTypeOption } from "../types/Event";
import { useField } from "react-final-form";
import { useEventsCtx } from "../contexts/eventsCtx/EventsCtx";

export const useNearbyAirports = (eventId: string) => {
  const { eventsObj } = useEventsCtx();
  const locId = eventsObj && eventsObj[eventId]?.locId;
  console.log("locId in useNearbyAPs", locId);
};

export const useEventFxns = () => {
  const { group } = useGroupCtx();
  const { firestore } = useFirebaseCtx();

  const deleteEvent = async (eventId: string, cb?: () => void) => {
    if (!group || !group.id) return null;
    const eventRef = firestore?.doc(`groups/${group.id}/events/${eventId}`);
    await eventRef?.delete();
    cb && cb();
  };
  return { deleteEvent };
};
