"use server";

import { auth } from "@/auth.config";

import prisma from "@/lib/prisma";
import { Product } from "../../interfaces/product.interface";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export const createUpdateProduct = async (
  formDataImage: FormData,
  formData: Product & {
    tags: string;
    categoryId: string;
  }
) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    return {
      ok: false,
      msg: "Must be admin user",
    };
  }

  formData.slug = formData.slug
    .toString()
    .toLowerCase()
    .replace(/ /g, "-")
    .trim();

  const TagsArray = formData.tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase());

  const { images, id, ...rest } = formData;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;

      if (id) {
        product = await prisma.product.update({
          where: {
            id,
          },
          data: {
            ...rest,
            tags: TagsArray,
            inStock: +rest.inStock,
          },
        });
      } else {
        const { ok } = await findProductBySlug(rest.slug);

        if (!ok) {
          throw new Error("Product exist with this slug");
        }

        product = await prisma.product.create({
          data: {
            ...rest,
            tags: TagsArray,
            inStock: +rest.inStock,
          },
        });
      }

      if (formDataImage.getAll("newImages")) {
        const images = await uploadImages(
          formDataImage.getAll("newImages") as File[]
        );
        if (!images) {
          throw new Error("Can't upload images, making rollback");
        }

        await prisma.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productID: product.id,
          })),
        });
      }
      return {
        product,
      };
    });
    revalidatePath(`/admin/product/${rest.slug}`);
    revalidatePath("/admin/products");
    revalidatePath(`/products/${rest.slug}`);

    return {
      ok: true,
      msg: "Product updated or created",
      product: prismaTx.product,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      msg: "View logs, the product can't update",
    };
  }
};

interface Response {
  ok: boolean;
}

const findProductBySlug = async (slug: string): Promise<Response> => {
  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (product) {
    return { ok: false };
  }

  return { ok: true };
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
