import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect, useState } from "react";
import { useField, useForm, useFormState } from "react-final-form";
import { useMapBoxCtx } from "../../../components/MapBox/MapBoxCtxSimple";
import usAirports from "../../../constants/usAirports";
import { ACOption, filterOptions } from "./airportAChelpers";
import { Typography } from "@material-ui/core";
import ShowMe from "../../../utils/ShowMe";
export default function MaterialAirportAC({
  label,
  toOrFrom,
  idName,
  locBasicName,
  defaultOptions
}: {
  label?: string;
  toOrFrom?: string;
  locBasicName: string;
  idName: string;
  defaultOptions?: any[];
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ACOption[]>(
    Object.entries(usAirports.airports)
  );
  const [nearbyOptions, setNearbyOptions] = useState<ACOption[]>([]);
  const { state } = useMapBoxCtx();
  const locBasicField = useField(locBasicName);
  const idField = useField(idName);
  const { change } = useForm();
  const { values } = useFormState();

  const onSelect = (ap: any) => {
    const apId = ap ? `airport_${ap.iataCode}` : null;
    change(locBasicName, ap);
    change(idName, apId);
    // locBasicField.input.onChange(ap);
    // idField.input.onChange(apId);
  };

  let stateAirports: any[] = [];
  if (
    toOrFrom === "to" &&
    state &&
    state.toLocs?.airports &&
    state.toLocs?.airports.length
  ) {
    stateAirports = state.toLocs?.airports;
  }
  if (
    toOrFrom === "from" &&
    state?.fromLocs?.airports &&
    state?.fromLocs?.airports.length
  ) {
    stateAirports = state.fromLocs?.airports;
  }

  const loading = open && options.length === 0;

  useEffect(() => {
    if (stateAirports.length) {
      const _nearbyOptions: ACOption[] = stateAirports
        .filter(
          (ap: any): boolean =>
            //@ts-ignore
            !!usAirports.airports[ap.iataCode]
        )
        .map(ap => {
          return [
            ap.iataCode,
            //@ts-ignore
            { nearby: true, ...usAirports.airports[ap.iataCode] }
          ];
        });
      setNearbyOptions(_nearbyOptions);
    }
  }, [stateAirports]);

  const getOptionLabel = ([iataCode, ap]: any) => {
    if (!iataCode || !ap) return "";
    return `${iataCode} • ${ap.venueName}`;
  };

  return (
    <>
      <Autocomplete
        style={{ width: "100%" }}
        autoComplete
        autoHighlight
        open={open}
        value={[locBasicField.input.value?.iataCode, locBasicField.input.value]}
        onChange={(e, val) => {
          const ap = val && val[1];
          onSelect(ap);
        }}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionLabel={getOptionLabel}
        options={[...options, ...nearbyOptions]}
        // loading={loading}
        groupBy={option => {
          return option[1].nearby ? "nearby" : "";
        }}
        filterOptions={filterOptions}
        renderInput={params => {
          if (toOrFrom === "to") {
          }
          return (
            <>
              <TextField
                error={idField.meta.dirty && !idField.meta.valid}
                {...params}
                {...{ label }}
                helperText={idField.meta.error}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  )
                }}
              />
            </>
          );
        }}
      />
    </>
  );
}
