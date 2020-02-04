import React, { createContext, useContext, useReducer } from "react";
import {
  LocBasicType,
  LocPoint,
  NearbyAirport,
  Route
} from "../../types/location.types";
import { Event } from "../../types/Event";

type LocCategory = "hotels" | "gigs" | "otherLocs" | "airports";
type Side = "toLocs" | "fromLocs";

type MapBoxState = {
  fromLocs: {
    hotels: LocBasicType[];
    gigs: Event[];
    otherLocs: LocBasicType[];
    airports: NearbyAirport[];
  };
  toLocs: {
    hotels: LocBasicType[];
    gigs: Event[];
    otherLocs: LocBasicType[];
    airports: NearbyAirport[];
  };
  routes: Route[];
  bounds?: LocPoint[];
  selectedLocId?: string;
  selectedLocBasic?: LocBasicType;
};
type MapBoxCombinedState = {
  to: MapBoxState;
  from: MapBoxState;
};

export type Action = {
  type:
    | "SET_HOTELS"
    | "SET_GIGS"
    | "SET_OTHERS"
    | "SET_AIRPORTS"
    | "SET_LOCS"
    | "SET_ROUTES"
    | "SET_BOUNDS"
    | "ADD_TO_BOUNDS";
  payload: any;
};

const initialState: MapBoxState = {
  fromLocs: {
    hotels: [],
    gigs: [],
    airports: [],
    otherLocs: []
  },
  toLocs: {
    hotels: [],
    gigs: [],
    airports: [],
    otherLocs: []
  },
  routes: [],
  bounds: []
};

type ContextType = {
  state: MapBoxState;
  dispatch: React.Dispatch<Action>;
};

const MapBoxCtx = createContext<Partial<ContextType>>({ state: initialState });

const reducer = (state: MapBoxState, action: Action) => {
  switch (action.type) {
    // case "SET_HOTELS": {
    //   const { hotels } = action.payload;
    //   return stateWithBounds({ ...state, hotels });
    // }
    case "SET_LOCS": {
      const { locs, toOrFrom, locName } = action.payload;
      let side;
      if (toOrFrom === "to") side = "toLocs";
      if (toOrFrom === "from") side = "fromLocs";
      if (side === "toLocs" || side === "fromLocs") {
        return {
          ...state,
          [side]: { ...state[side], [locName]: locs }
        };
      }
      break;
    }
    case "SET_BOUNDS": {
      const { bounds } = action.payload;
      return { ...state, bounds };
    }

    case "SET_ROUTES": {
      const { routes } = action.payload;
      return { ...state, routes };
    }

    // case "ADD_TO_BOUNDS": {
    //   const { locs } = action.payload;
    //   return stateWithBounds({ ...state }, locs);
    // }

    default:
      return state;
  }
};

export const MapBoxCtxProvider = (props: any) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapBoxCtx.Provider
      value={{
        state,
        dispatch
      }}
      {...props}
    />
  );
};

export const useMapBoxCtx = () => {
  const ctx = useContext(MapBoxCtx);
  if (!ctx) {
    throw new Error("useMapboxCtx must be a descendant of MapBoxCtxProvider");
  }
  return ctx;
};
