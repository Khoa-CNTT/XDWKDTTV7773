"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../login/Login.module.css";

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Vui lòng nhập mã xác thực.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Kiểm tra OTP hợp lệ (ở đây chúng ta chỉ điều hướng, không gọi API vì xác minh OTP sẽ được làm ở bước đổi mật khẩu)
      // Trong ứng dụng thực tế, bạn có thể gọi API để xác minh OTP ngay tại bước này
      
      // Chuyển hướng đến trang đặt lại mật khẩu với email và OTP
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
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
      <h2 style={{ textAlign: "center", marginBottom: 8 }}>Xác thực OTP</h2>
      <p style={{ textAlign: "center", marginBottom: 24, color: '#666' }}>
        Vui lòng nhập mã xác thực 6 số đã được gửi đến email {email}.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="otp-code">* Mã xác thực OTP</label>
          <input
            id="otp-code"
            type="text"
            placeholder="Nhập mã OTP 6 số"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.input}
            disabled={loading}
            maxLength={6}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Đang xử lý..." : "XÁC NHẬN"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href={`/forgot-password`} className={styles.forgotPassword}>
          Yêu cầu mã OTP mới
        </Link>
        <Link href="/auth/login" className={styles.forgotPassword}>
Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}