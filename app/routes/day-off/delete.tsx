import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getToday } from "~/date-utils";
import { deleteDayOff } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

type ActionData = Awaited<ReturnType<typeof deleteDayOff>>;

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const dayOff = await deleteDayOff({ userId, date: getToday() });
  return json<ActionData>(dayOff);
};
