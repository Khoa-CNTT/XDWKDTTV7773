/* app/components/Sidebar.tsx */
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn hiện tại để xác định mục active
  const [userName, setUserName] = useState("");

  // Lấy tên người dùng từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user?.name || "User");
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserName("User");
      }
    } else {
      setUserName("");
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Hàm kiểm tra mục active
  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.greeting}>
        {t("greeting")} <br />
        {userName || t("notLoggedIn")}
      </h2>
      <nav className={styles.nav}>
        <Link
          href="/profile/my-order"
          className={`${styles.navItem} ${isActive("/profile/my-order") ? styles.active : ""}`}
        >
          <i className="bi bi-box-seam"></i> {t("myOrders")}
        </Link>
        <Link
          href="/profile/my-info"
          className={`${styles.navItem} ${isActive("/profile/my-info") ? styles.active : ""}`}
        >
          <i className="bi bi-person"></i> {t("myInfo")}
        </Link>
        <Link
          href="/profile/favorites"
          className={`${styles.navItem} ${isActive("/profile/favorites") ? styles.active : ""}`}
        >
          <i className="bi bi-heart"></i> {t("favorites")}
        </Link>
        <Link
          href="/lien-he"
          className={`${styles.navItem} ${isActive("/lien-he") ? styles.active : ""}`}
        >
          <i className="bi bi-envelope"></i> {t("contact")}
        </Link>
        <button onClick={handleLogout} className={styles.navItem}>
          <i className="bi bi-box-arrow-right"></i> {t("logout")}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;