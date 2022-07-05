import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { CalendarTileProperties } from "react-calendar";
import type { DayOff } from "~/models/day-off.server";

dayjs.extend(utc);

export { dayjs };

export const dayjsutc = (date?: dayjs.ConfigType): dayjs.Dayjs => {
  const utc = dayjs.utc(date);
  // console.log("utc :>> ", utc.format());
  return utc;
};

export const getToday = (): Date => {
  return dayjsutc().startOf("day").toDate();
};

export const getMonthStartAndEnd = (
  date: Date
): [start: dayjs.Dayjs, end: dayjs.Dayjs] => {
  const start = dayjsutc(date).startOf("month");
  const end = dayjsutc(date).endOf("month");
  return [start, end];
};

export const getMonthStartAndEndDateObject = (
  date: Date = new Date()
): [start: Date, end: Date] => {
  const [start, end] = getMonthStartAndEnd(date);
  return [start.toDate(), end.toDate()];
};

const isWeekday = (date: dayjs.Dayjs): boolean => {
  return date.day() !== 0 && date.day() !== 6;
};

export const getAllWorkingDays = (month: Date) => {
  const workingDays = [];
  const [startDate, endDate] = getMonthStartAndEnd(month);

  for (
    let date = startDate;
    date.isBefore(endDate);
    date = date.add(1, "day")
  ) {
    if (isWeekday(date)) {
      workingDays.push(date.toDate());
    }
  }
  return workingDays;
};

export const getPossibleWorkingDays = (month: Date) => {
  const [, endDate] = getMonthStartAndEnd(month);
  const endOfToday = dayjsutc().endOf("day");
  // either end of month or endOfToday, whichever is earlier
  const isCurrentMonth =
    endDate.isSame(endOfToday, "month") && endDate.isAfter(endOfToday)
      ? endOfToday
      : endDate;

  const possibleWorkingDays = getAllWorkingDays(month);
  const possibleWorkingDaysUntilToday = possibleWorkingDays.filter((day) =>
    dayjsutc(day).isBefore(isCurrentMonth)
  );
  return possibleWorkingDaysUntilToday;
};

export const getActualWorkingDays = (month: Date, daysOff: DayOff[]) => {
  const workingDays = getPossibleWorkingDays(month);
  const daysOffDates = daysOff.map((dayOff) => dayOff.date.getTime());
  return workingDays.filter((day) => !daysOffDates.includes(day.getTime()));
};

export const getMonthYear = (date: Date) => {
  return dayjsutc(date).format("MMMM YYYY");
};

export const isDayOff = (date: Date, daysOff: DayOff[]) => {
  const day = dayjsutc(date);
  const dayOff = daysOff.find((dayOff) => {
    return dayjsutc(dayOff.date).isSame(day, "day");
  });

  return dayOff !== undefined;
};

export const getTileClassName = (
  tileProps: CalendarTileProperties,
  daysOff: DayOff[]
): string => {
  const { date, view } = tileProps;

  if (view !== "month") {
    return "";
  }

  let className = "";

  const day = dayjsutc(date);
  const isToday = dayjsutc().isSame(day, "day");

  if (!isDayOff(date, daysOff) && !day.isAfter(dayjsutc())) {
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
