"use client";

import { QuantitySelector } from "@/components";
import { ProductImage } from "@/components/product/product-image/ProductImage";
import { CartProduct as CartProd } from "@/interfaces/product.interface";
import { useCartStore } from "@/store";

import Link from "next/link";

interface Props {
  product: CartProd;
  inStock?: number;
}

export default function CartProduct({ product, inStock }: Props) {
  const { updateProductQuantity, removeProductFromCart } = useCartStore(
    (state) => state
  );

  return (
    <div key={product.slug} className="flex mb-5">
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
          <p>{product.size} </p> - <p> {product.title}</p>
        </Link>
        <p>${product.price}</p>
        <QuantitySelector
          quantity={product.quantity}
          handleQuantity={(quant) => updateProductQuantity(product, quant)}
          stock={inStock}
        />
        <button
          className="underline mt-3"
          onClick={() => removeProductFromCart(product)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
