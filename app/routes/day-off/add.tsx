import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getToday } from "~/date-utils";
import { addDayOff } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

type ActionData = Awaited<ReturnType<typeof addDayOff>>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const userId = await requireUserId(request);

  const requestDate = data.get("date") as string;
  console.log("requestDate :>> ", requestDate);

  const dateToToggle = data.has("date")
    ? new Date(data.get("date") as string)
    : getToday();

  console.log("dateToToggle :>> ", dateToToggle);

  const dayOff = await addDayOff({ userId, date: dateToToggle });
  return json<ActionData>(dayOff);
};
