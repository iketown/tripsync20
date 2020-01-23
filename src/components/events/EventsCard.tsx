import {
  Button,
  Card,
  CardActions,
  CardContent,
  List
} from "@material-ui/core";
import React, { useState } from "react";
import { useSpring } from "react-spring";

import EventForm from "../../forms/EventForm";
import { useEventsCtx } from "../../contexts/eventsCtx/EventsCtx";
import ShowMe from "../../utils/ShowMe";
import DialogForm from "../DialogForm";
import EventCardListItem from "./EventCardListItem";

//
//
const EventsCard = () => {
  const { events, eventsObj, sortedEvents } = useEventsCtx();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState("");
  const [openEvent, setOpenEvent] = useState("");
  const closeDialog = () => setDialogOpen(false);
  const editEvent = (eventId: string) => {
    setEditingEventId(eventId);
    setDialogOpen(true);
  };
  const [props, set] = useSpring(() => ({ transform: "translateX(0%)" }));

  return (
    <>
      <Card>
        <CardContent>
          <List>
            {sortedEvents?.show &&
              sortedEvents.show.map(event => {
                const eventId = event.id;
                if (!eventId) return null;
                const expanded = eventId === openEvent;
                const handleChange = (e: any, isExpanded: boolean) => {
                  setOpenEvent(isExpanded ? eventId : "");
                };
                return (
                  <EventCardListItem
                    key={eventId}
                    {...{ expanded, handleChange, eventId, event, editEvent }}
                  />
                );
              })}
          </List>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => editEvent("")}
            variant="contained"
            color="primary"
          >
            Add Event
          </Button>
        </CardActions>
        <ShowMe obj={events} name="events" noModal />
      </Card>
      <DialogForm
        {...{ dialogOpen, setDialogOpen }}
        content={
          <EventForm
            onCancel={closeDialog}
            onSuccess={closeDialog}
            event={eventsObj && eventsObj[editingEventId]}
          />
        }
        title="Event"
      />
    </>
  );
};

export default EventsCard;
