import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const getToday = (): Date => {
  dayjs.extend(utc);
  return dayjs.utc().startOf("day").toDate();
};
