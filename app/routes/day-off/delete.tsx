import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { dayjs, getToday } from "~/date-utils";
import { deleteDayOff } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

type ActionData = Awaited<ReturnType<typeof deleteDayOff>>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const userId = await requireUserId(request);

  const date = data.has("date")
    ? dayjs(data.get("date") as string)
        .tz("UTC", true)
        .startOf("day")
        .toDate()
    : getToday();

  const dayOff = await deleteDayOff({ userId, date });
  return json<ActionData>(dayOff);
};
