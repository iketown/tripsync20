import React, { createContext, useContext, useState, useEffect } from "react";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import { TravelType } from "../../types/travel.types";
import { useTravelCtx } from "../../contexts/travelCtx/TravelCtx";
import { useTravel } from "../../hooks/useTravel";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import { Event } from "../../types/Event";
//
//
type TravelFormCtxType = {
  travel: TravelType;
  fromEvent: Event;
  toEvent: Event;
  selectedLeg: string;
  setSelectedLeg: React.Dispatch<React.SetStateAction<string>>;
};

const TravelFormCtx = createContext<Partial<TravelFormCtxType>>({});

export const TravelFormCtxProvider = (props: any) => {
  const [travel, setTravel] = useState();
  const { state, dispatch: dialogDispatch } = useDialogCtx();
  const [selectedLeg, setSelectedLeg] = useState("");
  const { travelObj } = useTravelCtx();
  const { eventsObj } = useEventsCtx();
  const { getOrCreateTravel } = useTravel();
  const { fromEventId, toEventId } = state.props;

  // travelId is always the same as the id of the NEXT gig.
  const travelId = toEventId;

  useEffect(() => {
    // make sure this travel doc exists.  create if not.
    const getTravel = async (event: Event) => {
      const _travel = await getOrCreateTravel({ event });
      setTravel(_travel);
    };
    if (!travel && eventsObj) {
      getTravel(eventsObj[toEventId]);
    }
  }, [eventsObj, getOrCreateTravel, toEventId, travel]);

  useEffect(() => {
    // keep form travel up to date
    if (travelObj && travelObj[travelId]) {
      setTravel(travelObj[travelId]);
    }
  }, [travelId, travelObj]);

  const fromEvent = eventsObj && eventsObj[fromEventId];
  const toEvent = eventsObj && eventsObj[toEventId];

  return (
    <TravelFormCtx.Provider
      value={{ travel, fromEvent, toEvent, selectedLeg, setSelectedLeg }}
      {...props}
    />
  );
};

export const useTravelFormCtx = () => {
  const ctx = useContext(TravelFormCtx);

  return ctx;
};
