import { useEffect } from "react";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import { useTravelFormCtx } from "./TravelFormContext";

//
//
const GigSetters = () => {
  const { fromEvent, toEvent } = useTravelFormCtx();
  const { dispatch } = useMapBoxCtx();

  useEffect(() => {
    if (fromEvent) {
      dispatch &&
        dispatch({
          type: "SET_LOCS",
          payload: {
            toOrFrom: "from",
            locs: [fromEvent],
            locName: "gigs"
          }
        });
    }
  }, [dispatch, fromEvent]);
  useEffect(() => {
    if (toEvent) {
      dispatch &&
        dispatch({
          type: "SET_LOCS",
          payload: {
            toOrFrom: "to",
            locs: [toEvent],
            locName: "gigs"
          }
        });
    }
  }, [dispatch, toEvent]);

  return null;
};

export default GigSetters;
