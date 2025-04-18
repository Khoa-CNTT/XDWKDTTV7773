// src/components/AccountModal.tsx
import React, { useState } from "react";
import styles from "./AccountModal.module.css";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false); // State cho checkbox "Hiện mật khẩu"
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Trạng thái thay đổi mật khẩu
  const [oldPassword, setOldPassword] = useState(""); // Mật khẩu cũ
  const [newPassword, setNewPassword] = useState(""); // Mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(""); // Mật khẩu xác nhận

  if (!isOpen) return null; // Nếu không mở modal thì không render

  const handleChangePassword = () => {
    setIsChangingPassword(true); // Chuyển sang trạng thái đổi mật khẩu
  };

  const handleCancelChangePassword = () => {
    setIsChangingPassword(false); // Hủy thay đổi mật khẩu
    setOldPassword(""); // Xóa mật khẩu cũ
    setNewPassword(""); // Xóa mật khẩu mới
    setConfirmPassword(""); // Xóa mật khẩu xác nhận
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          {isChangingPassword ? "ĐỔI MẬT KHẨU" : "THÔNG TIN TÀI KHOẢN"}
        </h2>
        {isChangingPassword ? (
          // Hiển thị form thay đổi mật khẩu
          <div className={styles.formContent}>
            <div className={styles.inputGroup}>
              <label>Mật Khẩu Cũ</label>
              <input
                type={showPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Mật Khẩu Mới</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Xác Nhận Lại Mật Khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận lại mật khẩu mới"
              />
            </div>
            {/* Checkbox chung để hiển thị cả 2 mật khẩu cũ và mới */}
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Hiện Mật Khẩu</label>
            </div>
          </div>
        ) : (
          // Hiển thị thông tin tài khoản
          <div className={styles.formContent}>
            <div className={styles.inputGroup}>
              <label>Họ Tên</label>
              <input type="text" value="Nguyen Nam" readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" value="nguyennam@gmail.com" readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Số Điện Thoại</label>
              <input type="text" value="0987654123" readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label>Mật Khẩu</label>
              <input
                type={showPassword ? "text" : "password"} // Điều chỉnh
                value="123123123"
                readOnly
              />
            </div>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Hiện Mật Khẩu</label>
            </div>
          </div>
        )}
        <div className={styles.buttonGroup}>
          {isChangingPassword ? (
            <>
              <button>Đổi Mật Khẩu</button>
              <button
                className={styles.closeButton}
                onClick={handleCancelChangePassword}
              >
                Hủy
              </button>
            </>
          ) : (
            <button onClick={handleChangePassword}>Đổi Mật Khẩu</button>
          )}
          <button className={styles.closeButton} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
