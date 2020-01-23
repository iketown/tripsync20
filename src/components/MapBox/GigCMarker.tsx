import React from "react";
import ClickableMarker from "./ClickableMarker";
import { NearbyAirport, LocBasicType } from "../../types/location.types";
import { Grid, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { FaStar } from "react-icons/fa";
import { Event } from "../../types/Event";
//
//
interface GigCMarkerProps {
  isSelected?: boolean;
  handleClick?: () => void;
  gigLoc: LocBasicType;
}
const GigCMarker = ({
  isSelected,
  gigLoc,
  handleClick = () => console.log("clicked", gigLoc)
}: GigCMarkerProps) => {
  const icon = <FaStar style={{ color: isSelected ? blue[700] : blue[200] }} />;
  const popupDisplay = (
    <Grid container spacing={2} justify="center">
      <Grid item>
        <Typography variant="caption">
          <b>{gigLoc.venueName}</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption">yo there.</Typography>
      </Grid>
    </Grid>
  );
  const location = gigLoc;
  return (
    <ClickableMarker
      {...{ popupDisplay, handleClick, location, icon }}
    ></ClickableMarker>
  );
};

export default GigCMarker;
