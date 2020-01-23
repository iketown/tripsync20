import { Grid, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaPlane } from "react-icons/fa";
import ReactMapboxGL, { Marker, Popup } from "react-mapbox-gl";
import { purple } from "@material-ui/core/colors";
import { NearbyAirport } from "../../types/location.types";
import { gigLocToMapLoc } from "./mapboxHelpers";

const AirportMarker = ({
  ap,
  isSelected,
  onClick = () => console.log("clicked", ap)
}: {
  ap: NearbyAirport;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const [showPop, setShowPop] = useState(false);
  return (
    <>
      <Marker
        onMouseEnter={() => setShowPop(true)}
        onMouseLeave={() => setShowPop(false)}
        onClick={onClick}
        anchor="center"
        coordinates={gigLocToMapLoc(ap)}
        style={{ cursor: "pointer", fontSize: "1rem" }}
      >
        <FaPlane style={{ color: isSelected ? purple[700] : purple[200] }} />
      </Marker>
      {showPop && (
        <Popup offset={10} coordinates={gigLocToMapLoc(ap)}>
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
        </Popup>
      )}
    </>
  );
};

export default AirportMarker;
