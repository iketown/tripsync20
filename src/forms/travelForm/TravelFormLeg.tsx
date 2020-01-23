import { Grid } from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useField } from "react-final-form";

import { MapBoxCtxProvider } from "../../components/MapBox/MapBoxCtxSimple";
import TravelTargetMap from "../../components/MapBox/TravelTargetMap";
import { TravelTypeOption } from "../../types/travel.types";
import { AirportSwitcher, DateTimeInput, GroundSwitcher } from "../inputs";
import TravelTypeSelect from "../inputs/TravelTypeSelect";
import TravelFormNearbyAirports from "./TravelFormNearbyAirports";
import TravelFormRelatedEvents from "./TravelFormRelatedEvents";
import RouteDrawer from "./RouteDrawer";
import { Event } from "../../types/Event";

const TravelFormLeg = ({
  leg,
  index,
  fromEvent,
  toEvent
}: {
  leg: string;
  index: number;
  fromEvent?: Event;
  toEvent?: Event;
}) => {
  const {
    input: { value: travelType }
  } = useField(`${leg}.travelType`);

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} item xs={12}>
        <Grid item xs={12} sm={4}>
          <TravelTypeSelect name={`${leg}.travelType`} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateTimeInput
            name={`${leg}.startDate`}
            label="Start"
            timeZoneId={fromEvent?.locBasic?.timeZoneId}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateTimeInput
            name={`${leg}.endDate`}
            label="End"
            timeZoneId={toEvent?.locBasic?.timeZoneId}
          />
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <ShowMe obj={state} name="state" />
        <ShowMe obj={values} name="values" />
        <ShowMe obj={errors} name="errors" />
      </Grid> */}
      {[
        {
          locBasic: fromEvent?.locBasic,
          locBasicName: `${leg}.fromLocBasic`,
          idName: `${leg}.fromLocId`,
          label: "from"
        },
        {
          locBasic: toEvent?.locBasic,
          locBasicName: `${leg}.toLocBasic`,
          idName: `${leg}.toLocId`,
          label: "to"
        }
      ].map(({ locBasic, locBasicName, idName, label }) => {
        console.log(locBasicName, locBasic);
        return (
          <Grid key={locBasicName} item xs={12} sm={6}>
            {locBasic && (
              <MapBoxCtxProvider gigLocs={[locBasic]}>
                {travelType === TravelTypeOption.fly ? (
                  <AirportSwitcher
                    defaultAirports={[]}
                    {...{ locBasicName, idName, label }}
                  />
                ) : (
                  <GroundSwitcher
                    // defaultLocs={[fromLoc]}
                    {...{ locBasicName, idName, label }}
                  />
                )}
                <TravelTargetMap {...{ locBasicName, idName }} />
                <TravelFormNearbyAirports leg={leg} loc={locBasic} />
                {fromEvent && (
                  <TravelFormRelatedEvents leg={leg} event={fromEvent} />
                )}
                <RouteDrawer leg={leg} />
                {/*   <AddSelectedToBounds fieldName={`${leg}.fromLocBasic`} /> */}
              </MapBoxCtxProvider>
            )}
          </Grid>
        );
      })}
      }
    </Grid>
  );
};

export default TravelFormLeg;
