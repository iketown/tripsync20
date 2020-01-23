import React from "react";
import { DialogCtxProvider } from "./contexts/dialogCtx/DialogCtx";
import TimePickersProvider from "./providers/PickersProvider";

const GlobalProviders = ({ children }: { children: any }) => {
  return (
    <DialogCtxProvider>
      <TimePickersProvider>{children}</TimePickersProvider>
    </DialogCtxProvider>
  );
};

export default GlobalProviders;
