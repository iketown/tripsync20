import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardActions
} from "@material-ui/core";
import { Form, Field } from "react-final-form";
import { TextInput, DateTimeInput } from "../inputs";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import MaterialAirportAC from "../formComponents/MaterialAirportAC/MaterialAirportAC";
import ShowTree from "../../utils/ShowTree";
import { useTravelFormCtx } from "./TravelFormContext";
import { useMapBoxCtx } from "../../components/MapBox/MapBoxCtxSimple";
import moment from "moment-timezone";
import { getShortNameFromLoc } from "../../utils/locationFxns";
import styled from "styled-components";
import { TravelTypeOption } from "../../types/travel.types";
import AirlineSelect from "./AirlineSelect";
import { useGroupCtx } from "../../components/group/GroupCtx";

const Space = styled.div`
  padding-top: 1rem;
`;
const FlightForm = ({
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

  const onSubmit = (values: any) => {
    console.log("values", values);
    if (!group || !group.id) return;
    const { startMoment, endMoment, ...flightInfo } = values;
    flightInfo.startUnix = moment(startMoment).unix();
    flightInfo.endUnix = moment(endMoment).unix();
    flightInfo.enteredBy = "manual";
    const { fromLocId, toLocId, companyId, tripId } = flightInfo;
    const newLegId = legId || `${fromLocId}-${toLocId}-${companyId}-${tripId}`;
    const updateObj = { [newLegId]: flightInfo };
    const docId = `groups/${group.id}/travels/${travel?.id}`;
    console.log("docId", docId);
    firestore?.doc(docId).set({ legs: updateObj }, { merge: true });
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.startMoment)
      errors.startMoment = "Please enter a departure time";
    if (!values.endMoment) errors.endMoment = "Please enter an arrival time";
    if (!values.fromLocId) errors.fromLocId = "departure airport";
    if (!values.toLocId) errors.toLocId = "arrival airport";
    if (moment(values.endMoment).isAfter(values.startMoment))
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
    travelType: TravelTypeOption.fly,
    startMoment: startTimeWithTZ,
    endMoment: endTimeWithTZ
  });

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({
        handleSubmit,
        values,
        submitSucceeded,
        errors,
        hasValidationErrors,
        submitting
      }) => {
        if (submitSucceeded) onSuccess && onSuccess();

        return (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <AirlineSelect />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextInput name="tripId" label="Flight no." />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MaterialAirportAC
                      idName="fromLocId"
                      locBasicName="fromLocBasic"
                      toOrFrom="from"
                      label="From"
                    />
                    <Space />
                    <DateTimeInput
                      name="startMoment"
                      label="Departure Time"
                      // initialValue={startTimeWithTZ}
                      timeZoneId={fromEvent?.locBasic.timeZoneId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MaterialAirportAC
                      idName="toLocId"
                      locBasicName="toLocBasic"
                      toOrFrom="to"
                      label="To"
                    />
                    <Space />
                    <DateTimeInput
                      name="endMoment"
                      label="Arrival Time"
                      // initialValue={endTimeWithTZ}
                      timeZoneId={toEvent?.locBasic.timeZoneId}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button onClick={onCancel}>cancel</Button>
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

export default FlightForm;
