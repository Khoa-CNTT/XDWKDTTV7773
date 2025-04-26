/* eslint-disable @typescript-eslint/no-unused-vars */
/* app/components/Header.tsx */
"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./Header.module.css";
import { useCart } from "../context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "./AuthModal";
import { useTranslations, useLocale } from "next-intl";
import SearchBar from "./SearchBar";
import Image from "next/image";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown điều hướng "MUA SẮM"
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { cartItems } = useCart();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const tHeader = useTranslations("Header");
  const locale = useLocale();

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = useMemo(
    () => cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) ?? 0,
    [cartItems]
  );

  // Kiểm tra xem trang mua-sam có đang active không
  const isMuaSamActive = pathname.startsWith("/mua-sam");

  // Dữ liệu danh mục
  const categories = useMemo(
    () => ({
      [tHeader("men")]: [
        { name: tHeader("menWedding"), category: "wedding" },
        { name: tHeader("menFloral"), category: "floral" },
        { name: tHeader("menTrendy"), category: "new" },
        { name: tHeader("menFashion"), category: "men" },
        { name: tHeader("menModern"), category: "men" },
      ],
      [tHeader("newArrivals")]: [
        { name: tHeader("newArrivalsStarry"), category: "starry-night" },
        { name: tHeader("newArrivalsVibrant"), category: "starry-night" },
        { name: tHeader("newArrivalsPortofinoDress"), category: "starry-night" },
      ],
      [tHeader("events")]: [
        { name: tHeader("fashionShow2024"), category: "event" },
      ],
      [tHeader("women")]: [
        { name: tHeader("womenDresses"), category: "women" },
        { name: tHeader("womenBlazers"), category: "women" },
        { name: tHeader("womenCoats"), category: "women" },
        { name: tHeader("womenVests"), category: "women" },
        { name: tHeader("womenJumpsuits"), category: "women" },
        { name: tHeader("womenBlouses"), category: "women" },
        { name: tHeader("womenSkirtsShorts"), category: "women" },
        { name: tHeader("womenLinen"), category: "women" },
        { name: tHeader("womenCashmere"), category: "women" },
        { name: tHeader("womenEvening"), category: "women" },
      ],
    }),
    [tHeader]
  );

  // Xử lý mở AuthModal với tab cụ thể
  const openAuthModal = useCallback((mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  // Xử lý click vào giỏ hàng
  const handleCartClick = useCallback(() => {
    router.push("/gio-hang");
  }, [router]);

  // Xử lý click vào avatar để chuyển hướng đến đơn hàng
  const handleAvatarClick = useCallback(() => {
    router.push("/profile/my-order");
  }, [router]);

  // Xử lý điều hướng bàn phím cho dropdown "MUA SẮM"
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsDropdownOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  }, []);

  // Đóng dropdown "MUA SẮM" khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.navItem}`)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Kiểm tra translations
  if (!tHeader("home")) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Header: Translations are not available. Check messages and NextIntlClientProvider setup."
      );
    }
    return <header>Loading...</header>;
  }

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        {/* Thanh tìm kiếm */}
        <SearchBar />

        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" aria-label={tHeader("home")}>
          THE-DELIA <span className={styles.logoHighlight}>-COUTURE</span>
            <span className={styles.leafIcon}></span>
          </Link>
        </div>

        {/* Actions (Profile, Cart, Language) */}
        <div className={styles.actions}>
          {status === "loading" ? (
            <span>{tHeader("loading")}</span>
          ) : (
            <>
              {status === "authenticated" ? (
                <div className={styles.avatarWrapper}>
                  <button
                    onClick={handleAvatarClick}
                    className={styles.actionButton}
                    aria-label={tHeader("myOrders")}
                  >
                    <Image
                      src={session.user?.image || "/default-avatar.png"}
                      alt={session.user?.name || "User"}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal("login")}
                  className={styles.actionButton}
                  aria-label={tHeader("login")}
                >
                  <FaUser />
                </button>
              )}
              <div className={styles.cartWrapper}>
                <button
                  onClick={handleCartClick}
                  className={styles.actionButton}
                  aria-label={tHeader("cart")}
                >
                  <i className="bi bi-cart"></i>
                  {cartItemCount > 0 && (
                    <span className={styles.cartBadge}>{cartItemCount}</span>
                  )}
                </button>
              </div>
              <div className={styles.languageToggle}>
                <Link
                  href={`/${locale === "vi" ? "en" : "vi"}`}
                  className={`${styles.languageOption} ${
                    locale === "vi" ? "" : styles.activeLanguage
                  }`}
                  aria-label={`Switch to ${
                    locale === "vi" ? "English" : "Vietnamese"
                  }`}
                >
                  {locale === "vi" ? "EN" : "VN"}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thanh điều hướng */}
      <nav className={styles.nav}>
        <div className={styles.navWrapper}>
          <Link
            href="/"
            className={`${styles.navLink} ${
              pathname === "/" ? styles.activeLink : ""
            }`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            {tHeader("home")}
          </Link>
          <Link
            href="/may-do"
            className={`${styles.navLink} ${
              pathname === "/may-do" ? styles.activeLink : ""
            }`}
            aria-current={pathname === "/may-do" ? "page" : undefined}
          >
            {tHeader("customTailoring")}
          </Link>
          <div
            className={styles.navItem}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-expanded={isDropdownOpen}
            role="button"
          >
            <Link
              href="/mua-sam"
              className={`${styles.navLink} ${
                isMuaSamActive ? styles.activeLink : ""
              }`}
              aria-current={isMuaSamActive ? "page" : undefined}
            >
              {tHeader("shop")}
            </Link>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownContent}>
                  <div className={styles.categoryColumn}>
                    <h3 className={styles.categoryTitle}>{tHeader("men")}</h3>
                    {categories[tHeader("men")].map((item, index) => (
                      <Link
                        key={index}
                        href={`/mua-sam/nam`}
                        className={styles.categoryLink}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className={styles.categoryColumn}>
                    <h3 className={styles.categoryTitle}>
                      {tHeader("newArrivals")}
                    </h3>
                    {categories[tHeader("newArrivals")].map((item, index) => (
                      <Link
                        key={index}
                        href={`/mua-sam?category=${item.category}`}
                        className={styles.categoryLink}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/mua-sam"
                      className={styles.categoryLink}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {tHeader("viewMore")}
                    </Link>
                  </div>
                  <div className={styles.categoryColumn}>
                    <h3 className={styles.categoryTitle}>{tHeader("events")}</h3>
                    {categories[tHeader("events")].map((item, index) => (
                      <Link
                        key={index}
                        href={`/mua-sam?category=${item.category}`}
                        className={styles.categoryLink}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className={styles.categoryColumn}>
                    <h3 className={styles.categoryTitle}>{tHeader("women")}</h3>
                    {categories[tHeader("women")].map((item, index) => (
                      <Link
                        key={index}
                        href={`/mua-sam/nu`}
                        className={styles.categoryLink}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/faqs"
            className={`${styles.navLink} ${
              pathname === "/faqs" ? styles.activeLink : ""
            }`}
            aria-current={pathname === "/faqs" ? "page" : undefined}
          >
            {tHeader("faqs")}
          </Link>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authMode}
      />
    </header>
  );
}