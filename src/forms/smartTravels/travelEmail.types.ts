export type TravelEmail = {
  id: string;
  created: string;
  from_address: string;
  includes: {
    info: {
      class: number;
      confirmation_no: string;
    };
  };
  mailbox_id: string;
  metadata?: any;
  modified: string;
  msg_date: string;
  segments: TravelEmailSegment[];
  imported?: boolean;
};

export type TravelEmailSegment = {
  airline: string;
  arrival_datetime: string;
  arrival_time_zone_id: string;
  class_of_service: string;
  confirmation_no: string;
  created: string;
  departure_datetime: string;
  departure_time_zone_id: string;
  destination: string;
  destination_admin_code: string;
  destination_city_name: string;
  destination_country: string;
  destination_lat: string;
  destination_lon: string;
  destination_name: string;
  first_name: string;
  flight_number: string;
  iata_code: string;
  last_name: string;
  normalized_airline: string;
  number_of_pax: string;
  origin: string;
  origin_admin_code: string;
  origin_city_name: string;
  origin_country: string;
  origin_lat: string;
  origin_lon: string;
  origin_name: string;
  seat_assignment: string;
  ticket_number: string;
  travelers?: Traveler[];
  type: string;
};

export type Traveler = {
  first_name: string;
  last_name: string;
  name: string;
};
