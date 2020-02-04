import React from "react";
import { TravelEmail } from "../smartTravels/travelEmail.types";
import ShowTree from "../../utils/ShowTree";
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  Grid,
  Button
} from "@material-ui/core";
import { FaPlane } from "react-icons/fa";
import { ExpandMore } from "@material-ui/icons";
import styled from "styled-components";
import { useTravel } from "../../hooks/useTravel";
//
//
const SummaryDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const UnconfirmedEmailDisplay = ({
  email,
  emailId,
  travelId
}: {
  email: TravelEmail;
  emailId: string;
  travelId: string;
}) => {
  const { addEmailToTravel } = useTravel();

  const handleAddEmail = () => {
    addEmailToTravel({ email, travelId });
  };
  const AcceptButton = () => (
    <Button
      style={{ marginLeft: "5px" }}
      variant="contained"
      size="small"
      color="primary"
      onClick={handleAddEmail}
    >
      accept
    </Button>
  );
  // if (email.imported) return null;
  return (
    <ExpansionPanel style={{ marginBottom: "5px" }}>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <SummaryDiv>
          <Typography>email from {email.from_address} </Typography>
          {email.imported && (
            <Typography variant="caption">already imported</Typography>
          )}
          <div>
            <AcceptButton />
          </div>
        </SummaryDiv>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List dense>
              <ListSubheader>
                {email.segments[0].travelers?.map(trav => trav.name)}
              </ListSubheader>
              {email.segments.map((seg, index) => {
                return (
                  <ListItem dense key={seg.arrival_datetime}>
                    <ListItemAvatar>
                      <FaPlane />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${seg.origin} - ${seg.destination}`}
                      secondary={`${seg.origin_city_name} - ${seg.destination_city_name}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Grid>
          {/* <Grid item xs={12}>
            <ShowTree obj={email} name="email" />
          </Grid> */}
        </Grid>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <Button
          style={{ marginLeft: "5px" }}
          variant="outlined"
          size="small"
          color="secondary"
        >
          ignore
        </Button>
        <AcceptButton />
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

export default UnconfirmedEmailDisplay;
