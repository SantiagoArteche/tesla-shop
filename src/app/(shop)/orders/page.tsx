export const revalidate = 0;

import { getOrdersByUser } from "@/actions/order";
import { Title } from "@/components";
import { Metadata } from "next";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your orders",
};

export default async function OrdersPage() {
  const { ok, orders } = await getOrdersByUser();

  if (!ok) redirect("/auth/login");
  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Nombre completo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Estado
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => {
              return (
                <tr
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  key={order!.id}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {" "}
                    {order!.id.split("-")[0]}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.OrderAddress?.firstName}{" "}
                    {order.OrderAddress?.lastName}
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <IoCardOutline
                      className={`mx-2 ${
                        order.isPaid ? "text-green-800" : "text-red-800"
                      } `}
                    />
                    <span
                      className={`mx-2 ${
                        order.isPaid ? "text-green-800" : "text-red-800"
                      } `}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:underline"
                    >
                      View order
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
