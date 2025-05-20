/* app/components/Sidebar.tsx */
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl"; // Xóa useLocale vì không cần nữa
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCancelLogout = () => setShowLogoutModal(false);
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.greeting}>
        {t("greeting")} <br />
        {isAuthenticated && user?.name ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <i className="bi bi-person-circle" style={{ fontSize: 32, color: '#333', borderRadius: '50%', background: '#f5f5f5', padding: 2, marginRight: 6 }}></i>
            {user.name}
          </span>
        ) : (
          t("notLoggedIn")
        )}
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
          href="/profile/lien-he"
          className={`${styles.navItem} ${isActive("/profile/lien-he") ? styles.active : ""}`}
        >
          <i className="bi bi-envelope"></i> {t("contact")}
        </Link>
        <button onClick={handleLogoutClick} className={styles.navItem}>
          <i className="bi bi-box-arrow-right"></i> {t("logout")}
        </button>
      </nav>
      {showLogoutModal && (
        <div className={styles.overlayLogout}>
          <div className={styles.modalLogout}>
            <button className={styles.closeBtn} onClick={handleCancelLogout}>×</button>
            <h2 className={styles.modalTitle}>Đăng xuất</h2>
            <p className={styles.modalMessage}>Bạn có muốn đăng xuất không?</p>
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={handleCancelLogout}>Không</button>
              <button className={styles.confirmBtn} onClick={handleConfirmLogout}>Có</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;