"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      msg: "Must be authenticated",
    };
  }
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                price: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error(`${id} doesn't exist`);

    if (session.user.role === "user") {
      if (session.user.id !== order.userId)
        throw new Error(`You can't access to orders from others`);
    }
    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: "Contact support",
    };
  }
};
