import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import {
  TravelTypeOption,
  TravelType,
  TravelLeg
} from "../../types/travel.types";
import { useFirebaseCtx } from "../FirebaseCtx";
import { useDateRangeCtx } from "../dateRangeCtx/DateRangeCtx";
import { Group } from "@material-ui/icons";
import { useGroupCtx } from "../../components/group/GroupCtx";

type TravelCtxType = {
  travels: TravelType[];
  travelObj: { [id: string]: TravelType };
};

const TravelCtx = createContext<Partial<TravelCtxType>>({});

export const TravelCtxProvider = (props: any) => {
  const [travels, setTravels] = useState<TravelType[]>([]);
  const [travelObj, setTravelsObj] = useState<{ [id: string]: TravelType }>();
  const { dateRange } = useDateRangeCtx();
  const { firestore } = useFirebaseCtx();
  const { group } = useGroupCtx();

  useEffect(() => {
    if (!dateRange || !group || !group.id) {
      return;
    }
    const { earliest, latest } = dateRange;
    const travelsRef = firestore
      ?.collection(`groups/${group.id}/travels`)
      .where("startUnix", "<", latest)
      .where("startUnix", ">", earliest);
    const unsubscribe = travelsRef?.onSnapshot(snapshot => {
      const _travels: TravelType[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const {
          toEventId,
          fromEventId,
          startUnix,
          endUnix,
          legs,
          travelEmails
        } = data;
        _travels.push({
          id: doc.id,
          toEventId,
          fromEventId,
          startUnix,
          endUnix,
          legs,
          travelEmails
        });
      });
      const _travelsObj = _travels.reduce(
        (obj: { [id: string]: TravelType }, trav) => {
          if (trav.id) obj[trav.id] = trav;
          return obj;
        },
        {}
      );
      setTravels(_travels);
      setTravelsObj(_travelsObj);
    });
    return unsubscribe;
  }, [dateRange, firestore, group]);

  return <TravelCtx.Provider value={{ travels, travelObj }} {...props} />;
};

export const useTravelCtx = () => {
  const ctx = useContext(TravelCtx);
  const { dateRange, setDateRange } = useDateRangeCtx();
  if (!ctx.travels)
    throw new Error(
      "useTravelCtx must be a descendant of TravelCtxProvider 😕"
    );

  const getTravelAtTimes = useCallback(
    ({
      startTime,
      endTime,
      rangeDays = 1
    }: {
      startTime: number;
      endTime: number;
      rangeDays?: number;
    }) => {
      const targetEarliest = startTime - rangeDays * 86400;
      const targetLatest = endTime + rangeDays * 86400;
      const earliest = dateRange?.earliest;
      const latest = dateRange?.latest;
      if (
        earliest &&
        latest &&
        (targetEarliest < earliest || targetLatest > latest)
      ) {
        // go fetch travels
        setDateRange &&
          setDateRange(old => ({
            earliest: Math.min(targetEarliest - 86400, old.earliest),
            latest: Math.max(targetLatest + 86400, old.latest)
          }));
        return [];
      } else if (ctx.travels) {
        return ctx.travels.filter(
          trav =>
            trav.startUnix > targetEarliest && trav.startUnix < targetLatest
        );
      }
    },
    [ctx.travels, dateRange, setDateRange]
  );
  return { ...ctx, getTravelAtTimes };
};
