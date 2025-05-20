"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReturnVNPayPage() {
  const params = useSearchParams();
  const router = useRouter();
  const responseCode = params.get("vnp_ResponseCode");
  const transactionStatus = params.get("vnp_TransactionStatus");
  const amount = params.get("vnp_Amount");
  const orderId = params.get("vnp_TxnRef");

  useEffect(() => {
    if (responseCode === "00" && transactionStatus === "00") {
      setTimeout(() => {
        router.push("/profile/my-order");
      }, 2000);
    }
  }, [responseCode, transactionStatus, router]);

  let message = "Đang xác thực giao dịch...";
  if (responseCode === "00" && transactionStatus === "00") {
    message = "Thanh toán thành công! Đang chuyển về trang đơn hàng...";
  } else if (responseCode) {
    message = "Thanh toán thất bại hoặc bị hủy!";
  }

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Kết quả thanh toán VNPay</h1>
      <p>{message}</p>
      <p>Mã đơn hàng: {orderId}</p>
      <p>Số tiền: {amount ? Number(amount) / 100 : ""} VND</p>
    </div>
  );
} 