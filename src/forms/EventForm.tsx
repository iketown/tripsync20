import { Button, DialogActions, DialogContent, Grid } from "@material-ui/core";
import { FormApi } from "final-form";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import { Form } from "react-final-form";

import { useGroupCtx } from "../components/group/GroupCtx";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { Event, EventTypeOption } from "../types/Event";
import { removeMissing } from "../utils/general";
import { convertToTZTime } from "../utils/locationFxns";
import ShowMe from "../utils/ShowMe";
import { DateTimeInput, SelectInput, TextInput } from "./inputs";
import EventLocInput from "./inputs/EventLocInput";

const EventForm = ({
  onSuccess,
  onCancel,
  event
}: {
  event?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { firestore, user } = useFirebaseCtx();
  const { group } = useGroupCtx();

  const initVals = event || {
    startDate: moment()
      .startOf("day")
      .add(20, "hours")
      .format(),
    eventType: EventTypeOption.show
  };
  const [initialValues, setInitialValues] = useState<Partial<Event>>(initVals);

  const groupId = group && group.id;
  const docLoc = groupId && event && `groups/${groupId}/events/${event.id}`;
  const collectionLoc = `groups/${groupId}/events`;

  const onSubmit = async (values: any, formApi: FormApi) => {
    console.log("formApi", formApi);
    console.log("reg fields", formApi.getRegisteredFields());
    const { ...eventInfo } = values;

    eventInfo.startDate = convertToTZTime(
      eventInfo.startDate,
      eventInfo.startLocBasic?.timeZoneId
    );
    if (eventInfo.locBasic.id) {
      eventInfo.locId = eventInfo.locBasic.id;
    }
    eventInfo.startUnix = moment(eventInfo.startDate).unix();
    if (eventInfo.endDate) {
      eventInfo.endDate = convertToTZTime(
        eventInfo.endDate,
        eventInfo.startLocBasic?.timeZoneId
      );
      eventInfo.endUnix = moment(eventInfo.endDate).unix();
    }

    if (docLoc) {
      await firestore?.doc(docLoc).update(removeMissing(eventInfo));
    } else {
      await firestore?.collection(collectionLoc).add(removeMissing(eventInfo));
    }
    return;
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.eventType) errors.eventType = "Please choose Event Type";
    if (!values.startDate) errors.startDate = "Please choose Start Date";
    if (!values.locBasic) errors.locBasic = "Please choose a location";
    return errors;
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({ handleSubmit, values, submitSucceeded, form, valid }) => {
        console.log("submitSucc", submitSucceeded);
        if (submitSucceeded) onSuccess && onSuccess();
        if (values.locBasic?.shortName && !values.title) {
          form.change("title", values.locBasic?.shortName);
        }
        return (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <SelectInput
                    name="eventType"
                    label="Event Type"
                    options={[
                      ["show", "Show"],
                      ["hotel", "Hotel"],
                      ["restaurant", "Restaurant"],
                      ["other", "Other"]
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <EventLocInput
                    label="Location"
                    locBasicName="locBasic"
                    idName="locId"
                    location={values.locBasic}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DateTimeInput
                    //@ts-ignore
                    timeZoneId={values.locBasic?.timeZoneId}
                    name="startDate"
                    label="Start Date"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput name="title" label="Event Name" />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel}>cancel</Button>
              <Button
                disabled={!valid}
                variant="contained"
                color="primary"
                type="submit"
              >
                save
              </Button>
            </DialogActions>
            <ShowMe obj={values} name="values" noModal />
            <ShowMe obj={initialValues} name="initialValues" />
          </form>
        );
      }}
    </Form>
  );
};

export default EventForm;
