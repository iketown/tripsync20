import React from "react";
import ClickableMarker from "./ClickableMarker";
import { NearbyAirport } from "../../types/location.types";
import { Grid, Typography } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { FaPlane } from "react-icons/fa";
//
//
interface AirportCMarkerProps {
  isSelected: boolean;
  handleClick: () => void;
  ap: NearbyAirport;
}
const AirportCMarker = ({
  isSelected,
  handleClick,
  ap
}: AirportCMarkerProps) => {
  const icon = (
    <FaPlane style={{ color: isSelected ? purple[700] : purple[200] }} />
  );
  const popupDisplay = (
    <Grid container spacing={2} justify="center">
      <Grid item>
        <Typography variant="caption">
          <b>{ap.iataCode}</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption">
          {Math.round(ap.distanceMi)} mi
        </Typography>
      </Grid>
    </Grid>
  );
  const location = ap;
  return (
    <ClickableMarker
      {...{ popupDisplay, handleClick, location, icon }}
    ></ClickableMarker>
  );
};

export default AirportCMarker;
