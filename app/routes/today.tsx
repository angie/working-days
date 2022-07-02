import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import * as React from "react";

import { getToday } from "~/date-utils";
import { getDayOffByDate } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

type ActionData = {
  errors?: {
    date?: string;
  };
};

type LoaderData = {
  date: Date;
  isWorking: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const dayOff = await getDayOffByDate({ userId, date: getToday() });
  return json<LoaderData>({ date: getToday(), isWorking: !dayOff });
};

export default function TodayPage() {
  const actionData = useActionData() as ActionData;
  const dateRef = React.useRef<HTMLInputElement>(null);
  const { isWorking } = useLoaderData() as LoaderData;
  const user = useUser();
  const dayOff = useFetcher();

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const action = target.value === "off" ? "add" : "delete";

    dayOff.submit(dayOff.data, {
      method: "post",
      action: `/day-off/${action}`,
    });
  };

  React.useEffect(() => {
    if (actionData?.errors?.date) {
      dateRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-zinc-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Today</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-pink-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <dayOff.Form
        method="post"
        action="/day-off/add"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "100%",
        }}
      >
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Did you work today?</span>
            <span className="text-6xl">{isWorking ? "👩‍💻" : "🏝"}</span>
            <fieldset>
              <div>
                <input
                  type="radio"
                  id="worked"
                  name="worked"
                  value="worked"
                  defaultChecked={isWorking}
                  onChange={onChangeHandler}
                />
                <label htmlFor="worked">Yes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="off"
                  name="worked"
                  value="off"
                  defaultChecked={!isWorking}
                  onChange={onChangeHandler}
                />
                <label htmlFor="off">No</label>
              </div>
            </fieldset>
          </label>
          {actionData?.errors?.date && (
            <div className="pt-1 text-red-700" id="date-error">
              {actionData.errors.date}
            </div>
          )}
        </div>
      </dayOff.Form>
    </div>
  );
}
