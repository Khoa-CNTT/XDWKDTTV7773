'use client';

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";
import HeroSlider from "./HeroSlider";
import ProductCard from "./ProductCard";
import { products } from "../mua-sam/data/products";
import { Product } from "../types/product";

function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export default function HomeContent({
  translations,
}: {
  translations: {
    searchResults: string;
    noResults: string;
    heroTitle: string;
    heroAlt: string;
    newArrivalsTitle: string;
    womenTitle: string;
    menTitle: string;
    viewMore: string;
  };
}) {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") ?? "";
  const normalizedQuery = removeAccents(query);

  const allProducts: Product[] = Object.values(products).flat().map((product) => ({
    ...product,
    price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
  }));

  const filteredProducts = normalizedQuery
    ? allProducts.filter((product) =>
        removeAccents(product.name).includes(normalizedQuery)
      )
    : [];

  const newArrivals = products["hang-moi"] || [];
  const womenProducts = products["nu"] || [];
  const menProducts = products["nam"] || [];

  return (
    <>
      {normalizedQuery ? (
        <main className={styles.main}>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>
                {translations.searchResults}: <strong>{query}</strong>
              </h2>
            </div>
            {filteredProducts.length > 0 ? (
              <div className={styles.productsWrapper}>
                <div className={styles.productsGrid}>
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                      style={{ display: "block", position: "relative", zIndex: 1 }}
                    >
                      <ProductCard product={product as any} category={product.category} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p>{translations.noResults}</p>
            )}
          </section>
        </main>
      ) : (
        <>
          <section className={styles.heroSection}>
            <HeroSlider heroTitle={translations.heroTitle} heroAlt={translations.heroAlt} />
          </section>
          <main className={styles.main}>
            {/* NEW ARRIVALS */}
            <section className={styles.newArrivalsSection}>
              <div className={styles.sectionHeader}>
                <h2>{translations.newArrivalsTitle}</h2>
                <Link href="/mua-sam/hang-moi" className={styles.viewMoreLink}>
                  {translations.viewMore} ❯
                </Link>
              </div>
              <div className={styles.productsWrapper}>
                <div className={styles.productsGrid}>
                  {newArrivals.slice(0, 1).map((product) => (
                    <Link
                      key={product.id}
                      href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                      style={{ display: "block", position: "relative", zIndex: 1 }}
                    >
                      <ProductCard product={product as any} category="hang-moi" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* WOMEN */}
            <section className={styles.newArrivalsSection}>
              <div className={styles.sectionHeader}>
                <h2>{translations.womenTitle}</h2>
                <Link href="/mua-sam/nu" className={styles.viewMoreLink}>
                  {translations.viewMore} ❯
                </Link>
              </div>
              <div className={styles.productsWrapper}>
                <div className={styles.productsGrid}>
                  {womenProducts.slice(0, 1).map((product) => (
                    <Link
                      key={product.id}
                      href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                      style={{ display: "block", position: "relative", zIndex: 1 }}
                    >
                      <ProductCard product={product as any} category="nu" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* MEN */}
            <section className={styles.newArrivalsSection}>
              <div className={styles.sectionHeader}>
                <h2>{translations.menTitle}</h2>
                <Link href="/mua-sam/nam" className={styles.viewMoreLink}>
                  {translations.viewMore} ❯
                </Link>
              </div>
              <div className={styles.productsWrapper}>
                <div className={styles.productsGrid}>
                  {menProducts.slice(0, 1).map((product) => (
                    <Link
                      key={product.id}
                      href={`/mua-sam/${product.category}/${product.subCategory}/${product.id}`}
                      style={{ display: "block", position: "relative", zIndex: 1 }}
                    >
                      <ProductCard product={product as any} category="nam" />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
}
