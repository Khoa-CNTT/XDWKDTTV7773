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
import { flatProducts } from "../data/products";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
  params: { category: string; locale: string };
  searchParams: { query?: string };
  messages: any;
}) {
  const t = useTranslations("MuaSam");
  const tHome = useTranslations("Home");

  const categories = [
    { name: t("categories.men"), slug: "nam" },
    { name: t("categories.women"), slug: "nu" },
    { name: t("categories.wedding"), slug: "tiec-cuoi" },
    { name: t("categories.newArrivals"), slug: "hang-moi" },
    { name: t("categories.events"), slug: "su-kien" },
    { name: t("categories.floralPatterns"), slug: "hoa-tiet-hoa" },
  ];

  // Dữ liệu các mục con cho từng danh mục
  const subCategories: SubCategoriesMap = {
    "nam": [
      { name: "TUXEDO & DA HỘI", slug: "tuxedo-da-hoi" },
      { name: "THƯỜNG PHỤC", slug: "thuong-phuc" },
      { name: "ÂU PHỤC CÔNG SỞ", slug: "au-phuc-cong-so" },
      { name: "Áo Vest/Áo Blazer", slug: "ao-vest-ao-blazer" },
      { name: "Áo Khoác", slug: "ao-khoac" },
      { name: "Áo Chilê", slug: "ao-chile" },
      { name: "Quần Tay/Quần Dài", slug: "quan-tay-quan-dai" },
      { name: "Quần Ngắn", slug: "quan-ngan" },
      { name: "Áo Sơ Mi/Áo Top", slug: "ao-so-mi-ao-top" },
      { name: "Vải Lanh", slug: "vai-lanh" },
      { name: "Vải Cashmere", slug: "vai-cashmere" },
      { name: "Dạ Tiệc", slug: "da-tiec" },
    ],
    "nu": [
      { name: "Đầm", slug: "dam" },
      { name: "Áo Vest/Áo Blazer", slug: "ao-vest-ao-blazer" },
      { name: "Áo Khoác", slug: "ao-khoac" },
      { name: "Áo Chilê", slug: "ao-chile" },
      { name: "Quần/Jumpsuits", slug: "quan-jumpsuits" },
      { name: "Áo Sơ Mi/Blouses", slug: "ao-so-mi-blouses" },
      { name: "Váy/Quần Ngắn", slug: "vay-quan-ngan" },
      { name: "Vải Lanh", slug: "vai-lanh" },
      { name: "Vải Cashmere", slug: "vai-cashmere" },
      { name: "Dạ Tiệc", slug: "da-tiec" },
    ],
    "tiec-cuoi": [
      { name: "Cô Dâu", slug: "co-dau" },
      { name: "Chú Rể", slug: "chu-re" },
    ],
    "hang-moi": [
      { name: "ĐÊM TRỜI SAO", slug: "dem-troi-sao" },
      { name: "TÂM HỒN CỦA TRÁI ĐẤT", slug: "tam-hon-cua-trai-dat" },
      { name: "PHONG CÁCH RIVIERA", slug: "phong-cach-riviera" },
      { name: "ĐẲNG CẤP PORTOFINO", slug: "dang-cap-portofino" },
      { name: "MÙA HÈ BẬT TÂN", slug: "mua-he-bat-tan" },
      { name: "QUÝ ÔNG HIỆN ĐẠI", slug: "quy-ong-hien-dai" },
    ],
    "su-kien": [
      { name: "FASHION SHOW 2024 - The Edge of Elegance", slug: "fashion-show-2024" },
    ],
    "hoa-tiet-hoa": [
      { name: "Hoa Cẩm Chướng", slug: "hoa-cam-chuong" },
      { name: "Hoa Mẫu Đơn", slug: "hoa-mau-don" },
      { name: "Hoa Hồng", slug: "hoa-hong" },
      { name: "Hoa Cúc", slug: "hoa-cuc" },
      { name: "Hoa Thược Dược", slug: "hoa-thuoc-duoc" },
    ],
  };

  const category = params.category;
  const locale = params.locale;
  const query = searchParams.query?.toLowerCase() || "";

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
    const matchesQuery = query
      ? product.name.toLowerCase().includes(query)
      : true;
    return matchesCategory && matchesQuery;
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
        <span>{currentCategory?.name}</span>
      </nav>

      <h1 className={styles.title}>{currentCategory?.name}</h1>

      <div className={styles.filterBar}>
        {categories.map((cat) => {
          const subItems = subCategories[cat.slug] || [];
          return (
            <div key={cat.slug} className={styles.filterItemWrapper}>
              <div
                className={`${styles.filterItem} ${
                  cat.slug === category ? styles.active : ""
                }`}
                onClick={() => toggleDropdown(cat.slug)}
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
                      onClick={() => setOpenDropdown(null)} // Đóng dropdown sau khi chọn
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
              <ProductCard key={product.id} product={product} category={category} />
            ))}
          </>
        ) : (
          <p className={styles.noProducts}>{t("noProducts")}</p>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <Image src="/logo-couture.png" alt="Couture Logo" width={120} height={40} />
            <p className={styles.tagline}>{tHome("footerTagline")}</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>{tHome("footerCustomerService")}</h3>
            <ul>
              <li><Link href="/lien-he">{tHome("footerContact")}</Link></li>
              <li><Link href="/faqs">{tHome("footerFAQs")}</Link></li>
              <li><Link href="/dia-chi">{tHome("footerLocations")}</Link></li>
              <li><Link href="/chinh-sach">{tHome("footerPolicies")}</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>{tHome("footerAbout")}</h3>
            <ul>
              <li><Link href="/khach-hang">{tHome("footerClients")}</Link></li>
              <li><Link href="/chuyen-mon">{tHome("footerExpertise")}</Link></li>
              <li><Link href="/bao-chi">{tHome("footerPress")}</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>{tHome("footerHighlights")}</h3>
            <ul>
              <li><Link href="/ky-niem">{tHome("footerMilestones")}</Link></li>
              <li><Link href="/earth-essence">{tHome("footerEarthEssence")}</Link></li>
              <li><Link href="/simplicity">{tHome("footerSimplicity")}</Link></li>
              <li><Link href="/fashion-show">{tHome("footerFashionShow")}</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerSocial}>
          <h3>{tHome("footerCommunity")}</h3>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 The delia couture ALL RIGHT RESERVED. Developed by PNL.</p>
        </div>
      </footer>

      {/* Container cố định cho các biểu tượng mạng xã hội */}
      <div className={styles.socialIconsFixed}>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialIcon} ${styles.whatsapp}`}
        >
          <i className="bi bi-whatsapp"></i>
        </a>
        <a
          href="https://instagram.com/yourprofile"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialIcon} ${styles.instagram}`}
        >
          <i className="bi bi-instagram"></i>
        </a>
        <a
          href="/lien-he"
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.socialIcon} ${styles.contact}`}
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </div>
    </div>
  );
}