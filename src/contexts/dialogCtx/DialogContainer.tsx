import React from "react";
import { useDialogCtx } from "./DialogCtx";
import { Dialog } from "@material-ui/core";
import EventForm from "../../forms/EventForm";
import TravelFormSeparateLegs from "../../forms/travelForm/TravelFormSeparateLegs";
import HotelForm from "../../forms/HotelForm";
import PersonForm from "../../forms/personForm/PersonForm";
const None = () => <div>nope</div>;

const DialogContainer = () => {
  const { state, dispatch } = useDialogCtx();
  const onCancel = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };
  const onSuccess = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };
  const forms: { [key: string]: JSX.Element } = {
    event: <EventForm {...{ onCancel, onSuccess }} />,
    hotel: <HotelForm {...{ onCancel, onSuccess }} />,
    travel: <TravelFormSeparateLegs {...{ onCancel, onSuccess }} />,
    person: <PersonForm {...{ onCancel, onSuccess }} />,
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
