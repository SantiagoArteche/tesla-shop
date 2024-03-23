"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionId } from "@/actions/payments/set-transaction-id";
import { paypalCheckPayment } from "@/actions/payments/paypal-payment";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  orderId: string;
  amount: number;
  isPaid: boolean;
}

export const PayPalButton = ({ amount, orderId, isPaid }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = amount.toFixed(2);
  if (isPending && !isPaid) {
    return (
      <div className="animate-pulse">
        <div className="h-11 bg-gray-300 rounded mb-4" />
        <div className="h-11 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
          custom_id: orderId,
        },
      ],
    });

    const { ok } = await setTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error("Couldn't update order");
    }

    return transactionId;
  };

  const onApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    const details = await actions.order?.capture();

    if (!details) return;

    await paypalCheckPayment(details.id as string);
  };

  return !isPaid ? (
    <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
  ) : (
    <div
      className={
        "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 bg-green-700"
      }
    >
      <IoCardOutline size={30} />
      <span className="mx-2">Paid</span>
    </div>
  );
};
