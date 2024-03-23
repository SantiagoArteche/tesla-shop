"use server";

import { auth } from "@/auth.config";
import { Category } from "@/interfaces/category.interface";
import prisma from "@/lib/prisma";

export const getCategories = async (): Promise<
  Category[] | { ok: boolean; msg: string }
> => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      msg: "Must be admin user",
    };
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.log(error);

    return [];
  }
};
