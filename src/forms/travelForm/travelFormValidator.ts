import { TravelLeg } from "../../types/travel.types";
import moment from "moment-timezone";

const validate = (values: any) => {
  const errors: any = {
    legs: []
  };
  const { legs } = values;
  const requiredFields = new Map<keyof TravelLeg, string>([
    ["fromLocId", "Please choose a Location"],
    ["toLocId", "Please choose a Location"]
  ]);
  const addErrorToLeg = (index: number, newError: any) => {
    if (errors.legs && errors.legs[index]) {
      errors.legs[index] = { ...errors.legs[index], ...newError };
    } else if (errors.legs) {
      errors.legs[index] = newError;
    }
  };
  legs.forEach((leg: TravelLeg, index: number) => {
    requiredFields.forEach((msg: string, reqField: keyof TravelLeg) => {
      //@ts-ignore
      if (!leg[reqField]) {
        addErrorToLeg(index, { [reqField]: msg });
      }
    });
    if (
      legs[index - 1]?.endDate &&
      moment(legs[index - 1].endDate).isAfter(legs[index].startDate)
    ) {
      addErrorToLeg(index, {
        startDate: `Must be after ${moment(legs[index - 1].endDate).format(
          "h:mm a"
        )}`
      });
    }
    if (moment(leg.startDate).isAfter(leg.endDate)) {
      addErrorToLeg(index, {
        endDate: `Must be after ${moment
          .tz(leg.startDate, leg.fromLocBasic?.timeZoneId)
          .format("M.D h:mma z")}`
      });
    }
  });
  return errors;
};

export default validate;
