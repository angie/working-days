import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import type { DayOff } from "~/models/day-off.server";

dayjs.extend(utc);
dayjs.extend(timezone);

export { dayjs };

export const getToday = (): Date => {
  return dayjs().startOf("day").tz("UTC", true).toDate();
};

export const getMonthStartAndEnd = (
  date: Date
): [start: dayjs.Dayjs, end: dayjs.Dayjs] => {
  const start = dayjs.utc(date).startOf("month");
  const end = dayjs.utc(date).endOf("month");
  return [start, end];
};

export const getMonthStartAndEndDateObject = (
  date: Date = new Date()
): [start: Date, end: Date] => {
  const [start, end] = getMonthStartAndEnd(date);
  return [start.toDate(), end.toDate()];
};

export const isWeekday = (date: dayjs.Dayjs): boolean => {
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
  const actual = workingDays.filter(
    (day) => !daysOffDates.includes(day.getTime())
  );
  return actual;
};

export const getMonthYear = (date: Date) => {
  return dayjs(date).format("MMMM YYYY");
};

export const isDayOff = (date: Date, daysOff: Date[]) => {
  const day = dayjs(date);
  const dayOff = daysOff.find((dayOff) => {
    return dayjs(dayOff).isSame(day, "day");
  });

  return dayOff !== undefined;
};

export const convertUtcToLocal = (date: Date): Date => {
  const local = new Date(date.toISOString().split("Z")[0]);
  return local;
};
