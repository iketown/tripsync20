import React from "react";
import DefaultLocSwitcher from "../formComponents/DefaultLocSwitcher";
import { AirportInput, EventLocInput } from "./";
import { NearbyAirport } from "../../types/location.types";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
interface AirportSwitcherProps {
  defaultAirports?: NearbyAirport[];
  idName: string;
  locBasicName: string;
  label: string;
}

export const AirportSwitcher = ({
  defaultAirports,
  idName,
  locBasicName,
  label
}: AirportSwitcherProps) => {
  const { state } = useMapBoxCtx();
  const airports = state?.airports;
  return (
    <DefaultLocSwitcher
      defaultOptLabel="Nearby"
      customOptLabel="Other "
      defaultOption={
        <AirportInput
          name={idName}
          {...{ locBasicName, idName, label }}
          firstAirports={airports}
        />
      }
      customOption={
        // this should be airport ac not EventLocInput
        <EventLocInput {...{ locBasicName, idName, label }} />
      }
    />
  );
};

export default AirportSwitcher;
