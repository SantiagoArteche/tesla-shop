import prisma from "@/lib/prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return { ok: true, users };
  } catch (error) {
    return {
      ok: false,
      msg: "Couldn't get users",
    };
  }
};
