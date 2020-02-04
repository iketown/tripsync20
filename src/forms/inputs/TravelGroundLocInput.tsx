import React from "react";
import { useTravelFormCtx } from "../travelForm/TravelFormContext";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import GoogPlacesAC from "../formComponents/GooglePlacesAC";
import { LocBasicType, LocPoint } from "../../types/location.types";
import DefaultGroundOptions from "../travelForm/DefaultGroundOptions";
import { useField } from "react-final-form";

interface TravelGroundLIProps {
  idName: string;
  locBasicName: string;
  toOrFrom: string;
  label?: string;
  biasCenterLoc?: LocPoint;
}
const TravelGroundLocInput = ({
  idName,
  locBasicName,
  toOrFrom,
  label,
  biasCenterLoc
}: TravelGroundLIProps) => {
  const {
    input: { value: locBasicValue, onChange: onChangeLocBasic }
  } = useField(locBasicName);
  const {
    input: { onChange: onChangeId }
  } = useField(idName);
  const defaultLocation = locBasicValue;
  const value = locBasicValue;
  const setValue = (loc: LocBasicType | null, placeId: string | null) => {
    onChangeLocBasic(loc);
    onChangeId(placeId);
  };
  const setLocation = (loc: LocBasicType) => {};
  return (
    <div>
      <GoogPlacesAC
        {...{
          setLocation,
          biasCenterLoc,
          label,
          defaultLocation,
          value,
          setValue
        }}
      />
      <DefaultGroundOptions {...{ idName, locBasicName, toOrFrom }} />
    </div>
  );
};

export default TravelGroundLocInput;
