import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getToday } from "~/date-utils";
import { getMonthRoute } from "~/months-utils";

export const loader: LoaderFunction = () => redirect(getMonthRoute(getToday()));
