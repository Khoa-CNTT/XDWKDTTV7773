"use client";
import { useEffect, useState } from "react";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";
import styles from "./inventory.module.css";
import { FaHistory } from "react-icons/fa";

interface InventoryItem {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  price: number | string;
  size: string;
  material: string;
  color: string;
  status: string;
  created_at: string;
}

interface HistoryItem {
  id: number;
  name: string;
  quantity: number;
  supplier: string;
  created_at: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    supplier: "",
    quantity: "",
    price: "",
    size: "",
    material: "",
    color: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Fetch inventory data on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Fetch history when showHistory = true
  useEffect(() => {
    if (showHistory) fetchHistory();
  }, [showHistory]);

  // Lấy dữ liệu inventory (kho)
  const fetchInventory = async () => {
    try {
      const res = await fetch("http://localhost:4000/inventory");
      if (!res.ok) throw new Error("Lỗi khi gọi API kho");
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách kho:", err);
    }
  };

  // Lấy lịch sử nhập kho
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:4000/inventory/history");
      if (!res.ok) throw new Error("Lỗi khi gọi API lịch sử");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Lỗi khi tải lịch sử:", err);
    }
  };

  // Cập nhật state form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? value.replace(/\D/, "") : value,
    }));
  };

  // Xử lý thêm mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity);
    if (!formData.name || !formData.supplier || !formData.price || quantity <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
      return;
    }

    const payload = {
      ten_hang_hoa: formData.name,
      nha_cung_cap: formData.supplier,
      gia_nhap: parseFloat(formData.price),
      so_luong: quantity,
      size: formData.size,
      chat_lieu: formData.material,
      mau_sac: formData.color,
      trang_thai: quantity === 0 ? "het_hang" : "con_hang",
    };

    try {
      const res = await fetch("http://localhost:4000/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Thêm kho thất bại");
      }

      alert("✅ Nhập kho thành công!");
      fetchInventory();
      resetForm();
    } catch (err: any) {
      alert("❌ Lỗi: " + err.message);
    }
  };

  // Chỉnh sửa
  const handleEditClick = (item: InventoryItem) => {
    setFormData({
      id: item.id.toString(),
      name: item.name,
      supplier: item.supplier,
      quantity: item.quantity.toString(),
      price: String(item.price),
      size: item.size,
      material: item.material,
      color: item.color,
    });
    setIsEditing(true);
  };

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const payload = {
        ten_hang_hoa: formData.name,
        nha_cung_cap: formData.supplier,
        gia_nhap: parseFloat(formData.price),
        so_luong: parseInt(formData.quantity),
        size: formData.size,
        chat_lieu: formData.material,
        mau_sac: formData.color,
      };

      const res = await fetch(`http://localhost:4000/inventory/${formData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("❌ " + (err.message || "Cập nhật thất bại"));
        return;
      }

      alert("✅ Cập nhật thành công");
      fetchInventory();
      setIsEditing(false);
      resetForm();
    } catch (err) {
      alert("❌ Lỗi khi cập nhật");
    }
  };

  // Xóa hàng
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa hàng hóa này?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:4000/inventory/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert("❌ " + (err.message || "Xóa thất bại"));
        return;
      }

      alert("✅ Đã xóa thành công");
      fetchInventory();
    } catch (err) {
      alert("❌ Lỗi khi xóa");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      supplier: "",
      quantity: "",
      price: "",
      size: "",
      material: "",
      color: "",
    });
  };

  // Lọc tìm kiếm
  const filtered = inventory.filter((item) => {
    if (!item || typeof item.name !== 'string') return false;
    return !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Header />

        <div className={styles.titleRow}>
          <h2 className={styles.title}>Quản Lý Kho</h2>
          <button
            className={styles.historyBtn}
            onClick={() => setShowHistory((prev) => !prev)}
          >
            <FaHistory />
          </button>
        </div>

        <div className={styles.mainContent}>
          {/* FORM THÊM */}
          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tên Hàng hóa"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Nhà cung cấp"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                placeholder="Số lượng nhập"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Giá nhập"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Chất liệu"
                name="material"
                value={formData.material}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Màu sắc"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="">Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
                <option value="3XL">3XL</option>
              </select>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                  THÊM
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={resetForm}
                >
                  HỦY
                </button>
              </div>
            </form>
          </div>

          {/* TABLE */}
          <div className={styles.tableWrapper}>
            <div className={styles.actionBar}>
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hàng hóa</th>
                  <th>Nhà cung cấp</th>
                  <th>Giá nhập</th>
                  <th>Số lượng</th>
                  <th>Size</th>
                  <th>Chất liệu</th>
                  <th>Màu sắc</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{String(item.id).padStart(2, "0")}</td>
                    <td>{item.name}</td>
                    <td>{item.supplier}</td>
                    <td>{Number(item.price).toLocaleString("vi-VN")}đ</td>
                    <td>{item.quantity}</td>
                    <td>{item.size}</td>
                    <td>{item.material}</td>
                    <td>{item.color}</td>
                    <td>
                      {item.quantity === 0 ? (
                        <span className={styles.outOfStock}>Hết hàng</span>
                      ) : (
                        <span className={styles.inStock}>Còn hàng</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditClick(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORM SỬA (MODAL) */}
        {isEditing && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Chỉnh sửa sản phẩm</h3>
              <div className={styles.modalForm}>
                <input type="text" value={formData.id} disabled />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                >
                  <option value="">Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                  <option value="3XL">3XL</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button onClick={handleSaveEdit} className={styles.submitBtn}>
                  LƯU
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelBtn}
                >
                  ĐÓNG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lịch sử nhập kho */}
        {showHistory && (
          <div className={styles.historySection}>
            <h3>Lịch Sử Nhập Kho</h3>
            <div className={styles.scrollWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Ngày Nhập</th>
                    <th>Nhà Cung Cấp</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleString() : ""}</td>
                      <td>{item.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
