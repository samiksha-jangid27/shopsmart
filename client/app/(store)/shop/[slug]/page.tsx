import ShopPage from "../page";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ShopPage searchParams={Promise.resolve({ category: slug })} />;
}
