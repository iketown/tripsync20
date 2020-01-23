import React from "react";
import { Grid } from "@material-ui/core";
import GroupsCard from "../components/dashboard/GroupsCard";
//
//
const DashboardPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}></Grid>
      <Grid item sm={6} xs={12}>
        <GroupsCard />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
