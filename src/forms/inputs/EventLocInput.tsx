import {
  Button,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from "@material-ui/core";
import moment from "moment-timezone";
import React, { useState, useEffect } from "react";
import { Field, useField, useForm } from "react-final-form";

import {
  getShortNameFromLoc,
  getTimeZoneFromLatLng
} from "../../utils/locationFxns";
import {
  LocationType,
  LocBasicType,
  LocPoint
} from "../../types/location.types";
import GoogPlacesAC from "../formComponents/GooglePlacesAC";
import useLocation from "../../hooks/useLocation";
//
//
export const EventLocInput = ({
  location,
  onSelect,
  label,
  placeholder,
  locBasicName,
  idName,
  biasCenterLoc
}: {
  location?: LocBasicType;
  onSelect?: () => void;
  label?: string;
  placeholder?: string;
  idName: string;
  locBasicName: string;
  biasCenterLoc?: LocPoint;
}) => {
  const [editing, setEditing] = useState(!location);
  const [submitting, setSubmitting] = useState(false);
  const { getLocFromPlaceId, createLoc } = useLocation();
  const { batch, change } = useForm();
  const locBasicField = useField(locBasicName);
  const locIdField = useField(idName);

  const handleChange = async (loc: LocationType) => {
    let fbLoc = await getLocFromPlaceId(loc.placeId);
    if (!fbLoc) {
      //@ts-ignore
      fbLoc = await createLoc(loc);
    }
    if (fbLoc) {
      moment.tz.setDefault(fbLoc.timeZoneId);
      setEditing(false);
      batch(() => {
        fbLoc && locBasicField.input.onChange(fbLoc);
        fbLoc && locIdField.input.onChange(fbLoc.id);
      });
      setSubmitting(false);
      onSelect && onSelect();
    }
  };
  useEffect(() => {
    if (location && location.address) setEditing(false);
  }, [location]);

  // return locContent or editingContent depending on 'editing' boolean
  const locContent = <AddressDisplay location={location} />;
  const editingContent = (
    <div style={{ marginBottom: "10px", width: "100%" }}>
      <GoogPlacesAC
        {...{ submitting, setSubmitting, biasCenterLoc, placeholder }}
        setLocation={handleChange}
        label={label}
      />
    </div>
  );

  return (
    <>
      {submitting && <LinearProgress />}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {editing ? editingContent : locContent}
        {location && (
          <Button onClick={() => setEditing(old => !old)}>
            {editing ? "cancel" : "change"}
          </Button>
        )}
      </div>
    </>
  );
};

export default EventLocInput;

const AddressDisplay = ({ location }: { location?: LocBasicType }) => {
  console.log("AddressDisplay", location);
  if (!location) return null;
  const { venueName, shortName, address } = location;
  return (
    <Grid container justify="space-between">
      <Grid item>
        <Typography variant="h6">{venueName}</Typography>
        <Typography variant="subtitle2">{shortName}</Typography>
        {address && <Typography variant="caption">{address}</Typography>}
      </Grid>
    </Grid>
  );
};
