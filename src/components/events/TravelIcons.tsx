import React from "react";
import { TravelType } from "../../types/travel.types";
import { Tooltip } from "@material-ui/core";
import { getIcon } from "../travels/TravelDisplay";
import styled from "styled-components";

const StyledTitle = styled.div`
  background-color: white;
  color: #000000bb;
`;

const TravelIcons = ({ travel }: { travel?: TravelType }) => {
  if (!travel) return null;
  const types =
    travel.legs &&
    Object.values(travel.legs)
      .sort((a, b) => a.startUnix - b.startUnix)
      .map(leg => (
        <Tooltip
          title={
            <StyledTitle>
              <div>{leg.fromLocBasic.venueName}</div>
              <div>{leg.toLocBasic.venueName}</div>
            </StyledTitle>
          }
        >
          <span style={{ marginLeft: "3px" }}>{getIcon(leg.travelType)}</span>
        </Tooltip>
      ));
  if (types?.length) return <div>{types}</div>;
  return null;
};

export default TravelIcons;
