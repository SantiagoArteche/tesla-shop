"use client";
import { Size } from "@/interfaces/product.interface";
import clsx from "clsx";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  handleSize: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  handleSize,
}: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Size</h3>

      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            className={clsx("mx-2 hover:underline text-lg", {
              underline: size === selectedSize,
            })}
            onClick={() => handleSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
