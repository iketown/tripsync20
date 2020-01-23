import { LocationType } from "../../types/location.types";

export interface ILocationSearchInput {
  setLocation: (loc: LocationType) => void;
  initialAddress?: string;
  searchOptions?: {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    componentRestrictions?: google.maps.GeocoderComponentRestrictions;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    offset?: number | string;
    radius?: number | string;
    types?: string[];
  };
}
