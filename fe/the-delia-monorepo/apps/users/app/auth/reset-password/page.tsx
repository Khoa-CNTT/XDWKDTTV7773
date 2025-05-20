"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../login/Login.module.css";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!email || !otp) {
      router.push("/forgot-password");
    }
  }, [email, otp, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra các trường dữ liệu
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Gọi API để đặt lại mật khẩu
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể đặt lại mật khẩu');
      }

      setSuccess("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.");
      
      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authBox}>
      <button
        className={styles.closeButton}
        onClick={() => router.push("/auth/login")}
        aria-label="Đóng"
      >
        ✕
      </button>
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>Đặt lại mật khẩu</h2>
      <p style={{ textAlign: "center", marginBottom: 24, color: '#666' }}>
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="new-password">* Mật khẩu mới</label>
          <input
            id="new-password"
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            disabled={loading || !!success}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirm-password">* Xác nhận mật khẩu</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            disabled={loading || !!success}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p style={{ color: '#2ecc40', textAlign: 'center' }}>{success}</p>}
        <button type="submit" className={styles.submitButton} disabled={loading || !!success}>
          {loading ? "Đang xử lý..." : "ĐẶT LẠI MẬT KHẨU"}
        </button>
      </form>
      {!success && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/auth/login" className={styles.forgotPassword}>
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
