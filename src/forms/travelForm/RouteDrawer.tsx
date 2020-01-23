import React, { useEffect } from "react";
import { useField } from "react-final-form";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";

const RouteDrawer = ({ leg }: { leg: string }) => {
  // watches to see if there is a TO and FROM
  // once there is, sets one and only one route, sends it to map ctx.
  const {
    input: { value: fromLoc }
  } = useField(`${leg}.fromLocBasic`);
  const {
    input: { value: toLoc }
  } = useField(`${leg}.toLocBasic`);
  const {
    input: { value: travelType }
  } = useField(`${leg}.travelType`);
  const { dispatch } = useMapBoxCtx();
  useEffect(() => {
    if (fromLoc && toLoc && travelType) {
      dispatch &&
        dispatch({
          type: "SET_ROUTES",
          payload: { routes: [{ fromLoc, toLoc, travelType }] }
        });
    }
  }, [dispatch, fromLoc, toLoc, travelType]);
  return null;
};

export default RouteDrawer;
