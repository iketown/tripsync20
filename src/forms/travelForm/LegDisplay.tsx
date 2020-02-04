import {
  Button,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import moment from "moment-timezone";
import React from "react";

import { getIcon } from "../../components/travels/TravelDisplay";
import { useTravel } from "../../hooks/useTravel";
import { LocBasicType } from "../../types/location.types";
import { TravelTypeOption } from "../../types/travel.types";
import { useTravelFormCtx } from "./TravelFormContext";
import LegTimeDisplay from "./LegTimeDisplay";
const LegDisplay = ({ leg }: { leg: string }) => {
  const { travel, selectedLeg, setSelectedLeg } = useTravelFormCtx();
  const { deleteTravelLeg } = useTravel();
  if (!travel || !travel.legs || !travel.legs[leg]) return null;
  const {
    startUnix,
    endUnix,
    fromLocBasic,
    toLocBasic,
    travelerNames,
    travelType,
    companyId,
    tripId,
    info,
    path
  } = travel.legs[leg];

  const handleDelete = () => {
    if (!travel || !travel.id) return null;
    deleteTravelLeg({ travelId: travel.id, leg });
  };

  const summaryPanel = () => {
    switch (travelType) {
      case TravelTypeOption.fly:
        return (
          <>
            <AirportIconPanel {...{ companyId, tripId }} />
            <AirportLoc loc={fromLocBasic} timeUnix={startUnix} />
            <Grid item>{getIcon(travelType)}</Grid>
            <AirportLoc loc={toLocBasic} timeUnix={endUnix} />
          </>
        );
      case TravelTypeOption.bus:
      case TravelTypeOption.shuttle:
        return (
          <>
            <BusIconPanel {...{ companyId, tripId }} />
            <GroundLoc loc={fromLocBasic} timeUnix={startUnix} />
            <Grid item>
              <div style={{ textAlign: "center" }}>
                {getIcon(travelType)}
                {info && (
                  <>
                    <Typography
                      component="div"
                      variant="caption"
                      color="textSecondary"
                    >
                      {info[0].distance.text}
                    </Typography>
                    <Typography
                      component="div"
                      variant="caption"
                      color="textSecondary"
                    >
                      {moment
                        .duration(info[0].duration.value, "seconds")
                        .hours() || ""}
                      {moment
                        .duration(info[0].duration.value, "seconds")
                        .minutes()}
                      min
                    </Typography>
                  </>
                )}
              </div>
            </Grid>
            <GroundLoc loc={toLocBasic} timeUnix={endUnix} />
          </>
        );

      default:
        return <div>no travel type</div>;
    }
  };
  const seconds = info
    ? info[0].duration.value
    : moment
        .duration(moment.unix(endUnix).diff(moment.unix(startUnix)))
        .asSeconds();
  const duration = moment.duration(seconds, "seconds");
  const hours = duration.hours();
  const minutes = duration.minutes();

  return (
    <Grid item xs={12} md={6}>
      <ExpansionPanel
        onChange={(e, exp) => {
          setSelectedLeg && setSelectedLeg(exp ? leg : "");
        }}
        expanded={selectedLeg === leg}
      >
        <ExpansionPanelSummary>
          <Grid container spacing={2} alignItems="center">
            {summaryPanel()}
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List dense>
            <ListItem dense>
              <ListItemText
                primary={
                  <LegTimeDisplay
                    locBasic={fromLocBasic}
                    unix={startUnix}
                    leg={leg}
                    toOrFrom="from"
                  />
                }
              />
            </ListItem>
            <ListItem dense>
              <ListItemText
                secondary={
                  `${hours > 0 ? hours + " hr " : ""}` + `${minutes} min`
                }
              />
            </ListItem>
            <ListItem dense>
              <ListItemText
                primary={
                  <LegTimeDisplay
                    locBasic={toLocBasic}
                    unix={endUnix}
                    leg={leg}
                    toOrFrom="to"
                  />
                }
              />
            </ListItem>
            {travelerNames?.map((name, index, arr) => {
              if (arr.findIndex(_name => _name.name === name.name) !== index)
                return null;
              return (
                <ListItem key={`${name.name}${index}`} dense>
                  <ListItemText
                    primary={`${name.first_name} ${name.last_name}`}
                    //@ts-ignore
                    secondary={name.conf}
                  />
                </ListItem>
              );
            })}
          </List>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
          <Button color="primary">Edit</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </Grid>
  );
};

export default LegDisplay;

const AirportLoc = ({
  loc,
  timeUnix
}: {
  loc: LocBasicType;
  timeUnix: number;
}) => {
  const timeFormat = "MMMD h:mm a";

  return (
    <Grid item>
      <Typography variant="caption" noWrap style={{ maxWidth: "8rem" }}>
        {loc.city} {loc.state}
      </Typography>
      <div>
        <Typography component="span">
          <b>{loc.iataCode}</b>
        </Typography>
        <Typography
          style={{ marginLeft: "5px" }}
          variant="caption"
          component="span"
        >
          {moment.unix(timeUnix).format(timeFormat)}
        </Typography>
      </div>
      <Typography variant="caption" color="textSecondary">
        tz: {loc.timeZoneId}
      </Typography>
    </Grid>
  );
};

const AirportIconPanel = ({
  companyId = "",
  tripId
}: {
  companyId?: string;
  tripId: string;
}) => {
  return (
    <Grid item>
      {companyId && (
        <img
          src={`https://images.kiwi.com/airlines/64x64/${
            //@ts-ignore
            companyId.slice(0, 2).toUpperCase()
          }.png`}
          alt="airline logo"
          height="30"
        />
      )}
      <Typography component="div" variant="caption">
        {companyId}
        {tripId}
      </Typography>
    </Grid>
  );
};

const BusIconPanel = ({
  companyId = "",
  tripId = ""
}: {
  companyId?: string;
  tripId?: string;
}) => {
  return (
    <Typography component="div" variant="caption">
      {companyId}
      {tripId}
    </Typography>
  );
};

const GroundLoc = ({
  loc,
  timeUnix
}: {
  loc: LocBasicType;
  timeUnix: number;
}) => {
  const timeFormat = "MMMD h:mm a";

  return (
    <Grid item>
      <Typography component="div" noWrap style={{ maxWidth: "8rem" }}>
        <b>{loc.venueName}</b>
      </Typography>
      <Typography
        component="div"
        variant="caption"
        noWrap
        style={{ maxWidth: "5rem" }}
      >
        {loc.shortName}
      </Typography>
      <Typography component="div" variant="caption" color="textSecondary">
        tz: {loc.timeZoneId}
      </Typography>
    </Grid>
  );
};
