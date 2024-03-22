"use client";

import { useAddressStore, useCartStore } from "@/store";

import { useEffect, useState } from "react";
import { currencyFormat } from "../../../../../utils/currencyFormat";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);

  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInfo()
  );
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-xl p-7 flex flex-col justify-center">
      <h2 className="text-2xl mb-2 font-bold">Delivery address</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>

        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.postalCode}</p>
        <p>{address.phone}</p>
      </div>
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

      <h2 className="text-2xl mb-2">Order summary</h2>
      <div className="grid grid-cols-2">
        <span>No. Product</span>
        <span className="text-right">{itemsInCart}</span>
        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>
        <span>Sales Tax (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>
        <span className="text-3xl mt-3">Total:</span>
        <span className="text-right text-3xl mt-3">
          {currencyFormat(total)}
        </span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <p className="pb-5">
          <span className="text-xs">
            {`When you click "Place Order"`}, you accept ours {""}
            <span className="underline">terms and conditions</span> and{" "}
            <span className="underline">privacy politics</span>
          </span>
        </p>
        <button
          /*href="/orders/123" */ className="flex btn-primary justify-center"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
