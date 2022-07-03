import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { DayOff } from "~/models/day-off.server";

dayjs.extend(utc);

export const getToday = (): Date => {
  return dayjs.utc().startOf("day").toDate();
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

export const getAllWorkingDays = (month: Date) => {
  const workingDays = [];
  const [startDate, endDate] = getMonthStartAndEnd(month);

  for (
    let date = startDate;
    date.isBefore(endDate);
    date = date.add(1, "day")
  ) {
    if (date.day() !== 0 && date.day() !== 6) {
      workingDays.push(date.toDate());
    }
  }
  return workingDays;
};

export const getPossibleWorkingDays = (month: Date) => {
  const [, endDate] = getMonthStartAndEnd(month);
  const endOfToday = dayjs.utc().endOf("day");
  // either end of month or endOfToday, whichever is earlier
  const isCurrentMonth =
    endDate.isSame(endOfToday, "month") && endDate.isAfter(endOfToday)
      ? endOfToday
      : endDate;

  const possibleWorkingDays = getAllWorkingDays(month);
  const possibleWorkingDaysUntilToday = possibleWorkingDays.filter((day) =>
    dayjs.utc(day).isBefore(isCurrentMonth)
  );
  return possibleWorkingDaysUntilToday;
};

export const getActualWorkingDays = (month: Date, daysOff: DayOff[]) => {
  const workingDays = getPossibleWorkingDays(month);
  const daysOffDates = daysOff.map((dayOff) => dayOff.date);
  return workingDays.filter((day) => !daysOffDates.includes(day));
};

export const getMonthYear = (date: Date) => {
  return dayjs.utc(date).format("MMMM YYYY");
};
