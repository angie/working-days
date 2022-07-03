import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Calendar from "react-calendar";

import { Main } from "~/components/main";
import { NavBar } from "~/components/navbar";
import {
  getMonthStartAndEndDateObject,
  getActualWorkingDays,
  getAllWorkingDays,
  getMonthYear,
} from "~/date-utils";
import { getDaysOffBetween } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  actualWorkingDays: ReturnType<typeof getActualWorkingDays>;
  allWorkingDays: ReturnType<typeof getAllWorkingDays>;
  daysOffList: Awaited<ReturnType<typeof getDaysOffBetween>>;
  month: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const [startDate, endDate] = getMonthStartAndEndDateObject();

  const daysOff = await getDaysOffBetween({ userId, startDate, endDate });
  const actualWorkingDays = getActualWorkingDays(startDate, daysOff);
  const allWorkingDays = getAllWorkingDays(startDate);

  return json<LoaderData>({
    actualWorkingDays,
    allWorkingDays,
    daysOffList: daysOff,
    month: getMonthYear(startDate),
  });
};

export default function Months() {
  const { daysOffList, actualWorkingDays, allWorkingDays, month } =
    useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col">
      <NavBar />
      <Main>
        <div className="pb-6 text-sm md:text-lg">
          {/* TODO: fix issue with aria-label differences on server and client */}
          <Calendar value={new Date()} />
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
      </Main>
    </div>
  );
}
