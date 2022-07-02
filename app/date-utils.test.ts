import { getToday } from "./date-utils";

test("getToday should return today's date at midnight", () => {
  const today = new Date().toJSON().split("T")[0];
  const todayMidnight = new Date(today + "T00:00:00.000Z");

  expect(getToday()).toEqual(todayMidnight);
});
