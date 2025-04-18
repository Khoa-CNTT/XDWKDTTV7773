// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state để theo dõi checkbox

  const handleLogin = () => {
    // Kiểm tra thông tin đăng nhập (có thể gọi API backend ở đây)
    if (email === "user@gmail.com" && password === "password123") {
      // Lưu token vào localStorage khi đăng nhập thành công
      const token = "fake-jwt-token"; // Đây là token giả, cần thay bằng token thật khi đăng nhập thành công
      localStorage.setItem("token", token);

      // Điều hướng tới trang Dashboard
      router.push("/dashboard");
    } else {
      alert("Thông tin đăng nhập không chính xác!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Đăng Nhập</h2>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"} // Thay đổi type dựa trên trạng thái showPassword
          placeholder="Mật khẩu"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.options}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              id="show-password"
              checked={showPassword} // Điều khiển trạng thái checkbox
              onChange={() => setShowPassword(!showPassword)} // Đổi trạng thái khi click
            />
            <label htmlFor="show-password" className={styles.checkboxLabel}>
              Hiển thị mật khẩu
            </label>
          </div>
        </div>
        <button className={styles.button} onClick={handleLogin}>
          ĐĂNG NHẬP
        </button>
        <p className={styles.forgot}>
          <a href="/forgot-password">Quên mật khẩu?</a>
        </p>
      </div>
    </div>
  );
}
