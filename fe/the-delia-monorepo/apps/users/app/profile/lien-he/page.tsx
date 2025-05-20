/* app/profile/contact/page.tsx */
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Contact.module.css";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaPinterest } from "react-icons/fa";
import SocialIcons from "../../components/SocialIcons";

export default function ContactPage() {
  const t = useTranslations("Profile");

  // Trạng thái cho form liên hệ
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    message: "",
  });

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form (giả lập, có thể tích hợp API sau)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Reset form sau khi gửi
    setFormData({
      email: "",
      fullName: "",
      phone: "",
      message: "",
    });
  };

  return (
    <>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}><i className="bi bi-envelope"></i> {t("contact")}</h1>
        <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <i className="bi bi-telephone"></i>
            <span>Gọi ngay</span>
            <p>+84 0919345227</p>
          </div>
          <div className={styles.infoItem}>
            <i className="bi bi-envelope"></i>
            <div>
              <span>ĐỂ LẠI LỜI NHẮN</span>
              <p>info@thetheliacouture.com</p>
            </div>
          </div>
          <h2 className={styles.sectionTitle}>{t("connectWithUs")}</h2>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className={styles.socialIcon} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className={styles.socialIcon} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok className={styles.socialIcon} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className={styles.socialIcon} />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest className={styles.socialIcon} />
            </a>
          </div>
        </div>
        <div className={styles.contactForm}>
          <h2 className={styles.sectionTitle}>{t("haveAQuestion")}</h2>
          <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
            <div className={styles.inputGroup}>
              <label>{t("email")} <span className={styles.required}>*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="abc@gmail.com" className={styles.input} required />
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>{t("fullName")} <span className={styles.required}>*</span></label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t("fullNamePlaceholder")}
                  className={styles.input} required />
              </div>
              <div className={styles.inputGroup}>
                <label>{t("phone")} <span className={styles.required}>*</span></label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+01(0)-0000000000" className={styles.input} required />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("message")} <span className={styles.required}>*</span></label>
              <textarea name="message" value={formData.message} onChange={handleChange} className={styles.textarea} required />
            </div>
            <button type="submit" className={styles.submitButton}>{t("submitMessage")} <span className={styles.arrow}>➔</span></button>
          </form>
        </div>
        </div>
      </div>
      <SocialIcons />
    </>
  );
}