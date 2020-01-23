import { LocBasicType } from "./location.types";
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
  startDate: string;
  endDate: string;
  legs: TravelLeg[];
};

export type TravelLeg = {
  endDate?: string;
  fromLocBasic: LocBasicType;
  fromLocId: string;
  km?: number;
  miles?: number;
  minutes?: number;
  startDate?: string;
  toLocBasic: LocBasicType;
  toLocId: string;
  travelType: TravelTypeOption;
  itinIds?: string[];
  itinBasics?: Itinerary[];
};

export type Itinerary = {
  id?: string;
  people: string[];
};
