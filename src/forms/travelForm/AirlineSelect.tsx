import React from "react";
import { Select, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import airlines from "../../constants/airlinesObj";
import { useField } from "react-final-form";

//
//
const AirlineSelect = () => {
  const {
    input: { value: valueName, onChange: onChangeName }
  } = useField("company");
  const {
    input: { value: valueId, onChange: onChangeId }
  } = useField("companyId");
  const handleChange = (val: any) => {
    onChangeName(val.name);
    onChangeId(val.code);
  };
  return (
    <Autocomplete
      options={airlines}
      value={{ name: valueName }}
      //@ts-ignore
      getOptionLabel={al => al.name}
      renderInput={params => (
        <TextField {...params} label="Airline" fullWidth />
      )}
      onChange={(e, val) => handleChange(val)}
    />
  );
};

export default AirlineSelect;
