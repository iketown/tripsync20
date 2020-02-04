import { LocBasicType } from "./location.types";

export enum EventTypeOption {
  show = "show",
  hotel = "hotel",
  dining = "dining",
  other = "other"
}

export type Event = {
  id: string;
  eventType: EventTypeOption;
  startDate: string;
  startUnix: number;
  endUnix?: number;
  locId: string;
  locBasic: LocBasicType;
  relatedEvents?: string[];
  endDate?: string;
  durationMinutes?: number;
  title?: string;
  amHotels?: Event[];
  pmHotels?: Event[];
};
