import React, { useContext, useEffect, useRef, useState } from "react";
import { useField } from "react-final-form";
import ReactMapboxGL from "react-mapbox-gl";

import { iataCodeToLocId } from "../../hooks/useLocation";
import { Event } from "../../types/Event";
import {
  LocBasicType,
  NearbyAirport,
  LocPoint
} from "../../types/location.types";
import ShowMe from "../../utils/ShowMe";
import AirportCMarker from "./AirportCMarker";
import GigCMarker from "./GigCMarker";
import HotelCMarker from "./HotelCMarker";
import { useMapBoxCtx } from "./MapBoxCtxSimple";
import { fitMapToLocs, gigLocToMapLoc } from "./mapboxHelpers";
import RouteLine from "./RouteLine";
import { useGroupCtx } from "../group/GroupCtx";

//
//
const accessToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
const Map = ReactMapboxGL({ accessToken, maxZoom: 15 });

const TravelTargetMap = ({
  idName = "",
  locBasicName = ""
}: {
  idName?: string;
  locBasicName?: string;
}) => {
  const { group } = useGroupCtx();
  const defMapCenter = group?.defaultMapCenter;
  const [map, setMap] = useState<mapboxgl.Map>();
  const { state } = useMapBoxCtx();

  const [zoom, setZoom] = useState<[number]>([4]);

  const fromHotels = state?.fromLocs.hotels || [];
  const fromGigs = state?.fromLocs.gigs || [];
  const fromAirports = state?.fromLocs.airports || [];
  const fromOtherLocs = state?.fromLocs.otherLocs || [];
  const toHotels = state?.toLocs.hotels || [];
  const toGigs = state?.toLocs.gigs || [];
  const toAirports = state?.toLocs.airports || [];
  const toOtherLocs = state?.toLocs.otherLocs || [];

  const hotels = fromHotels.concat(toHotels);
  const gigs = fromGigs.concat(toGigs);
  const airports = fromAirports.concat(toAirports);
  const otherLocs = fromOtherLocs.concat(toOtherLocs);
  const bounds = state?.bounds;
  const routes = state?.routes;

  const boundsCount = useRef(0);

  useEffect(() => {
    if (map) {
      //@ts-ignore
      window.mapbox = map;

      if (state && state.bounds?.length) {
        fitMapToLocs({ map, locs: state.bounds });
      }
    }
  }, [map, state]);

  return (
    <>
      <Map
        style="mapbox://styles/brianeichenberger/ck48bhoze4o2u1cqpygnfu0kc"
        pitch={[10]}
        containerStyle={{ height: "25rem" }}
        onStyleLoad={(map, event) => {
          setMap(map);
          //@ts-ignore
          window.map = map;
        }}
        movingMethod="easeTo"
        zoom={zoom}
        center={gigLocToMapLoc(defMapCenter)}
      >
        <>
          {hotels &&
            hotels.length &&
            hotels.map((hotel: LocBasicType, index: number) => {
              if (!hotel) return null;
              const hotelLocId = hotel.id;
              const handleClick = () => {
                console.log("clicked", hotelLocId);
              };
              const hotelLoc = hotel;
              const isSelected = false;
              return (
                <HotelCMarker
                  key={`${hotel.lat}${hotel.lng}${index}`}
                  {...{ hotelLoc, isSelected, handleClick }}
                />
              );
            })}

          {gigs &&
            gigs.length &&
            gigs.map((gig: Event, index: number) => {
              if (!gig.locBasic) return null;
              const gigLoc = gig.locBasic;
              const gigLocId = gig.locId;
              const isPopupOpen = true;
              const isSelected = false;
              const handleClick = () => {
                console.log("clicked", gigLocId);
              };
              return (
                <GigCMarker
                  key={`${gigLoc.lat}${gigLoc.lng}${index}`}
                  {...{ gig, gigLoc, isSelected, isPopupOpen, handleClick }}
                />
              );
            })}
          {routes && routes.length && <RouteLine routes={routes} />}

          {/* {routes && routes.length && (
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
          )} */}

          {airports &&
            airports.length &&
            airports.map((ap: NearbyAirport, index: number) => {
              if (!ap) return null;
              const airportId = iataCodeToLocId(ap.iataCode);
              const isSelected = false;
              const handleClick = () => {
                console.log("clicked", airportId);
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
      <ShowMe obj={state} name="state" />
    </>
  );
};

export default TravelTargetMap;
