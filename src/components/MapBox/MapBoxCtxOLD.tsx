import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect
} from "react";
import { LngLat } from "mapbox-gl";
import { EventLoc } from "./mapboxHelpers";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import moment from "moment";
import { Event } from "../../types/Event";

//
//
const MBCtx: React.Context<{
  state: MBCtxState;
  dispatch: React.Dispatch<IAction>;
  events: Event[];
  eventsObj: { [eventId: string]: Event };
  //@ts-ignore
}> = createContext();

type MapActionTypes =
  | "SELECT_EVENT"
  | "DRAW_PATH"
  | "SET_EVENTS"
  | "CREATE_TOUR"
  | "EDIT_TOUR";
type IAction = {
  type: MapActionTypes;
  eventId?: string;
  tourId?: string;
  route?: EventLoc[];
  selectedRoute?: EventLoc[];
};

interface MBCtxState {
  selectedEvent?: string;
  eventId?: string;
  selectedTour?: string;
  selectedType?: "event" | "tour" | "none";
  centerOn?: LngLat;
  path?: EventLoc[];
  route?: EventLoc[];
  selectedRoute?: EventLoc[];
}

const initialState = {
  centerOn: new LngLat(-97, 38), // center of U.S.
  selectedType: "none"
};
const reducer = (state: MBCtxState, action: IAction): MBCtxState => {
  switch (action.type) {
    case "SELECT_EVENT": {
      const { eventId } = action;
      return { ...state, eventId, selectedType: "event" };
    }
    case "DRAW_PATH": {
      const { route, selectedRoute } = action;
      return { ...state, route, selectedRoute };
    }
    case "CREATE_TOUR": {
      const { eventId } = action;
      if (!!eventId) {
        return {
          ...state,
          selectedType: "tour",
          selectedTour: undefined,
          eventId
        };
      }
      break;
    }
    case "EDIT_TOUR":
      {
        const { tourId, eventId } = action;
        if (tourId) {
          return {
            ...state,
            selectedType: "tour",
            selectedTour: tourId,
            selectedEvent: eventId
          };
        }
      }
      break;
    default:
      return state;
  }
  return state;
};

export const MapBoxCtxProvider = (props: any) => {
  const [firstDate, setFirstDate] = useState(
    moment()
      .startOf("month")
      .subtract(2, "month")
      .format()
  );
  const [lastDate, setLastDate] = useState(
    moment()
      .endOf("month")
      .format()
  );
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  const { events, eventsObj } = useEventsCtx();

  return (
    <MBCtx.Provider value={{ state, dispatch, events, eventsObj }} {...props} />
  );
};

export const useMapBoxCtx = () => {
  const ctx = useContext(MBCtx);
  if (!ctx)
    throw new Error(
      "useMapBoxCtx must be a descendant of MapBoxCtxProvider 😕"
    );
  return ctx;
};
