import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface PaginationOption {
  page?: number;
  take?: number;
}
export const getOrdersPaginated = async ({
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

  const orders = await prisma.order.findMany({
    take: take,
    skip: (page - 1) * take,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const totalCount = await prisma.order.count({});

  const totalPages = Math.ceil(totalCount / take);

  return { ok: true, orders, totalPages };
};
