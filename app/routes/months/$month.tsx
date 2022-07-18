import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  dayjs,
  getActualWorkingDays,
  getAllWorkingDays,
  convertUtcToLocal,
  getMonthYear,
  isDayOff,
} from "~/date-utils";
import { getDaysOffBetween } from "~/models/day-off.server";
import { getMonth } from "~/models/month.server";

import { getMonthStartAndEndDateObject } from "~/date-utils";
import { requireUserId } from "~/session.server";

import { useFetcher, useNavigate } from "@remix-run/react";
import Calendar from "react-calendar";
import { ToggleMonthLock } from "~/components/lock";
import {
  getMonthRoute,
  getTileClassName,
  isTileDisabled,
} from "~/months-utils";

type LoaderData = {
  actualWorkingDays: ReturnType<typeof getActualWorkingDays>;
  allWorkingDays: ReturnType<typeof getAllWorkingDays>;
  daysOffList: Awaited<ReturnType<typeof getDaysOffBetween>>;
  month: Awaited<ReturnType<typeof getMonth>>;
  startDate: Date;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.month, "month not found");

  const date = dayjs.utc(params.month).toDate();
  const userId = await requireUserId(request);
  const [startDate, endDate] = getMonthStartAndEndDateObject(date);

  const month = await getMonth({ userId, date: startDate });
  const daysOff = await getDaysOffBetween({ userId, startDate, endDate });
  const actualWorkingDays = getActualWorkingDays(startDate, daysOff);
  const allWorkingDays = getAllWorkingDays(startDate);

  return json<LoaderData>({
    actualWorkingDays,
    allWorkingDays,
    daysOffList: daysOff,
    month,
    startDate,
  });
};

export default function MonthView() {
  const { daysOffList, actualWorkingDays, allWorkingDays, month, startDate } =
    useLoaderData() as LoaderData;

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
          tileClassName={(tileProps) =>
            getTileClassName(tileProps, daysOffLocal)
          }
          tileDisabled={(tileProps) => isTileDisabled(tileProps, month)}
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
      <ToggleMonthLock date={startDate} month={month} />
    </>
  );
}
