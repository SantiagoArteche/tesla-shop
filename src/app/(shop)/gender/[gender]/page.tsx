export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";

import { Gender } from "@prisma/client";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const { gender } = params;

  return {
    title: `${gender[0].toUpperCase()}${gender.slice(1, gender.length)}`,
    description: `${gender} products`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender,
    take: 6,
  });

  const validCategories: Gender[] = ["men", "women", "kid", "unisex"];

  if (!validCategories.includes(gender)) {
    return notFound();
  }

  return (
    <>
      <Title
        title={gender}
        className="mb-2"
        subtitle={`${gender[0].toUpperCase()}${gender.slice(
          1,
          gender.length
        )} articles`}
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
