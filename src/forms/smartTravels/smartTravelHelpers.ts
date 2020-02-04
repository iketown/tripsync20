import { TravelEmail, TravelEmailSegment } from "./travelEmail.types";
import moment from "moment-timezone";
import {
  TravelLeg,
  TravelTypeOption,
  TravelType
} from "../../types/travel.types";
import usAirports from "../../constants/usAirports";
//
//
export const getStartEndUnixFromSegments = (segments: TravelEmailSegment[]) => {
  const firstLeg = segments[0];
  const lastLeg = segments[segments.length - 1];
  const startTime = moment
    .tz(firstLeg.departure_datetime, firstLeg.departure_time_zone_id)
    .unix();
  const endTime = moment
    .tz(lastLeg.arrival_datetime, lastLeg.arrival_time_zone_id)
    .unix();
  return { startTime, endTime };
};

export const apArrayFromSegments = (segments: TravelEmailSegment[]) => {
  const array = segments.map(seg => [seg.origin, seg.destination]);
  return array;
};

export const convertTraxoSegToTLeg = (
  segment: TravelEmailSegment
): { leg: TravelLeg; legId: string } | null => {
  const {
    type,
    origin,
    destination,
    departure_datetime,
    departure_time_zone_id,
    arrival_datetime,
    arrival_time_zone_id,
    travelers,
    normalized_airline,
    airline,
    flight_number,
    confirmation_no
  } = segment;

  let travelType = TravelTypeOption.other;

  if (type === "Air") {
    travelType = TravelTypeOption.fly;
    let fromLocId = `airport_${origin}`;
    let toLocId = `airport_${destination}`;
    const startUnix = moment
      .tz(departure_datetime, departure_time_zone_id)
      .unix();
    const endUnix = moment.tz(arrival_datetime, arrival_time_zone_id).unix();
    //@ts-ignore
    const fromLocBasic = usAirports.airports[origin];
    //@ts-ignore
    const toLocBasic = usAirports.airports[destination];
    if (!fromLocBasic) {
      //TODO handle it
    }
    if (!toLocBasic) {
      //TODO handle it
    }
    return {
      leg: {
        fromLocId,
        toLocId,
        fromLocBasic,
        toLocBasic,
        startUnix,
        endUnix,
        travelType,
        travelerNames: travelers,
        company: airline,
        companyId: normalized_airline,
        tripId: flight_number,
        confirmationNo: confirmation_no,
        enteredBy: "emailImport"
      },
      legId: `${fromLocId}-${toLocId}-${normalized_airline}-${flight_number}___${travelers
        ?.map(trav => trav.last_name)
        .join("-")}`
    };
  }
  return null;
};
