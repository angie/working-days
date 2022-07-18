import * as React from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useFetcher } from "@remix-run/react";
import type { Month } from "~/models/month.server";

export const ToggleMonthLock: React.FC<{
  date: Date;
  month: Month | null;
}> = ({ date, month }) => {
  const fetcher = useFetcher();
  const isLocked = month?.isLocked ?? false;
  return (
    <div className="mt-4 flex flex-row items-center text-left text-xs">
      <button
        className="inline-flex items-center gap-2 bg-transparent p-2 hover:bg-transparent"
        onClick={() => {
          if (month?.id && isLocked) {
            fetcher.submit(
              { id: month.id },
              {
                method: "post",
                action: "/months/delete",
              }
            );
          } else {
            fetcher.submit(
              { date: date.toString() },
              {
                method: "post",
                action: "/months/add",
              }
            );
          }
        }}
      >
        {isLocked ? <FaLock /> : <FaUnlock />}
        Click to {isLocked ? "allow" : "prevent"} changes.
      </button>
    </div>
  );
};
