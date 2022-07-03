import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const getToday = (): Date => {
  return dayjs.utc().startOf("day").toDate();
};

export const getWorkingDays = (month: Date) => {
  const workingDays = [];
  const startDate = dayjs.utc(month).startOf("month");
  const endDate = dayjs.utc(month).endOf("month");
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
