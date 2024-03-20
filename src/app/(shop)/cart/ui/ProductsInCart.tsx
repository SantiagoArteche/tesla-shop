"use client";
import CartProduct from "@/components/cart/cart-product/CartProduct";
import { useCartStore } from "@/store";
import React, { useEffect, useState } from "react";

export const ProductsInCart = () => {
  const { cart } = useCartStore((state) => state);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {cart.map((product) => (
        <CartProduct
          key={`${product.id}-${product.size}`}
          product={product}
          {...product}
        />
      ))}
    </>
  );
};
