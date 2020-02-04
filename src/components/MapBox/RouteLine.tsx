import React from "react";
import { Layer, Feature } from "react-mapbox-gl";
import { LocBasicType, Route } from "../../types/location.types";
import { TravelTypeOption } from "../../types/travel.types";
import { gigLocToMapLoc } from "./mapboxHelpers";

//
//

type SeparateObj = {
  [opt in TravelTypeOption]?: Route[];
};

const getPaint = (travelType: string) => {
  switch (travelType) {
    case TravelTypeOption.fly:
      return {
        "line-color": "purple",
        // "line-dasharray": [2, 2],
        "line-width": 1
      };
    case TravelTypeOption.bus:
    case TravelTypeOption.shuttle:
    case TravelTypeOption.car:
      return {
        "line-color": "brown",
        "line-dasharray": [1, 1],
        "line-width": 2
      };
    default:
      return {
        "line-color": "black",
        "line-dasharray": [3, 3],
        "line-width": 2
      };
  }
};

const RouteLine = ({ routes }: { routes: Route[] }) => {
  const separates = routes.reduce((obj: SeparateObj, route) => {
    if (!!obj[route.travelType]) {
      //@ts-ignore
      obj[route.travelType].push(route);
    } else {
      obj[route.travelType] = [route];
    }
    return obj;
  }, {});
  console.log("separates", separates);
  return (
    <div>
      {Object.entries(separates).map(([travelType, scopedRoutes]) => {
        console.log("drawing route", scopedRoutes);
        return (
          <Layer
            key={travelType}
            type="line"
            id={`layer-${travelType}`}
            paint={getPaint(travelType)}
          >
            {scopedRoutes &&
              scopedRoutes.map(({ fromLoc, toLoc, path }, index) => {
                if (!path) {
                  console.log("no path", fromLoc, toLoc);
                  return null;
                }
                return (
                  <Feature
                    key={`${toLoc.id}${index}`}
                    coordinates={path.map(loc => gigLocToMapLoc(loc))}
                  />
                );
              })}
          </Layer>
        );
      })}
    </div>
  );
};

export default RouteLine;
