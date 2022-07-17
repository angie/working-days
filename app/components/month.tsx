import { useFetcher, useNavigate } from "@remix-run/react";
import * as React from "react";
import Calendar from "react-calendar";

import {
  convertUtcToLocal,
  dayjs,
  getMonthYear,
  getTileClassName,
  isDayOff,
} from "~/date-utils";

import type { DayOff } from "~/models/day-off.server";
import { getMonthRoute } from "~/months-utils";

export const Month: React.FC<{
  daysOffList: DayOff[];
  actualWorkingDays: Date[];
  allWorkingDays: Date[];
  startDate: Date;
}> = ({ daysOffList, actualWorkingDays, allWorkingDays, startDate }) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const daysOffLocal = daysOffList.map((d) =>
    convertUtcToLocal(new Date(d.date))
  );

  const onClickDayHandler = (date: Date): void => {
    const action = isDayOff(date, daysOffLocal) ? "delete" : "add";
    const dateString = dayjs(date).tz("UTC", true).toJSON();

    fetcher.submit(
      { date: dateString },
      {
        method: "post",
        action: `/day-off/${action}`,
      }
    );
  };

  return (
    <>
      <div className="flex justify-center pb-6 text-sm md:text-lg">
        <Calendar
          activeStartDate={convertUtcToLocal(new Date(startDate))}
          nextAriaLabel="Next month"
          next2AriaLabel="Next year"
          prevAriaLabel="Previous month"
          prev2AriaLabel="Previous year"
          onActiveStartDateChange={({ activeStartDate, view }) => {
            if (view !== "month") {
              return;
            }

            navigate(getMonthRoute(activeStartDate));
          }}
          onClickDay={onClickDayHandler}
          onClickMonth={(date: Date) => {
            navigate(getMonthRoute(date));
          }}
          showNeighboringMonth={false}
          tileClassName={(tileProps) => {
            return getTileClassName(tileProps, daysOffLocal);
          }}
          tileDisabled={({ date, view }) => {
            const isWeekend =
              view === "month" && (date.getDay() === 0 || date.getDay() === 6);
            return isWeekend;
          }}
        />
      </div>
      <div className="text-left text-sm sm:text-center sm:text-base sm:leading-loose">
        <p>
          You have worked {actualWorkingDays.length}{" "}
          {actualWorkingDays.length === 1 ? "day" : "days"} this month.
        </p>
        <p>
          There are {allWorkingDays.length} working days total in{" "}
          {getMonthYear(startDate)}.
        </p>
      </div>
    </>
  );
};
