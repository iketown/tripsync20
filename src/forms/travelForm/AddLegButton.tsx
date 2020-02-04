import React from "react";
import { Button } from "@material-ui/core";
import { useFormState, useForm } from "react-final-form";
import { TravelLeg, TravelTypeOption } from "../../types/travel.types";
import moment from "moment";

const AddLegButton = () => {
  const { values } = useFormState();
  const { mutators } = useForm();
  const legs: TravelLeg[] = values.legs;

  const { push } = mutators;

  const getNextLeg = (): Partial<TravelLeg> => {
    const prevLeg = { ...legs[legs.length - 1] };
    const fromLocBasic = prevLeg.toLocBasic;
    const fromLocId = prevLeg.toLocId;
    const startDate = prevLeg.endDate;
    let endDate = !!startDate
      ? moment(startDate)
          .add(4, "hours")
          .format()
      : "";
    const travelType = prevLeg.toLocId?.includes("airport")
      ? TravelTypeOption.fly
      : prevLeg.travelType;
    const returnObj: Partial<TravelLeg> = {
      fromLocBasic,
      fromLocId,
      startDate,
      endDate,
      travelType
    };
    return returnObj;
  };

  const handleAdd = () => {
    push("legs", getNextLeg());
  };

  return <Button onClick={handleAdd}>Add Leg</Button>;
};

export default AddLegButton;
