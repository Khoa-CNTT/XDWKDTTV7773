import { useState } from "react";
import styles from "./AuthModal.module.css";
import { toast } from "react-toastify";

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
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  // Không hiển thị OTP cố định

  if (!isOpen) return null;

  const handleEmailSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập địa chỉ email.");
      setSuccess("");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      // Giả lập gọi API để gửi OTP
      // Trong thực tế, bạn sẽ gọi API backend để gửi OTP qua email
      setTimeout(() => {
        // Không hiển thị OTP cố định
        setSuccess("Mã OTP đã được gửi đến email của bạn.");
        setLoading(false);
        setStep(2); // Chuyển sang bước nhập OTP
      }, 1200);
    } catch (error) {
      setError("Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!otp) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }
    if (otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số.");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      // Giả lập gọi API để xác thực OTP
      // Trong thực tế, bạn sẽ gọi API backend để xác thực OTP
      setTimeout(() => {
        // Giả lập xác thực thành công
        setSuccess("Xác thực OTP thành công.");
        setLoading(false);
        setStep(3); // Chuyển sang bước đặt mật khẩu mới
      }, 1200);
    } catch (error) {
      setError("Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!password) {
      setError("Vui lòng nhập mật khẩu mới.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Giả lập gọi API để đặt lại mật khẩu
      // Trong thực tế, bạn sẽ gọi API backend để đặt lại mật khẩu
      setTimeout(() => {
        toast.success("Đặt lại mật khẩu thành công!");
setLoading(false);
        onClose(); // Đóng modal sau khi hoàn tất
      }, 1200);
    } catch (error) {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
      setLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: // Bước 1: Nhập email
        return (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 8, fontWeight: 700, fontSize: 24, color: '#333' }}>Quên mật khẩu?</h2>
            <p style={{ textAlign: "center", marginBottom: 24, color: '#666', fontSize: 15, fontWeight: 400 }}>
              Vui lòng nhập địa chỉ email bạn đã sử dụng để tạo tài khoản và chúng tôi sẽ gửi cho bạn mã OTP.
            </p>
            <form onSubmit={handleEmailSubmit} className={styles.form} style={{ gap: 18 }}>
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
          </>
        );
      
      case 2: // Bước 2: Nhập OTP
        return (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 8, fontWeight: 700, fontSize: 24, color: '#333' }}>Xác thực OTP</h2>
            <p style={{ textAlign: "center", marginBottom: 24, color: '#666', fontSize: 15, fontWeight: 400 }}>
              Vui lòng nhập mã OTP đã được gửi đến email của bạn.
            </p>
            {/* Đã xóa phần hiển thị OTP cố định */}
            <form onSubmit={handleOtpSubmit} className={styles.form} style={{ gap: 18 }}>
              <div className={styles.inputGroup}>
<label htmlFor="otp" style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 6 }}>
                  <span style={{ color: '#e63946', marginRight: 2 }}>*</span>Mã OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  maxLength={6}
                  style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, color: '#444', fontSize: 15, padding: '12px', marginBottom: 0 }}
                />
              </div>
              {error && <p className={styles.error} style={{ margin: '4px 0 0 0', fontSize: 14 }}>{error}</p>}
              {success && <p style={{ color: '#2ecc40', textAlign: 'center', margin: '4px 0 0 0', fontSize: 14 }}>{success}</p>}
              <button type="submit" className={styles.submitButton} disabled={loading}
                style={{ background: 'linear-gradient(90deg, #ff6f61, #e65b50)', borderRadius: 6, fontWeight: 700, fontSize: 18, letterSpacing: 1, marginTop: 10, color: '#fff', border: 'none' }}>
                {loading ? "Đang xác thực..." : "XÁC THỰC"}
              </button>
              <button 
                type="button" 
                className={styles.secondaryButton} 
                onClick={() => setStep(1)} 
                disabled={loading}
                style={{ marginTop: 8, background: 'transparent', color: '#333', border: '1px solid #ccc', borderRadius: 6, padding: '10px', fontSize: 15, fontWeight: 500 }}
              >
                Quay lại
              </button>
            </form>
          </>
        );
      
      case 3: // Bước 3: Đặt mật khẩu mới
        return (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 8, fontWeight: 700, fontSize: 24, color: '#333' }}>Đặt mật khẩu mới</h2>
            <p style={{ textAlign: "center", marginBottom: 24, color: '#666', fontSize: 15, fontWeight: 400 }}>
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
            </p>
            <form onSubmit={handlePasswordSubmit} className={styles.form} style={{ gap: 18 }}>
              <div className={styles.inputGroup}>
                <label htmlFor="new-password" style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 6 }}>
                  <span style={{ color: '#e63946', marginRight: 2 }}>*</span>Mật khẩu mới
                </label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  minLength={6}
style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, color: '#444', fontSize: 15, padding: '12px', marginBottom: 0 }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="confirm-password" style={{ color: '#888', fontWeight: 500, fontSize: 15, marginBottom: 6 }}>
                  <span style={{ color: '#e63946', marginRight: 2 }}>*</span>Xác nhận mật khẩu
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  disabled={loading}
                  minLength={6}
                  style={{ background: '#f7f7f7', border: '1px solid #ddd', borderRadius: 6, color: '#444', fontSize: 15, padding: '12px', marginBottom: 0 }}
                />
              </div>
              {error && <p className={styles.error} style={{ margin: '4px 0 0 0', fontSize: 14 }}>{error}</p>}
              {success && <p style={{ color: '#2ecc40', textAlign: 'center', margin: '4px 0 0 0', fontSize: 14 }}>{success}</p>}
              <button type="submit" className={styles.submitButton} disabled={loading}
                style={{ background: 'linear-gradient(90deg, #ff6f61, #e65b50)', borderRadius: 6, fontWeight: 700, fontSize: 18, letterSpacing: 1, marginTop: 10, color: '#fff', border: 'none' }}>
                {loading ? "Đang xử lý..." : "ĐẶT LẠI MẬT KHẨU"}
              </button>
              <button 
                type="button" 
                className={styles.secondaryButton} 
                onClick={() => setStep(2)} 
                disabled={loading}
                style={{ marginTop: 8, background: 'transparent', color: '#333', border: '1px solid #ccc', borderRadius: 6, padding: '10px', fontSize: 15, fontWeight: 500 }}
              >
                Quay lại
              </button>
            </form>
          </>
        );
      
      default:
        return null;
    }
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
        {renderStep()}
      </div>
    </div>
  );
}
