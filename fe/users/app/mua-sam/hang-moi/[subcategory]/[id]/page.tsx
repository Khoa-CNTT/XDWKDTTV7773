import { getMessages, getTranslations } from "next-intl/server";
import HeaderWrapper from "../../../../components/HeaderWrapper";
import Footer from "../../../../components/Footer";
import SocialIcons from "../../../../components/SocialIcons";
import styles from "../../../ProductDetail.module.css";
import Image from "next/image";
import Link from "next/link";

type Subcategory = "dem-troi-sao" | "tam-hon-cua-trai-dat";

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  description?: string;
  material?: string;
  colors?: string[];
  sizes?: string[];
  images?: string[];
};

const products: Record<Subcategory, Product[]> = {
  "dem-troi-sao": [
    {
      id: 5,
      name: "Bộ 2 mảnh thun kim tuyến sang trọng",
      image: "/images/starry-dress-1.jpg",
      price: 4480000,
      description: "Bộ 2 mảnh thun kim tuyến sang trọng, phù hợp cho các bữa tiệc tối hoặc sự kiện đặc biệt.",
      material: "Thun kim tuyến",
      colors: ["Đen ánh kim"],
      sizes: ["S", "M", "L"],
      images: ["/images/starry-dress-1.jpg"],
    },
    {
      id: 6,
      name: "Đầm xẻ vạt vải lụa",
      image: "/images/starry-dress-2.jpg",
      price: 3220000,
      description: "Đầm xẻ vạt vải lụa mềm mại, thiết kế thanh lịch và hiện đại.",
      material: "Vải lụa",
      colors: ["Trắng ngọc trai"],
      sizes: ["S", "M", "L"],
      images: ["/images/starry-dress-2.jpg"],
    },
  ],
  "tam-hon-cua-trai-dat": [
    {
      id: 7,
      name: "Bộ suit 100% vải len nhẹ",
      image: "/images/starry-dress-3.jpg",
      price: 6660000,
      description: "Bộ suit 2 mảnh với chất liệu vải 100% len mềm mại, thiết kế váy cực dài bóng bền và jacket ôm sát cơ thể, kết hợp áo corset bên trong làm tốt lên sự tinh tế và phong cách hiện đại.",
      material: "Vải",
      colors: ["Light Grey", "Dark Grey"],
      sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
      images: [
        "/images/starry-dress-3.jpg",
        "/images/starry-dress-3-side.jpg",
        "/images/starry-dress-3-back.jpg",
        "/images/starry-dress-3-detail.jpg",
      ],
    },
    {
      id: 8,
      name: "Đầm lệch vai vải dập chéo",
      image: "/images/starry-dress-4.jpg",
      price: 2860000,
      description: "Đầm lệch vai vải dập chéo, thiết kế độc đáo và phong cách.",
      material: "Vải dập chéo",
      colors: ["Xanh lá"],
      sizes: ["S", "M", "L"],
      images: ["/images/starry-dress-4.jpg"],
    },
  ],
};

export default async function ProductDetailPage({
  params: { subcategory, id, locale },
}: {
  params: { subcategory: Subcategory; id: string; locale: string };
}) {
  const messages = await getMessages();
  const t = await getTranslations("Product");

  // Tìm sản phẩm
  const productId = parseInt(id, 10);
  let product: Product | undefined;

  const subcategoryData = products[subcategory];
  if (!subcategoryData) {
    return <div>{t("productNotFound")}</div>;
  }

  // eslint-disable-next-line prefer-const
  product = subcategoryData.find((p) => p.id === productId);

  if (!product) {
    return <div>{t("productNotFound")}</div>;
  }

  // Breadcrumb
  const breadcrumb = [
    { label: t("home"), href: "/" },
    { label: t("shop"), href: "/mua-sam" },
    { label: t("newArrivalsTitle"), href: `/mua-sam/hang-moi` },
    { label: subcategory === "dem-troi-sao" ? "Đêm trời sao" : "Tâm hồn của trái đất", href: `/mua-sam/hang-moi/${subcategory}` },
    { label: product.name, href: null },
  ];

  return (
    <div className={styles.container}>
      <HeaderWrapper messages={messages} locale={locale} />
      <main className={styles.main}>
        <nav className={styles.breadcrumb}>
          {breadcrumb.map((item, index) => (
            <span key={index}>
              {item.href ? (
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.breadcrumbCurrent}>{item.label}</span>
              )}
              {index < breadcrumb.length - 1 && " > "}
            </span>
          ))}
        </nav>

        <div className={styles.productDetail}>
          <div className={styles.imagesSection}>
            <div className={styles.thumbnailList}>
              {(product.images || [product.image]).map((img, index) => (
                <div key={index} className={styles.thumbnail}>
                  <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} width={80} height={120} className={styles.thumbnailImage} />
                </div>
              ))}
            </div>
            <div className={styles.mainImageWrapper}>
              <div className={styles.mainImage}>
                <Image src={product.image} alt={product.name} width={500} height={700} className={styles.mainImageContent} />
              </div>
              {(product.images || []).slice(1, 4).map((img, index) => (
                <div key={index} className={`${styles.backgroundImage} ${styles[`backgroundImage${index + 1}`]}`}>
                  <Image src={img} alt={`${product.name} background ${index + 1}`} width={200} height={300} className={styles.backgroundImageContent} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>{product.price.toLocaleString("vi-VN")} đ</p>
            <div className={styles.favorite}>
              <span className={styles.heartIcon}>❤️</span> 9
            </div>

            <div className={styles.productAttribute}>
              <span className={styles.label}>{t("material")}:</span>
              <span>{product.material || "N/A"}</span>
            </div>

            <div className={styles.productAttribute}>
              <span className={styles.label}>{t("color")}:</span>
              <div className={styles.colorOptions}>
                {(product.colors || []).map((color, index) => (
                  <div
                    key={index}
                    className={styles.colorSwatch}
                    style={{
                      backgroundColor:
                        color.toLowerCase() === "đen" ? "#000000" :
                        color.toLowerCase() === "xám đậm" ? "#4a4a4a" :
                        color.toLowerCase() === "xám nhạt" ? "#d3d3d3" :
                        color.toLowerCase() === "trắng" ? "#ffffff" :
                        color.toLowerCase() === "xanh navy" ? "#1a2526" :
                        color.toLowerCase() === "đỏ rượu" ? "#5f0000" :
                        color.toLowerCase() === "trắng ngọc trai" ? "#f0f0f0" :
                        color.toLowerCase() === "đen ánh kim" ? "#1c2526" :
                        color.toLowerCase() === "xanh lá" ? "#2e8b57" :
                        color.toLowerCase() === "hồng" ? "#ff69b4" :
                        color.toLowerCase() === "đỏ" ? "#ff0000" :
                        color.toLowerCase() === "vàng" ? "#ffd700" :
                        color.toLowerCase() === "bạc" ? "#c0c0c0" :
                        color.toLowerCase() === "be" ? "#f5f5dc" :
                        color.toLowerCase() === "xanh dương" ? "#4682b4" :
                        color.toLowerCase() === "hồng phấn" ? "#ffb6c1" :
                        color.toLowerCase() === "vàng ánh kim" ? "#b8860b" :
                        color.toLowerCase() === "tím" ? "#800080" :
                        color.toLowerCase(),
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className={styles.productAttribute}>
              <span className={styles.label}>{t("size")}:</span>
              <div className={styles.sizeOptions}>
                {(product.sizes || []).map((size, index) => (
                  <button key={index} className={styles.sizeButton}>
                    {size}
                  </button>
                ))}
              </div>
              <Link href="#" className={styles.sizeGuideLink}>
                {t("sizeGuide")}
              </Link>
            </div>

            <div className={styles.madeToMeasure}>
              <button className={styles.madeToMeasureButton}>{t("madeToMeasure")}</button>
            </div>

            <div className={styles.quantity}>
              <span className={styles.label}>{t("quantity")}:</span>
              <div className={styles.quantitySelector}>
                <button className={styles.quantityButton}>-</button>
                <input type="number" value="1" min="1" className={styles.quantityInput} readOnly />
                <button className={styles.quantityButton}>+</button>
              </div>
            </div>

            <button className={styles.addToCartButton}>
              <span className={styles.cartIcon}>🛒</span> {t("addToCart")}
            </button>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h2 className={styles.descriptionTitle}>{t("description")}</h2>
          <p className={styles.descriptionContent}>{product.description || "Không có mô tả."}</p>
        </div>
      </main>
      <SocialIcons />
      <Footer />
    </div>
  );
}