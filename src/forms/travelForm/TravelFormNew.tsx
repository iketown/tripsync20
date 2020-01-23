import { DialogActions, DialogContent, Grid, Button } from "@material-ui/core";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, useField, useForm } from "react-final-form";

import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import useLocation, { iataCodeToLocId } from "../../hooks/useLocation";
import { getDistanceInKm } from "../../utils/locationFxns";
import ShowMe from "../../utils/ShowMe";
import TravelTypeSelect from "../inputs/TravelTypeSelect";
import { maxDrivingDistanceKm } from "../../constants/travelPreferences";
import { TravelTypeOption } from "../../types/travel.types";
import { Event, EventTypeOption } from "../../types/Event";
import { LocBasicType, NearbyAirport } from "../../types/location.types";
import { AirportSwitcher, GroundSwitcher, DateTimeInput } from "../inputs";
import {
  MapBoxCtxProvider,
  useMapBoxCtx
} from "../../components/MapBox/MapBoxCtxSimple";
import TravelTargetMap from "../../components/MapBox/TravelTargetMap";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import moment from "moment-timezone";
import { DateTimePicker } from "@material-ui/pickers";
import { useTravel } from "../../hooks/useTravel";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import TravelFormLeg from "./TravelFormLeg";
//
//
const TravelForm = ({ onCancel }: { onCancel?: () => void }) => {
  //@ts-ignore
  const { state, dispatch: dialogDispatch } = useDialogCtx();
  const { before, fromEventId, toEventId } = state.props;
  const { eventsObj } = useEventsCtx();
  const [fromEvent, setFromEvent] = useState(
    eventsObj && eventsObj[fromEventId]
  );
  const [toEvent, setToEvent] = useState(eventsObj && eventsObj[toEventId]);

  const { getEventLocation } = useLocation();

  const [distanceInKm, setDistanceInKm] = useState<number>(0);
  const { addLegToTravel } = useTravel();

  useEffect(() => {
    if (fromEvent && toEvent) {
      const _distance = getDistanceInKm(fromEvent?.locBasic, toEvent?.locBasic);
      setDistanceInKm(_distance);
    }
  }, [fromEvent, toEvent]);

  const validate = (v: any) => {
    const errors: { [fieldName: string]: string } = {};
    if (!v.fromLocId) errors.fromLocId = "Please choose FROM location";
    if (!v.toLocId) errors.toLocId = "Please choose TO location";
    if (v.travelType === TravelTypeOption.fly) {
      if (!v.fromLocId.includes("airport"))
        errors.fromLocId = "Please choose an airport";
      if (!v.toLocId.includes("airport"))
        errors.toLocId = "Please choose an airport";
    }
    if (moment(v.startDate).isSameOrAfter(v.endDate)) {
      errors.endDate = "Must be after start date";
      errors.startDate = "Must be before end date";
    }
    return errors;
  };
  const onSubmit = (values: any) => {
    console.log("values", values);
    return addLegToTravel(values);
  };

  const travelType =
    distanceInKm < maxDrivingDistanceKm
      ? TravelTypeOption.bus
      : TravelTypeOption.fly;

  const groundLocs = {
    fromLocId: fromEvent?.locId,
    fromLocBasic: fromEvent?.locBasic,
    toLocId: toEvent?.locId,
    toLocBasic: toEvent?.locBasic
  };
  // const airLocs = {
  //   fromLocId:
  //     fromAirports[0]?.id || iataCodeToLocId(fromAirports[0]?.iataCode),
  //   fromLocBasic: fromAirports[0],
  //   toLocId: toAirports[0]?.id || iataCodeToLocId(toAirports[0]?.iataCode),
  //   toLocBasic: toAirports[0]
  // };
  const startDate = moment(toEvent?.startDate)
    .tz(fromEvent?.locBasic?.timeZoneId || "")
    .startOf("day")
    .add(12, "hours")
    .format();

  const sharedVals = {
    fromEventId: fromEvent?.id,
    toEventId: toEvent?.id,
    travelType,
    startDate,
    endDate: moment(startDate)
      .add(4, "hours")
      .format()
  };
  const defaultValues =
    travelType === "FLY"
      ? {
          ...sharedVals
        }
      : {
          ...sharedVals,
          ...groundLocs
        };

  return (
    <div>
      <Form
        {...{
          onSubmit
        }}
        mutators={{ ...arrayMutators }}
        initialValues={{ legs: [defaultValues] }}
      >
        {({
          handleSubmit,
          values,
          errors,
          initialValues,
          form,
          valid,
          submitSucceeded
        }) => {
          if (submitSucceeded) {
            dialogDispatch({ type: "CLOSE_DIALOG" });
          }
          const { push, pop } = form.mutators;
          return (
            <form onSubmit={handleSubmit}>
              {/* <SetDefaults
                {...{
                  eventId,
                  before,
                  prev,
                  next,
                  fromLoc,
                  toLoc
                }}
              /> */}
              <DialogContent>
                <FieldArray name="legs">
                  {({ fields }) => {
                    return (
                      <div>
                        {fields.map((leg, index) => {
                          return (
                            <TravelFormLeg
                              key={index}
                              {...{ leg, index, fromEvent, toEvent }}
                            />
                          );
                        })}
                      </div>
                    );
                  }}
                </FieldArray>
                <ShowMe obj={state} name="state" noModal />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => push("legs", { foo: "bar" })}>
                  Add Leg
                </Button>
                <Button onClick={onCancel}>cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!valid}
                >
                  Save
                </Button>
              </DialogActions>
              <Grid container>
                <Grid item xs={6}>
                  <ShowMe obj={values} name="values" />
                  <ShowMe obj={{ fromEvent, toEvent }} name="from/to event" />
                </Grid>
                <Grid item xs={6}>
                  <ShowMe obj={errors} name="errors" />
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Form>
    </div>
  );
};

export default TravelForm;

interface SetDefaultsProps {
  eventId: string;
  before: boolean;
  prev?: any;
  next?: any;
  fromLoc?: any;
  toLoc?: any;
}
const SetDefaults = ({
  eventId,
  before,
  prev,
  next,
  fromLoc,
  toLoc
}: SetDefaultsProps) => {
  const { change, batch } = useForm();
  const { input: fromInput } = useField("fromLocId");
  const { input: toInput } = useField("toLocId");

  // if (eventId && before && prev && prev.id) {
  //   batch(() => {
  //     change("toFromEvents.from", prev.id);
  //     change("toFromEvents.to", eventId);
  //   });
  // }
  // if (eventId && !before && next && next.id) {
  //   batch(() => {
  //     change("toFromEvents.from", eventId);
  //     change("toFromEvents.to", next.id);
  //   });
  // }
  if (fromLoc && fromLoc.nearbyAirports && !fromInput.value) {
    change("fromLocId", iataCodeToLocId(fromLoc.nearbyAirports[0].iataCode));
  }
  if (toLoc && toLoc.nearbyAirports && !toInput.value) {
    change("toLocId", iataCodeToLocId(toLoc.nearbyAirports[0].iataCode));
  }

  return <div />;
};

const GetRelatedEvents = ({ event }: { event: Event }) => {
  const { relatedEvents } = useEventsCtx(event.id);

  const {
    input: { value: travelType }
  } = useField("travelType");
  const { state, dispatch } = useMapBoxCtx();

  const dispatchRef = useRef(dispatch);
  const travelTypeRef = useRef(travelType);
  const relatedEventsRef = useRef(relatedEvents);

  useEffect(() => {
    console.assert(dispatch === dispatchRef.current, "dispatch changed");
    console.assert(travelType === travelTypeRef.current, "travelType changed");
    console.assert(
      relatedEvents === relatedEventsRef.current,
      "relatedEvents changed"
    );
    dispatchRef.current = dispatch;
    travelTypeRef.current = travelType;
    relatedEventsRef.current = relatedEvents;

    const groundTypes = [
      TravelTypeOption.bus,
      TravelTypeOption.car,
      TravelTypeOption.other
    ];
    if (relatedEvents?.length && groundTypes.includes(travelType)) {
      dispatch &&
        dispatch({
          type: "SET_HOTELS",
          payload: {
            hotels: relatedEvents
              .filter(({ eventType }) => eventType === EventTypeOption.hotel)
              .map(ev => ev.locBasic)
          }
        });
    } else {
      // empty hotels
      dispatch &&
        dispatch({
          type: "SET_HOTELS",
          payload: {
            hotels: []
          }
        });
    }
  }, [dispatch, travelType, relatedEvents]);
  return null;
};

const RouteDrawer = () => {
  // watches to see if there is a TO and FROM
  // once there is, sets one and only one route, sends it to map ctx.
  const {
    input: { value: fromLoc }
  } = useField("fromLocBasic");
  const {
    input: { value: toLoc }
  } = useField("toLocBasic");
  const {
    input: { value: travelType }
  } = useField("travelType");
  const { dispatch } = useMapBoxCtx();
  useEffect(() => {
    if (fromLoc && toLoc && travelType) {
      dispatch &&
        dispatch({
          type: "SET_ROUTES",
          payload: { routes: [{ fromLoc, toLoc, travelType }] }
        });
    }
  }, [dispatch, fromLoc, toLoc, travelType]);
  return null;
};

const AddSelectedToBounds = ({ fieldName }: { fieldName: string }) => {
  const {
    input: { value }
  } = useField(fieldName);

  const { dispatch } = useMapBoxCtx();
  useEffect(() => {
    if (value && dispatch) {
      dispatch({ type: "ADD_TO_BOUNDS", payload: { locs: [value] } });
    }
  }, [value, dispatch]);
  return null;
};
