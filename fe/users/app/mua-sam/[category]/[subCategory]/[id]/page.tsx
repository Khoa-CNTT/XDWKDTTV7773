/* app/mua-sam/[category]/[subCategory]/[id]/page.tsx */
import { getMessages, getTranslations } from "next-intl/server";
import HeaderWrapper from "../../../../components/HeaderWrapper";
import Footer from "../../../../components/Footer";
import SocialIcons from "../../../../components/SocialIcons";
import ProductDetailClient from "./ProductDetailClient";
import { products } from "../../../data/products";
import styles from "./ProductDetail.module.css"; // Đường dẫn đã được sửa

type Category = "nam" | "hang-moi" | "nu" | "su-kien" | "tiec-cuoi" | "hoa-tiet-hoa";

const subCategories: Record<Category, { name: string; slug: string }[]> = {
  nam: [
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
  nu: [
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

export default async function ProductDetailPage({
  params: { category, subCategory, id, locale },
}: {
  params: { category: Category; subCategory: string; id: string; locale: string };
}) {
  const messages = await getMessages();
  const tProduct = await getTranslations("Product");
  const tHome = await getTranslations("Home");

  // Tìm sản phẩm
  const categoryData = products[category];
  if (!categoryData) {
    return <div>{tProduct("productNotFound")}</div>;
  }

  // Kiểm tra subCategory hợp lệ
  const currentCategorySubCategories = subCategories[category] || [];
  const isValidSubCategory = currentCategorySubCategories.some(
    (subCat) => subCat.slug === subCategory
  );
  if (!isValidSubCategory) {
    return <div>{tProduct("subCategoryNotFound")}</div>;
  }

  // Tìm sản phẩm dựa trên category, subCategory và id
  const product = categoryData.find(
    (p) => p.id === id && p.subCategory === subCategory
  );
  if (!product) {
    return <div>{tProduct("productNotFound")}</div>;
  }

  // Tìm tên mục con
  const subCategoryName = currentCategorySubCategories.find(
    (subCat) => subCat.slug === subCategory
  )?.name;

  // Breadcrumb
  const categoryTitles: Record<Category, string> = {
    nam: tHome("mensFashionTitle"),
    "hang-moi": tHome("newArrivalsTitle"),
    nu: tHome("womensFashionTitle"),
    "su-kien": tHome("eventFashionTitle"),
    "tiec-cuoi": tHome("weddingPartyTitle"),
    "hoa-tiet-hoa": tHome("floralPatternsTitle"),
  };

  const breadcrumb = [
    { label: tHome("home"), href: "/" },
    { label: tHome("shop"), href: "/mua-sam" },
    { label: categoryTitles[category], href: `/mua-sam/${category}` },
    { label: subCategoryName || subCategory, href: `/mua-sam/${category}/${subCategory}` },
    { label: product.name, href: null },
  ];

  return (
    <div className={styles.container}>
      <HeaderWrapper messages={messages} locale={locale} />
      <ProductDetailClient product={product} breadcrumb={breadcrumb} />
      <SocialIcons />
      <Footer />
    </div>
  );
}