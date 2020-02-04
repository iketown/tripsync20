import moment from "moment-timezone";
import React, { useState } from "react";

import { useTravel } from "../../hooks/useTravel";
import { LocBasicType } from "../../types/location.types";
import { useTravelFormCtx } from "./TravelFormContext";
import { Dialog, DialogContent, DialogActions } from "@material-ui/core";

const LegTimeDisplay = ({
  locBasic,
  unix,
  leg,
  toOrFrom
}: {
  locBasic: LocBasicType;
  unix: number;
  leg: string;
  toOrFrom: string;
}) => {
  const { travel } = useTravelFormCtx();
  const { updateTravelLeg } = useTravel();
  const thisLeg = travel?.legs[leg];
  console.log("thisLeg", thisLeg);
  const editable = thisLeg && thisLeg.enteredBy === "manual";
  const [editing, setEditing] = useState("");

  return (
    <div>
      <span>
        {toOrFrom === "from" ? "depart" : toOrFrom === "to" ? "arrive" : ""}{" "}
      </span>
      <b>{locBasic.venueName}</b>
      <span> at </span>
      <b>
        {moment
          .unix(unix)
          .tz(locBasic.timeZoneId)
          .format("h:mm")}
      </b>
      <span>
        {" "}
        {moment
          .unix(unix)
          .tz(locBasic.timeZoneId)
          .format("a z")}
      </span>
    </div>
  );
};

export default LegTimeDisplay;
