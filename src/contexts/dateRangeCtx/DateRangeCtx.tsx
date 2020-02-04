import React, { createContext, useContext, useState } from "react";
import moment from "moment";

type DateRangeContext = {
  dateRange: { earliest: number; latest: number };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      earliest: number;
      latest: number;
    }>
  >;
};

const DateRangeCtx = createContext<Partial<DateRangeContext>>({});

export const DateRangeCtxProvider = (props: any) => {
  const earliest = moment()
    .subtract(1, "week")
    .unix();
  const latest = moment()
    .add(6, "weeks")
    .unix();
  const [dateRange, setDateRange] = useState({ earliest, latest });
  //@ts-ignore
  window.moment = moment;
  return (
    <DateRangeCtx.Provider value={{ dateRange, setDateRange }} {...props} />
  );
};

export const useDateRangeCtx = () => {
  const ctx = useContext(DateRangeCtx);
  return ctx;
};
