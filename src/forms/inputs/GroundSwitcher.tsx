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

  const fromHotels = state?.fromLocs.hotels || [];
  const fromGigs = state?.fromLocs.gigs || [];
  const fromOtherLocs = state?.fromLocs.otherLocs || [];
  const toHotels = state?.toLocs.hotels || [];
  const toGigs = state?.toLocs.gigs || [];
  const toOtherLocs = state?.toLocs.otherLocs || [];

  const hotels = fromHotels.concat(toHotels);
  const gigs = fromGigs.concat(toGigs);
  const gigLocs = gigs.map(({ locBasic }) => locBasic);
  const otherLocs = fromOtherLocs.concat(toOtherLocs);

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
