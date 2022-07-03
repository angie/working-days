import { getToday, getWorkingDays } from "./date-utils";

test("getToday should return today's date at midnight", () => {
  const today = new Date().toJSON().split("T")[0];
  const todayMidnight = new Date(today + "T00:00:00.000Z");

  expect(getToday()).toEqual(todayMidnight);
});

test("getWorkingDays should return all working days in a month", () => {
  const month = new Date("2019-01-01");
  const workingDays = [
    new Date("2019-01-01"),
    new Date("2019-01-02"),
    new Date("2019-01-03"),
    new Date("2019-01-04"),
    // skip Saturday 5th and Sunday 6th
    new Date("2019-01-07"),
    new Date("2019-01-08"),
    new Date("2019-01-09"),
    new Date("2019-01-10"),
    new Date("2019-01-11"),
    // skip Saturday 12th and Sunday 13th
    new Date("2019-01-14"),
    new Date("2019-01-15"),
    new Date("2019-01-16"),
    new Date("2019-01-17"),
    new Date("2019-01-18"),
    // skip Saturday 19th and Sunday 20th
    new Date("2019-01-21"),
    new Date("2019-01-22"),
    new Date("2019-01-23"),
    new Date("2019-01-24"),
    new Date("2019-01-25"),
    // skip Saturday 26th and Sunday 27th
    new Date("2019-01-28"),
    new Date("2019-01-29"),
    new Date("2019-01-30"),
    new Date("2019-01-31"),
  ];

  expect(getWorkingDays(month)).toEqual(workingDays);
});
