"use client";
import { useState, useEffect, Fragment } from "react";
import Swal from "sweetalert2";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";
import styles from "./page.module.css";

type Purchase = {
  orderId: string;
  productName: string;
  purchaseDate: string;
  totalAmount: string;
};

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  group: string;
  purchases: Purchase[];
  isLocked: boolean;
};

export default function CustomerPage() {
  const [expandedCustomerId, setExpandedCustomerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/users?role=khach_hang")
      .then(res => res.json())
      .then(data => {
        setCustomers(data.map((u: any) => ({
  id: u.id,
  name: u.name,
  phone: u.phone,
  email: u.email,
  group: u.group,
  isLocked: u.isLocked,
  purchases: []
})));

      });
  }, []);

  const handleLock = (id: number) => {
    Swal.fire({
      title: "Tạm khóa tài khoản?",
      text: "Tài khoản này đã không sử dụng lâu ngày",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:4000/users/lock/${id}`, { method: "PATCH" });
        setCustomers((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isLocked: true } : c))
        );
        Swal.fire({
          icon: "success",
          title: "Đã tạm khóa!",
          text: "Tài khoản đã được tạm khóa thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleShowHistory = async (customer: Customer) => {
    setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id);
    if (expandedCustomerId !== customer.id) {
      const res = await fetch(`http://localhost:4000/orders/history/${customer.id}`);
      const history = await res.json();
      setCustomers(prev =>
        prev.map((c) =>
          c.id === customer.id ? { ...c, purchases: history } : c
        )
      );
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(query) ||
      c.id.toString().includes(query)
    );
  });

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Danh Sách Khách Hàng</h1>

        <input
          type="text"
          placeholder="🔍 Tìm theo tên khách hàng..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Nhóm</th>
              <th>Lịch sử</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <Fragment key={customer.id}>
                <tr>
                  <td>
                    {customer.id}{" "}
                    {customer.isLocked && (
                      <span className={styles.lockIcon}>❌</span>
                    )}
                  </td>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.group}</td>
                  <td>
                    {!customer.isLocked && (
                      <button
                        className={styles.historyBtn}
                        onClick={() => handleShowHistory(customer)}
                      >
                        🕘
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className={`${styles.lockBtn} ${customer.isLocked ? styles.locked : ""}`}
                      disabled={customer.isLocked}
                      onClick={() => handleLock(customer.id)}
                    >
                      {customer.isLocked ? "Đã tạm khóa" : "Tạm khóa"}
                    </button>
                  </td>
                </tr>

                {expandedCustomerId === customer.id && (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.purchaseHistoryBox}>
                        <h4>Lịch sử mua hàng của {customer.name}</h4>
                        {customer.purchases.length > 0 ? (
                          <table className={styles.subTable}>
                            <thead>
                              <tr>
                                <th>Mã Đơn</th>
                                <th>Sản phẩm</th>
                                <th>Ngày mua</th>
                                <th>Tổng thanh toán</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customer.purchases.map((p) => (
                                <tr key={p.orderId}>
                                  <td>{p.orderId}</td>
                                  <td>{p.productName}</td>
                                  <td>{p.purchaseDate}</td>
                                  <td>{p.totalAmount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Chưa có đơn hàng nào</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
