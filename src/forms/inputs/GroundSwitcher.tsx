import React from "react";
import DefaultLocSwitcher from "../formComponents/DefaultLocSwitcher";
import { AirportInput, EventLocInput } from "./";
import { NearbyAirport, LocBasicType } from "../../types/location.types";
import { LocSelectInput } from "./";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";

interface GroundSwitcherProps {
  // defaultLocs: LocBasicType[];
  idName: string;
  locBasicName: string;
  label: string;
}

export const GroundSwitcher = ({
  // defaultLocs,
  idName,
  locBasicName,
  label
}: GroundSwitcherProps) => {
  const { state } = useMapBoxCtx();
  const hotels = state?.hotels || [];
  const otherLocs = state?.otherLocs || [];
  const gigLocs = state?.gigLocs || [];

  return (
    <DefaultLocSwitcher
      defaultOptLabel="Nearby"
      customOptLabel="Other"
      defaultOption={
        <LocSelectInput
          {...{ locBasicName, idName, label }}
          locations={[...gigLocs, ...hotels, ...otherLocs]}
        />
      }
      customOption={<EventLocInput {...{ locBasicName, idName, label }} />}
    />
  );
};

export default GroundSwitcher;
