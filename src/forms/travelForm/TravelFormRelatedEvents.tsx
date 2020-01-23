import React, { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "react-final-form";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import { Event, EventTypeOption } from "../../types/Event";
import { TravelTypeOption } from "../../types/travel.types";

const GetRelatedEvents = ({ event, leg }: { event: Event; leg: string }) => {
  const { relatedEvents } = useEventsCtx(event.id);

  const {
    input: { value: travelType }
  } = useField(`${leg}.travelType`);
  const { state, dispatch } = useMapBoxCtx();

  const dispatchRef = useRef(dispatch);
  const travelTypeRef = useRef(travelType);
  const relatedEventsRef = useRef(relatedEvents);

  useEffect(() => {
    console.assert(dispatch === dispatchRef.current, "dispatch changed");
    console.assert(travelType === travelTypeRef.current, "travelType changed");
    console.assert(
      relatedEvents === relatedEventsRef.current,
      "relatedEvents changed"
    );
    dispatchRef.current = dispatch;
    travelTypeRef.current = travelType;
    relatedEventsRef.current = relatedEvents;

    const groundTypes = [
      TravelTypeOption.bus,
      TravelTypeOption.car,
      TravelTypeOption.other
    ];
    if (relatedEvents?.length && groundTypes.includes(travelType)) {
      dispatch &&
        dispatch({
          type: "SET_HOTELS",
          payload: {
            hotels: relatedEvents
              .filter(({ eventType }) => eventType === EventTypeOption.hotel)
              .map(ev => ev.locBasic)
          }
        });
    } else {
      // empty hotels
      dispatch &&
        dispatch({
          type: "SET_HOTELS",
          payload: {
            hotels: []
          }
        });
    }
  }, [dispatch, travelType, relatedEvents]);
  return null;
};

export default GetRelatedEvents;
