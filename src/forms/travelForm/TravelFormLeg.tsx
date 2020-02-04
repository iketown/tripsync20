import {
  Divider as MuiDivider,
  Grid,
  Typography,
  Checkbox,
  FormControl,
  FormControlLabel
} from "@material-ui/core";
import React, { useState } from "react";
import { useField, useForm } from "react-final-form";
import styled from "styled-components";

import { Event } from "../../types/Event";
import { TravelTypeOption } from "../../types/travel.types";
import ShowMe from "../../utils/ShowMe";
import { LocalAirport } from "../formComponents/MaterialAirportAC/airportAChelpers";
import MaterialAirportAC from "../formComponents/MaterialAirportAC/MaterialAirportAC";
import { DateTimeInput, EventLocInput } from "../inputs";
import TravelTypeSelect from "../inputs/TravelTypeSelect";
import AddLegButton from "./AddLegButton";
import DefaultGroundOptions from "./DefaultGroundOptions";
import ShowTree from "../../utils/ShowTree";
import TravelFormLockedLeg from "./TravelFormLockedLeg";
const Divider = styled(MuiDivider)`
  width: calc(100% - 2rem);
  margin: 1rem !important;
`;
const TravelFormLeg = ({
  leg,
  index,
  fromEvent,
  toEvent,
  fields
}: {
  leg: string;
  index: number;
  fromEvent?: Event;
  toEvent?: Event;
  fields: any;
}) => {
  const { input } = useField(`${leg}.travelType`);
  const [showInfo, setShowInfo] = useState(false);
  const travelType = input?.value;
  const { change } = useForm();
  const {
    input: { value: fromLocBasic }
  } = useField(`${leg}.fromLocBasic`);
  const {
    input: { value: toLocBasic }
  } = useField(`${leg}.toLocBasic`);
  const {
    input: { value: legInfo }
  } = useField(leg);

  const checkBox = (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl>
          <FormControlLabel
            label="show form"
            control={
              <Checkbox
                value={showInfo}
                onChange={(e, chk) => setShowInfo(chk)}
              />
            }
          />
        </FormControl>

        {showInfo && <ShowTree obj={legInfo} name="legInfo" />}
      </Grid>
    </Grid>
  );

  const manualEntryForm = (
    <Grid container item xs={12} spacing={2}>
      <Grid container spacing={2} item xs={12}>
        <Grid item xs={12} sm={4}>
          <TravelTypeSelect name={`${leg}.travelType`} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateTimeInput
            name={`${leg}.startUnix`}
            label="Start"
            timeZoneId={
              fromLocBasic?.timeZoneId || fromEvent?.locBasic?.timeZoneId
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateTimeInput
            name={`${leg}.endUnix`}
            label="End"
            timeZoneId={toLocBasic?.timeZoneId || toEvent?.locBasic?.timeZoneId}
          />
        </Grid>
      </Grid>
      {[
        {
          event: fromEvent,
          locBasic: fromEvent?.locBasic,
          locBasicName: `${leg}.fromLocBasic`,
          idName: `${leg}.fromLocId`,
          label: "from",
          toOrFrom: "from"
        },
        {
          event: toEvent,
          locBasic: toEvent?.locBasic,
          locBasicName: `${leg}.toLocBasic`,
          idName: `${leg}.toLocId`,
          label: "to",
          toOrFrom: "to"
        }
      ].map(({ event, locBasic, locBasicName, idName, label, toOrFrom }) => {
        const handleAPChange = (ap: LocalAirport) => {
          change(locBasicName, ap);
          change(idName, ap && ap.placeId);
        };
        return (
          <Grid key={locBasicName} item xs={12} sm={6}>
            {locBasic && (
              <>
                {travelType === TravelTypeOption.fly ? (
                  <MaterialAirportAC
                    key={idName}
                    {...{ label, toOrFrom, idName, locBasicName }}
                  />
                ) : (
                  <div>
                    <EventLocInput {...{ idName, locBasicName, label }} />
                    <DefaultGroundOptions
                      {...{ index, idName, locBasicName, toOrFrom }}
                    />
                  </div>
                )}
              </>
            )}
          </Grid>
        );
      })}
      <Divider />
    </Grid>
  );
  return legInfo && legInfo.enteredBy === "emailImport" ? (
    <TravelFormLockedLeg leg={leg} />
  ) : (
    manualEntryForm
  );
};

export default TravelFormLeg;
