import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { Month } from "~/components/month";
import { getActualWorkingDays, getAllWorkingDays } from "~/date-utils";
import { getDaysOffBetween } from "~/models/day-off.server";

import { getMonthStartAndEndDateObject, getMonthYear } from "~/date-utils";
import { requireUserId } from "~/session.server";

type LoaderData = {
  actualWorkingDays: ReturnType<typeof getActualWorkingDays>;
  allWorkingDays: ReturnType<typeof getAllWorkingDays>;
  daysOffList: Awaited<ReturnType<typeof getDaysOffBetween>>;
  month: string;
  startDate: Date;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.month, "month not found");

  const date = new Date(params.month);
  const userId = await requireUserId(request);
  const [startDate, endDate] = getMonthStartAndEndDateObject(date);

  const daysOff = await getDaysOffBetween({ userId, startDate, endDate });
  const actualWorkingDays = getActualWorkingDays(startDate, daysOff);
  const allWorkingDays = getAllWorkingDays(startDate);

  return json<LoaderData>({
    actualWorkingDays,
    allWorkingDays,
    daysOffList: daysOff,
    month: getMonthYear(endDate),
    startDate,
  });
};

export default function MonthView() {
  const loaderData = useLoaderData() as LoaderData;

  return <Month {...loaderData} />;
}
