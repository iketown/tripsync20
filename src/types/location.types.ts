import { TravelTypeOption } from "./travel.types";
import { AirportResult } from "./amadeus.types";

export type NearbyAirport = {
  address: string;
  city: string;
  country: string;
  countryShort: string;
  distanceKm: number;
  distanceMi: number;
  iataCode: string;
  id?: string;
  lat: number;
  lng: number;
  placeId: string;
  relevance: number;
  shortName: string;
  state?: string;
  timeZoneId: string;
  town?: string;
  venueName: string;
  departing?: boolean;
};

// export const locTypes = [
//   "venue",
//   "hotel",
//   "restaurant",
//   "station",
//   "airport",
//   "other"
// ];

export type LocationType = {
  address: string;
  city?: string;
  country?: string;
  countryShort?: string;
  iataCode?: string;
  id?: string;
  lat: number;
  lng: number;
  nearbyAirports?: NearbyAirport[];
  placeId: string;
  shortName: string;
  state?: string;
  stateShort?: string;
  timeZoneId: string;
  town?: string;
  venueName: string;
};

export type LocBasicType = {
  address: string;
  id?: string;
  lat: number;
  lng: number;
  shortName: string;
  timeZoneId: string;
  venueName: string;
  iataCode?: string;
  city?: string;
  state?: string;
  placeId?: string;
};

export interface LocPoint {
  lat: number;
  lng: number;
}

export type Route = {
  fromLoc: LocBasicType;
  toLoc: LocBasicType;
  travelType: TravelTypeOption;
  path?: { lat: number; lng: number }[];
};
