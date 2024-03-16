import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;

  if (id !== "kids") {
    notFound();
  }
  return (
    <div>
      <h1>Cart Page</h1>
    </div>
  );
}
