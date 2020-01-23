import React from "react";
import { useGroupCtx } from "./GroupCtx";
import { Grid, Typography, Button } from "@material-ui/core";
import EventsCard from "../events/EventsCard";

const GroupAdmin = () => {
  const { group } = useGroupCtx();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>Group Admin</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <EventsCard />
      </Grid>
    </Grid>
  );
};

export default GroupAdmin;
