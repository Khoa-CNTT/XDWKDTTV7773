"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import styles from './VNPayReturn.module.css';

export default function VNPayReturn() {
  const params = useSearchParams();
  const router = useRouter();
  
  // Lấy các tham số từ VNPAY
  const responseCode = params.get("vnp_ResponseCode");
  const transactionStatus = params.get("vnp_TransactionStatus");
  const amount = params.get("vnp_Amount");
  const orderId = params.get("vnp_TxnRef");
  const bankCode = params.get("vnp_BankCode");
  const payDate = params.get("vnp_PayDate");
  const transactionNo = params.get("vnp_TransactionNo");
  const orderInfo = params.get("vnp_OrderInfo");
  const secureHash = params.get("vnp_SecureHash");

  const [verificationStatus, setVerificationStatus] = useState<{ 
    verified: boolean; 
    message: string; 
    loading: boolean;
  }>({
    verified: false,
    message: "Đang xác thực giao dịch...",
    loading: true
  });

  // Xác thực thanh toán
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Chuyển tất cả tham số vào URL query string để gửi đến API
        const searchParams = new URLSearchParams();
        Array.from(params.entries()).forEach(([key, value]) => {
          searchParams.append(key, value);
        });

        // Gọi API xác thực
        const response = await fetch(`/api/vnpay/verify?${searchParams.toString()}`);
        const result = await response.json();

        console.log('Verification result:', result);

        setVerificationStatus({
          verified: result.success,
          message: result.Message,
          loading: false
        });

        if (result.success) {
          // Cập nhật trạng thái đơn hàng trong localStorage
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          
          // Tìm đơn hàng - trước hết thử bằng orderId chính xác, sau đó là đơn hàng VNPay đang chờ gần nhất
          let orderIndex = orders.findIndex((order: any) => order.id === orderId);
          
          if (orderIndex === -1) {
            orderIndex = orders.findIndex((order: any) => 
              order.paymentMethod === 'vnpay' && order.paymentStatus === 'pending'
            );
          }
          
          if (orderIndex !== -1) {
            // Cập nhật đơn hàng với thông tin thanh toán
            orders[orderIndex].paymentStatus = 'paid';
            orders[orderIndex].paidAmount = Number(amount) / 100;
            // Thêm vào: Cập nhật status để hiển thị trong tab đơn hàng đang xử lý
            orders[orderIndex].status = 'processing';
            orders[orderIndex].paymentDetails = {
              bankCode,
              payDate,
              transactionNo,
              orderInfo,
              vnp_TxnRef: orderId,
              secureHash,
              responseCode,
              transactionStatus
            };
            // Log để debug
            console.log('Đã cập nhật đơn hàng:', orders[orderIndex]);
            localStorage.setItem('orders', JSON.stringify(orders));
          }
          const timer = setTimeout(() => {
            router.push("/profile/my-order");
          }, 3000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error verifying VNPay payment:', error);
        setVerificationStatus({
          verified: false,
          message: 'Có lỗi xảy ra khi xác thực thanh toán',
          loading: false
        });
      }
    };

    if (responseCode && secureHash) {
      verifyPayment();
    }
  }, [params, responseCode, secureHash, router, orderId, amount, bankCode, payDate, transactionNo, orderInfo, transactionStatus]);

  // Format số tiền
  const formatAmount = (amountValue: string | null) => {
    if (!amountValue) return '0 VND';
    const value = parseInt(amountValue) / 100;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.statusHeader}>
          <div className={verificationStatus.loading ? styles.loadingIcon : 
               verificationStatus.verified ? styles.successIcon : styles.errorIcon} />
          <h1 className={styles.title}>
            {verificationStatus.loading
              ? 'Đang xử lý giao dịch'
              : verificationStatus.verified
                ? 'Thanh toán thành công'
                : 'Thanh toán thất bại'}
          </h1>
        </div>
        
        <div className={styles.message}>
          {verificationStatus.message}
        </div>
        
        {orderId && (
          <div className={styles.paymentDetails}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Mã đơn hàng:</span>
              <span className={styles.value}>{orderId}</span>
            </div>
            {amount && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Số tiền:</span>
                <span className={styles.value}>{formatAmount(amount)}</span>
              </div>
            )}
            {bankCode && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Ngân hàng:</span>
                <span className={styles.value}>{bankCode}</span>
              </div>
            )}
            {payDate && (
              <div className={styles.detailItem}>
                <span className={styles.label}>Thời gian:</span>
                <span className={styles.value}>
                  {`${payDate.substring(6, 8)}/${payDate.substring(4, 6)}/${payDate.substring(0, 4)} ${payDate.substring(8, 10)}:${payDate.substring(10, 12)}:${payDate.substring(12, 14)}`}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className={styles.actions}>
          {!verificationStatus.loading && (
            <>
              {verificationStatus.verified ? (
                <Link href="/profile/my-order" className={styles.primaryButton}>
                  Xem đơn hàng
                </Link>
              ) : (
                <Link href="/cart" className={styles.primaryButton}>
                  Quay lại giỏ hàng
                </Link>
              )}
              <Link href="/" className={styles.secondaryButton}>
                Về trang chủ
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
