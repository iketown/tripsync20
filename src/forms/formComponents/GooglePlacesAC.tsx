import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import { throttle } from "lodash";
import { geocodeByPlaceId } from "react-places-autocomplete";
import { LocPoint, LocBasicType } from "../../types/location.types";
import { getTimeZoneFromLatLng } from "../../utils/locationFxns";
const autocompleteService = { current: null };

const useStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

export interface PlaceType {
  place_id: string;
  description: string;
  structured_formatting: {
    secondary_text: string;
    main_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      }
    ];
  };
}

export default function GooglePlacesAC({
  setLocation,
  label = "Enter location",
  placeholder,
  submitting,
  setSubmitting,
  biasCenterLoc,
  biasCenterRadius = 64000,
  value,
  setValue
}: {
  setLocation?: any;
  label?: string;
  placeholder?: string;
  submitting?: boolean;
  setSubmitting?: (val: boolean) => void;
  biasCenterLoc?: LocPoint;
  biasCenterRadius?: number; // distance in meters
  value?: LocBasicType;
  setValue?: (loc: LocBasicType | null, placeId: string | null) => void;
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<PlaceType[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelect = async (e: any, loc: PlaceType) => {
    if (!loc) {
      setLocation(null);
      setValue && setValue(null, null);
      return;
    }
    setSubmitting && setSubmitting(true);
    const { place_id } = loc;
    await geocodeByPlaceId(place_id)
      .then(async ([result]) => {
        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();
        const timeZoneId = await getTimeZoneFromLatLng({ lat, lng });
        let cityObj = result.address_components.find(comp =>
          comp.types.includes("locality")
        );
        let stateObj = result.address_components.find(comp =>
          comp.types.includes("administrative_area_level_1")
        );
        let countryObj = result.address_components.find(comp =>
          comp.types.includes("country")
        );
        let townObj = result.address_components.find(comp =>
          comp.types.includes("postal_town")
        );
        const address = result.formatted_address;
        const city = cityObj && cityObj.long_name;
        const state = stateObj && stateObj.long_name;
        const stateShort = (stateObj && stateObj.short_name) || state;
        const country = countryObj && countryObj.long_name;
        const countryShort = (countryObj && countryObj.short_name) || country;
        const town = (townObj && townObj.long_name) || "";
        const locBasic = {
          lat,
          lng,
          address,
          city,
          town,
          state,
          stateShort,
          country,
          countryShort,
          placeId: place_id,
          shortName: `${city || town}, ${stateShort || state || ""}${
            countryShort !== "US" ? " " + countryShort : ""
          }`,
          venueName: loc.structured_formatting.main_text,
          timeZoneId
        };
        setLocation(locBasic);
        setValue && setValue(locBasic, place_id);
      })
      .catch(err => console.log("error", err));
  };

  const fetch = React.useMemo(
    () =>
      throttle((input: any, callback: any) => {
        (autocompleteService.current as any).getPlacePredictions(
          input,
          callback
        );
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      console.log("service missing");
      return undefined;
    }

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }
    const fetchParams: {
      input: string;
      location?: google.maps.LatLng;
      radius?: number;
    } = { input: inputValue };
    if (biasCenterLoc) {
      const { lat, lng } = biasCenterLoc;
      fetchParams.location = new google.maps.LatLng({ lat, lng });
      fetchParams.radius = biasCenterRadius || 64000;
    }
    fetch(fetchParams, (results?: PlaceType[]) => {
      if (active) {
        console.log("raw results", results);
        setOptions(results || []);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch, biasCenterLoc, biasCenterRadius]);

  return (
    <>
      <Autocomplete
        id={`google-map-${Math.random()}`}
        getOptionLabel={option => {
          return option.description || option.venueName;
        }}
        style={{ minWidth: "11rem", width: "100%" }}
        filterOptions={x => x}
        value={value}
        onChange={handleSelect}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        disableOpenOnFocus
        renderInput={params => (
          <TextField
            {...params}
            {...{ placeholder, label }}
            variant="outlined"
            fullWidth
            onChange={handleChange}
          />
        )}
        renderOption={option => {
          const matches =
            option.structured_formatting.main_text_matched_substrings;
          const parts = parse(
            option.structured_formatting.main_text,
            matches.map((match: any) => [
              match.offset,
              match.offset + match.length
            ])
          );
          return (
            <Grid container alignItems="center">
              <Grid item>
                <span>•</span>
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="textSecondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          );
        }}
      />
    </>
  );
}
