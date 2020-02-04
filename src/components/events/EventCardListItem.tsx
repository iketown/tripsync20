import {
  Button,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import moment from "moment-timezone";
import React, { useEffect, useMemo, useState } from "react";
import { FaEdit, FaHotel, FaPaperPlane, FaStar } from "react-icons/fa";

import { EventIcon } from "../../constants/Icons";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import { useTravelCtx } from "../../contexts/travelCtx/TravelCtx";
import { Event } from "../../types/Event";
import ShowTree from "../../utils/ShowTree";
import TravelIcons from "./TravelIcons";

interface EventListItemProps {
  expanded: boolean;
  handleChange: (e: any, esExpanded: boolean) => void;
  eventId: string;
  event: Event;
  editEvent: (eventId: string) => void;
}

const EventCardListItem = ({
  expanded,
  handleChange,
  eventId,
  event,
  editEvent
}: EventListItemProps) => {
  const { dispatch } = useDialogCtx();
  const { prevAndNext } = useEventsCtx(eventId);
  const { travelObj } = useTravelCtx();
  const { amHotels, pmHotels } = event;
  const { prev, next } = prevAndNext;
  const { prevTravel, nextTravel } = useMemo(() => {
    const prevTravel = travelObj && travelObj[eventId];
    const nextTravel = travelObj && next && travelObj[next.id];
    return { prevTravel, nextTravel };
  }, [eventId, next, travelObj]);
  const openTravel = (before: boolean) => {
    const fromEventId = before ? prev?.id : eventId;
    const toEventId = before ? eventId : next?.id;
    console.log({ fromEventId, toEventId });
    dispatch({
      type: "OPEN_DIALOG",
      formType: "travel",
      props: { before, fromEventId, toEventId }
    });
  };
  const openHotel = ({ hotelEventId }: { hotelEventId?: string }) => {
    dispatch({
      type: "OPEN_DIALOG",
      formType: "hotel",
      props: {
        eventId,
        event,
        hotelEventId
      }
    });
  };
  return (
    <>
      {expanded && prev && (
        <>
          <Button onClick={() => openTravel(true)}>
            <FaPaperPlane style={{ marginRight: "5px" }} /> Travel to{" "}
            {event.locBasic.shortName}
          </Button>
          <TravelIcons travel={prevTravel} />
        </>
      )}
      <ExpansionPanel
        className="tightList"
        {...{ expanded }}
        onChange={handleChange}
        // TransitionProps={{ unmountOnExit: true }}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItem className="tightList">
            <ListItemAvatar>
              <FaStar />
            </ListItemAvatar>
            <ListItemText
              className="tightList"
              primary={event.title || event.locBasic.shortName}
              secondary={`${moment(event.startDate).format("ddd MMM D")} • ${
                event.locBasic.shortName
              }`}
            />
          </ListItem>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <List dense style={{ width: "100%" }}>
            <HotelDisplay
              {...{ amHotels, pmHotels }}
              eventId={eventId}
              event={event}
            />
            <ShowTree obj={prevAndNext} name="prevAndNext" />
          </List>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Typography variant="caption">{eventId}</Typography>
          <Button onClick={() => openHotel({})}>
            <FaHotel style={{ marginRight: "5px" }} /> Hotel
          </Button>
          <Button onClick={() => eventId && editEvent(eventId)}>
            <FaEdit style={{ marginRight: "5px" }} /> Edit
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
      {expanded && next && (
        <>
          <Button onClick={() => openTravel(false)}>
            <FaPaperPlane style={{ marginRight: "5px" }} /> Travel from{" "}
            {event.locBasic.shortName}
          </Button>
          <TravelIcons travel={nextTravel} />
        </>
      )}
    </>
  );
};

export default EventCardListItem;

const HotelDisplay = ({
  amHotels = [],
  pmHotels = [],
  eventId,
  event
}: {
  amHotels?: Event[];
  pmHotels?: Event[];
  eventId: string;
  event: Event;
}) => {
  const { state, dispatch } = useDialogCtx();
  const handleEditHotel = (hotelEvent: Event) => () => {
    dispatch({
      type: "OPEN_DIALOG",
      formType: "hotel",
      props: {
        eventId,
        event,
        hotelEventId: hotelEvent.id,
        hotelEvent
      }
    });
  };

  return (
    <div>
      {[...amHotels, ...pmHotels].map((hotelEvent, index, arr) => {
        // if am AND pm, only show once
        if (arr.findIndex(ev => ev.id === hotelEvent.id) !== index) return null;
        // if am OR pm, display "AM" or "PM"
        let am, pm;
        if (amHotels.find(h => h.id === hotelEvent.id)) am = true;
        if (pmHotels.find(h => h.id === hotelEvent.id)) pm = true;
        const text = am && pm ? "" : am ? "AM" : "PM";
        //
        function formatTime(time?: string) {
          if (!time) return null;
          return moment(time).format("M/D");
        }

        return (
          <ListItem key={hotelEvent.id} dense>
            <ListItemAvatar>
              <div>
                {text} <EventIcon event={hotelEvent} />
              </div>
            </ListItemAvatar>
            <ListItemText
              primary={hotelEvent.locBasic.venueName}
              secondary={`${formatTime(hotelEvent.startDate)} - ${formatTime(
                hotelEvent.endDate
              )}`}
            />
            {/* <ShowMe obj={hotelEvent} name="hotelEv" /> */}
            <ListItemSecondaryAction>
              <IconButton onClick={handleEditHotel(hotelEvent)}>
                <FaEdit />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </div>
  );
};
