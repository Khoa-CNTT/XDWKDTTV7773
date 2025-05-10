"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth/login/Login.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email.");
      setSuccess("");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setSuccess("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.");
      setLoading(false);
    }, 1200);
  };

  return (
    <div className={styles.authBox}>
      <button
        className={styles.closeButton}
        onClick={() => router.back()}
        aria-label="Đóng"
      >
        ✕
      </button>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>Quên mật khẩu?</h2>
      <p style={{ textAlign: "center", marginBottom: 24, color: '#666' }}>
        Vui lòng nhập địa chỉ email bạn đã sử dụng để tạo tài khoản và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="forgot-email">* Địa chỉ Email</label>
          <input
            id="forgot-email"
            type="email"
            placeholder="Địa chỉ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            disabled={loading}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p style={{ color: '#2ecc40', textAlign: 'center' }}>{success}</p>}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Đang gửi..." : "GỬI"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link href="/auth/login" className={styles.forgotPassword}>
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
} 