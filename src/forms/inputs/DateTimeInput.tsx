import React from "react";
import { DateTimePicker } from "@material-ui/pickers";
import { Field } from "react-final-form";
import moment from "moment-timezone";
import ShowTree from "../../utils/ShowTree";
import { initializeApp } from "firebase";
import { Moment } from "moment-timezone";
export const DateTimeInput = ({
  name,
  label,
  timeZoneId,
  onSelect,
  initialValue
}: {
  name: string;
  label: string;
  timeZoneId?: string;
  onSelect?: () => void;
  initialValue?: Moment;
}) => {
  return (
    <Field name={name} initialValue={initialValue}>
      {({ input, meta }) => {
        const handleChange = (value: any) => {
          input.onChange(value);
          onSelect && onSelect();
        };
        const valueMoment =
          typeof input.value === "number"
            ? moment.unix(input.value)
            : moment(input.value);
        const value = timeZoneId
          ? moment(valueMoment).tz(timeZoneId)
          : valueMoment;
        return (
          <DateTimePicker
            error={meta.dirty && !!meta.error}
            fullWidth
            value={value}
            onChange={handleChange}
            {...{ label }}
            helperText={
              (meta.dirty && meta.error) || `time zone: ${timeZoneId}`
            }
          />
        );
      }}
    </Field>
  );
};
