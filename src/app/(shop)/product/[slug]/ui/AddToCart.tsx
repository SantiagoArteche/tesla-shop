"use client";
import { SizeSelector, QuantitySelector } from "@/components";
import { CartProduct, Product, Size } from "@/interfaces/product.interface";
import { useCartStore } from "@/store";

import React, { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const { addProductToCart } = useCartStore((state) => state);
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const handleSize = (size: Size) => {
    setSize(size);
  };

  const handleQuantity = (quant: number) => {
    setQuantity(quant);
  };

  const addToCart = () => {
    setPosted(true);
    if (!size) return;

    const cartProduct: CartProduct = {
      quantity,
      size,
      ...product,
      image: product.images[0],
    };

    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };
  return (
    <>
      {!size && posted && (
        <div className="flex items-center gap-2">
          <IoWarningOutline className="text-red-700" size={20} />
          <span className="text-red-700">Must select a size!</span>
        </div>
      )}

      <SizeSelector
        availableSizes={product.sizes}
        selectedSize={size}
        handleSize={handleSize}
      />
      <QuantitySelector
        quantity={quantity}
        stock={product.inStock}
        handleQuantity={handleQuantity}
      />
      <button className="btn-primary my-5" onClick={addToCart}>
        Add to cart
      </button>
    </>
  );
};
