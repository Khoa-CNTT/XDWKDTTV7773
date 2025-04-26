/* eslint-disable @typescript-eslint/no-unused-vars */
/* app/page.tsx */
import Image from "next/image";
import Link from "next/link";
import { getTranslations, getMessages } from "next-intl/server";
import styles from "./page.module.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FloatingIcons from "./components/FloatingIcons";
import ProductCard from "./components/ProductCard";
import { Product, products } from "./data/products";
import heroImage from "../public/hero-image.jpg";
import Footer from './components/Footer';

function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export const metadata = {
  title: "the delia couture - Thời trang cao cấp",
  description: "Khám phá các bộ sưu tập thời trang độc đáo từ the delia couture.",
};

export default async function HomePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { query?: string };
}) {
  const messages = await getMessages();
  const t = await getTranslations("Home");

  const query = searchParams.query || "";
  const normalizedQuery = removeAccents(query);

  const allProducts: Product[] = Object.values(products).flat();

  const filteredProducts = normalizedQuery
    ? allProducts.filter((product) =>
        removeAccents(product.name).includes(normalizedQuery)
      )
    : [];

  const newArrivals = products["hang-moi"] || [];
  const events = products["su-kien"] || [];
  const womenProducts = products["nu"] || [];
  const menProducts = products["nam"] || [];
  const weddingProducts = products["tiec-cuoi"] || [];
  const floralProducts = products["hoa-tiet-hoa"] || [];

  return (
    <div className={styles.container}>
      <HeaderWrapper messages={messages} locale={locale} />
      {normalizedQuery ? (
        <section className={styles.newArrivalsSection}>
          <div className={styles.sectionHeader}>
            <h2>
              {t("searchResults")}: <strong>{query}</strong>
            </h2>
          </div>
          {filteredProducts.length > 0 ? (
            <div className={styles.productsWrapper}>
              <div className={styles.productsGrid}>
                {filteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={product.category}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>{t("noResults")}</p>
          )}
        </section>
      ) : (
        <>
          <section className={styles.heroSection}>
            <div className={styles.heroWrapper}>
              <Image
                src={heroImage}
                alt={t("heroAlt")}
                fill
                priority
                className={styles.heroImage}
                placeholder="blur"
              />
              <div className={styles.heroText}>
                <h1>{t("heroTitle")}</h1>
              </div>
              <div className={styles.dots}>
                <span className={styles.dotActive}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <button className={styles.arrowLeft}>❮</button>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("newArrivalsTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {newArrivals.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="hang-moi"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("eventsTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {events.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="su-kien"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("womenTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {womenProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="nu"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("menTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {menProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="nam"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("weddingTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {weddingProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="tiec-cuoi"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
          <section className={styles.newArrivalsSection}>
            <div className={styles.sectionHeader}>
              <h2>{t("floralTitle")}</h2>
              <Link href="/mua-sam" className={styles.viewMoreLink}>
                {t("viewMore")} ❯
              </Link>
            </div>
            <div className={styles.productsWrapper}>
              <button className={styles.arrowLeft}>❮</button>
              <div className={styles.productsGrid}>
                {floralProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category="hoa-tiet-hoa"
                  />
                ))}
              </div>
              <button className={styles.arrowRight}>❯</button>
            </div>
          </section>
        </>
      )}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLogo}>
            <Image
              src="/logo-couture.png"
              alt="Couture Logo"
              width={120}
              height={40}
            />
            <p className={styles.tagline}>{t("footerTagline")}</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t("footerCustomerService")}</h3>
            <ul>
              <li>
                <Link href="/lien-he">{t("footerContact")}</Link>
              </li>
              <li>
                <Link href="/faqs">{t("footerFAQs")}</Link>
              </li>
              <li>
                <Link href="/dia-chi">{t("footerLocations")}</Link>
              </li>
              <li>
                <Link href="/chinh-sach">{t("footerPolicies")}</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t("footerAbout")}</h3>
            <ul>
              <li>
                <Link href="/the-delia-couture">{t("footerHistory")}</Link>
              </li>
              <li>
                <Link href="/khach-hang">{t("footerClients")}</Link>
              </li>
              <li>
                <Link href="/chuyen-mon">{t("footerExpertise")}</Link>
              </li>
              <li>
                <Link href="/bao-chi">{t("footerPress")}</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>{t("footerHighlights")}</h3>
            <ul>
              <li>
                <Link href="/ky-niem">{t("footerMilestones")}</Link>
              </li>
              <li>
                <Link href="/earth-essence">{t("footerEarthEssence")}</Link>
              </li>
              <li>
                <Link href="/simplicity">{t("footerSimplicity")}</Link>
              </li>
              <li>
                <Link href="/fashion-show">{t("footerFashionShow")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerSocial}>
          <h3>{t("footerCommunity")}</h3>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 the delia couture ALL RIGHT RESERVED. Developed by PNL.</p>
        </div>
      </footer>
      <FloatingIcons />
    </div>
  );
}