import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";
import { Field } from "react-final-form";

export const SelectInput = ({
  name,
  label,
  options
}: {
  name: string;
  label?: string;
  options: [string, string][];
}) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>

            <Select
              inputProps={{ name: label }}
              value={input.value}
              onChange={e => input.onChange(e.target.value)}
            >
              {options.map(([value, display]) => {
                return (
                  <MenuItem key={value} value={value}>
                    {display}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        );
      }}
    </Field>
  );
};
