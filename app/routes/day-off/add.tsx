import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import dayjs from "dayjs";
import { getToday } from "~/date-utils";
import { addDayOff } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

type ActionData = Awaited<ReturnType<typeof addDayOff>>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const userId = await requireUserId(request);

  const dateToToggle = data.has("date")
    ? dayjs(data.get("date") as string)
        .startOf("day")
        .toDate()
    : getToday();

  const dayOff = await addDayOff({ userId, date: dateToToggle });
  return json<ActionData>(dayOff);
};
