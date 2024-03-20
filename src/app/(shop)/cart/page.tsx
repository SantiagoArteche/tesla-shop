import { QuantitySelector, Title } from "@/components";

import { initialData } from "@/seed/seed";
import { useCartStore } from "@/store";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ProductsInCart } from "./ui/ProductsInCart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Cart with products",
};

export default function CartPage() {
  // redirect("/empty");

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Cart" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Add more items</span>
            <Link href="/" className="underline mb-5">
              Continua comprando
            </Link>

            <ProductsInCart />
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Order summary</h2>
            <div className="grid grid-cols-2">
              <span>No. Product</span>
              <span className="text-right">3 articles</span>
              <span>Subtotal</span>
              <span className="text-right">$ 100</span>
              <span>Sales Tax</span>
              <span className="text-right">15%</span>
              <span className="text-3xl mt-3">Total:</span>
              <span className="text-right text-3xl mt-3">$ 100</span>
            </div>
            <div className="mt-5 mb-2 w-full">
              <Link
                href="/checkout/address"
                className="flex btn-primary justify-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
