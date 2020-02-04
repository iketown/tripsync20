import React, { useEffect, useState } from "react";

import AirportSetters from "./AirportSetters";
import BoundsSetter from "./BoundsSetter";
import GigSetters from "./GigSetters";
import HotelSetters from "./HotelSetters";
import RouteDrawers from "./RouteDrawers";

//
//
const MapDefaultSetters = () => {
  return (
    <div>
      map loc setter
      <AirportSetters />
      <HotelSetters />
      <GigSetters />
      <RouteDrawers />
      <BoundsSetter />
    </div>
  );
};

export default MapDefaultSetters;
