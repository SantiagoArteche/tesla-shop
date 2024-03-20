"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const productBySlug = await prisma.product.findFirst({
      where: { slug },
      select: { inStock: true },
    });

    return productBySlug?.inStock ?? 0;
  } catch (error) {
    throw new Error("Product not found");
  }
};
