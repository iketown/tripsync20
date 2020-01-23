import React, { useReducer, createContext, useContext } from "react";

type DialogState = {
  dialogOpen: boolean;
  props: { [key: string]: any };
  formType: string;
};
type DialogAction = {
  type: "OPEN_DIALOG" | "CLOSE_DIALOG";
  formType?: string;
  props: { [key: string]: any };
};

const reducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "OPEN_DIALOG":
      return {
        ...state,
        dialogOpen: true,
        props: action.props,
        formType: action.formType || "none"
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        dialogOpen: false,
        props: {
          eventId: ""
        },
        formType: "none"
      };
    default:
      return state;
  }
};

const inititalState = {
  dialogOpen: false,
  props: {
    eventId: "",
    event: {},
    before: false,
    hotelEventId: ""
  },
  formType: "hotel"
};
const DialogCtx = createContext<{ state: DialogState; dispatch: any }>({
  state: inititalState,
  dispatch: (action: DialogAction) => null
});

export const DialogCtxProvider = (props: any) => {
  const [state, dispatch] = useReducer(reducer, inititalState);
  return <DialogCtx.Provider value={{ state, dispatch }} {...props} />;
};

export const useDialogCtx = () => {
  const ctx = useContext(DialogCtx);
  return ctx;
};

export default DialogCtx;
