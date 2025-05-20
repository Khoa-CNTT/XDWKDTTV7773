"use client";
import { useState, useEffect } from "react";
import styles from "./marketing.module.css";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";

// Chuẩn hóa type với DB
type Discount = {
  id_khuyen_mai: number;
  ma_giam_gia: string;
  dieu_kien_su_dung: string;
  so_luong: number;
  han_su_dung: string;
};

type ExpiredDiscount = Discount & { ngay_het_han: string };

export default function MarketingPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [expired, setExpired] = useState<ExpiredDiscount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State tạo mới
  const [newDiscount, setNewDiscount] = useState({
    ma_giam_gia: "",
    dieu_kien_su_dung: "",
    so_luong: '',
    han_su_dung: "",
  });

  // Lấy danh sách mã giảm giá từ API
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/discounts");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Tách hết hạn
        const now = new Date();
        const _valid: Discount[] = [];
        const _expired: ExpiredDiscount[] = [];
        data.forEach((item: Discount) => {
          if (item.han_su_dung && new Date(item.han_su_dung) < now) {
            _expired.push({
              ...item,
              ngay_het_han: new Date(item.han_su_dung).toLocaleDateString("vi-VN"),
            });
          } else {
            _valid.push(item);
          }
        });
        setDiscounts(_valid);
        setExpired(_expired);
      } else {
        setDiscounts([]);
        setExpired([]);
      }
    } catch (err) {
      alert("Lỗi tải danh sách mã giảm giá");
      setDiscounts([]);
      setExpired([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Thêm mã mới
  const handleAddDiscount = async () => {
    if (
      !newDiscount.ma_giam_gia ||
      !newDiscount.dieu_kien_su_dung ||
      !newDiscount.so_luong ||
      !newDiscount.han_su_dung
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscount),
      });
      if (!res.ok) throw new Error("Lỗi thêm mã giảm giá");
      await fetchDiscounts();
      setIsModalOpen(false);
      setNewDiscount({
        ma_giam_gia: "",
        dieu_kien_su_dung: "",
        so_luong: "",
        han_su_dung: "",
      });
    } catch (err) {
      alert("Lỗi thêm mã giảm giá!");
    }
  };

  // Xóa mã
  const handleDelete = async (id_khuyen_mai: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      await fetch(`http://localhost:4000/discounts/${id_khuyen_mai}`, {
        method: "DELETE",
      });
      await fetchDiscounts();
    } catch {
      alert("Lỗi xóa mã giảm giá");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Marketing - Mã Giảm Giá</h1>

        <div className={styles.actionBar}>
          <button
            className={styles.addBtn}
            onClick={() => setIsModalOpen(true)}
          >
            + Tạo Mã Mới
          </button>
        </div>

        <h2 className={styles.titleSmall}>Mã giảm giá còn hiệu lực</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mã giảm giá</th>
                <th>Điều kiện sử dụng</th>
                <th>Số lượng</th>
                <th>Hạn sử dụng</th>
                <th>Trạng thái</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    Không có mã còn hiệu lực
                  </td>
                </tr>
              )}
              {discounts.map((item) => (
                <tr key={item.id_khuyen_mai}>
                  <td>{item.id_khuyen_mai}</td>
                  <td>{item.ma_giam_gia}</td>
                  <td>{item.dieu_kien_su_dung}</td>
                  <td>{item.so_luong}</td>
                  <td>
                    {item.han_su_dung
                      ? new Date(item.han_su_dung).toLocaleDateString("vi-VN")
                      : ""}
                  </td>
                  <td className={styles.active}>Còn hiệu lực</td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(item.id_khuyen_mai)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal thêm mã */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Tạo Mã Giảm Giá Mới</h2>
              <div className={styles.formGroup}>
                <label>Mã giảm giá:</label>
                <input
                  type="text"
                  value={newDiscount.ma_giam_gia}
                  onChange={(e) =>
                    setNewDiscount((prev) => ({
                      ...prev,
                      ma_giam_gia: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Điều kiện sử dụng:</label>
                <input
                  type="text"
                  value={newDiscount.dieu_kien_su_dung}
                  onChange={(e) =>
                    setNewDiscount((prev) => ({
                      ...prev,
                      dieu_kien_su_dung: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số lượng:</label>
                <input
                  type="number"
                  value={newDiscount.so_luong}
                  onChange={(e) =>
                    setNewDiscount((prev) => ({
                      ...prev,
                      so_luong: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hạn sử dụng:</label>
                <input
                  type="date"
                  value={
                    newDiscount.han_su_dung
                      ? newDiscount.han_su_dung.slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setNewDiscount((prev) => ({
                      ...prev,
                      han_su_dung: e.target.value,
                    }))
                  }
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
                <button onClick={handleAddDiscount} className={styles.saveBtn}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className={styles.titleSmall}>Lịch sử tạo mã (mã đã hết hạn)</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã giảm giá</th>
              <th>Điều kiện sử dụng</th>
              <th>Số lượng</th>
              <th>Ngày hết hạn</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {expired.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Không có mã hết hạn
                </td>
              </tr>
            )}
            {expired.map((item) => (
              <tr key={item.id_khuyen_mai}>
                <td>{item.id_khuyen_mai}</td>
                <td>{item.ma_giam_gia}</td>
                <td>{item.dieu_kien_su_dung}</td>
                <td>{item.so_luong}</td>
                <td>{item.ngay_het_han}</td>
                <td className={styles.expired}>Hết hạn</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
