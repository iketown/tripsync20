import { pickBy } from "lodash";

export const removeMissing = (obj: Object) => {
  return pickBy(obj, v => v !== null && v !== undefined);
};
