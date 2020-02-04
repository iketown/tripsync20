import React from "react";
import ClickableMarker from "./ClickableMarker";
import { NearbyAirport, LocBasicType } from "../../types/location.types";
import { Grid, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { FaStar } from "react-icons/fa";
import { Event } from "../../types/Event";
import moment from "moment";
import styled from "styled-components";

const PopupContent = styled.div`
  text-align: center;
`;
//
//
interface GigCMarkerProps {
  isSelected?: boolean;
  isPopupOpen?: boolean;
  handleClick?: () => void;
  gigLoc: LocBasicType;
  gig: Event;
}
const GigCMarker = ({
  isSelected,
  isPopupOpen,
  gigLoc,
  gig,
  handleClick = () => console.log("clicked", gigLoc)
}: GigCMarkerProps) => {
  const icon = <FaStar style={{ color: isSelected ? blue[700] : blue[300] }} />;
  const popupDisplay = (
    <PopupContent>
      <Typography component="div" variant="caption">
        <b>{gigLoc.venueName}</b>
      </Typography>
      <Typography component="div" variant="caption">
        {moment(gig.startDate).format("MMM D")}
      </Typography>
    </PopupContent>
  );
  const location = gigLoc;
  return (
    <ClickableMarker
      {...{ popupDisplay, handleClick, location, icon }}
    ></ClickableMarker>
  );
};

export default GigCMarker;
