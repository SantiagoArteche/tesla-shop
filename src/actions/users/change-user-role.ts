"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const changeUserRole = async (
  userId: string,
  role: "admin" | "user"
) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    redirect("/");
  }
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

    revalidatePath("/admin/users");
    return {
      ok: true,
      user,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Couldn't update user",
    };
  }
};
