import {
  convertUtcToLocal,
  dayjs,
  getAllWorkingDays,
  getMonthStartAndEndDateObject,
  getPossibleWorkingDays,
  getToday,
} from "./date-utils";

afterEach(() => {
  vi.useRealTimers();
});

test("getToday should return today's date at midnight", () => {
  const today = new Date().toJSON().split("T")[0];
  const todayMidnight = new Date(today + "T00:00:00.000Z");

  expect(getToday()).toEqual(todayMidnight);
});

test("getMonthStartAndEnd should return the start and end dates for the current month by default", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2019-02-06"));

  expect(getMonthStartAndEndDateObject()).toEqual([
    new Date("2019-02-01T00:00:00.000Z"),
    new Date("2019-02-28T23:59:59.999Z"),
  ]);
});

test("getMonthStartAndEndDateObject should return the start and end dates of the month", () => {
  const date = new Date("2018-04-20 10:00:00Z");

  const [start, end] = getMonthStartAndEndDateObject(date);
  expect(start).toEqual(new Date("2018-04-01"));
  expect(end).toEqual(new Date("2018-04-30T23:59:59.999Z"));
});

test("getAllWorkingDays should return all working days in a month", () => {
  const month = dayjs("2019-01-01").tz("Asia/Tokyo").toDate();
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

  expect(getAllWorkingDays(month)).toEqual(workingDays);
});

test("getPossibleWorkingDays should return all working days in a month stopping at today's date", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2019-02-06"));

  expect(getPossibleWorkingDays(new Date("2019-02-01"))).toEqual([
    new Date("2019-02-01"),
    // skip Saturday 2nd and Sunday 3rd
    new Date("2019-02-04"),
    new Date("2019-02-05"),
    new Date("2019-02-06"),
  ]);
});

test("getAllPossibleWorkingDays should return all working days for a month in the past", () => {
  expect(getPossibleWorkingDays(new Date("2022-02-01"))).toHaveLength(20);
});

test("getAllPossibleWorkingDays should return all working days for a month in the future", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2019-02-06"));

  expect(getPossibleWorkingDays(new Date("2022-02-01"))).toHaveLength(20);
});

test("convertUtcToLocal should convert UTC date to local without offsetting time", () => {
  const utc = dayjs.utc("2022-02-01");

  expect(convertUtcToLocal(utc.toDate())).toEqual(
    new Date("2022-02-01T00:00:00")
  );
});
