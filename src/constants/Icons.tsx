import React from "react";
import { Event, EventTypeOption } from "../types/Event";
import { FaHSquare, FaStar, FaUtensils, FaCircle } from "react-icons/fa";

export const EventIcon = ({ event }: { event: Event }) => {
  switch (event.eventType) {
    case EventTypeOption.show:
      return <FaStar />;
    case EventTypeOption.dining:
      return <FaUtensils />;
    case EventTypeOption.hotel:
      return <FaHSquare />;
    case EventTypeOption.other:
      return <FaCircle />;
    default:
      return <FaCircle />;
  }
};
