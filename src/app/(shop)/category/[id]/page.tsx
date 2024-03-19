import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces/product.interface";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;
  const filterProducts = initialData.products.filter(
    (product) => product.gender === id
  );

  const validCategories: Category[] = ["men", "women", "kid", "unisex"];

  if (!validCategories.includes(id)) {
    return notFound();
  }

  return (
    <>
      <Title
        title={id}
        className="mb-2"
        subtitle={`${id[0].toUpperCase()}${id.slice(1, id.length)} articles`}
      />
      <ProductGrid products={filterProducts} />
    </>
  );
}
