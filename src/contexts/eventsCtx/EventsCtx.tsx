import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { Event, EventTypeOption } from "../../types/Event";
import { useFirebaseCtx } from "../FirebaseCtx";
import { useGroupCtx } from "../../components/group/GroupCtx";
import moment from "moment";
import { useDateRangeCtx } from "../dateRangeCtx/DateRangeCtx";

type SortedEvents = {
  [P in EventTypeOption]?: Event[];
};

type EventsCtxProps = {
  events: Event[];
  eventsObj: { [id: string]: Event };
  sortedEvents: SortedEvents;
};

const EventsCtx = createContext<Partial<EventsCtxProps>>({});

export const EventsCtxProvider = (props: any) => {
  const { firestore } = useFirebaseCtx();
  const { group } = useGroupCtx();
  const { dateRange } = useDateRangeCtx();
  const [events, setEvents] = useState<Event[]>();
  const [eventsObj, setEventsObj] = useState<{ [id: string]: Event }>();

  useEffect(() => {
    let unsubscribe: any = () => null;
    if (firestore && group && dateRange) {
      const { earliest, latest } = dateRange;

      unsubscribe = firestore
        ?.collection(`groups/${group.id}/events`)
        .where("startUnix", "<", latest)
        .where("startUnix", ">", earliest)
        .onSnapshot(snapshot => {
          const _events: Event[] = [];
          snapshot.forEach(doc => {
            //@ts-ignore
            _events.push({ ...doc.data(), id: doc.id });
          });
          const _eventsObj = _events?.reduce(
            (obj: { [id: string]: Event }, evt) => {
              if (evt && evt.id) {
                obj[evt.id] = evt;
              }
              return obj;
            },
            {}
          );
          setEventsObj(_eventsObj);
          setEvents(
            _events.sort((a, b) => (a.startDate < b.startDate ? -1 : 1))
          );
        });
    }
    return unsubscribe;
  }, [dateRange, firestore, group]);

  const sortedEvents = useMemo(() => {
    const _sorted = events?.reduce((obj: SortedEvents, evt) => {
      if (evt && evt.eventType) {
        const eventType = evt && evt.eventType;
        if (obj[eventType]) {
          //@ts-ignore
          obj[eventType].push(evt);
        } else {
          obj[eventType] = [evt];
        }
      }
      return obj;
    }, {});

    if (_sorted?.show && _sorted?.show.length && _sorted.hotel?.length) {
      _sorted?.show.forEach(show => {
        show.amHotels = _sorted.hotel?.filter(
          hotel =>
            hotel.startDate &&
            hotel.endDate &&
            moment(hotel.startDate).isSameOrBefore(
              moment(show.startDate).startOf("day")
            ) &&
            moment(hotel.endDate).isSameOrAfter(
              moment(show.startDate).startOf("day")
            )
        );
        show.pmHotels = _sorted.hotel?.filter(
          hotel =>
            hotel.startDate &&
            hotel.endDate &&
            moment(hotel.startDate).isSameOrBefore(
              moment(show.startDate).endOf("day")
            ) &&
            moment(hotel.endDate).isSameOrAfter(
              moment(show.startDate).endOf("day")
            )
        );
      });
    }
    return _sorted;
  }, [events]);

  return (
    <EventsCtx.Provider
      value={{ events, eventsObj, sortedEvents }}
      {...props}
    />
  );
};

export const useEventsCtx = (eventId?: string) => {
  const ctx = useContext(EventsCtx);
  const { events, sortedEvents } = ctx;
  const { dateRange, setDateRange } = useDateRangeCtx();
  const prevAndNext = useMemo(() => {
    if (eventId && events) {
      const gigEvents = sortedEvents?.show;
      const eventIndex = gigEvents?.findIndex(evt => evt.id === eventId);
      let prev, next;
      if (typeof eventIndex === "undefined") return { prev, next };
      prev =
        gigEvents && eventIndex >= 0 ? gigEvents[eventIndex - 1] : undefined;
      next =
        gigEvents && eventIndex >= 0 ? gigEvents[eventIndex + 1] : undefined;
      return { prev, next };
    }
    return { prev: undefined, next: undefined };
  }, [eventId, events, sortedEvents]);

  const getEventsAtTimes = useCallback(
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
      } else if (ctx.sortedEvents?.show) {
        return ctx.sortedEvents?.show.filter(
          event =>
            event.startUnix > targetEarliest && event.startUnix < targetLatest
        );
      }
    },
    [ctx.sortedEvents, dateRange, setDateRange]
  );

  return { ...ctx, prevAndNext, getEventsAtTimes };
};
