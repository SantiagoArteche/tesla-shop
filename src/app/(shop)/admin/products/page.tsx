

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, Title } from "@/components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currencyFormat } from "../../../../utils/currencyFormat";
import { ProductImage } from "@/components/product/product-image/ProductImage";

interface Props {
  searchParams: {
    page?: string;
  };
}
export default async function ProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take: 10,
  });

  if (products.length === 0) {
    redirect("/");
  }
  return (
    <div>
      <Title title="Orders" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/product/new" className="btn-primary">
          New Product
        </Link>
      </div>
      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Image
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Title
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Price
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Gender
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Sizes
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  key={product.id}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/product/${product.slug}`}>
                      <ProductImage
                        src={product.ProductImage[0]?.url}
                        alt={product.title}
                        width={96}
                        height={96}
                        className="rounded w-24 h-24 object-cover"
                      />
                    </Link>
                  </td>
                  <td className="text-sm text-gray-900 px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/product/${product.slug}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </td>
                  <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    {currencyFormat(product.price)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap capitalize">
                    {product.gender}
                  </td>
                  <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    {product.inStock}
                  </td>
                  <td className="text-sm font-bold px-6 py-4 whitespace-nowrap">
                    {product.sizes.join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
