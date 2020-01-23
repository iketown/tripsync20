import React from "react";
import { useDialogCtx } from "./DialogCtx";
import { Dialog } from "@material-ui/core";
import EventForm from "../../forms/EventForm";
import TravelFormNew from "../../forms/travelForm/TravelFormNew";
import HotelForm from "../../forms/HotelForm";
const None = () => <div>nope</div>;

const DialogContainer = () => {
  const { state, dispatch } = useDialogCtx();
  const onCancel = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };
  const forms: { [key: string]: JSX.Element } = {
    event: <EventForm {...{ onCancel }} />,
    hotel: <HotelForm {...{ onCancel }} />,
    travel: <TravelFormNew {...{ onCancel }} />,
    none: <None />
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={state.dialogOpen}
      onClose={() => dispatch({ type: "CLOSE_DIALOG", props: {} })}
    >
      {state.formType && forms[state.formType]}
    </Dialog>
  );
};

export default DialogContainer;
