import { LocBasicType } from "./../../types/location.types";
import { TravelLeg } from "../../types/travel.types";

export const dedupeLegs = (legsObj?: { [legId: string]: TravelLeg }) => {
  if (!legsObj || !Object.keys(legsObj).length) return null;

  const dedupedObj =
    legsObj &&
    Object.entries(legsObj).reduce((obj: any, [legId, leg]) => {
      const [flightId, _] = legId.split("___");
      leg.travelerNames =
        leg.travelerNames &&
        leg.travelerNames.map(trav => ({
          ...trav,
          conf: leg.confirmationNo
        }));
      if (!!obj[flightId]) {
        // add this person to that one
        leg.travelerNames &&
          obj[flightId].travelerNames.push(...leg.travelerNames);
      } else {
        obj[flightId] = leg;
      }
      return obj;
    }, {});
  return Object.values(dedupedObj).sort((a: any, b: any) =>
    a.startUnix < b.startUnix ? -1 : 1
  );
};

export const pathIdFromLocs = ({
  fromLocBasic,
  toLocBasic
}: {
  fromLocBasic: LocBasicType;
  toLocBasic: LocBasicType;
}) => {
  const startId = fromLocBasic.id || fromLocBasic.placeId;
  const endId = toLocBasic.id || toLocBasic.placeId;
  return `${startId}-->${endId}`;
};
