import { LocBasicType } from "./location.types";

export type Person = {
  firstName: string;
  lastName: string;
  homeAirportId: string;
  homeAirportLocBasic: LocBasicType;
  homeAirport2Id?: string;
  homeAirport2LocBasic?: LocBasicType;
  avatarUrl?: string;
  email?: string;
  id?: string;
  altId: string;
};
