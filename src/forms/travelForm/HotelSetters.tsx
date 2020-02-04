import { useCallback, useEffect } from "react";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import { useTravelFormCtx } from "./TravelFormContext";

//
//
const HotelSetters = () => {
  const { fromEvent, toEvent } = useTravelFormCtx();
  const { dispatch } = useMapBoxCtx();

  const dedupe = useCallback((hotels: any[]) => {
    return hotels.filter(
      (h, i, arr) => arr.findIndex(_h => _h.id === h.id) === i
    );
  }, []);

  useEffect(() => {
    if (fromEvent) {
      let { amHotels = [], pmHotels = [] } = fromEvent;
      const hotels = dedupe([...amHotels, ...pmHotels]);
      dispatch &&
        dispatch({
          type: "SET_LOCS",
          payload: {
            toOrFrom: "from",
            locs: hotels.map(({ locBasic }) => locBasic),
            locName: "hotels"
          }
        });
    }
  }, [dedupe, dispatch, fromEvent]);
  useEffect(() => {
    if (toEvent) {
      let { amHotels = [], pmHotels = [] } = toEvent;
      const hotels = dedupe([...amHotels, ...pmHotels]);
      dispatch &&
        dispatch({
          type: "SET_LOCS",
          payload: {
            toOrFrom: "to",
            locs: hotels.map(({ locBasic }) => locBasic),
            locName: "hotels"
          }
        });
    }
  }, [dedupe, dispatch, toEvent]);

  return null;
};

export default HotelSetters;
