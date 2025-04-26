/* app/profile/my-info/page.tsx */
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./MyInfo.module.css";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

const MyInfoPage = () => {
  const t = useTranslations("Profile");
  const { user } = useAuth(); // Loại bỏ setUser
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserInfo>({
    name: user?.name || "",
    email: user?.email || "",
    phone: (user?.phone as string) || "", // Ép kiểu phone thành string
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Lưu thông tin vào localStorage (tạm thời)
      const updatedUser = { ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Gọi API để cập nhật thông tin người dùng trên server (nếu có)
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user?.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      // Sau khi cập nhật thành công, làm mới session (tùy chọn)
      // Có thể gọi API của next-auth để làm mới session nếu cần
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user info:", error);
      // Hiển thị thông báo lỗi cho người dùng nếu cần
    }
  };

  if (!user) {
    return <div>{t("notLoggedIn")}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("profile")}</h1>
      {isEditing ? (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t("email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>{t("phone")}</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles.actions}>
            <button onClick={handleSave} className={styles.saveButton}>
              {t("save")}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.info}>
          <p>
            <strong>{t("name")}:</strong> {user.name || "N/A"}
          </p>
          <p>
            <strong>{t("email")}:</strong> {user.email || "N/A"}
          </p>
          <p>
            <strong>{t("phone")}:</strong> {(user.phone as string) || "N/A"}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            {t("edit")}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInfoPage;