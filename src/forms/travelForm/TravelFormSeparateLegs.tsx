import { Button, DialogActions, DialogContent, Grid } from "@material-ui/core";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";

import { MapBoxCtxProvider } from "../../components/MapBox/MapBoxCtxSimple";
import TravelTargetMapCombined from "../../components/MapBox/TravelTargetMapNoForm";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import ShowMe from "../../utils/ShowMe";
import ShowTree from "../../utils/ShowTree";
import LegDisplay from "./LegDisplay";
import MapDefaultSetters from "./MapDefaultSetters";
import { TravelFormCtxProvider, useTravelFormCtx } from "./TravelFormContext";
import { dedupeLegs } from "./travelFormHelpers";
import UnconfirmedEmailDisplay from "./UnconfirmedEmailDisplay";
import FlightForm from "./FlightForm";
import GroundForm from "./GroundForm";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
//
//
const TravelForm = ({ onCancel }: { onCancel?: () => void }) => {
  const { travel, fromEvent, toEvent } = useTravelFormCtx();

  const { prevAndNext } = useEventsCtx();
  const travelEmails = travel && travel.travelEmails;
  const dedupedLegs = dedupeLegs(travel?.legs);
  const [editForm, setEditForm] = useState("");
  if (!travel) return <div>...loading</div>;

  return (
    <div>
      <DialogContent>
        <MapBoxCtxProvider gigs={[fromEvent, toEvent]}>
          <Grid container spacing={2}>
            {travel.legs &&
              Object.keys(travel.legs)
                .sort(
                  (a, b) => travel.legs[a].startUnix - travel.legs[b].startUnix
                )
                .map(leg => {
                  console.log("leg", leg);
                  return <LegDisplay key={leg} leg={leg} />;
                })}
            {editForm === "flight" && (
              <Grid item xs={12} sm={6}>
                <FlightForm
                  onSuccess={() => setEditForm("")}
                  onCancel={() => setEditForm("")}
                />
              </Grid>
            )}
            {editForm === "ground" && (
              <Grid item xs={12} sm={6}>
                <GroundForm
                  onSuccess={() => setEditForm("")}
                  onCancel={() => setEditForm("")}
                />
                <Button onClick={() => setEditForm("")}>cancel</Button>
              </Grid>
            )}
            <Grid
              item
              xs={6}
              container
              justify="space-around"
              alignItems="flex-start"
            >
              <Button variant="outlined" onClick={() => setEditForm("flight")}>
                add flight
              </Button>
              <Button variant="outlined" onClick={() => setEditForm("ground")}>
                add ground
              </Button>
            </Grid>
          </Grid>
          <TravelTargetMapCombined />
          <MapDefaultSetters />
        </MapBoxCtxProvider>
        <ShowTree obj={travel} name="travel" />
        {travelEmails && (
          <div>
            {Object.entries(travelEmails).map(([emailId, email]) => {
              return (
                <UnconfirmedEmailDisplay
                  key={emailId}
                  {...{ emailId, email, travelId: travel.id || "" }}
                />
              );
            })}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>cancel</Button>
      </DialogActions>
    </div>
  );
};

const TravelFormContainer = ({ onCancel }: { onCancel?: () => void }) => {
  return (
    <TravelFormCtxProvider>
      <TravelForm {...{ onCancel }} />
    </TravelFormCtxProvider>
  );
};

export default TravelFormContainer;
