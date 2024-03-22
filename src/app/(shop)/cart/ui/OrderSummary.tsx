"use client";

import { useCartStore } from "@/store";
import { useEffect, useState } from "react";
import { currencyFormat } from "../../../../utils/currencyFormat";

export const OrderSummary = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInfo()
  );

  return !loaded ? (
    <h1>Cargando...</h1>
  ) : (
    <div className="grid grid-cols-2">
      <span>No. Product</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 article" : `${itemsInCart} articles`}{" "}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Sales Tax (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="text-3xl mt-3">Total:</span>
      <span className="text-right text-3xl mt-3">{currencyFormat(total)}</span>
    </div>
  );
};
