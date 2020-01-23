import React from "react";
import { SelectInput } from "./";
import { TravelTypeOption } from "../../types/travel.types";

const TravelTypeSelect = ({ name }: { name: string }) => {
  return (
    <SelectInput
      name={name}
      label="Travel Type"
      options={[
        [TravelTypeOption.fly, "Fly"],
        [TravelTypeOption.bus, "Bus"],
        [TravelTypeOption.car, "Car"],
        [TravelTypeOption.train, "Train"],
        [TravelTypeOption.walk, "Walk"],
        [TravelTypeOption.shuttle, "Shuttle"],
        [TravelTypeOption.other, "Other"]
      ]}
    />
  );
};

export default TravelTypeSelect;
