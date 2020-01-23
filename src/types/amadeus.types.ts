export type Airport = {
  lat: number;
  lng: number;
  iataCode: string;
  name: string;
  detailedName?: string;
  distance: {
    value: number;
    unit: string;
  };
  timeZoneOffset: string;
  city: string;
  country: string;
  preferred?: boolean;
};

export type AirportResult = {
  address: {
    cityCode: string;
    cityName: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
  };
  analytics: {
    flights: { score: number };
    travelers: { score: number };
  };
  detailedName: string;
  distance: { value: number; unit: string };
  geoCode: {
    latitude: number;
    longitude: number;
  };
  iataCode: string;
  name: string;
  relevance: number;
  subType: string;
  timeZoneOffset: string;
  type: string;
};

export type AirportSearchResult = {
  body: string;
  contentType: string;
  data: AirportResult[];
  parsed: boolean;
  result: {
    data: AirportResult[];
    meta: {
      count: number;
      links: {
        next: string;
        last: string;
        self: string;
      };
    };
  };
  statusCode: number;
};
