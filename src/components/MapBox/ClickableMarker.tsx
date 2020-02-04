import React, { useState } from "react";
import { Marker, Popup } from "react-mapbox-gl";
import { LocPoint } from "../../types/location.types";
import { gigLocToMapLoc } from "./mapboxHelpers";
import styled from "styled-components";

const StyledPopup = styled(Popup)`
  .mapboxgl-popup-content {
    padding: 5px;
    box-shadow: 2px 2px 4px #00000059;
  }
`;
const ClickableMarker = ({
  location,
  icon,
  isSelected,
  // isPopupOpen,
  popupDisplay,
  handleClick = () => console.log("clicked", location)
}: {
  location: LocPoint;
  icon: JSX.Element;
  isSelected?: boolean;
  // isPopupOpen?: boolean;
  popupDisplay?: JSX.Element;
  handleClick?: () => void;
}) => {
  const [showPop, setShowPop] = useState(isSelected);
  return (
    <>
      <Marker
        onMouseEnter={() => popupDisplay && setShowPop(true)}
        onMouseLeave={() => popupDisplay && setShowPop(isSelected)}
        onClick={handleClick}
        anchor="center"
        coordinates={gigLocToMapLoc(location)}
        style={{ cursor: "pointer", fontSize: "1rem" }}
      >
        {icon}
      </Marker>
      {popupDisplay && showPop && (
        <StyledPopup
          onClick={() => setShowPop(false)}
          offset={10}
          coordinates={gigLocToMapLoc(location)}
          className="pops"
        >
          {popupDisplay}
        </StyledPopup>
      )}
    </>
  );
};

export default ClickableMarker;
