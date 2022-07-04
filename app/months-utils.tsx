import { getDayJs } from "~/date-utils";

export const getMonthRoute = (date: Date): string => {
  return `/months/${getDayJs(date).format("YYYY-MM")}`;
};
