import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  TextField,
  Menu
} from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Downshift, { GetItemPropsOptions } from "downshift";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { amadeusFxns } from "../../apis/Amadeus";
import { AirportResult } from "../../types/amadeus.types";
import { airportResultToLoc, useUSAirports } from "../../utils/locationFxns";
import {
  LocBasicType,
  LocationType,
  NearbyAirport
} from "../../types/location.types";

//
//
const AirportACDownshift = ({
  onSelect,
  closeAirports,
  defaultAirports,
  arriving,
  meta,
  disableIata,
  label,
  initialValue
}: {
  onSelect: (ap: LocBasicType) => void;
  closeAirports?: (AirportResult | undefined)[];
  defaultAirports?: NearbyAirport[];
  arriving?: boolean;
  meta?: any;
  disableIata?: string;
  label?: string;
  initialValue?: string;
}) => {
  const [airports, setAirports] = useState<(AirportResult | undefined)[]>([]);

  const [searchString, setSearchString] = useState(initialValue);

  const { getAirportsByKeyword } = amadeusFxns();
  const { getLocalResults, localResults } = useUSAirports();
  const initialAirports = useMemo(() => {
    const _initialAirports =
      defaultAirports &&
      defaultAirports.filter(
        (ap, index, arr) =>
          !!ap &&
          arr.findIndex(_ap => _ap && _ap.iataCode === ap.iataCode) === index
      );
    return _initialAirports || [];
  }, [defaultAirports]);

  const dbApCall = useRef(
    debounce(
      (searchString: string, active: boolean) => {
        getAirportsByKeyword(searchString).then(response => {
          if (active && response) {
            setAirports(response);
          }
        });
      },
      200,
      { maxWait: 500 }
    )
  );
  const textFieldRef = useRef();
  useEffect(() => {
    let active = true;
    if (
      active &&
      searchString &&
      searchString.length > 2 &&
      searchString.length < 10 &&
      searchString !== initialValue
    ) {
      getLocalResults(searchString);
      // first check local
      // if (!getLocalResults(searchString)) {
      //   dbApCall.current(searchString, active);
      // }
    }
    return () => {
      active = false;
    };
  }, [searchString, initialAirports, getLocalResults, initialValue]);

  useEffect(() => {
    if (localResults && localResults.length && airports.length) {
      setAirports([]);
    }
  }, [localResults, airports]);

  const handleSelect = async (ap: any) => {
    // console.log("airport", ap);
    // if (!ap) return null;
    // let formatAP;

    // if (ap.locType) {
    //   formatAP = ap;
    // } else {
    //   formatAP = await airportResultToLoc(ap);
    //   formatAP.locType = "airport";
    // }
    onSelect(ap);
  };

  return (
    <>
      <Downshift
        onInputValueChange={setSearchString}
        itemToString={(item: LocationType | null) =>
          item ? `${item.iataCode} - ${item.venueName} ` : ""
        }
        onSelect={handleSelect}
        initialIsOpen={true}
      >
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          isOpen,
          closeMenu,
          inputValue,
          highlightedIndex,
          selectedItem,
          getRootProps,
          getToggleButtonProps
        }) => {
          console.log("isOpen", isOpen);
          return (
            <Grid container {...getRootProps()}>
              <Grid item xs={12} innerRef={textFieldRef}>
                <TextField
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  fullWidth
                  error={meta && meta.dirty && !!meta.error}
                  helperText={meta && meta.dirty && meta.error}
                  label={label || (arriving ? "TO" : "FROM")}
                  {...getInputProps()}
                  InputProps={{
                    endAdornment: (
                      <IconButton {...getToggleButtonProps()} size="small">
                        <ArrowDropDown />
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Menu keepMounted open={isOpen} anchorEl={textFieldRef.current}>
                <List
                  dense
                  style={{
                    width: "100%",
                    maxHeight: "15rem",
                    overflow: "scroll"
                  }}
                >
                  {[...localResults, ...airports].map((ap, index) => {
                    if (!ap) return null;
                    return (
                      <AirportListItem
                        disabled={disableIata === ap.iataCode}
                        key={ap.iataCode}
                        {...{ ap, index, highlightedIndex, getItemProps }}
                      />
                    );
                  })}
                  {/* {airports.map((ap, index) => {
                    if (!ap) return null;
                    return (
                      <AirportListItem
                        disabled={disableIata === ap.iataCode}
                        key={ap.iataCode}
                        {...{ ap, index, highlightedIndex, getItemProps }}
                      />
                    );
                  })} */}
                  <ListSubheader>nearby airports</ListSubheader>
                  {initialAirports
                    .filter(
                      ap =>
                        !airports.find(
                          _ap => ap && _ap && ap.iataCode === _ap.iataCode
                        )
                    )
                    .map((ap, index) => {
                      if (!ap) return null;
                      const indexOffset = [...localResults, ...airports].length;
                      console.log("indexOffset", indexOffset);
                      return (
                        <AirportListItem
                          disabled={disableIata === ap.iataCode}
                          key={ap.iataCode}
                          {...{
                            ap,
                            index: index + indexOffset,
                            highlightedIndex,
                            getItemProps
                          }}
                        />
                      );
                    })}
                </List>
              </Menu>
            </Grid>
          );
        }}
      </Downshift>
    </>
  );
};

interface IAirportListItem {
  ap: AirportResult;
  index: number;
  highlightedIndex: number | null;
  getItemProps: (options: GetItemPropsOptions<any>) => any;
  disabled?: boolean;
}
const AirportListItem = ({
  ap,
  index,
  getItemProps,
  highlightedIndex,
  disabled
}: any) => {
  if (disabled) return null;
  return (
    <ListItem
      disabled={disabled}
      dense
      key={ap.iataCode}
      {...getItemProps({
        key: ap.iataCode,
        index,
        item: ap,
        style: {
          backgroundColor: highlightedIndex === index ? "#ccc" : "#eee"
        }
      })}
    >
      <ListItemAvatar>
        <b>{ap.iataCode}</b>
      </ListItemAvatar>
      <ListItemText
        style={{ margin: 0 }}
        primary={ap.name || ap.shortName}
        primaryTypographyProps={{ noWrap: true }}
        secondaryTypographyProps={{ noWrap: true }}
        secondary={ap.detailedName || ap.venueName}
      />
    </ListItem>
  );
};

export default AirportACDownshift;
