import React from "react";
import { Field, useForm } from "react-final-form";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  FormHelperText
} from "@material-ui/core";
import AirportAC from "../formComponents/AirportACDownshift";
import { NearbyAirport } from "../../types/location.types";
import { iataCodeToLocId } from "../../hooks/useLocation";

export const AirportInput = ({
  name,
  locBasicName,
  idName,
  label,
  firstAirports
}: {
  name: string;
  locBasicName: string;
  idName: string;
  label?: string;
  firstAirports?: NearbyAirport[];
}) => {
  const { change, batch } = useForm();

  const handleChange = (e: any) => {
    const apId = e.target.value;
    const [_, iataCode] = apId.split("_");
    console.log("iataCode", iataCode);
    batch(() => {
      change(idName, apId);
      firstAirports &&
        change(
          locBasicName,
          firstAirports.find(ap => ap.iataCode === iataCode)
        );
    });
  };
  return (
    <Field {...{ name }}>
      {({ input, meta }) => {
        return (
          <FormControl fullWidth error={meta.dirty && !!meta.error}>
            {!!label && <InputLabel>{label}</InputLabel>}
            <Select value={input.value} onChange={handleChange}>
              {firstAirports?.map(ap => {
                return (
                  <MenuItem
                    key={ap.iataCode}
                    value={iataCodeToLocId(ap.iataCode)}
                  >
                    <Typography component="span">
                      <b>{ap.iataCode}</b>
                    </Typography>
                    <Typography
                      component="span"
                      style={{ margin: "0 5px" }}
                      color="textSecondary"
                    >
                      •
                    </Typography>
                    <Typography component="span">{ap.shortName}</Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="span"
                      style={{ margin: "0 5px" }}
                    >
                      {Math.round(ap.distanceMi)} mi.
                    </Typography>
                  </MenuItem>
                );
              })}
              <MenuItem value="home">Home / various</MenuItem>
            </Select>
            <FormHelperText>{meta.error}</FormHelperText>
          </FormControl>
        );
      }}
    </Field>
  );
};
