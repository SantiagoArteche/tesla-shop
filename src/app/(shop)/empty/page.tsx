import { Metadata } from "next";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export const metadata: Metadata = {
  title: "Cart",
  description: "Empty cart",
};

export default function EmptyPage() {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={80} className="mx-5" />
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <Link href="/" className="text-blue-500 mt-2 text-xl">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
