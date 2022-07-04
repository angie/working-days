import dayjs from "dayjs";
import type { CalendarTileProperties } from "react-calendar";
import type { DayOff } from "~/models/day-off.server";

// dayjs.extend(utc);

export const getToday = (): Date => {
  return dayjs().startOf("day").toDate();
};

export const getMonthStartAndEnd = (
  date: Date
): [start: dayjs.Dayjs, end: dayjs.Dayjs] => {
  const start = dayjs(date).startOf("month");
  const end = dayjs(date).endOf("month");
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
  const endOfToday = dayjs().endOf("day");
  // either end of month or endOfToday, whichever is earlier
  const isCurrentMonth =
    endDate.isSame(endOfToday, "month") && endDate.isAfter(endOfToday)
      ? endOfToday
      : endDate;

  const possibleWorkingDays = getAllWorkingDays(month);
  const possibleWorkingDaysUntilToday = possibleWorkingDays.filter((day) =>
    dayjs(day).isBefore(isCurrentMonth)
  );
  return possibleWorkingDaysUntilToday;
};

export const getActualWorkingDays = (month: Date, daysOff: DayOff[]) => {
  const workingDays = getPossibleWorkingDays(month);
  const daysOffDates = daysOff.map((dayOff) => dayOff.date.getTime());
  return workingDays.filter((day) => !daysOffDates.includes(day.getTime()));
};

export const getMonthYear = (date: Date) => {
  return dayjs(date).format("MMMM YYYY");
};

export const getDayJs = (date: Date) => {
  return dayjs(date);
};

export const isDayOff = (date: Date, daysOff: DayOff[]) => {
  const day = dayjs(date);
  const dayOff = daysOff.find((dayOff) => {
    return dayjs(dayOff.date).isSame(day, "day");
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
