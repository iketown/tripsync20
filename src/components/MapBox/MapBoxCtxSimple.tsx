import React, { createContext, useContext, useReducer } from "react";
import {
  LocBasicType,
  LocPoint,
  NearbyAirport,
  Route
} from "../../types/location.types";

type MapBoxState = {
  hotels: LocBasicType[];
  gigLocs: LocBasicType[];
  otherLocs: LocBasicType[];
  airports: NearbyAirport[];
  routes: Route[];
  bounds?: LocPoint[];
  selectedLocId?: string;
  selectedLocBasic?: LocBasicType;
};
export type Action = {
  type:
    | "SET_HOTELS"
    | "SET_GIGS"
    | "SET_OTHERS"
    | "SET_AIRPORTS"
    | "SET_ROUTES"
    | "ADD_TO_BOUNDS";
  payload: any;
};

const initializer = ({
  hotels,
  gigLocs,
  otherLocs,
  airports,
  routes
}: MapBoxState) => {
  return stateWithBounds({
    hotels,
    gigLocs,
    airports,
    otherLocs,
    routes
  });
};

const initialState = {
  hotels: [],
  gigLocs: [],
  airports: [],
  otherLocs: [],
  routes: [],
  bounds: []
};

type ContextType = {
  state: MapBoxState;
  dispatch: React.Dispatch<Action>;
};

const MapBoxCtx = createContext<Partial<ContextType>>({ state: initialState });

const stateWithBounds = (
  state: MapBoxState,
  otherBoundsPoints?: LocPoint[]
): MapBoxState => {
  const { hotels = [], gigLocs = [], airports = [], otherLocs = [] } = state;
  if (otherBoundsPoints) {
  }
  const newBounds = [
    ...hotels,
    ...gigLocs,
    ...airports,
    ...otherLocs,
    ...(otherBoundsPoints || []).map(loc => ({ ...loc, keepMe: true }))
  ].map((loc, index) => {
    if (!loc) return null;
    //@ts-ignore
    if (loc.distanceMi && loc.distanceMi > 100 && !loc.keepMe) return null;
    const { lat, lng } = loc;
    return { lat, lng };
  });
  //@ts-ignore
  return { ...state, bounds: newBounds.filter(loc => !!loc) };
};

const reducer = (state: MapBoxState, action: Action) => {
  console.log("reducer", action);
  switch (action.type) {
    case "SET_HOTELS": {
      const { hotels } = action.payload;
      return stateWithBounds({ ...state, hotels });
    }
    case "SET_AIRPORTS": {
      const { airports } = action.payload;
      return stateWithBounds({ ...state, airports });
    }
    case "SET_GIGS": {
      const { gigLocs } = action.payload;
      return stateWithBounds({ ...state, gigLocs });
    }
    case "SET_OTHERS": {
      const { otherLocs } = action.payload;
      return stateWithBounds({ ...state, otherLocs });
    }
    case "SET_ROUTES": {
      const { routes } = action.payload;
      return { ...state, routes };
    }
    case "ADD_TO_BOUNDS": {
      const { locs } = action.payload;
      return stateWithBounds({ ...state }, locs);
    }

    default:
      return state;
  }
};

export const MapBoxCtxProvider = (props: any) => {
  const { gigLocs, hotels, airports, routes } = props;
  const [state, dispatch] = useReducer(
    reducer,
    { ...initialState, gigLocs, hotels, airports, routes },
    initializer
  );

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
