"use server";

import { Size } from "@/interfaces/product.interface";
import { Address } from "../../interfaces/address.interface";
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsId: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = !!session?.user && session?.user.id;

  if (!userId) {
    return {
      ok: false,
      msg: "Session doesn't exist",
    };
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsId.map((p) => p.productId),
      },
    },
  });

  const itemsInOrder = productsId.reduce(
    (acum, prod) => acum + prod.quantity,
    0
  );

  const { tax, total, subTotal } = productsId.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error(`${item.productId} doesn't exist = 500`);

      totals.subTotal += product.price * productQuantity;
      totals.tax = totals.subTotal * 0.15;
      totals.total = totals.subTotal * 1.15;

      return totals;
    },
    {
      subTotal: 0,
      tax: 0,
      total: 0,
    }
  );

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      const updatedProductPromises = products.map(async (product) => {
        const productQuantity = productsId
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0)
          throw new Error(`${product.id} Don't have the right quantity`);

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductPromises);

      updatedProducts.forEach((prod) => {
        if (prod.inStock < 0) {
          throw new Error(`${prod.title} doesn't have stock`);
        }
      });

      const { rememberAddress, country, ...rest } = address;
      const order = await tx.order.create({
        data: {
          tax,
          userId,
          subTotal,
          total,
          itemsInOrder,

          OrderItem: {
            createMany: {
              data: productsId.map((p) => ({
                size: p.size,
                productId: p.productId,
                quantity: p.quantity,
                price:
                  products.find((prod) => prod.id === p.productId)?.price ?? 0,
              })),
            },
          },

          OrderAddress: {
            create: {
              ...rest,
              countryId: country,
              address2: rest.address2 ? rest.address2 : "",
            },
          },
        },
      });

      return { order, updatedProducts };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      msg: error.message,
    };
  }
};
