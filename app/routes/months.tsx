import { Outlet } from "@remix-run/react";

import { Main } from "~/components/main";
import { NavBar } from "~/components/navbar";

export default function Months() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <NavBar />
      <Main>
        <Outlet />
      </Main>
    </div>
  );
}
