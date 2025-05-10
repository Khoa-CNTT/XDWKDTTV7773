import { useState } from "react";
import styles from "./AuthModal.module.css";

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose, 
  onBackToLogin 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onBackToLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: { preventDefault: () => void; }) => {
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          style={{ position: 'absolute', top: 18, left: 18, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#ff6f61', fontWeight: 700, padding: 0, lineHeight: 1, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={onBackToLogin}
          aria-label="Quay lại đăng nhập"
        >
          &#8592;
        </button>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 style={{ textAlign: "center", marginBottom: 8, fontWeight: 700, fontSize: 24, color: '#333' }}>Quên mật khẩu?</h2>
        <p style={{ textAlign: "center", marginBottom: 24, color: '#666', fontSize: 15, fontWeight: 400 }}>
          Vui lòng nhập địa chỉ email bạn đã sử dụng để tạo tài khoản và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit} className={styles.form} style={{ gap: 18 }}>
          <div className={styles.inputGroup}>
            <label htmlFor="forgot-email" style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 6 }}>
              <span style={{ color: '#e63946', marginRight: 2 }}>*</span>Địa chỉ Email
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="Địa chỉ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading}
              style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, color: '#444', fontSize: 15, padding: '12px', marginBottom: 0 }}
            />
          </div>
          {error && <p className={styles.error} style={{ margin: '4px 0 0 0', fontSize: 14 }}>{error}</p>}
          {success && <p style={{ color: '#2ecc40', textAlign: 'center', margin: '4px 0 0 0', fontSize: 14 }}>{success}</p>}
          <button type="submit" className={styles.submitButton} disabled={loading}
            style={{ background: 'linear-gradient(90deg, #ff6f61, #e65b50)', borderRadius: 6, fontWeight: 700, fontSize: 18, letterSpacing: 1, marginTop: 10, color: '#fff', border: 'none' }}>
            {loading ? "Đang gửi..." : "GỬI"}
          </button>
        </form>
      </div>
    </div>
  );
} 