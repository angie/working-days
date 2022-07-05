import { dayjs } from "~/date-utils";

export const getMonthRoute = (date: Date): string => {
  return `/months/${dayjs(date).format("YYYY-MM")}`;
};
