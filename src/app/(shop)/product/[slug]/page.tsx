export const revalidate = 604800;

import { getProductBySlug } from "@/actions";
import { ProductSlideshow, ProductSlideshowMobile } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StockLabel } from "../../../../components/product/stock-label/StockLabel";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  return {
    title: `${product?.title}` ?? "Product not found",
    description: "Specific product" ?? "",
    openGraph: {
      title: `${product?.title}` ?? "Product not found",
      description: "Specific product" ?? "",
      images: [`/products/${product?.images[2]}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">
        <ProductSlideshowMobile
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>
      <div className="col-span-1 px-5 ">
        <StockLabel slug={product.slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        <p className=" mb-5 font-bold text-xl">${product.price}</p>
        <AddToCart product={product} />
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
