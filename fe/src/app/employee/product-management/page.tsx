/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";

import styles from "./product-management.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
  category: string;
};

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Vest-nam",
      description:
        "Vest-nam xám kèm phụ kiện cavat nơ tôn lên nét trẻ trung thanh lịch ",
      price: "550.000",
      image:
        "https://th.bing.com/th/id/OIP.y2sQEkr1DaeZZP2_TEOE9gDIEs?rs=1&pid=ImgDetMain",
      quantity: 10,
      size: "XL",
      category: "Hàng Nam-Vest nam",
    },
    {
      id: 2,
      name: "Áo dài Việt",
      description: "Áo dài là một loại trang phục truyền thống của Việt Nam...",
      price: "300.000",
      image:
        "https://anhvienmimosa.com.vn/wp-content/uploads/2023/02/ao-dai-cuoi-truyen-thong-xua-21-534x800.jpg",
      quantity: 20,
      size: "L",
      category: "Hàng Nữ-Áo dài",
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    image: "",
    quantity: "",
    size: "",
    category: "",
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      price: "",
      image: "",
      quantity: "",
      size: "",
      category: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: formData.image,
      quantity: parseInt(formData.quantity),
      size: formData.size,
      category: formData.category,
    };
    setProducts((prev) => [...prev, newProduct]);
    resetForm();
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      quantity: product.quantity.toString(),
      size: product.size,
      category: product.category,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updated = products.map((p) =>
      p.id === parseInt(formData.id)
        ? {
            ...p,
            description: formData.description,
            price: formData.price,
            image: formData.image,
            quantity: parseInt(formData.quantity),
            size: formData.size,
            category: formData.category,
          }
        : p
    );
    setProducts(updated);
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <h2 className={styles.title}>SẢN PHẨM</h2>

        {/* Form thêm sản phẩm */}
        <div className={styles.mainContent}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              placeholder="Mô tả"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              name="price"
              placeholder="Giá bán (VNĐ)"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <input
              name="image"
              placeholder="Link hình ảnh"
              value={formData.image}
              onChange={handleChange}
              required
            />
            <input
              name="quantity"
              type="number"
              placeholder="Số lượng"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            >
              <option value="">Chọn size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="2XL">2XL</option>
            </select>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Chọn danh mục</option>
              <optgroup label="HÀNG NAM">
                <option value="Vest-Nam">Vest-Nam</option>
                <option value="Ghi-Lê">Ghi-Lê</option>
                <option value="Sơ Mi Dài/Ngắn Tay">Sơ Mi Dài/Ngắn Tay</option>
                <option value="PoLo">Polo</option>
                <option value="Quần Tây">Quần Tây</option>
              </optgroup>
              <optgroup label="HÀNG NỮ">
                <option value="VÁY NGẮN/DÀI">VÁY NGẮN/DÀI</option>
                <option value="ÁO THUN">ÁO THUN</option>
                <option value="ĐỒ NGỦ">ĐỒ NGỦ</option>
                <option value="ÁO DÀI">ÁO DÀI</option>
              </optgroup>
              <optgroup label="HÀNG MỚI">
                <option value="ÁO PHÔNG">ÁO PHÔNG</option>
                <option value="QUẦN SHORT">QUẦN SHORT</option>
                <option value="ÁO/QUẦN JEAN">ÁO/QUẦN JEAN</option>
                <option value="ÁO ẤM PHAO">ÁO ẤM PHAO</option>
              </optgroup>
            </select>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                Thêm Sản Phẩm
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={resetForm}
              >
                Hủy
              </button>
            </div>
          </form>

          {/* Tìm kiếm + bảng */}
          <div className={styles.tableWrapper}>
            <input
              className={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Mô tả</th>
                  <th>Giá bán</th>
                  <th>Hình ảnh</th>
                  <th>Số lượng</th>
                  <th>Size</th>
                  <th>Danh mục</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}₫</td>
                    <td>
                      <img
                        src={product.image}
                        alt="Ảnh sản phẩm"
                        className={styles.productImage}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://via.placeholder.com/100";
                        }}
                      />
                    </td>
                    <td>{product.quantity}</td>
                    <td>{product.size}</td>
                    <td>{product.category}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEditClick(product)}
                          className={styles.editBtn}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className={styles.deleteBtn}
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

        {/* Modal chỉnh sửa sản phẩm */}
        {isEditing && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Chỉnh sửa sản phẩm</h3>
              <input disabled value={formData.name} />
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="">Chọn size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
              </select>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Chọn danh mục</option>
                {/* same optgroup here */}
              </select>
              <div className={styles.modalActions}>
                <button onClick={handleSaveEdit} className={styles.submitBtn}>
                  Lưu
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelBtn}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
