import { useEffect } from "react";
import { useFormState } from "react-final-form";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useEventFxns } from "../../hooks/useEvents";
import { TravelType } from "../../types/travel.types";
import { useTravelFormCtx } from "./TravelFormContext";

//
//
const AirportSetters = () => {
  const { fromEvent, toEvent } = useTravelFormCtx();
  const { dispatch } = useMapBoxCtx();
  const { getNearbyAirports } = useEventFxns();
  const fromEventId = fromEvent?.id;
  const toEventId = toEvent?.id;

  useEffect(() => {
    const getAirports = async () => {
      if (!fromEventId) return null;
      const airports = await getNearbyAirports(fromEventId);
      dispatch &&
        airports &&
        airports.length &&
        dispatch({
          type: "SET_LOCS",
          payload: { locs: airports, toOrFrom: "from", locName: "airports" }
        });
    };
    fromEventId && getAirports();
  }, [dispatch, fromEventId, getNearbyAirports]);

  useEffect(() => {
    const getAirports = async () => {
      if (!toEventId) return null;
      const airports = await getNearbyAirports(toEventId);
      dispatch &&
        airports &&
        airports.length &&
        dispatch({
          type: "SET_LOCS",
          payload: { locs: airports, toOrFrom: "to", locName: "airports" }
        });
    };
    toEventId && getAirports();
  }, [dispatch, getNearbyAirports, toEventId]);

  return null;
};

export default AirportSetters;
