import React from "react";
import ClickableMarker from "./ClickableMarker";
import { NearbyAirport, LocBasicType } from "../../types/location.types";
import { Grid, Typography } from "@material-ui/core";
import { blue, green } from "@material-ui/core/colors";
import { FaStar, FaHSquare } from "react-icons/fa";
import { Event } from "../../types/Event";
//
//
interface HotelCMarkerProps {
  isSelected?: boolean;
  handleClick?: () => void;
  hotelLoc: LocBasicType;
}
const HotelCMarker = ({
  isSelected,
  hotelLoc,
  handleClick = () => console.log("clicked", hotelLoc)
}: HotelCMarkerProps) => {
  const icon = (
    <FaHSquare style={{ color: isSelected ? green[700] : green[200] }} />
  );
  const popupDisplay = (
    <Grid container spacing={2} justify="center">
      <Grid item>
        <Typography variant="caption">
          <b>{hotelLoc.venueName}</b>
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption">yo there.</Typography>
      </Grid>
    </Grid>
  );
  const location = hotelLoc;
  return (
    <ClickableMarker
      {...{ popupDisplay, handleClick, location, icon }}
    ></ClickableMarker>
  );
};

export default HotelCMarker;
