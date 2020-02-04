import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  FormHelperText
} from "@material-ui/core";
import { useField } from "react-final-form";
import { LocBasicType } from "../../types/location.types";

interface LocSelectInputProps {
  locBasicName: string;
  idName: string;
  locations: LocBasicType[];
  label?: string;
}

export const LocSelectInput = ({
  locBasicName,
  idName,
  locations,
  label
}: LocSelectInputProps) => {
  const locBasicField = useField(locBasicName);
  const { input: idInput, meta: idMeta } = useField(idName);

  const handleChange = (e: any) => {
    const locId = e.target.value;
    idInput.onChange(locId);
    locBasicField.input.onChange(locations.find(loc => loc.id === locId));
  };

  return (
    <FormControl error={!idMeta.valid}>
      <InputLabel>{label}</InputLabel>
      <Select fullWidth onChange={handleChange} value={idInput.value}>
        {locations.length &&
          locations.map((loc: LocBasicType) => {
            if (!loc) return null;
            return (
              <MenuItem key={loc.id} value={loc.id}>
                <ListItemText
                  primary={loc.venueName}
                  secondary={loc.address || loc.shortName}
                />
              </MenuItem>
            );
          })}
      </Select>
      <FormHelperText>{idMeta.error}</FormHelperText>
    </FormControl>
  );
};

export default LocSelectInput;
