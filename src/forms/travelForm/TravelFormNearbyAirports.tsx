import React, { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "react-final-form";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import { LocBasicType, NearbyAirport } from "../../types/location.types";
import { TravelTypeOption } from "../../types/travel.types";

const TravelFormNearbyAirports = ({
  loc,
  leg,
  toOrFrom
}: {
  loc?: LocBasicType;
  leg: string;
  toOrFrom?: string;
}) => {
  const { firestore } = useFirebaseCtx();
  const { state, dispatch } = useMapBoxCtx();
  const {
    input: { value: travelType }
  } = useField(`${leg}.travelType`);

  const [nearbyAirports, setNearbyAirports] = useState<NearbyAirport[]>([]);

  useEffect(() => {
    // put into map context if they exist
    if (travelType === TravelTypeOption.fly && nearbyAirports.length) {
      dispatch &&
        dispatch({
          type: "SET_AIRPORTS",
          payload: { airports: nearbyAirports, toOrFrom }
        });
    } else {
      // remove from context
      dispatch &&
        dispatch({
          type: "SET_AIRPORTS",
          payload: { airports: [], toOrFrom }
        });
    }
  }, [dispatch, travelType, nearbyAirports, toOrFrom]);

  useEffect(() => {
    // get airports from firestore
    const getAirports = async () => {
      if (!loc || !loc.id) return null;
      const locRef = firestore?.doc(`locations/${loc.id}`);
      const location = await locRef?.get().then(doc => doc.data());
      if (location?.nearbyAirports) {
        setNearbyAirports(location.nearbyAirports);
      }
    };
    if (loc && loc.id) {
      console.log("getting airports for", loc);
      getAirports();
    }
  }, [dispatch, firestore, loc]);
  return <div />;
};

export default TravelFormNearbyAirports;
