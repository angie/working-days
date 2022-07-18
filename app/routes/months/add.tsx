import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { addMonth } from "~/models/month.server";
import { requireUserId } from "~/session.server";

type ActionData = Awaited<ReturnType<typeof addMonth>>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const userId = await requireUserId(request);
  const date = new Date(data.get("date") as string);

  const dayOff = await addMonth({ userId, date });
  return json<ActionData>(dayOff);
};
