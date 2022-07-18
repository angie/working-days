import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteMonth } from "~/models/month.server";

type ActionData = Awaited<ReturnType<typeof deleteMonth>>;

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id") as string;

  console.log("incoming id :>> ", id);

  invariant(id, "id not found");

  const res = await deleteMonth({ id });
  return json<ActionData>(res);
};
