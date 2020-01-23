import React from "react";
import { Select, MenuItem } from "@material-ui/core";
import { Field } from "react-final-form";

const LocTypeSelect = ({ name = "locBasic.locType" }: { name?: string }) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <Select
            value={input.value}
            onChange={e => input.onChange(e.target.value)}
          >
            <MenuItem value="venue">Venue</MenuItem>
            <MenuItem value="hotel">Hotel</MenuItem>
            <MenuItem value="restaurant">Restaurant</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        );
      }}
    </Field>
  );
};

export default LocTypeSelect;
