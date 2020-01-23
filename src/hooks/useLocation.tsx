import React, { useEffect, useCallback } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { LocationType } from "../types/location.types";
import {
  getShortNameFromLoc,
  getTimeZoneFromLatLng,
  airportResultToLoc,
  locationToLocBasic
} from "../utils/locationFxns";
import moment from "moment-timezone";
import { getAirportsNearPoint } from "../apis/Amadeus";
import { useGroupCtx } from "../components/group/GroupCtx";
import { Event } from "../types/Event";
//
//
const useLocation = () => {
  const { firestore } = useFirebaseCtx();
  const { group } = useGroupCtx();
  //
  //
  const createLoc = async (loc: any) => {
    loc.shortName = getShortNameFromLoc(loc);
    const timeZoneId = await getTimeZoneFromLatLng({
      lat: loc.lat,
      lng: loc.lng
    });
    const nearbyAirports = await getAirportsNearPoint(loc.lat, loc.lng);
    loc.timeZoneId = timeZoneId;
    loc.nearbyAirports =
      nearbyAirports &&
      (await Promise.all(nearbyAirports?.map(ap => airportResultToLoc(ap))));
    await firestore
      ?.doc(`locations/${loc.placeId}`)
      .set(loc, { merge: true })
      .catch(err => {
        console.log("firestore location error", err);
        throw new Error("error saving location");
      });
    console.log("created new LOC", loc);
    return locationToLocBasic(loc);
  };

  //
  //
  const getLocFromPlaceId = async (placeId: string) => {
    const doc = await firestore?.doc(`locations/${placeId}`).get();
    if (!doc || !doc.exists) {
      console.log("never seen that loc before");
      return null;
    }
    const data = doc.data();
    if (!data) return null;
    return locationToLocBasic({ ...data, id: doc.id });
  };

  const getEventLocation = useCallback(
    async (eventId: string): Promise<LocationType | null> => {
      if (!group) return null;
      const eventRef = firestore?.doc(`groups/${group.id}/events/${eventId}`);
      const locId = await eventRef?.get().then(doc => {
        const data = doc.data();
        //@ts-ignore
        return data.locId;
      });
      const loc = await firestore
        ?.doc(`locations/${locId}`)
        .get()
        .then(doc => ({ id: doc.id, ...doc.data() }));
      //@ts-ignore
      return (!!loc && loc) || null;
    },
    [firestore, group]
  );

  return { getLocFromPlaceId, createLoc, getEventLocation };
};

export const iataCodeToLocId = (iataCode: string) => `airport_${iataCode}`;

export default useLocation;
