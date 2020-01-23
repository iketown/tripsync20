import React from "react";
import { DatePicker, Picker } from "@material-ui/pickers";
import { Field } from "react-final-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";
//
//

export const DateInput = ({
  name,
  label,
  shouldDisableDate
}: {
  name: string;
  label: string;
  shouldDisableDate?: ((day: MaterialUiPickersDate) => boolean) | undefined;
}) => {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        return (
          <DatePicker
            fullWidth
            label={label}
            value={input.value}
            onChange={(date: MaterialUiPickersDate) =>
              input.onChange(date && moment(date).format("YYYY-MM-DD"))
            }
            variant="inline"
            style={{ marginBottom: "1rem" }}
            autoOk
            shouldDisableDate={shouldDisableDate}
          />
        );
      }}
    </Field>
  );
};

export default DateInput;
