/* app/mua-sam/page.tsx */
import { getMessages } from "next-intl/server";
import ProductCardClient from "./ProductCardClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import { products } from "./data/products";

export default async function MuaSamPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { query?: string };
}) {
  const locale = params?.locale || "vi";
  const messages = await getMessages().catch(() => ({}));
  const allProducts = Object.values(products).flat();

  return (
    <ProductCardClient
      locale={locale}
      messages={messages}
      searchParams={searchParams}
      params={params}
    />
  );
}