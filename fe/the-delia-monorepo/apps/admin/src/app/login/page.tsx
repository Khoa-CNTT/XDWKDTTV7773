'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"quan_ly" | "nhan_vien" | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  


  const handleLogin = async () => {
    if (!email || !password || !userType) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn vai trò.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Kiểm tra vai trò đúng với loại người dùng đã chọn
      if (data.user.vai_tro !== userType) {
        throw new Error("Vai trò không hợp lệ với tài khoản này");
      }

      // Lưu thông tin vào localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.user.ho_ten);
      localStorage.setItem("userRole", data.user.vai_tro);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userId", data.user.id); // sau khi đăng nhập thành công


      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Đăng Nhập</h2>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mật khẩu"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className={styles.options}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              disabled={loading}
            />
            Hiển thị mật khẩu
          </label>
        </div>

        <div className={styles.roleOptions}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="userType"
              value="admin"
              checked={userType === "quan_ly"}
              onChange={() => setUserType("quan_ly")}
              disabled={loading}
            />
            Admin
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="userType"
              value="employee"
              checked={userType === "nhan_vien"}
              onChange={() => setUserType("nhan_vien")}
              disabled={loading}
            />
            Nhân viên
          </label>
        </div>

        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          <div className={styles.buttonContent}>
            {loading && <div className={styles.spinner} />}
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </div>
        </button>

        <p className={styles.forgot}>
          <a href="/forgot-password">Quên mật khẩu?</a>
        </p>
      </div>
    </div>
  );
}
