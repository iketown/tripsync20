import { LocBasicType } from "./location.types";
import { TravelEmail, Traveler } from "../forms/smartTravels/travelEmail.types";
import { Moment } from "moment";
export type TravelBasic = {
  id: string;
  // id is same as the destination eventID
  toLocId: string;
  toLocBasic: LocBasicType;
  toLocStartDate: string;
  fromLocId?: string;
  fromLocBasic?: LocBasicType;
  fromLocStartDate?: string;
  startDate?: string;
  endDate?: string;
  minutes?: number;
  miles?: number;
  km?: number;
};

export enum TravelTypeOption {
  fly = "FLY",
  bus = "BUS",
  car = "CAR",
  train = "TRAIN",
  walk = "WALK",
  shuttle = "SHUTTLE",
  other = "OTHER"
}

export type TravelForm = TravelLeg & TravelType;

export type TravelType = {
  id?: string;
  toEventId: string;
  fromEventId: string;
  startUnix: number;
  endUnix?: number;
  legs: { [legId: string]: TravelLeg };
  travelEmails: { [id: string]: TravelEmail };
};

export type TravelLeg = {
  endDate?: string;
  startUnix: number;
  endUnix: number;
  startMoment?: Moment;
  endMoment?: Moment;
  fromLocBasic: LocBasicType;
  fromLocId: string;
  toLocBasic: LocBasicType;
  toLocId: string;
  travelType: TravelTypeOption;
  company: string;
  companyId?: string;
  tripId: string;
  // tripId is flight number, etc
  enteredBy?: "emailImport" | "manual";
  confirmationNo?: string;
  travelerNames?: Traveler[];
  travelerIds?: string[];
  km?: number;
  miles?: number;
  minutes?: number;
  startDate?: string;
  itinIds?: string[];
  itinBasics?: Itinerary[];
  path?: any;
  info?: any;
};

export type Itinerary = {
  id?: string;
  people: string[];
};
