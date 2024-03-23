"use client";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  stock?: number;
  handleQuantity: (quant: number) => void | number;
}

export const QuantitySelector = ({
  quantity,
  stock = 1,
  handleQuantity,
}: Props) => {
  return (
    <div className="flex">
      <button onClick={() => quantity > 1 && handleQuantity(quantity - 1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">
        {quantity}
      </span>
      <button onClick={() => quantity < stock && handleQuantity(quantity + 1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
