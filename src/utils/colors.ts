import {
  red,
  purple,
  indigo,
  lightBlue,
  green,
  orange,
  brown,
  grey
} from "@material-ui/core/colors";
import { Color } from "@material-ui/core/index";

export const colors = [
  [red[800], red[400]],
  [purple[800], purple[400]],
  [indigo[800], indigo[400]],
  [lightBlue[800], lightBlue[400]],
  [green[800], green[400]],
  [orange[800], orange[400]],
  [brown[800], brown[400]],
  [grey[800], grey[400]]
];

export const rawColors = [
  grey,
  red,
  green,
  purple,
  orange,
  indigo,
  brown,
  lightBlue
];

export const colorByIndex = (
  index: number | string,
  darkness: keyof Color = 400
) => {
  return rawColors[Number(index) % rawColors.length][darkness];
};
