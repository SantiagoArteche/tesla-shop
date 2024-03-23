import { getOrderById } from "@/actions/order/get-order-by-id";
import { PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils/currencyFormat";

import clsx from "clsx";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { IoCardOutline } from "react-icons/io5";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ok, order } = await getOrderById(params.id);
  return {
    title: `Order #${order?.id.split("-")[0]}`,
    description: "Specific order",
  };
}

export default async function OrderIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(params.id);

  if (!ok) redirect("/");

  const address = order!.OrderAddress;

  const product = order!.OrderItem;

  return (
    <>
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
          <Title title={`Order #${id.split("-")[0]}`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col mt-5">
              <div
                className={clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    "bg-red-500": !order!.isPaid,
                    "bg-green-700": order!.isPaid,
                  }
                )}
              >
                <IoCardOutline size={30} />
                <span className="mx-2">
                  {" "}
                  {order!.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>

              {product!.map((prod) => (
                <div
                  key={prod.product.slug + prod.size}
                  className="flex mb-5 items-center"
                >
                  <Image
                    src={`/products/${prod.product.ProductImage[0].url}`}
                    width={155}
                    height={155}
                    style={{ width: "150px", height: "150px" }}
                    alt={prod.product.title}
                    className="mr-5 rounded"
                  />
                  <div>
                    <Link
                      href={`/product/${prod.product.slug}`}
                      className="hover:underline flex gap-1"
                    >
                      <p>{prod.size} </p> - <p> {prod.product.title}</p>
                    </Link>
                    <p>
                      {" "}
                      {currencyFormat(prod.product.price)} x {prod.quantity}
                    </p>
                    <p className="font-bold">
                      {currencyFormat(prod.product.price * prod.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-xl p-7 flex flex-col justify-center">
              <h2 className="text-2xl mb-2 font-bold">Delivery address</h2>
              <div className="mb-10">
                <p className="text-xl">
                  {address!.firstName} {address!.lastName}
                </p>
                <p>{address!.address}</p>
                <p>{address!.address2}</p>

                <p>
                  {address!.city}, {address!.countryId}
                </p>
                <p>{address!.postalCode}</p>
                <p>{address!.phone}</p>
              </div>
              <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

              <h2 className="text-2xl mb-2">Order summary</h2>
              <div className="grid grid-cols-2">
                <span>No. Product</span>
                <span className="text-right">{order?.itemsInOrder}</span>
                <span>Subtotal</span>
                <span className="text-right">
                  {currencyFormat(order!.subTotal)}
                </span>
                <span>Sales Tax (15%)</span>
                <span className="text-right">{currencyFormat(order!.tax)}</span>
                <span className="text-3xl mt-3">Total:</span>
                <span className="text-right text-3xl mt-3">
                  {currencyFormat(order!.total)}
                </span>
              </div>
              <div className="mt-5  w-full">
                <PayPalButton
                  amount={order!.total}
                  orderId={order!.id}
                  isPaid={order!.isPaid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
