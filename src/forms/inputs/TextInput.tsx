import React from "react";
import { Field } from "react-final-form";
import { TextField } from "@material-ui/core";

export const TextInput = ({
  name,
  label,
  fullWidth
}: {
  name: string;
  label?: string;
  rest?: any;
  fullWidth?: boolean;
}) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <TextField
            {...input}
            {...{ label, fullWidth }}
            fullWidth
            helperText={(meta.touched && meta.error) || meta.submitError}
            error={meta.touched && meta.error}
          />
        );
      }}
    </Field>
  );
};
