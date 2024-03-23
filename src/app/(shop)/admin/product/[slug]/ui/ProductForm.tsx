"use client";

import { Product, Size } from "@/interfaces/product.interface";
import { Category } from "@/interfaces/category.interface";
import { Gender } from "@prisma/client";
import { useFormik } from "formik";

interface Props {
  product: Product;
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: Size[];
  tags: string;
  gender: Gender;
  categoryId: string;
}

interface RefObject {
  click: () => void;
}
export const ProductForm = ({ product, categories }: Props) => {
  const { handleSubmit, handleChange, values, errors, resetForm } =
    useFormik<FormInputs>({
      initialValues: {
        ...product,
        categoryId: "",
        tags: product.tags.join(", "),
        sizes: product.sizes ?? [],
      },
      onSubmit: (values) => {
        console.log(values);
      },
      validateOnChange: false,
    });
  return (
    <form
      onSubmit={handleSubmit}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Title</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="title"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="slug"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Description</span>
          <textarea
            rows={5}
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="description"
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="price"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="tags"
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="gender"
          >
            <option value="">[Select]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Category</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            onChange={handleChange}
            name="categoryId"
          >
            <option value="">[Select]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full" type="submit">
          Save
        </button>
      </div>

      <div className="w-full">
        <div className="flex flex-col">
          <span>Sizes</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                className="flex items-center justify-center w-10 h-10 mr-2 border rounded-md"
              >
                <span>{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Photos</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
