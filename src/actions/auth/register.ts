"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const findUser = await prisma.user.findUnique({ where: { email } });

    if (findUser) {
      return {
        ok: false,
        msg: "User already exist",
      };
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: bcryptjs.hashSync(password, 15),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      msg: "User created!",
      user,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      msg: "Couldn't create user ",
    };
  }
};
