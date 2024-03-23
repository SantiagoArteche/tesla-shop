"use server";

import { PaypalOrderStatusResponse } from "@/interfaces/paypal.interface";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = (await getPayPalBearerToken()) ?? "";

  if (!authToken) {
    return {
      ok: false,
      msg: "Couldn't get token",
    };
  }
  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      msg: "Payment error",
    };
  }

  const { status, purchase_units, id } = resp;

  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return {
      ok: false,
      msg: "Yet unpaid",
    };
  }

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      msg: "Payment error",
    };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const NEXT_PUBLIC_PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";
  const base64Token = Buffer.from(
    `${NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(`${oauth2Url}`, requestOptions).then((r) =>
      r.json()
    );

    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  authToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const ordersUrl = process.env.PAYPAL_ORDERS_URL;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${authToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resp = await fetch(
      `${ordersUrl}/${paypalTransactionId}`,
      requestOptions
    ).then((r) => r.json());

    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
