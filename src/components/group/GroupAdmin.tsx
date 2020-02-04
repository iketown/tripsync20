import React from "react";
import { useGroupCtx } from "./GroupCtx";
import { Grid, Typography, Button } from "@material-ui/core";
import EventsCard from "../events/EventsCard";
import ShowMe from "../../utils/ShowMe";
import { useTravelCtx } from "../../contexts/travelCtx/TravelCtx";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import ShowTree from "../../utils/ShowTree";
import { PeopleCtxProvider } from "../../contexts/peopleCtx/PeopleCtx";
import PeopleCard from "../people/PeopleCard";
//
//
const GroupAdmin = () => {
  const { group } = useGroupCtx();
  const { travels, travelObj } = useTravelCtx();
  const { dispatch } = useDialogCtx();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>Group Admin</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <EventsCard />
      </Grid>
      <Grid item xs={12} sm={6}>
        <PeopleCard />
      </Grid>
    </Grid>
  );
};

export default GroupAdmin;
