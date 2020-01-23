import { LngLatBounds, LngLat } from "mapbox-gl";
import { LocPoint } from "../../types/location.types";

export interface EventLoc {
  lat: number;
  lng: number;
}

export const fitMapToLocs = ({
  map,
  locs
}: {
  locs: LocPoint[];
  map?: mapboxgl.Map;
}) => {
  const locLngLats = locs
    .map(loc => gigLocToMapLoc(loc))
    .map(([lng, lat]) => new LngLat(lng, lat));
  const bounds = locLngLats.reduce((bounds, lngLat) => {
    return bounds.extend(lngLat);
  }, new LngLatBounds(locLngLats[0], locLngLats[0]));
  map && map.fitBounds(bounds, { padding: 40 });
};

export const locsToBounds = (locs: LocPoint[]) => {
  const locLngLats = locs
    .map(loc => gigLocToMapLoc(loc))
    .map(([lng, lat]) => new LngLat(lng, lat));
  const bounds = locLngLats.reduce((bounds, lngLat) => {
    return bounds.extend(lngLat);
  }, new LngLatBounds(locLngLats[0], locLngLats[0]));
  return bounds;
};

export const gigLocToMapLoc = (gigLoc: EventLoc): [number, number] => {
  const { lat, lng } = gigLoc;
  return [lng, lat];
};
