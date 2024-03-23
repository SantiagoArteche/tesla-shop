"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOption {
  page?: number;
  take?: number;
}

export const getUsersPaginated = async ({
  take = 5,
  page = 1,
}: PaginationOption) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      msg: "Must be admin user",
    };
  }

  const users = await prisma.user.findMany({
    take: take,
    skip: (page - 1) * take,
    orderBy: {
      name: "desc",
    },
  });

  const totalCount = await prisma.user.count({});

  const totalPages = Math.ceil(totalCount / take);

  return { ok: true, users, totalPages };
};
