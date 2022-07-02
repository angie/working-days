import type { User, DayOff } from "@prisma/client";

import { prisma } from "~/db.server";

export type { DayOff } from "@prisma/client";

export function getNote({
  id,
  userId,
}: Pick<DayOff, "id"> & {
  userId: User["id"];
}) {
  return prisma.dayOff.findFirst({
    where: { id, userId },
  });
}

export function getDayOffByDate({
  userId,
  date,
}: Pick<DayOff, "userId" | "date">) {
  return prisma.dayOff.findFirst({
    where: { userId, date },
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
