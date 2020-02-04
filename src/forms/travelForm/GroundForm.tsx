import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography
} from "@material-ui/core";
import moment from "moment-timezone";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Form, useFormState, useForm, useField } from "react-final-form";
import styled from "styled-components";

import { useGroupCtx } from "../../components/group/GroupCtx";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import { LocBasicType } from "../../types/location.types";
import { TravelLeg, TravelTypeOption } from "../../types/travel.types";
import { getDirections } from "../../utils/locationFxns";
import ShowTree from "../../utils/ShowTree";
import { DateTimeInput, SelectInput, TextInput } from "../inputs";
import TravelGroundLocInput from "../inputs/TravelGroundLocInput";
import { useTravelFormCtx } from "./TravelFormContext";
import { pathIdFromLocs } from "./travelFormHelpers";

const Space = styled.div`
  padding-top: 1rem;
`;
const GroundForm = ({
  legId,
  onSuccess,
  onCancel
}: {
  legId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { firestore, user } = useFirebaseCtx();

  const { group } = useGroupCtx();
  const { travel, fromEvent, toEvent } = useTravelFormCtx();

  const onSubmit = async (values: Partial<TravelLeg>) => {
    console.log("values", values);
    if (!group || !group.id) return;
    const { startMoment, endMoment, ...travelInfo } = values;
    travelInfo.startUnix = moment(startMoment).unix();
    travelInfo.endUnix = moment(endMoment).unix();
    travelInfo.enteredBy = "manual";
    if (!travelInfo.info || !travelInfo.path) {
      const { path, info } = await getPathBeforeSubmit(travelInfo);
      travelInfo.path = path;
      travelInfo.info = info;
    }
    const { fromLocId, toLocId, company } = travelInfo;
    const newLegId =
      legId ||
      `${fromLocId}-${toLocId}-${company}-${moment().format("YYYY-MM-DD")}`;
    const updateObj = { [newLegId]: travelInfo };
    const docId = `groups/${group.id}/travels/${travel?.id}`;
    firestore?.doc(docId).set({ legs: updateObj }, { merge: true });
  };

  const getPathBeforeSubmit = async (travelInfo: Partial<TravelLeg>) => {
    const { fromLocBasic, toLocBasic, travelType } = travelInfo;
    if (!fromLocBasic || !toLocBasic)
      return { path: undefined, info: undefined };
    const response = await getDirections({
      fromLng: fromLocBasic.lng,
      fromLat: fromLocBasic.lat,
      toLng: toLocBasic.lng,
      toLat: toLocBasic.lat,
      travelMode:
        travelType === TravelTypeOption.walk
          ? google.maps.TravelMode.WALKING
          : google.maps.TravelMode.DRIVING
    }).catch(err => console.log("error", err));
    const path = response && response.path;
    const info = response && response.info;
    return { path, info };
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.startMoment)
      errors.startMoment = "Please enter a departure time";
    if (!values.endMoment) errors.endMoment = "Please enter an arrival time";
    if (!values.fromLocId) errors.fromLocId = "choose starting point";
    if (!values.toLocId) errors.toLocId = "choose ending point";
    if (moment(values.endMoment).isBefore(values.startMoment))
      errors.endMoment = `Must be later than ${moment(
        values.startMoment
      ).format("h:mm z")}`;
    return errors;
  };
  const { startTimeWithTZ, endTimeWithTZ } = useMemo(() => {
    const startTZ = fromEvent?.locBasic.timeZoneId;
    const endTZ = toEvent?.locBasic.timeZoneId;

    const defaultStartTime =
      (travel?.startUnix &&
        moment
          .unix(travel.startUnix)
          .startOf("day")
          .add(12, "hours")) ||
      (toEvent?.startUnix &&
        moment
          .unix(toEvent.startUnix)
          .startOf("day")
          .subtract(12, "hours")) ||
      moment();

    const startTimeWithTZ = startTZ
      ? moment.tz(defaultStartTime, startTZ)
      : defaultStartTime;
    const endTimeWithTZ = endTZ
      ? moment.tz(defaultStartTime, endTZ)
      : defaultStartTime;
    return { startTimeWithTZ, endTimeWithTZ };
  }, [fromEvent, toEvent, travel]);

  const [initialValues, setInitialValues] = useState({
    travelType: TravelTypeOption.bus,
    startMoment: startTimeWithTZ,
    endMoment: endTimeWithTZ
  });

  const _getDirections = async ({
    fromLocBasic,
    toLocBasic,
    travelType
  }: {
    fromLocBasic: LocBasicType;
    toLocBasic: LocBasicType;
    travelType?: TravelTypeOption;
  }) => {
    if (!fromLocBasic || !toLocBasic) return null;
    const { lat: fromLat, lng: fromLng } = fromLocBasic;
    const { lat: toLat, lng: toLng } = toLocBasic;
    const travelMode =
      travelType === TravelTypeOption.walk
        ? google.maps.TravelMode.WALKING
        : google.maps.TravelMode.DRIVING;
    //@ts-ignore
    const { path, info } = await getDirections({
      fromLat,
      fromLng,
      toLat,
      toLng,
      travelMode
    });
    return { path, info };
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({
        handleSubmit,
        values,
        submitSucceeded,
        errors,
        hasValidationErrors,
        submitting,
        form
      }) => {
        if (submitSucceeded) onSuccess && onSuccess();
        const handleGetDirections = async () => {
          //@ts-ignore
          const { fromLocBasic, toLocBasic, travelType, pathId } = values;
          if (!fromLocBasic || !toLocBasic) {
            return;
          }
          if (pathId === pathIdFromLocs({ fromLocBasic, toLocBasic })) {
            return;
          }
          const response = await _getDirections({
            fromLocBasic,
            toLocBasic,
            travelType
          });
          const path = response?.path;
          const info = response?.info;
          if (path && info) {
            form.change("path", path);
            form.change("info", info);
            form.change("pathId", pathIdFromLocs({ fromLocBasic, toLocBasic }));
          }
        };
        return (
          <form onSubmit={handleSubmit}>
            <AutoDirections />
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <SelectInput
                      name="travelType"
                      label="Travel Type"
                      options={[
                        [TravelTypeOption.bus, "Bus"],
                        [TravelTypeOption.car, "Car / Uber"],
                        [TravelTypeOption.shuttle, "Shuttle"],
                        [TravelTypeOption.train, "Train"]
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextInput name="company" label="Company" />
                  </Grid>
                  <Grid item xs={12}>
                    <TravelGroundLocInput
                      idName="fromLocId"
                      locBasicName="fromLocBasic"
                      toOrFrom="from"
                      label="From"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TravelGroundLocInput
                      idName="toLocId"
                      locBasicName="toLocBasic"
                      toOrFrom="to"
                      label="To"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimeInput
                      name="startMoment"
                      label="Departure Time"
                      timeZoneId={fromEvent?.locBasic.timeZoneId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <EndTimePicker />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button onClick={onCancel}>cancel</Button>
                <Button
                  onClick={handleGetDirections}
                  //@ts-ignore
                  disabled={!values.fromLocBasic || !values.toLocBasic}
                >
                  Get Directions
                </Button>
                <Button
                  disabled={hasValidationErrors || submitting}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  save
                </Button>
              </CardActions>
              <ShowTree obj={values} name="values" />
              <ShowTree obj={errors} name="errors" />
            </Card>
          </form>
        );
      }}
    </Form>
  );
};

export default GroundForm;

const EndTimePicker = () => {
  const [autoArriveTime, setAutoArriveTime] = useState(true);
  const { values } = useFormState();
  const { change, batch } = useForm();
  const {
    startMoment,
    endMoment,
    fromLocBasic,
    toLocBasic,
    info,
    pathId
  } = values;

  const endTimeFormat =
    endMoment &&
    moment(endMoment).dayOfYear() === moment(startMoment).dayOfYear()
      ? "h:mm a"
      : "M/D h:mm a";

  const arriveTime =
    (endMoment && endMoment.format(endTimeFormat)) || "unknown";

  useEffect(() => {
    if (!fromLocBasic || !toLocBasic) return;
    const correctPathId = pathIdFromLocs({ fromLocBasic, toLocBasic });
    if (startMoment && info && info[0] && correctPathId === pathId) {
      const seconds = info[0].duration.value;
      const endMoment = moment(startMoment)
        .add(seconds, "seconds")
        .tz(toLocBasic.timeZoneId);
      change("endMoment", endMoment);
    }
  }, [startMoment, change, info, fromLocBasic, toLocBasic, pathId]);

  return (
    <>
      <Typography variant="caption" color="textSecondary">
        arrival:
      </Typography>
      <Typography>{arriveTime}</Typography>
      <FormControlLabel
        label="Auto Arrive Time"
        control={
          <Checkbox
            checked={autoArriveTime}
            onChange={(e, chk) => setAutoArriveTime(chk)}
          />
        }
      />
    </>
  );
};

const AutoDirections = () => {
  const { values } = useFormState();
  const { change, batch } = useForm();

  const _getDirections = useCallback(
    async ({
      fromLocBasic,
      toLocBasic,
      travelType
    }: {
      fromLocBasic: LocBasicType;
      toLocBasic: LocBasicType;
      travelType?: TravelTypeOption;
    }) => {
      if (!fromLocBasic || !toLocBasic) return null;
      const { lat: fromLat, lng: fromLng } = fromLocBasic;
      const { lat: toLat, lng: toLng } = toLocBasic;
      const travelMode =
        travelType === TravelTypeOption.walk
          ? google.maps.TravelMode.WALKING
          : google.maps.TravelMode.DRIVING;
      //@ts-ignore
      const { path, info } = await getDirections({
        fromLat,
        fromLng,
        toLat,
        toLng,
        travelMode
      });
      return { path, info };
    },
    []
  );

  useEffect(() => {
    const { fromLocBasic, toLocBasic, travelType, pathId } = values;
    if (!fromLocBasic || !toLocBasic) return;
    const newPathId = pathIdFromLocs({ fromLocBasic, toLocBasic });
    if (pathId === newPathId) return;

    const updateDirections = async () => {
      const response = await _getDirections({
        fromLocBasic,
        toLocBasic,
        travelType
      });
      const path = response?.path;
      const info = response?.info;
      batch(() => {
        change("path", path);
        change("info", info);
        change("pathId", newPathId);
      });
    };
    updateDirections();
  }, [_getDirections, batch, change, values]);
  return null;
};
