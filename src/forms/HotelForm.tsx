import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid
} from "@material-ui/core";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Form, useField } from "react-final-form";
import styled from "styled-components";

import { useGroupCtx } from "../components/group/GroupCtx";
import {
  MapBoxCtxProvider,
  useMapBoxCtx
} from "../components/MapBox/MapBoxCtxSimple";
import TravelTargetMap from "../components/MapBox/TravelTargetMap";
import { useDialogCtx } from "../contexts/dialogCtx/DialogCtx";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useEventFxns } from "../hooks/useEvents";
import { EventTypeOption } from "../types/Event";
import ShowMe from "../utils/ShowMe";
import { DateTimeInput, EventLocInput } from "./inputs";

const Spacer = styled.div`
  padding: 5px;
`;
const HotelForm = ({
  onSuccess,
  onCancel
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { firestore, user } = useFirebaseCtx();
  const { state, dispatch } = useDialogCtx();
  const [initialValues, setInitialValues] = useState<any>(
    state.props.hotelEvent || {
      startDate: moment(state.props?.event?.startDate)
        .tz(state.props?.event?.locBasic?.timeZoneId)
        .startOf("day")
        .add(15, "hours")
        .format(),
      endDate: moment(state.props?.event?.startDate)
        .tz(state.props?.event?.locBasic?.timeZoneId)
        .startOf("day")
        .add(1, "day")
        .add(13, "hours")
        .format(),
      eventType: EventTypeOption.hotel
    }
  );
  // eventId is the ASSOCIATED event for this hotel stay
  // HotelEvent will have a field called associatedEvents []

  const { eventId, hotelEventId } = state.props;
  const { group } = useGroupCtx();
  const { deleteEvent } = useEventFxns();
  const groupId = group?.id;
  const docLoc =
    groupId && hotelEventId && `groups/${groupId}/events/${hotelEventId}`;
  const collectionLoc = groupId && `groups/${groupId}/events`;

  const onSubmit = async (values: any) => {
    console.log("values", values);
    const { locBasic, startDate, endDate } = values;
    values.startDate = moment.tz(startDate, locBasic.timeZoneId).format();
    values.endDate = moment.tz(endDate, locBasic.timeZoneId).format();
    values.startUnix = moment(values.startDate).unix();
    values.endUnix = moment(values.endDate).unix();
    if (docLoc) {
      await firestore?.doc(docLoc).update(values);
      return;
    } else if (collectionLoc) {
      console.log("saving to firestore", collectionLoc);
      await firestore?.collection(collectionLoc).add(values);
      return;
    } else {
      console.log("didnt work", values, docLoc, collectionLoc);
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    return errors;
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({
        handleSubmit,
        values,
        submitSucceeded,
        pristine,
        valid,
        dirtyFields
      }) => {
        if (submitSucceeded) onSuccess && onSuccess();
        const dirty = !!Object.keys(dirtyFields).filter(k => !!k).length;

        const venueName = state.props.event?.locBasic?.venueName;
        return (
          <form onSubmit={handleSubmit}>
            <DialogTitle>Hotel {venueName && `near ${venueName}`}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid container spacing={2} item xs={12} sm={6}>
                  <Grid item xs={12}>
                    <EventLocInput
                      idName="locId"
                      locBasicName="locBasic"
                      location={values.locBasic}
                      biasCenterLoc={state.props.event?.locBasic}
                      placeholder="Marriott, Hyatt, Motel 6 etc. . ."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimeInput
                      name="startDate"
                      label="Check In"
                      timeZoneId={
                        values.locBasic?.timeZoneId ||
                        state.props.event?.locBasic?.timeZoneId
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimeInput
                      name="endDate"
                      label="Check Out"
                      timeZoneId={
                        values.locBasic?.timeZoneId ||
                        state.props.event?.locBasic?.timeZoneId
                      }
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MapBoxCtxProvider
                    gigLocs={[state.props.event?.locBasic]}
                    hotels={[values.locBasic]}
                  >
                    <TravelTargetMap />
                    <MapAdder />
                  </MapBoxCtxProvider>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between" }}>
              <div>
                {state.props.hotelEventId && (
                  <Button
                    onClick={() => {
                      deleteEvent(state.props.hotelEventId);
                      onCancel && onCancel();
                    }}
                    variant="outlined"
                    color="secondary"
                  >
                    delete hotel
                  </Button>
                )}
              </div>
              <div>
                <Button style={{ marginLeft: "5px" }} onClick={onCancel}>
                  cancel
                </Button>
                <Button
                  style={{ marginLeft: "5px" }}
                  disabled={!valid || !dirty}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  save
                </Button>
              </div>
            </DialogActions>
            <ShowMe obj={{ collectionLoc, docLoc }} name="locs" noModal />
            <ShowMe obj={values} name="values" noModal />
            <ShowMe obj={state} name="state" noModal />
          </form>
        );
      }}
    </Form>
  );
};

export default HotelForm;

const MapAdder = () => {
  const hotel = useField("locBasic");
  const currentHotel = hotel.input.value;
  const { state, dispatch } = useMapBoxCtx();
  useEffect(() => {
    if (currentHotel && dispatch) {
      dispatch({ type: "SET_HOTELS", payload: { hotels: [currentHotel] } });
    }
  }, [currentHotel, dispatch]);
  return <div />;
};
