"use client";

import { ProductImage } from "@/components/product/product-image/ProductImage";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils/currencyFormat";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsCheckout = () => {
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
        <div
          key={product.slug + product.size}
          className="flex mb-5 items-center"
        >
          <ProductImage
            src={product.image}
            width={155}
            height={155}
            style={{ width: "150px", height: "150px" }}
            alt={product.title}
            className="mr-5 rounded"
          />
          <div>
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline flex gap-1"
            >
              <p>{product.size} </p> -{" "}
              <p>
                {" "}
                {product.title} ({product.quantity})
              </p>
            </Link>
            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
