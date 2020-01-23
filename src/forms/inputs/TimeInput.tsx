import React from "react";
import { TimePicker } from "@material-ui/pickers";
import { Field } from "react-final-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment-timezone";

//
//

export const TimeInput = ({
  name,
  label,
  timeZoneId
}: {
  name: string;
  label: string;
  timeZoneId?: string;
}) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const handleChange = (value: MaterialUiPickersDate) => {
          //@ts-ignore
          const [date, time] = moment(value)
            .toISOString()
            .split("T");
          console.log("time", time);
          input.onChange(value);
        };
        return (
          <TimePicker
            value={input.value}
            onChange={date => {}}
            label={label}
            helperText={timeZoneId || "timezone ?"}
          />
        );
      }}
    </Field>
  );
};

export default TimeInput;
