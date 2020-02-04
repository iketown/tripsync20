import React from "react";
import moment from "moment-timezone";
import {
  Grid,
  Typography,
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  ListItem,
  ListItemText,
  ExpansionPanelActions
} from "@material-ui/core";
import { useField } from "react-final-form";
import { TravelLeg, TravelTypeOption } from "../../types/travel.types";
import { LocBasicType } from "../../types/location.types";
import { FaPlane } from "react-icons/fa";
import { getIcon } from "../../components/travels/TravelDisplay";
import ShowTree from "../../utils/ShowTree";

const TravelFormLockedLeg = ({
  leg,
  handleEdit
}: {
  leg: string;
  handleEdit?: () => void;
}) => {
  const {
    input: { value }
  } = useField(leg);
  const legInfo: TravelLeg = value;
  const {
    startUnix,
    endUnix,
    fromLocBasic,
    toLocBasic,
    travelerNames,
    travelType,
    companyId = "",
    tripId
  } = legInfo;
  const timeFormat = "h:mm a";
  return (
    <Grid item xs={12} sm={6}>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <img
                src={`https://images.kiwi.com/airlines/64x64/${
                  //@ts-ignore
                  companyId ? companyId.slice(0, 2).toUpperCase() : ""
                }.png`}
                alt="airline logo"
                height="30"
              />
              <Typography component="div" variant="caption">
                {companyId} #{tripId}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <b>{fromLocBasic.iataCode}</b>
              </Typography>
              <Typography>
                {moment.unix(startUnix).format(timeFormat)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {fromLocBasic.timeZoneId}
              </Typography>
            </Grid>
            <Grid item>{getIcon(travelType)}</Grid>
            <Grid item>
              <Typography>
                <b>{toLocBasic.iataCode}</b>
              </Typography>
              <Typography>{moment.unix(endUnix).format(timeFormat)}</Typography>
              <Typography variant="caption" color="textSecondary">
                {toLocBasic.timeZoneId}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List dense>
            {travelerNames?.map((name, index, arr) => {
              if (arr.findIndex(_name => _name.name === name.name) !== index)
                return null;
              return (
                <ListItem dense>
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
          <Button onClick={handleEdit}>Edit</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </Grid>
  );
};

export default TravelFormLockedLeg;

interface ILocDisplay {
  loc: LocBasicType;
  toOrFrom: string;
  travelType: TravelTypeOption;
}

const LocDisplay = ({ loc, toOrFrom, travelType }: ILocDisplay) => {
  return (
    <div>
      {travelType === TravelTypeOption.fly && <AirportDisplay {...{ loc }} />}
    </div>
  );
};

const AirportDisplay = ({ loc }: { loc: LocBasicType }) => {
  return (
    <div>
      <Typography>{loc.iataCode}</Typography>
    </div>
  );
};
