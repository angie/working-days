import type { User, Month } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Month } from "@prisma/client";

export function addMonth({
  date,
  userId,
}: Pick<Month, "date"> & {
  userId: User["id"];
}) {
  return prisma.month.create({
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

export function deleteMonth({ id }: { id: Month["id"] }) {
  return prisma.month.delete({
    where: {
      id,
    },
  });
}

export function getMonth({
  userId,
  date,
}: Pick<Month, "date"> & { userId: User["id"] }) {
  return prisma.month.findFirst({
    where: { date, userId },
  });
}
