// src/components/Footer.tsx
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>The Delia Couture</h3>
          <p>Địa chỉ: 47 Nguyễn Thị Minh Khai, Hội An, Quảng Nam</p>
          <p>Email: info@thedeliacouture.com</p>
          <p>Hotline: 1900 1234</p>
          <p>Giờ làm việc: 8:00 - 20:00</p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Liên kết nhanh</h3>
          <div className={styles.links}>
            <Link href="/about">Về chúng tôi</Link>
            <Link href="/collections">Bộ sưu tập</Link>
            <Link href="/services">Dịch vụ</Link>
            <Link href="/contact">Liên hệ</Link>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Chính sách</h3>
          <div className={styles.links}>
            <Link href="/privacy">Chính sách bảo mật</Link>
            <Link href="/terms">Điều khoản dịch vụ</Link>
            <Link href="/shipping">Chính sách vận chuyển</Link>
            <Link href="/return">Chính sách đổi trả</Link>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Kết nối với chúng tôi</h3>
          <div className={styles.socialLinks}>
            <a
              href="https://facebook.com/thedeliacouture"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF className={styles.socialIcon} />
            </a>
            <a
              href="https://instagram.com/thedeliacouture"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className={styles.socialIcon} />
            </a>
            <a
              href="https://tiktok.com/@thedeliacouture"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className={styles.socialIcon} />
            </a>
            <a
              href="https://youtube.com/@thedeliacouture"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube className={styles.socialIcon} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} The Delia Couture. All rights reserved.</p>
      </div>
    </footer>
  );
}