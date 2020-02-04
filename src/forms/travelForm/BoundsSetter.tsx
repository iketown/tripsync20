import React, { useEffect, useState } from "react";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useTravelFormCtx } from "./TravelFormContext";
import { LocPoint } from "../../types/location.types";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";

//
//
const BoundsSetter = () => {
  // watches to see if there is a TO and FROM
  // once there is, sets one and only one route, sends it to map ctx.
  const { travel, fromEvent, toEvent, selectedLeg } = useTravelFormCtx();
  const { dispatch } = useMapBoxCtx();
  const legs = travel?.legs;
  // if selected leg, change the bounds to show only the to and from of that one.
  // then if unselected, go back to showing everything.
  useEffect(() => {
    const bounds: LocPoint[] = [];
    const _fromLoc = fromEvent?.locBasic;
    const _toLoc = toEvent?.locBasic;
    _fromLoc && bounds.push(_fromLoc);
    _toLoc && bounds.push(_toLoc);
    legs &&
      Object.values(legs).forEach((leg: any) => {
        if (leg.fromLocBasic) bounds.push(leg.fromLocBasic);
        if (leg.toLocBasic) bounds.push(leg.toLocBasic);
      });
    dispatch && dispatch({ type: "SET_BOUNDS", payload: { bounds } });
  }, [legs, dispatch, fromEvent, toEvent]);

  return null;
};

export default BoundsSetter;
