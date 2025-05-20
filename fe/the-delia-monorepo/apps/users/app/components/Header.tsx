/* eslint-disable @typescript-eslint/no-unused-vars */
/* app/components/Header.tsx */
"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./Header.module.css";
import { useCart } from "../context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { useTranslations, useLocale } from "next-intl";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { flatProducts, Product } from "../mua-sam/data/products";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown điều hướng "MUA SẮM"
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { cartItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const tHeader = useTranslations("Header");
  const locale = useLocale();
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = useMemo(
    () => cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) ?? 0,
    [cartItems]
  );

  const isMuaSamActive = pathname.startsWith("/mua-sam");

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

  // Lấy subCategory thực tế từ dữ liệu sản phẩm 
  const getSubCategories = (cat: string) => {
    const productsOfCat = flatProducts.filter((p: Product) => p.category === cat);
    const uniqueSubs = Array.from(new Set(productsOfCat.map((p: Product) => p.subCategory)));
    return uniqueSubs.map((sub) => ({
      name: subCategoryDisplayNames[sub] || sub,
      slug: sub
    }));
  };

  // Dữ liệu danh mục đồng bộ thực tế
  const categories = useMemo(
    () => ({
      [tHeader("men")]: getSubCategories("nam"),
      [tHeader("newArrivals")]: getSubCategories("hang-moi"),
      [tHeader("women")]: getSubCategories("nu"),
    }),
    [getSubCategories, tHeader]
  );

  // Xử lý mở AuthModal với tab cụ thể
  const openAuthModal = useCallback((mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  // Xử lý click vào giỏ hàng
  const handleCartClick = useCallback(() => {
    router.push("/cart");
  }, [router]);

  // Xử lý click vào avatar dựa vào trạng thái đăng nhập
  const handleAvatarClick = useCallback(() => {
    if (isAuthenticated) {
      // Nếu đã đăng nhập, chuyển hướng đến trang profile
      router.push("/profile/my-order");
    } else {
      // Nếu chưa đăng nhập, mở modal đăng nhập
      openAuthModal("login");
    }
  }, [isAuthenticated, router, openAuthModal]);

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
            THE DELIA COUTURE{" "}
          </Link>
        </div>

        {/* Actions (Profile, Cart, Language) */}
        <div className={styles.actions}>
          <button
            onClick={handleAvatarClick}
            className={styles.actionButton}
            aria-label={isAuthenticated ? tHeader("profile") : tHeader("login")}
          >
            {isAuthenticated ? (
              <div className={styles.userAvatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            ) : (
              <FaUser size={33} className={styles.avatar} />
            )}
          </button>
          <div className={styles.cartWrapper}>
            <button
              onClick={handleCartClick}
              className={styles.actionButton}
              aria-label={tHeader("cart")}
            >
              <i className={`bi bi-cart ${styles.avatar}`}></i>
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
          </div>
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
            href="/SizeGuide"
            className={`${styles.navLink} ${
              pathname === "/SizeGuide" ? styles.activeLink : ""
            }`}
            aria-current={pathname === "/SizeGuide" ? "page" : undefined}
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
                        href={`/mua-sam/nam/${item.slug}`}
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
                        href={`/mua-sam/hang-moi/${item.slug}`}
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
                        href={`/mua-sam/nu/${item.slug}`}
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
        onForgotPassword={() => {
          setIsAuthModalOpen(false);
          setIsForgotModalOpen(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onBackToLogin={() => {
          setIsForgotModalOpen(false);
          setIsAuthModalOpen(true);
          setAuthMode("login");
        }}
      />
    </header>
  );
}