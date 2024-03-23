"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId,
      },
    });

    if (!order) {
      return {
        ok: false,
        msg: `Order with id ${orderId} not found`,
      };
    }

    return {
      ok: true,
      order,
      transactionId,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Couldn't update order",
    };
  }
};
