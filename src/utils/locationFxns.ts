import moment from "moment-timezone";
import { useCallback, useState } from "react";

import usAirports from "../constants/usAirports";
import { AirportResult } from "../types/amadeus.types";
import { LocationType, LocBasicType, LocPoint } from "../types/location.types";

//
//
export const getShortNameFromLoc = (loc: LocationType) => {
  let shortName;
  if (loc.countryShort && loc.countryShort === "US") {
    shortName = `${loc.city}, ${loc.stateShort}`;
  } else {
    shortName = `${loc.city || loc.town} ${loc.state && loc.state} ${
      loc.country
    }`;
  }
  return shortName;
};

export const getTimeZoneFromLatLng = async ({
  lat,
  lng,
  timeStamp = moment().format("X")
}: {
  lat: number | string;
  lng: number | string;
  timeStamp?: number | string;
}): Promise<string> => {
  const { REACT_APP_GOOGLE_MAP_API_KEY } = process.env;
  const { timeZoneId } = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timeStamp}&key=${REACT_APP_GOOGLE_MAP_API_KEY}`
  ).then(res => res.json());
  return timeZoneId;
};

export const airportResultToLoc = async (ap: any) => {
  if (ap.locType) return ap;
  const { cityName, stateCode, countryCode, countryName } = ap.address;
  const { latitude, longitude } = ap.geoCode;
  const timeZoneId = await getTimeZoneFromLatLng({
    lat: latitude,
    lng: longitude
  });
  return {
    iataCode: ap.iataCode,
    placeId: ap.iataCode,
    timeZoneId,
    distanceKm: ap.distance.value,
    distanceMi: ap.distance.value * 0.621371,
    address: `${cityName} ${stateCode} ${countryCode}`,
    relevance: ap.relevance,
    city: cityName,
    state: countryName,
    country: countryName,
    countryShort: countryCode,
    shortName: `${cityName} ${stateCode} ${countryCode}`,
    venueName: `${ap.iataCode} airport`,
    lat: latitude,
    lng: longitude
  };
};

export const locationToLocBasic = (location: any): LocBasicType => {
  const { address, id, lat, lng, shortName, timeZoneId, venueName } = location;
  console.log("location in locationToLocBasic", location);
  return {
    address,
    id: location.id || location.placeId,
    lat,
    lng,
    shortName,
    timeZoneId,
    venueName
  };
};

export const useUSAirports = () => {
  const [localResults, setLocalResults] = useState<AirportResult[]>([]);

  const getLocalResults = useCallback((searchString?: string) => {
    // get exact match airports "BOS" "MSP"
    if (searchString) {
      const codes: string[] = [];
      const searchStringLow = searchString.toLowerCase();
      try {
        //@ts-ignore
        const exactMatch: any = usAirports.airports[searchString.toUpperCase()];
        if (exactMatch) codes.push(exactMatch.iataCode);
        // get cities
        Object.entries(usAirports.cities).forEach(([city, code]) => {
          if (city.includes(searchStringLow)) {
            //@ts-ignore
            codes.push(code);
          }
        });
        // get states
        Object.entries(usAirports.states).forEach(([state, apCodes]) => {
          if (state.includes(searchStringLow)) {
            //@ts-ignore
            codes.concat(apCodes);
          }
        });
        Object.entries(usAirports.names).forEach(([name, code]) => {
          if (name.includes(searchStringLow)) {
            //@ts-ignore
            codes.push(code);
          }
        });
      } catch (error) {
        console.log("error", error);
      }
      const filteredCodes = codes.filter(
        (code, i) => codes.findIndex(_code => _code === code) === i
      );
      setLocalResults(
        //@ts-ignore
        filteredCodes.map(code => usAirports.airports[code])
      );
      return !!filteredCodes.length;
    } else return true;
  }, []);
  return { getLocalResults, localResults };
};

export const convertToTZTime = (time: "string", timeZoneId: "string") => {
  if (!timeZoneId) return time;
  return moment(time)
    .tz(timeZoneId)
    .format();
};

export const getDistanceInKm = (loc1: LocPoint, loc2: LocPoint): number => {
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
  function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  const d = getDistanceFromLatLonInKm(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
  return d;
};
