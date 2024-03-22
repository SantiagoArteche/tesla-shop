"use server";

import { Address } from "@/interfaces/address.interface";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      newAddress,
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Couldn't save address",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  const { rememberAddress, ...data } = address;
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    const { country, ...rest } = data;

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: { userId, ...rest, countryId: country },
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: { ...rest, userId, countryId: country },
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);

    throw new Error("Couldn't save address");
  }
};


