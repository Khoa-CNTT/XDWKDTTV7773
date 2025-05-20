/* eslint-disable @typescript-eslint/no-explicit-any */
/* app/mua-sam/[category]/CategoryPageClient.tsx */
"use client";

import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./Category.module.css";
import ProductCard from "../../components/ProductCard";
import HeaderWrapper from "../../components/HeaderWrapper";
import { flatProducts, Category } from "../data/products"; // Import Category
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/navigation";
import SocialIcons from "../../components/SocialIcons";

export default function CategoryPageClient({
  params,
  searchParams,
  messages,
}: {
  params: { category: Category; locale: string; subCategory?: string };
  searchParams: { query?: string };
  messages: any;
}) {
  const t = useTranslations("MuaSam");
  const tHome = useTranslations("Home");
  const router = useRouter();

  const category = params.category;
  const locale = params.locale;
  const query = searchParams.query?.toLowerCase() || "";

  // Lọc sản phẩm theo category và query
  const filteredProducts = flatProducts.filter((product) => {
    const matchesCategory = product.category === category;
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query)
      : true;
    return matchesCategory && matchesQuery;
  });

  // Filter giá
  const [priceFilter, setPriceFilter] = useState("");
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceFilter(e.target.value);
  };
  const priceFilteredProducts = filteredProducts.filter((product) => {
    const price = Number(product.price);
    if (priceFilter === "over-1m") return price > 1000000;
    if (priceFilter === "under-1m") return price <= 1000000;
    if (priceFilter === "over-10m") return price > 10000000;
    if (priceFilter === "under-10m") return price <= 10000000;
    return true;
  });

  return (
    <div className={styles.container}>
      <HeaderWrapper locale={locale} messages={messages} />

      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          {tHome("home")}
        </Link>
        <span>{" > "}</span>
        <Link href="/mua-sam" className={styles.breadcrumbLink}>
          {tHome("shop")}
        </Link>
        <span>{" > "}</span>
        <Link href={`/mua-sam/${category}`} className={styles.breadcrumbLink}>
          {category.toUpperCase()}
        </Link>
      </nav>

      <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <select value={priceFilter} onChange={handleFilterChange} style={{ padding: "8px 16px", borderRadius: 6 }}>
          <option value="">Tất cả sản phẩm</option>
          <option value="over-1m">Sản phẩm trên 1 triệu</option>
          <option value="under-1m">Sản phẩm dưới 1 triệu</option>
          <option value="over-10m">Sản phẩm trên 10 triệu</option>
          <option value="under-10m">Sản phẩm dưới 10 triệu</option>
        </select>
      </div>

      {query && (
        <p className={styles.searchInfo}>
          {t("searchResults")} "{query}"
        </p>
      )}

      <div className={styles.productList}>
        {priceFilteredProducts.length > 0 ? (
          <>
            {priceFilteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/mua-sam/${category}/${product.subCategory}/${product.id}`}
                className={styles.productLink}
              >
                <ProductCard product={product} category={category} />
              </Link>
            ))}
            {/* Thêm placeholder để lấp đầy hàng cuối */}
            {(() => {
              const colCount = 4;
              const remainder = priceFilteredProducts.length % colCount;
              const placeholders = remainder === 0 ? 0 : colCount - remainder;
              return Array.from({ length: placeholders }).map((_, idx) => (
                <div key={`placeholder-${idx}`} className={styles.productLink} style={{ visibility: "hidden" }}>
                  <div className={styles.productCard} />
                </div>
              ));
            })()}
          </>
        ) : (
          <p className={styles.noProducts}>{t("noProducts")}</p>
        )}
      </div>

      {/* Container cố định cho các biểu tượng mạng xã hội */}
      <SocialIcons />
    </div>
  );
}