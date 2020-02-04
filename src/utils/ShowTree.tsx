import React, { useState } from "react";
import JSONTree from "react-json-tree";
import {
  Typography,
  IconButton,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import { FaMinus, FaPlus } from "react-icons/fa";

export const ShowTree = ({
  obj,
  name,
  openKeys
}: {
  obj: any;
  name?: string;
  openKeys?: React.ReactText[];
}) => {
  const [maxRems, setMaxRems] = useState(30);
  return (
    <ExpansionPanel
      defaultExpanded
      style={{ border: "1px solid rebeccapurple" }}
    >
      <ExpansionPanelSummary>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around"
          }}
        >
          {!!name && <Typography variant="caption">{name}</Typography>}
          <IconButton size="small" onClick={() => setMaxRems(old => old - 5)}>
            <FaMinus />
          </IconButton>
          <IconButton size="small" onClick={() => setMaxRems(old => old + 5)}>
            <FaPlus />
          </IconButton>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div
          style={{
            maxHeight: `${maxRems}rem`,
            width: "100%",
            overflow: "scroll"
          }}
        >
          {obj && Object.keys(obj).length ? (
            <JSONTree
              data={obj}
              hideRoot
              shouldExpandNode={(keyName, data, level) => {
                const find = !!keyName.find(key => openKeys?.includes(key));
                const shouldOpen =
                  !!openKeys && !!keyName.find(key => openKeys.includes(key));
                if (keyName.includes("segments")) {
                  // debugger;
                }
                return shouldOpen;
              }}
            />
          ) : obj ? (
            "empty object"
          ) : (
            "undefined"
          )}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ShowTree;
