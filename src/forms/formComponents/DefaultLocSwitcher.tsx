import React, { useState } from "react";
import { RadioGroup, Radio, FormControlLabel, Switch } from "@material-ui/core";
import { useField, useForm } from "react-final-form";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";

interface DefaultLocSwitcherProps {
  defaultOption: JSX.Element;
  defaultOptLabel?: string;
  customOption: JSX.Element;
  customOptLabel?: string;
}

const DefaultLocSwitcherRadio = ({
  defaultOption,
  defaultOptLabel,
  customOption,
  customOptLabel
}: DefaultLocSwitcherProps) => {
  const [value, setValue] = useState("default");
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  return (
    <>
      <RadioGroup
        value={value}
        onChange={handleChange}
        style={{ flexDirection: "row", justifyContent: "space-around" }}
      >
        <FormControlLabel
          value="default"
          control={<Radio />}
          label={defaultOptLabel}
        />
        <FormControlLabel
          value="custom"
          control={<Radio />}
          label={customOptLabel}
        />
      </RadioGroup>
      {value === "default" ? defaultOption : customOption}
    </>
  );
};

const DefaultLocSwitcher = ({
  defaultOption,
  defaultOptLabel,
  customOption,
  customOptLabel
}: DefaultLocSwitcherProps) => {
  const [defaultOpt, setDefaultOpt] = useState(true);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {defaultOpt ? defaultOption : customOption}
      <FormControlLabel
        label={defaultOpt ? defaultOptLabel : customOptLabel}
        control={
          <Switch
            checked={defaultOpt}
            onChange={(e: any) => setDefaultOpt(e.target.checked)}
          />
        }
      />
    </div>
  );
};

export default DefaultLocSwitcher;
