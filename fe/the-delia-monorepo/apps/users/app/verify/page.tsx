'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../components/AuthModal.module.css';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Lấy email từ URL khi component load
  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      setError('Không tìm thấy email xác thực.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch("http://localhost:4000/auth/verify-otp", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi xác thực');

      setSuccess('✅ Xác thực thành công! Đang chuyển hướng...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Xác nhận tài khoản</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Mã xác thực (OTP)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              className={styles.input}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Đang xác minh...' : 'XÁC NHẬN'}
          </button>
        </form>
      </div>
    </div>
  );
}
