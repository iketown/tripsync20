import React, { useState } from "react";
import { Marker, Popup } from "react-mapbox-gl";
import { LocPoint } from "../../types/location.types";
import { gigLocToMapLoc } from "./mapboxHelpers";

const ClickableMarker = ({
  location,
  icon,
  isSelected,
  popupDisplay,
  handleClick = () => console.log("clicked", location)
}: {
  location: LocPoint;
  icon: JSX.Element;
  isSelected?: boolean;
  popupDisplay?: JSX.Element;
  handleClick?: () => void;
}) => {
  const [showPop, setShowPop] = useState(false);
  return (
    <>
      <Marker
        onMouseEnter={() => popupDisplay && setShowPop(true)}
        onMouseLeave={() => popupDisplay && setShowPop(false)}
        onClick={handleClick}
        anchor="center"
        coordinates={gigLocToMapLoc(location)}
        style={{ cursor: "pointer", fontSize: "1rem" }}
      >
        {icon}
      </Marker>
      {popupDisplay && showPop && (
        <Popup offset={10} coordinates={gigLocToMapLoc(location)}>
          {popupDisplay}
        </Popup>
      )}
    </>
  );
};

export default ClickableMarker;
