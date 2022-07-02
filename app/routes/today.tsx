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
    const action = target.checked ? "delete" : "add";

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
      <header className="flex items-center justify-between bg-prussian-blue-900 p-4 text-solitaire-50">
        <h1 className="text-xl font-bold sm:text-3xl">
          <Link to="/">Today</Link>
        </h1>
        <p className="text-xs sm:text-lg">{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-pink-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="drop-shadow-solid relative mt-12 flex justify-center p-4 text-3xl sm:mt-24">
        <div className="w-11/12 border-2 border-black shadow-solid sm:w-3/5">
          <div className="bg-solitaire-100 p-4 pb-8">
            <dayOff.Form
              method="post"
              action="/day-off/add"
              style={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
            >
              <h1 className="pb-4 font-bold text-persian-pink-500 sm:pb-8">
                Did you work today?
              </h1>
              <span className="flex justify-center pb-4 text-6xl sm:pb-8">
                {isWorking ? "Yes" : "No"}
              </span>
              <fieldset className="flex justify-center gap-3">
                <label
                  htmlFor="checked-toggle"
                  className="relative inline-flex cursor-pointer items-center "
                >
                  <input
                    type="checkbox"
                    value="working"
                    id="checked-toggle"
                    className="peer sr-only"
                    defaultChecked={isWorking}
                    onClick={onChangeHandler}
                  />
                  <div className="peer h-11 w-[100px] rounded-full border-4 border-black after:absolute after:top-1.5 after:left-[6px] after:h-8 after:w-8 after:rounded-full after:border-4 after:border-black after:bg-morning-glory after:transition-all after:content-[''] peer-checked:bg-persian-pink-200 peer-checked:after:translate-x-[175%] peer-focus:ring-4 peer-focus:ring-persian-pink-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                  <span className="sr-only ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Did you work today?
                  </span>
                </label>
              </fieldset>
              {actionData?.errors?.date && (
                <div className="pt-1 text-red-700" id="date-error">
                  {actionData.errors.date}
                </div>
              )}
            </dayOff.Form>
          </div>
        </div>
      </main>
    </div>
  );
}
