"use client";

import { useAddressStore, useCartStore } from "@/store";

import { useEffect, useState } from "react";
import { currencyFormat } from "../../../../../utils/currencyFormat";
import clsx from "clsx";
import { placeOrder } from "@/actions/order";
import { useRouter } from "next/navigation";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMsg(resp.msg);
      return;
    }

    clearCart();
    router.replace("/orders/" + resp.order!.id);
  };

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
        {errorMsg !== "" && <p className="text-red-500 mb-3">{errorMsg}</p>}
        <button
          /*href="/orders/123" */ className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};
