import React from "react";
import { FaPlane, FaBus, FaCar, FaCircle } from "react-icons/fa";
import { TravelTypeOption, TravelLeg } from "../../types/travel.types";

export const getIcon = (travelType: TravelTypeOption) => {
  switch (travelType) {
    case TravelTypeOption.fly:
      return <FaPlane />;
    case TravelTypeOption.bus:
    case TravelTypeOption.shuttle:
      return <FaBus />;
    case TravelTypeOption.car:
      return <FaCar />;
    default:
      return <FaCircle />;
  }
};

const TravelDisplay = ({ travels }: { travels: any }) => {
  console.log("travelDisplay trav", travels);
  return (
    <div>
      {travels.map((travel: any) => {
        const { id, fromEventId, legs, toEventId } = travel;
        return (
          <ul>
            {legs &&
              legs.map((leg: TravelLeg) => {
                return (
                  <li style={{ display: "flex" }}>
                    {getIcon(leg.travelType)}
                    {leg.fromLocBasic.venueName} - {leg.toLocBasic.venueName}
                  </li>
                );
              })}
          </ul>
        );
      })}
    </div>
  );
};

export default TravelDisplay;
