import { useFetcher, useNavigate } from "@remix-run/react";
import * as React from "react";
import Calendar from "react-calendar";

import { getTileClassName, isDayOff } from "~/date-utils";
import type { DayOff } from "~/models/day-off.server";
import { getMonthRoute } from "~/months-utils";

export const Month: React.FC<{
  daysOffList: DayOff[];
  actualWorkingDays: Date[];
  allWorkingDays: Date[];
  month: string;
  startDate: Date;
}> = ({ daysOffList, actualWorkingDays, allWorkingDays, month, startDate }) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const onClickDayHandler = (date: Date): void => {
    const action = isDayOff(date, daysOffList) ? "delete" : "add";

    fetcher.submit(
      { date: date.toJSON() },
      {
        method: "post",
        action: `/day-off/${action}`,
      }
    );
  };

  return (
    <>
      <div className="flex justify-center pb-6 text-sm md:text-lg">
        {/* TODO: fix issue with aria-label differences on server and client */}
        <Calendar
          activeStartDate={new Date(startDate)}
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
            return getTileClassName(tileProps, daysOffList);
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
          There are {allWorkingDays.length} working days total in {month}.
        </p>
      </div>
    </>
  );
};
