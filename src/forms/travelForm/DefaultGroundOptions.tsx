import React, { useEffect, useState } from "react";
import { useFormState, useField } from "react-final-form";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import { LocBasicType } from "../../types/location.types";
import ShowMe from "../../utils/ShowMe";
import { Chip } from "@material-ui/core";
import styled from "styled-components";
//
//

const ChipContainer = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: flex;
`;

interface DefaultGroundOptionsProps {
  idName: string;
  locBasicName: string;
  toOrFrom: string;
}

const DefaultGroundOptions = ({
  idName,
  locBasicName,
  toOrFrom
}: DefaultGroundOptionsProps) => {
  const { state, dispatch } = useMapBoxCtx();
  const [recLocs, setRecLocs] = useState<LocBasicType[]>([]);

  const locBasicField = useField(locBasicName);
  const locIdField = useField(idName);

  const handleClick = (loc: LocBasicType) => {
    let locId = loc.id;
    if (!!loc.iataCode) locId = `airport_${loc.iataCode}`;
    locBasicField.input.onChange(loc);
    locIdField.input.onChange(locId);
  };

  useEffect(() => {
    const _recLocs = [];
    if (toOrFrom === "from") {
      // use startLocs
      const airports = state?.toLocs.airports || [];
      const hotels = state?.fromLocs.hotels || [];
      const gigLocs =
        state?.fromLocs.gigs.map(({ locBasic }) => locBasic) || [];
      const otherLocs = state?.fromLocs.otherLocs || [];
      _recLocs.push(
        ...gigLocs,
        ...otherLocs,
        ...hotels,
        ...airports.slice(0, 3)
      );
    }
    if (toOrFrom === "to") {
      // nearest 2 airports?
      const airports = state?.fromLocs.airports || [];
      const gigLocs = state?.toLocs.gigs.map(({ locBasic }) => locBasic) || [];
      const otherLocs = state?.toLocs.otherLocs || [];
      const hotels = state?.toLocs.hotels || [];
      _recLocs.push(
        ...gigLocs,
        ...otherLocs,
        ...hotels,
        ...airports.slice(0, 3)
      );
    }
    setRecLocs(_recLocs);
  }, [state, toOrFrom]);
  return (
    <ChipContainer>
      {recLocs.map((loc, index) => {
        return (
          <Chip
            key={`${loc.id}-${index}`}
            onClick={() => handleClick(loc)}
            style={{ marginRight: "3px" }}
            label={loc.venueName}
            title={loc.venueName}
          />
        );
      })}
      {/* <ShowMe obj={recLocs} name="recLocs" /> */}
    </ChipContainer>
  );
};

export default DefaultGroundOptions;
