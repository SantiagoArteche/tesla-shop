import { Title } from "@/components";

import { Metadata } from "next";

import Link from "next/link";
import { ProductsCheckout } from "./ui/ProductsCheckout";
import { PlaceOrder } from "./ui/PlaceOrder";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Checkout" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="flex flex-col mt-5">
            <span className="text-xl">Adjust elements</span>
            <Link href="/cart" className="underline mb-5">
              Edit cart
            </Link>

            <ProductsCheckout />
          </div>
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}
