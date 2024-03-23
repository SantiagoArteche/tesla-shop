import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions";
import { Category } from "@/interfaces/category.interface";

interface Props {
  params: {
    slug: string;
  };
}

export default async function AdminProductSlug({ params }: Props) {
  const { slug } = params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product) redirect("/admin/products");

  const title = slug === "new" ? "New Product" : "Edit Product";
  return (
    <>
      <Title title={title} />
      <ProductForm product={product} categories={categories as Category[]} />
    </>
  );
}
