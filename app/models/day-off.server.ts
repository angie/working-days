import type { User, DayOff } from "@prisma/client";

import { prisma } from "~/db.server";

export type { DayOff } from "@prisma/client";

export function getDayOffByDate({
  userId,
  date,
}: Pick<DayOff, "userId" | "date">) {
  return prisma.dayOff.findFirst({
    where: { userId, date },
  });
}

// get all days off for a user between a given date range
export function getDaysOffBetween({
  userId,
  startDate,
  endDate,
}: Pick<DayOff, "userId"> & {
  startDate: Date;
  endDate: Date;
}) {
  return prisma.dayOff.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export function getDaysOff({ userId }: { userId: User["id"] }) {
  return prisma.dayOff.findMany({
    where: { userId },
    select: { id: true, date: true },
    orderBy: { date: "desc" },
  });
}

export function addDayOff({
  date,
  userId,
}: Pick<DayOff, "date"> & {
  userId: User["id"];
}) {
  return prisma.dayOff.create({
    data: {
      date,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteDayOff({
  date,
  userId,
}: Pick<DayOff, "date"> & { userId: User["id"] }) {
  return prisma.dayOff.deleteMany({
    where: { date, userId },
  });
}
