import React, { useEffect } from "react";

import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { useTravelFormCtx } from "./TravelFormContext";
import { TravelLeg, TravelTypeOption } from "../../types/travel.types";
import { Route } from "../../types/location.types";

const RouteDrawer = () => {
  const { travel } = useTravelFormCtx();
  // watches to see if there is a TO and FROM
  // once there is, sets one and only one route, sends it to map ctx.
  const legs = travel?.legs;
  const { dispatch } = useMapBoxCtx();

  useEffect(() => {
    const routes: Route[] = [];
    legs &&
      Object.values(legs).forEach((leg: TravelLeg) => {
        if (leg.fromLocBasic && leg.toLocBasic) {
          const {
            travelType,
            fromLocBasic: fromLoc,
            toLocBasic: toLoc,
            path
          } = leg;
          routes.push({
            travelType,
            fromLoc,
            toLoc,
            path: path || [fromLoc, toLoc]
          });
        }
      });
    dispatch && dispatch({ type: "SET_ROUTES", payload: { routes } });
  }, [legs, dispatch]);

  return null;
};

export default RouteDrawer;
