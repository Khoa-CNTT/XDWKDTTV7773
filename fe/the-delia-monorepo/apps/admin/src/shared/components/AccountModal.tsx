"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AccountModal.module.css";
import { FaUser } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdated: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdated,
}) => {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  


  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // ✅ tạo URL preview ảnh mới
  }
};


  const handleSaveInfo = async () => {
    const userId = user.id;
    const hasInfoChange = phone !== user.phone || address !== user.address || avatarFile;
    const hasPasswordChange = oldPassword && newPassword;

    try {
      if (hasInfoChange) {
        const formData = new FormData();
        formData.append("so_dien_thoai", phone);
        formData.append("dia_chi", address);
        if (avatarFile) formData.append("file", avatarFile);

        const infoRes = await fetch(`http://localhost:4000/users/${userId}`, {
          method: "PATCH",
          body: formData,
        });

        if (!infoRes.ok) throw new Error("Lỗi cập nhật thông tin cá nhân");
      }

      if (hasPasswordChange) {
        if (newPassword !== confirmPassword) {
          alert("❌ Mật khẩu mới và xác nhận không khớp.");
          return;
        }

        const res = await fetch(`http://localhost:4000/users/${userId}/password`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        const result = await res.json();
        if (!res.ok) {
          alert(result.message || "❌ Đổi mật khẩu thất bại!");
          return;
        }

        if (!hasInfoChange) {
          alert(result.message || "✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userRole");
          router.push("/login");
          return;
        }
      }

      alert("✅ Cập nhật thành công!");
      onUpdated();
      onClose();
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      alert(" ✅ Cập nhật thành công!\n" + error.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}><h2>THÔNG TIN TÀI KHOẢN</h2></div>

        <div className={styles.body}>
          <div className={styles.leftSide}>
            <div className={styles.avatarContainer}>
              {previewUrl ? (
               <img src={previewUrl} alt="Avatar Preview" className={styles.avatar} />
                ) : user.avatar ? (
               <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                ) : (
             <div className={styles.avatarPlaceholder}>
               <FaUser className={styles.userIcon} />
             </div>
                )}
              <label htmlFor="uploadAvatar" className={styles.uploadAvatarLabel}>
                Đổi ảnh
              </label>
              <input
                type="file"
                id="uploadAvatar"
                className={styles.uploadAvatarInput}
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className={styles.rightSide}>
            <div className={styles.inputGroup}>
              <label>Tên người dùng</label>
              <input type="text" value={user.name} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>Gmail</label>
              <input type="email" value={user.email} disabled />
            </div>

            <div className={styles.inputGroup}>
              <label>Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!showForm}
                placeholder="Chưa có số điện thoại"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Địa chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!showForm}
                placeholder="Chưa có địa chỉ"
              />
            </div>

            {showForm && (
              <>
                <div className={styles.inputGroup}>
                  <label>Mật khẩu cũ</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Mật khẩu mới</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label>Hiện mật khẩu</label>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>Hủy</button>
          {showForm ? (
            <>
              <button className={styles.backButton} onClick={() => setShowForm(false)}>Quay Lại</button>
              <button className={styles.saveButton} onClick={handleSaveInfo}>Lưu</button>
            </>
          ) : (
            <button className={styles.changePasswordButton} onClick={() => setShowForm(true)}>
              Cập Nhật Thông Tin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;