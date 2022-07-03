import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { Main } from "~/components/main";
import { NavBar } from "~/components/navbar";
import { getToday } from "~/date-utils";
import { getDayOffByDate } from "~/models/day-off.server";
import { requireUserId } from "~/session.server";

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
  const { isWorking } = useLoaderData() as LoaderData;
  const dayOff = useFetcher();

  const onChangeHandler = (event: React.FormEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const action = target.checked ? "delete" : "add";

    dayOff.submit(dayOff.data, {
      method: "post",
      action: `/day-off/${action}`,
    });
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <NavBar />
      <Main>
        <Form
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <h1 className="pb-4 font-bold leading-snug text-persian-pink-500 sm:pb-8">
            Did you work today?
          </h1>
          <span className="flex justify-center pb-4 text-4xl sm:pb-8 sm:text-6xl">
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
        </Form>
      </Main>
    </div>
  );
}
