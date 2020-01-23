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
  const [events, setEvents] = useState<Event[]>();
  const [eventsObj, setEventsObj] = useState<{ [id: string]: Event }>();

  useEffect(() => {
    let unsubscribe: any = () => null;
    if (firestore && group) {
      unsubscribe = firestore
        ?.collection(`groups/${group.id}/events`)
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
  }, [firestore, group]);

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
        console.log("show", show);
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
    console.log("_sorted", _sorted);
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

  const relatedEvents = useMemo(() => {
    console.log("getting related events", eventId);
    return eventId
      ? events?.filter(evt => evt.relatedEvents?.includes(eventId))
      : [];
  }, [events, eventId]);
  return { ...ctx, prevAndNext, relatedEvents };
};
