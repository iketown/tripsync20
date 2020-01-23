import React, { useEffect, useRef, useState, useContext } from "react";
import { useMapBoxCtx } from "./MapBoxCtxSimple";
import ReactMapboxGL, { Marker, Layer, Feature, Popup } from "react-mapbox-gl";
import { FaStar, FaHSquare, FaPlane } from "react-icons/fa";
import ShowMe from "../../utils/ShowMe";
import { fitMapToLocs, EventLoc, gigLocToMapLoc } from "./mapboxHelpers";
import { Typography, Grid } from "@material-ui/core";
import AirportMarker from "./AirportMarker";
import AirportCMarker from "./AirportCMarker";
import GigCMarker from "./GigCMarker";
import HotelCMarker from "./HotelCMarker";
//
//
import { Event } from "../../types/Event";
import { LocBasicType, NearbyAirport } from "../../types/location.types";
import { useField } from "react-final-form";
import { iataCodeToLocId } from "../../hooks/useLocation";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
const Map = ReactMapboxGL({ accessToken, maxZoom: 15 });

const TravelTargetMap = ({
  idName = "",
  locBasicName = ""
}: {
  idName?: string;
  locBasicName?: string;
}) => {
  const [map, setMap] = useState<mapboxgl.Map>();
  const { state } = useMapBoxCtx();
  const { input: idInput } = useField(idName);
  const { input: basicInput } = useField(locBasicName);
  const selectedId = idInput.value;

  const [center, setCenter] = useState(
    state?.gigLocs && !!state.gigLocs[0] && gigLocToMapLoc(state?.gigLocs[0])
  );
  const [zoom, setZoom] = useState<[number]>([12]);

  const hotels = state?.hotels;
  const gigLocs = state?.gigLocs;
  const airports = state?.airports;
  const bounds = state?.bounds;
  const routes = state?.routes;

  const boundsCount = useRef(0);
  useEffect(() => {
    if (map) {
      //@ts-ignore
      window.mapbox = map;
      // if (bounds && bounds.length) {
      //   console.log("doing bounds", boundsCount.current++, bounds);
      //   fitMapToLocs({ map, locs: bounds.filter(loc => !!loc) });
      // } else {
      //   console.log("setting center");
      //   setCenter(state?.gigLocs && state.gigLocs[0]);
      //   map.setZoom(12);
      // }
      if (bounds && bounds.length > 1) {
        fitMapToLocs({ map, locs: bounds });
      } else {
        console.log("doing center");
        const centerLoc =
          state?.gigLocs &&
          !!state.gigLocs[0] &&
          gigLocToMapLoc(state?.gigLocs[0]);

        centerLoc && map.setCenter(centerLoc);
      }
    }
  }, [bounds, map, state]);

  return (
    <>
      <Map
        style="mapbox://styles/brianeichenberger/ck48bhoze4o2u1cqpygnfu0kc"
        pitch={[10]}
        containerStyle={{ height: "20rem" }}
        onStyleLoad={(map, event) => {
          setMap(map);
          //@ts-ignore
          window.map = map;
        }}
        center={center}
        movingMethod="easeTo"
        zoom={zoom}
      >
        <>
          {/* {center && (
            <Marker
              anchor="center"
              coordinates={gigLocToMapLoc(center)}
              onClick={() => console.log("wuzzup")}
              style={{ cursor: "pointer", fontSize: "1rem" }}
            >
              <FaStar style={{ color: "orange" }} />
            </Marker>
          )} */}
          {hotels &&
            hotels.length &&
            hotels.map((hotel: LocBasicType, index: number) => {
              if (!hotel) return null;
              const hotelLocId = hotel.id;
              const isSelected = hotelLocId === selectedId;
              const handleClick = () => {
                idInput.onChange(hotelLocId);
                basicInput.onChange(hotel);
              };
              const hotelLoc = hotel;
              return (
                <HotelCMarker
                  key={`${hotel.lat}${hotel.lng}${index}`}
                  {...{ hotelLoc, isSelected, handleClick }}
                />
              );
            })}
          {gigLocs &&
            gigLocs.length &&
            gigLocs.map((gigLoc: LocBasicType, index: number) => {
              if (!gigLoc) return null;
              const gigLocId = gigLoc.id;
              const isSelected = gigLocId === selectedId;
              const handleClick = () => {
                idInput.onChange(gigLocId);
                basicInput.onChange(gigLoc);
              };
              return (
                <GigCMarker
                  key={`${gigLoc.lat}${gigLoc.lng}${index}`}
                  {...{ gigLoc, isSelected, handleClick }}
                />
              );
            })}

          {routes && routes.length && (
            <Layer
              type="line"
              id="selected-route"
              paint={{
                "line-color": "black",
                "line-dasharray": [3, 3],
                "line-width": 2
              }}
            >
              {routes.map((route, index) => {
                const { toLoc, fromLoc, travelType } = route;
                return (
                  <Feature
                    key={`${toLoc.id}${index}`}
                    coordinates={[
                      gigLocToMapLoc(fromLoc),
                      gigLocToMapLoc(toLoc)
                    ]}
                  />
                );
              })}
            </Layer>
          )}

          {airports &&
            airports.length &&
            airports.map((ap: NearbyAirport, index: number) => {
              if (!ap) return null;
              const airportId = iataCodeToLocId(ap.iataCode);
              const isSelected = airportId === selectedId;
              const handleClick = () => {
                idInput.onChange(iataCodeToLocId(ap.iataCode));
                basicInput.onChange(ap);
              };
              return (
                <AirportCMarker
                  key={`${ap.lat}${ap.lng}${index}`}
                  {...{ isSelected, handleClick, ap }}
                />
              );
            })}
        </>
      </Map>
      {/* <ShowMe obj={state} name="state" /> */}
    </>
  );
};

export default TravelTargetMap;
