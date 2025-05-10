/* app/profile/my-order/page.tsx */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../context/AuthContext";
import styles from "./MyOrder.module.css";
import Image from "next/image";
import { BsBoxSeam, BsClipboardX } from "react-icons/bs";
import SocialIcons from "../../components/SocialIcons";
import { useRouter, useSearchParams } from 'next/navigation';

// Định nghĩa type cho Order và OrderItem để fix linter
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  material: string;
  color?: string;
  fabric?: string;
}
interface Order {
  id: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  paymentStatus?: string;
  paidAmount?: number;
}

export default function MyOrderPage() {
  const t = useTranslations("Profile");
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("processing");
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    // Xử lý cập nhật trạng thái đơn hàng khi thanh toán VNPAY thành công
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    if (orderId && status === 'success') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map((order: any) =>
        order.id === orderId
          ? { ...order, paymentStatus: 'paid', paidAmount: order.total }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      // Hiển thị toast thành công
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success('Thanh toán thành công! Đơn hàng đã được cập nhật.');
      }
      // Xóa query khỏi URL
      router.replace('/profile/my-order');
    }
  }, []);

  const tabs = [
    { key: "processing", label: <><i className="bi bi-list-task"></i> {t("ordersProcessing")}</> },
    { key: "delivered", label: <><i className="bi bi-truck"></i> {t("ordersDelivered")}</> },
    { key: "changeReturn", label: <><i className="bi bi-bag"></i> {t("changeReturn")}</> },
  ];

  if (!user) {
    return (
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>{t("orders")}</h1>
        <div className={styles.notLoggedIn}>{t("notLoggedIn")}</div>
      </div>
    );
  }

  return (
    <div className={styles.mainContent}>
      <h1 className={styles.pageTitle}><i className="bi bi-box-seam"></i> {t("orders")}</h1>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "processing" && (
        orders.length === 0 ? (
          <div className={styles.emptyState}>
            <BsClipboardX className={styles.emptyIconBig} />
            <p className={styles.emptyText}>{t("emptyOrders")}</p>
          </div>
        ) : (
          <div>
            {orders
              .filter((order: Order) => order.status === "processing")
              .map((order: Order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span>Mã đơn: <b>{order.id}</b></span>
                    <span>Ngày đặt: {order.createdAt}</span>
                    <span className={styles.processingStatus}>Đang xử lý</span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item: OrderItem, idx: number) => (
                      <div key={idx} className={styles.orderItem}>
                        <img src={item.image} alt={item.name} className={styles.orderItemImage} />
                        <div>
                          <div className={styles.orderItemName}>{item.name}</div>
                          <div>Size: {item.size} | Màu: {item.color}</div>
                          <div>Số lượng: {item.quantity}</div>
                        </div>
                        <div className={styles.orderItemPrice}>{item.price.toLocaleString()}đ</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderTotal}>
                    {order.paymentStatus === 'paid' ? (
                      <>
                        <div style={{color: '#009900', fontWeight: 600, marginBottom: 4}}>Đã thanh toán</div>
                        Tổng cộng: <b>{order.total.toLocaleString()}đ</b>
                      </>
                    ) : order.paymentStatus === 'cod' ? (
                      <>
                        <div style={{color: 'red', fontWeight: 600, marginBottom: 4}}>Chưa thanh toán</div>
                        Tổng cộng: <b>{order.total.toLocaleString()}đ</b>
                      </>
                    ) : (
                      <>
                        Tổng cộng: <b>{order.total.toLocaleString()}đ</b>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )
      )}
      <SocialIcons />
    </div>
  );
}