import type { CalendarTileProperties } from "react-calendar";
import type { Month } from "~/models/month.server";
import { dayjs, isDayOff, isWeekday } from "~/date-utils";

export const getMonthRoute = (date: Date): string => {
  return `/months/${dayjs(date).format("YYYY-MM")}`;
};

export const getTileClassName = (
  tileProps: CalendarTileProperties,
  daysOff: Date[]
): string => {
  const { date, view } = tileProps;

  if (view !== "month") {
    return "";
  }

  let className = "";

  const day = dayjs(date);
  const isToday = dayjs().isSame(day, "day");

  if (!isDayOff(date, daysOff) && !day.isAfter(dayjs())) {
    className += " bg-red-200";
  }
  if (view === "month" && !isWeekday(day)) {
    className += " opacity-25";
  }

  if (isToday) {
    // add some kind of circle around today
  }
  return className;
};

export const isTileDisabled = (
  tileProps: CalendarTileProperties,
  month: Month | null
): boolean => {
  const { date, view } = tileProps;
  const isWeekend =
    view === "month" && (date.getDay() === 0 || date.getDay() === 6);
  const isFuture = dayjs(date).isAfter(dayjs());
  const isInLockedMonth = month?.isLocked ?? false;

  return isWeekend || isFuture || isInLockedMonth;
};
