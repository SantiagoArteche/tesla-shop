import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

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

            {productsInCart.map((product) => (
              <div key={product.slug} className="flex mb-5">
                <Image
                  src={`/products/${product.images[0]}`}
                  width={155}
                  height={155}
                  style={{ width: "100px", height: "100px" }}
                  alt={product.title}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{product.title}</p>
                  <p>$ {product.price} x3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-xl p-7 flex flex-col justify-center">
            <h2 className="text-2xl mb-2 font-bold">Delivery address</h2>
            <div className="mb-10">
              <p className="text-xl">Santiago Arteche</p>
              <p>Sta fe 2859</p>
              <p>Argentina</p>
              <p>Sta Fe</p>
              <p>Rosario</p>
              <p>CP 2020</p>
              <p>3413650110</p>
            </div>
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

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
              <p className="pb-5">
                <span className="text-xs">
                  {`When you click "Place Order"`}, you accept ours {""}
                  <span className="underline">
                    terms and conditions
                  </span> and{" "}
                  <span className="underline">privacy politics</span>
                </span>
              </p>
              <Link
                href="/orders/123"
                className="flex btn-primary justify-center"
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
