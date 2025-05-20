"use client";
import { useEffect, useState } from "react";
import styles from "./order.module.css";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";

// Chuẩn hóa lại type từ BE trả về:
type OrderItem = {
  id: number;
  ma_don: string | number;
  khach_hang: string;
  ngay_dat: string | Date;
  tong_tien: number;
  trang_thai: string;
  dia_chi_giao: string;
  chi_tiet: {
    id_chi_tiet: number;
    ten_san_pham: string;
    so_luong: number;
    don_gia: number;
    kich_co: string;
  }[];
};

export default function OrderPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Đang chỉnh sửa trạng thái:
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");

  // Lấy danh sách đơn hàng thực từ BE:
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Lọc theo tên khách hàng:
  const filteredOrders = orders.filter((order) =>
    order.khach_hang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bắt đầu chỉnh sửa trạng thái:
  const handleStartEdit = (order: OrderItem) => {
    setEditingId(order.id);
    setEditStatus(order.trang_thai);
  };

  // Hủy chỉnh sửa trạng thái:
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
  };

  // Gửi cập nhật trạng thái đơn hàng:
  const handleSaveStatus = async (orderId: number) => {
    try {
      const res = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trang_thai: editStatus }),
      });
      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
      // reload danh sách
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((od) =>
          od.id === orderId ? { ...od, trang_thai: updated.trang_thai } : od
        )
      );
      setEditingId(null);
      setEditStatus("");
    } catch (e) {
      alert("Lỗi khi cập nhật trạng thái!");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Quản Lý Đơn Hàng</h1>
        <div className={styles.actionBar}>
          <div></div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>ĐỊA CHỈ GIAO</th>
                <th>TRẠNG THÁI</th>
                <th>SẢN PHẨM</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8}>Không có đơn hàng phù hợp</td>
                </tr>
              )}
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.ma_don}</td>
                  <td>{order.khach_hang}</td>
                  <td>
                    {order.ngay_dat
                      ? new Date(order.ngay_dat).toLocaleString("vi-VN")
                      : ""}
                  </td>
                  <td>{Number(order.tong_tien).toLocaleString("vi-VN")}₫</td>
                  <td>{order.dia_chi_giao}</td>
                  <td>
                    {editingId === order.id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className={styles.statusDropdown}
                      >
                        <option value="cho_xu_ly">Chờ xử lý</option>
                        <option value="dang_giao">Đang giao</option>
                        <option value="hoan_thanh">Hoàn thành</option>
                        <option value="da_huy">Đã hủy</option>
                      </select>
                    ) : (
                      <span>
                        {{
                          cho_xu_ly: "Chờ xử lý",
                          dang_giao: "Đang giao",
                          hoan_thanh: "Hoàn thành",
                          da_huy: "Đã hủy",
                        }[order.trang_thai] || order.trang_thai}
                      </span>
                    )}
                  </td>
                  <td>
                    {order.chi_tiet?.length ? (
                      <ul>
                        {order.chi_tiet.map((ct) => (
                          <li key={ct.id_chi_tiet}>
                            {ct.ten_san_pham} ({ct.kich_co}) x {ct.so_luong} -{" "}
                            {Number(ct.don_gia).toLocaleString("vi-VN")}₫
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {editingId === order.id ? (
                      <>
                        <button
                          className={styles.saveBtn}
                          onClick={() => handleSaveStatus(order.id)}
                        >
                          Lưu
                        </button>
                        <button
                          className={styles.cancelBtn}
                          onClick={handleCancelEdit}
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        className={styles.editBtn}
                        onClick={() => handleStartEdit(order)}
                      >
                        Đổi trạng thái
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
