/* app/mua-sam/ProductCardClient.tsx */
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import HeaderWrapper from "../components/HeaderWrapper";
import ProductCard from "../components/ProductCard";
import styles from "./ProductDetail.module.css";
import { Product, products, Category } from "./data/products";
import { Messages } from "next-intl";
import FloatingIcons from "../components/FloatingIcons";

function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export default async function ShopPageClient({
  searchParams,
  params: { locale },
  messages,
}: {
  locale: string;
  messages: Messages;
  searchParams: { query?: string };
  params: { locale: string };
}) {
  const t = await getTranslations({ namespace: "MuaSam", locale }).catch(() => () => "");
  const tHome = await getTranslations({ namespace: "Home", locale }).catch(() => () => "");

  const query = searchParams.query || "";
  const normalizedQuery = removeAccents(query);

  const allProducts: Product[] = Object.values(products).flat();
  const filteredProducts = normalizedQuery
    ? allProducts.filter((product) => removeAccents(product.name).includes(normalizedQuery))
    : [];

  const categories: { name: string; slug: Category }[] = [
    { name: t("categories.men"), slug: "nam" },
    { name: t("categories.women"), slug: "nu" },
    { name: t("categories.newArrivals"), slug: "hang-moi" },
  ];

  return (
    <div className={styles.container}>
      <HeaderWrapper messages={messages} locale={locale} />

      {normalizedQuery ? (
        <>
          <p className={styles.searchInfo}>
            {t("searchResults")} &quot;{query}&quot;
          </p>
          {filteredProducts.length > 0 ? (
            <div className={styles.productList}>
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                  style={{ display: "block", position: "relative", zIndex: 1 }}
                >
                  <ProductCard
                    product={product}
                    category={product.category}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className={styles.noProducts}>{t("noProducts")}</p>
          )}
        </>
      ) : (
        <>
          {categories.map((category) => {
            const categoryItems = products[category.slug] || [];
            return (
              categoryItems.length > 0 && (
                <div key={category.slug} className={styles.categorySection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{category.name}</h2>
                    <Link
                      href={`/mua-sam/${category.slug}`}
                      className={styles.viewMoreLink}
                    >
                      {tHome("viewMore")} ❯
                    </Link>
                  </div>
                  <div className={styles.productList}>
                    {categoryItems.slice(0, 4).map((product: Product) => (
                      <Link
                        key={product.id}
                        href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                        style={{ display: "block", position: "relative", zIndex: 1 }}
                      >
                        <ProductCard
                          product={product}
                          category={category.slug}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </>
      )}
      <FloatingIcons />
    </div>
  );
}