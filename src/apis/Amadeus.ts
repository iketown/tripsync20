//@ts-ignore
import Amadeus from "amadeus";
import { debounce } from "lodash";
import {
  AirportResult,
  AirportSearchResult,
  Airport
} from "../types/amadeus.types";

const amadeus = new Amadeus({
  clientId: process.env.REACT_APP_AMADEUS_KEY,
  clientSecret: process.env.REACT_APP_AMADEUS_SECRET
});

export const amadeusFxns = () => {
  const getHotelsCityCode = async (cityCode: string) => {
    try {
      const response = await amadeus.shopping.hotelOffers.get({
        cityCode
      });
      console.log("response", response);
      return response;
    } catch (err) {
      console.log("hotels error", err);
    }
  };
  const getHotelsNearPoint = async (latitude: number, longitude: number) => {
    try {
      const response = await amadeus.shopping.hotelOffers.get({
        latitude,
        longitude
      });
      return response;
    } catch (err) {
      console.log("hotels error", err);
    }
  };

  const getAirportsNearPoint = async (
    latitude: number,
    longitude: number
  ): Promise<AirportResult[] | null> => {
    if (!latitude || !longitude) return null;
    const response: AirportSearchResult = await amadeus.referenceData.locations.airports
      .get({
        latitude,
        longitude
      })
      .catch((err: any) => console.log("amadeus ERROR", err));
    if (!response) return null;
    return response.data;
  };

  const getAirportsByKeyword = async (keyword: string) => {
    debounce(() => {});
    const response: AirportSearchResult = await amadeus.referenceData.locations
      .get({ keyword, subType: "AIRPORT" })
      .catch((err: any) => console.log("amadeus ERROR", err));
    if (response) return response.data;
  };

  const mapAPResultToAP = (ap: AirportResult): Airport => {
    const { timeZoneOffset, distance, detailedName, name, iataCode } = ap;
    const { cityName, countryCode } = ap.address;
    const { latitude, longitude } = ap.geoCode;
    return {
      lat: latitude,
      lng: longitude,
      iataCode,
      name,
      detailedName,
      distance,
      timeZoneOffset,
      city: cityName,
      country: countryCode
    };
  };

  return {
    getAirportsNearPoint,
    getAirportsByKeyword,
    mapAPResultToAP,
    getHotelsNearPoint,
    getHotelsCityCode
  };
};

export const getAirportsNearPoint = async (
  latitude: number,
  longitude: number
): Promise<AirportResult[] | null> => {
  if (!latitude || !longitude) return null;
  const response: AirportSearchResult = await amadeus.referenceData.locations.airports
    .get({
      latitude,
      longitude
    })
    .catch((err: any) => console.log("amadeus ERROR", err));
  if (!response) return null;
  return (
    response.data
      .filter(result => result.relevance > 1)
      // .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4)
  );
};
