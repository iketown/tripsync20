import React, { createContext, useContext, useEffect, useState } from "react";
import {
  TravelTypeOption,
  TravelType,
  TravelLeg
} from "../../types/travel.types";
type TravelCtxType = {
  travels: TravelType[];
  travelLegs: TravelLeg[];
};

const TravelCtx = createContext<Partial<TravelCtxType>>({});

export const TravelCtxProvider = (props: any) => {
  const [travels, setTravels] = useState([]);
  return <TravelCtx.Provider value={42} {...props} />;
};

export const useTravelCtx = () => {
  const ctx = useContext(TravelCtx);
  return ctx;
};
