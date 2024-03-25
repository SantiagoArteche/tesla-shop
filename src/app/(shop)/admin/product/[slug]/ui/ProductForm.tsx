"use client";

import { Product, ProductImage, Size } from "@/interfaces/product.interface";
import { Category } from "@/interfaces/category.interface";
import { Gender } from "@prisma/client";
import { useFormik } from "formik";

import { createUpdateProduct } from "@/actions/product/create-update-product";
import * as Yup from "yup";
import { IoInformationOutline } from "react-icons/io5";
import { ProductImage as ProdImg } from "@/components/product/product-image/ProductImage";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteProductImage } from "@/actions/product/delete-product-image";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImage[] };
  categories: Category[];
}

const productSizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: Size[];
  tags: string;
  gender: Gender;
  categoryId?: string;
  ProductImage?: ProductImage[];
  newImages?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const { handleSubmit, handleChange, values, errors, setFieldValue } =
    useFormik<FormInputs>({
      initialValues: product.title
        ? {
            ...(product as Product),

            tags: (product.tags?.join(", ") as string) ?? [],
            sizes: product.sizes ?? [],
            newImages: undefined,
          }
        : {
            title: "",
            slug: "",
            description: "",
            price: 0,
            inStock: 0,
            sizes: [],
            tags: (product.tags?.join(", ") as string) ?? [],
            gender: "" as Gender,
            categoryId: "",
            ProductImage: [],
            newImages: undefined,
          },
      validateOnChange: false,
      onSubmit: async (data) => {
        const formDataImage = new FormData();
        const { ProductImage, newImages, ...rest } = data;

        if (newImages) {
          for (let i = 0; i < newImages.length; i++) {
            formDataImage.append("newImages", newImages[i]);
          }
        }
        const {
          ok,
          msg,
          product: prod,
        } = await createUpdateProduct(formDataImage, {
          ...rest,
          tags: (rest.tags as string[] & string) ?? [],
          id: product.id as string,
          images: ProductImage as ProductImage[] & string[],
          categoryId: rest.categoryId as string,
        });

        if (!ok) {
          Swal.fire("Error", msg, "error");
          return;
        }

        router.replace(`/admin/product/${prod!.slug}`);
      },

      validationSchema: Yup.object({
        title: Yup.string().required("Title is required"),
        slug: Yup.string().required("Slug is required"),
        tags: Yup.string().optional(),
        sizes: Yup.array().required().min(1, "At least 1 size is required"),
        description: Yup.string().optional(),
        price: Yup.number().required("Price is required"),
        gender: Yup.string().required("Gender is required"),
        categoryId: Yup.string().required("Category is required"),
        inStock: Yup.number().required("Stock is required"),
        newImages: Yup.mixed().optional(),
      }),
    });

  const onSizeChanged = (size: Size) => {
    if (!values.sizes.includes(size)) {
      values.sizes = [...values.sizes!, size];
    } else {
      values.sizes = values.sizes.filter((sizes) => sizes !== size);
    }

    setFieldValue("sizes", values.sizes);
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("newImages", event.target.files); // Update images in form state
  };

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
            value={values.title}
          />
          {errors.title && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.title}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="slug"
            value={values.slug}
          />
          {errors.slug && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.slug}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Description</span>
          <textarea
            rows={5}
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="description"
            value={values.description}
          ></textarea>
          {errors.description && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.description}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="price"
            value={values.price}
          />
          {errors.price && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.price}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="tags"
            value={values.tags}
          />
          {errors.tags && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.tags}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="gender"
            value={values.gender}
          >
            <option value="">[Select]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
          {errors.gender && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.gender}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Category</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            onChange={handleChange}
            name="categoryId"
            value={values.categoryId}
          >
            <option value="">[Select]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.categoryId}</p>
            </div>
          )}
        </div>

        <button className="btn-primary w-full" type="submit">
          Save
        </button>
      </div>

      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input
            type="text"
            onChange={handleChange}
            className="p-2 border rounded-md bg-gray-200"
            name="inStock"
            value={values.inStock}
          />
          {errors.inStock && (
            <div className="flex gap-2 my-2">
              <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
              <p className="text-sm text-red-500">{errors.inStock}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span>Sizes</span>
          <div className="flex flex-wrap">
            {productSizes.map((size) => (
              <div
                key={size}
                className={`text-center w-14 h-10 p-2 mr-2 mb-2 border transition-all rounded-md cursor-pointer ${
                  values.sizes.includes(size as Size) &&
                  "bg-blue-500 text-white"
                }`}
                onClick={() => onSizeChanged(size as Size)}
              >
                <span>{size}</span>
              </div>
            ))}
            {errors.sizes && (
              <div className="flex gap-2 my-2">
                <IoInformationOutline className="h-5 w-5 text-white rounded-xl bg-red-500 " />
                <p className="text-sm text-red-500">{errors.sizes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col mb-2">
            <span>Photos</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
              name="newImages"
              onChange={onImageChange}
            />
          </div>

          <div className="grid grid-cols-1  sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image) => (
              <div key={image.id}>
                <ProdImg
                  alt={product.title ?? ""}
                  width={300}
                  height={300}
                  src={image.url}
                />
                <button
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                  className="btn-danger rounded-b-xl w-full"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
