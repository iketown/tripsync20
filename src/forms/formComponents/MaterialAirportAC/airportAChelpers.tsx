import { FilterOptionsState } from "@material-ui/lab/useAutocomplete";
import usAirports from "../../../constants/usAirports";

const { names, states, cities } = usAirports;

export type LocalAirport = {
  iataCode: string;
  placeId: string;
  lat: number;
  lng: number;
  address: string;
  venueName: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  locType: string;
  timeZoneId: string;
  nearby?: boolean;
};

export type ACOption = [string, LocalAirport];

export const filterOptions = (
  options: ACOption[],
  state: FilterOptionsState
) => {
  const { inputValue } = state;
  const searchVal = inputValue.toLowerCase();
  const exactMatchCodes =
    searchVal.length > 1
      ? options
          .filter(([iata]) => {
            return iata.toLowerCase().includes(searchVal);
          })
          .map(([iata]) => iata)
      : [];

  const cityMatchCodes =
    searchVal.length > 1
      ? Object.entries(cities)
          .filter(([city, iata]) => {
            return city.includes(searchVal);
          })
          .map(([city, iata]) => iata)
      : [];
  const stateMatchCodes =
    searchVal.length > 1
      ? Object.entries(states)
          .filter(([state, iataArr]) => {
            return state.includes(searchVal);
          })
          .flatMap(([state, iataArr]) => iataArr)
      : [];
  const nameMatchCodes =
    searchVal.length > 1
      ? Object.entries(names)
          .filter(([name, iata]) => {
            return name.includes(searchVal);
          })
          .map(([state, iata]) => iata)
      : [];

  const allCodes = [
    //@ts-ignore
    ...new Set([
      ...exactMatchCodes,
      ...cityMatchCodes,
      ...stateMatchCodes,
      ...nameMatchCodes
    ])
  ];
  const filteredOptions = options.filter(([iata, airport]) =>
    allCodes.includes(iata)
  );
  const nearbyOptions = options.filter(([iata, airport]) => {
    return airport.nearby;
  });
  return [...filteredOptions, ...nearbyOptions];
};
