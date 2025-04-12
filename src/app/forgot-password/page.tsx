"use client";
import styles from "./forgot-password.module.css";

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h2 className={styles.title}>Quên Mật Khẩu</h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className={styles.input}
        />
        <input type="email" placeholder="Email" className={styles.input} />
        <input type="text" placeholder="Mã xác nhận" className={styles.input} />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          className={styles.input}
        />
        <div className={styles.options}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              id="show-password"
            />
            <label htmlFor="show-password" className={styles.checkboxLabel}>
              Hiển thị mật khẩu
            </label>
          </div>
        </div>
        <button className={styles.button}>Lấy lại tài khoản</button>
        <p className={styles.loginLink}>
          <a href="/login">Quay Lại Đăng Nhập</a>
        </p>
      </div>
    </div>
  );
}
