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

type SubCategory = {
  name: string;
  slug: string;
};

type SubCategoriesMap = {
  [key: string]: SubCategory[] | undefined;
};

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

  const categories = [
    { name: "NAM", slug: "nam" },
    { name: "HÀNG MỚI", slug: "hang-moi" },
    { name: "NỮ", slug: "nu" },
  ];

  // Bảng ánh xạ subCategory sang tên hiển thị đẹp
  const subCategoryDisplayNames: Record<string, string> = {
    "vest-nam": "Vest Nam",
    "gi-le": "Gi-Lê",
    "so-mi": "Sơ Mi",
    "polo": "Polo",
    "quan-tay": "Quần Tây",
    "jeans-nam": "Jeans Nam",
    "vay": "Váy",
    "dam-dao-pho": "Đầm Dạo Phố",
    "ao-dai": "Áo Dài",
    "jeans-nu": "Jeans Nữ",
    "ao-phong": "Áo Phông",
    "quan-short-nam": "Quần Short Nam",
    "quan-short-nu": "Quần Short Nữ",
    "ao-len": "Áo Len",
    "ao-tank": "Áo Tank"
  };

  // Tạo subCategories tự động từ dữ liệu sản phẩm
  const subCategories: SubCategoriesMap = {};
  ["nam", "nu", "hang-moi"].forEach((cat) => {
    const productsOfCat = flatProducts.filter((p) => p.category === cat);
    const uniqueSubs = Array.from(new Set(productsOfCat.map((p) => p.subCategory)));
    subCategories[cat] = uniqueSubs.map((sub) => ({
      name: subCategoryDisplayNames[sub] || sub,
      slug: sub
    }));
  });

  const category = params.category;
  const locale = params.locale;
  const query = searchParams.query?.toLowerCase() || "";
  const subCategoryParam = params.subCategory;

  // Trạng thái để theo dõi danh mục nào đang mở dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (slug: string) => {
    setOpenDropdown(openDropdown === slug ? null : slug);
  };

  if (!categories.some((cat) => cat.slug === category)) {
    notFound();
  }

  const filteredProducts = flatProducts.filter((product) => {
    const matchesCategory = product.category === category;
    const matchesSubCategory = subCategoryParam ? product.subCategory === subCategoryParam : true;
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query)
      : true;
    return matchesCategory && matchesSubCategory && matchesQuery;
  });

  const currentCategory = categories.find((cat) => cat.slug === category);

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
          {currentCategory?.name}
        </Link>
        {subCategoryParam && (
          <>
            <span>{" > "}</span>
            <span>
              {subCategories[category]?.find((s) => s.slug === subCategoryParam)?.name || subCategoryParam}
            </span>
          </>
        )}
      </nav>

      <div className={styles.filterBar}>
        {categories.map((cat) => {
          const subItems = subCategories[cat.slug] || [];
          return (
            <div key={cat.slug} className={styles.filterItemWrapper}>
              <div
                className={`${styles.filterItem} ${
                  cat.slug === category ? styles.active : ""
                }`}
                onClick={() => {
                  if (cat.slug === category) {
                    toggleDropdown(cat.slug);
                  } else {
                    router.push(`/mua-sam/${cat.slug}`);
                  }
                }}
              >
                <span>{cat.name}</span>
                <i
                  className={`bi ${
                    openDropdown === cat.slug ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                ></i>
              </div>
              {subItems.length > 0 && openDropdown === cat.slug && (
                <div className={styles.dropdownMenu}>
                  {subItems.map((subItem) => (
                    <Link
                      key={subItem.slug}
                      href={`/mua-sam/${cat.slug}/${subItem.slug}`}
                      className={styles.dropdownItem}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {query && (
        <p className={styles.searchInfo}>
          {t("searchResults")} {"\""} {query} {"\""}
        </p>
      )}

      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          <>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/mua-sam/${category}/${product.subCategory}/${product.id}`}
                className={styles.productLink}
              >
                <ProductCard product={product} category={category} />
              </Link>
            ))}
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