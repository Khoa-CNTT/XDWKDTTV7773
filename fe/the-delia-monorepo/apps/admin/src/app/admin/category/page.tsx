/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";

import styles from "./category.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  quantity: number;
  size: string;
  category: string;
  material: string; // Chất liệu
  color: string; // Màu sắc
};

export default function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 0,
      name: "",
      description: "",
      price: "",
      image: "",
      quantity: 0,
      size: "",
      category: "",
      material: "",
      color: "",
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
    material: "",
    color: "",
    categoryRoot: "",
  });

  const [categories, setCategories] = useState([
    { id: 0, name: "", classification: "" },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newCategory, setNewCategory] = useState({
    name: "",
    classification: "",
    type: "",
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.classification.trim()) {
      alert("Vui lòng nhập đầy đủ tên sản phẩm và danh mục.");
      return;
    }
    const newItem = {
      id: Math.floor(Math.random() * 1000000),
      name: newCategory.name,
      classification: newCategory.classification,
      type: newCategory.type,
    };

    setCategories((prev) => [...prev, newItem]);

    // Reset form
    setNewCategory({ name: "", classification: "", type: "" });
    setShowAddCategoryModal(false);
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const [priceFilter, setPriceFilter] = useState<string>(""); // ví dụ: "<500000", "500000-1000000", ">1000000"

  const handleDeleteCategory = (id: number) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== id)
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" && {
        categoryRoot: categoryMap[value] || "",
      }),
    }));
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
      material: "",
      color: "",
      categoryRoot: "",
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
      material: "",
      color: "",
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
      material: product.material,
      color: product.color,
      categoryRoot: categoryMap[product.category] || "",
    });
    setIsEditing(true);
  };

  const categoryMap: Record<string, string> = {
    "Vest-Nam": "HÀNG NAM",
    "Ghi-Lê": "HÀNG NAM",
    "Sơ Mi Dài/Ngắn Tay": "HÀNG NAM",
    PoLo: "HÀNG NAM",
    "Quần Tây": "HÀNG NAM",
    "Quần/Áo Jeans": "HÀNG NAM",

    "VÁY NGẮN/DÀI": "HÀNG NỮ",
    "ĐẦM DẠO PHỐ": "HÀNG NỮ",
    "ÁO DÀI": "HÀNG NỮ",
    "ÁO/QUẦN JEANS": "HÀNG NỮ",

    "ÁO PHÔNG": "HÀNG MỚI",
    "QUẦN SHORT NAM": "HÀNG MỚI",
    "QUẦN SHORT NỮ": "HÀNG MỚI",
    "ÁO TANK NAM/NỮ": "HÀNG MỚI",
    "ÁO LEN NAM/NỮ": "HÀNG MỚI",
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
            material: formData.material,
            color: formData.color,
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

  const filtered = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const price = Number(p.price);
    let matchesPrice = true;
    if (priceFilter === "<500000") matchesPrice = price < 500000;
    else if (priceFilter === "500000-1000000")
      matchesPrice = price >= 500000 && price <= 1000000;
    else if (priceFilter === ">1000000") matchesPrice = price > 1000000;

    return matchesSearch && matchesPrice;
  });

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <h2 className={styles.title}>SẢN PHẨM</h2>

        {/* Nút Thêm Danh Mục */}
        <div className={styles.addCategoryBtnWrapper}>
          <button
            className={styles.addCategoryBtn}
            onClick={() => setShowAddCategoryModal(true)}
          >
            + Thêm danh mục mới
          </button>
        </div>

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
              name="material"
              placeholder="Chất liệu"
              value={formData.material}
              onChange={handleChange}
              required
            />

            <input
              name="color"
              placeholder="Màu sắc"
              value={formData.color}
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
              <option value="">Chọn danh mục con</option>
              <optgroup label="HÀNG NAM">
                <option value="Vest-Nam">Vest-Nam</option>
                <option value="Ghi-Lê">Ghi-Lê</option>
                <option value="Sơ Mi Dài/Ngắn Tay">Sơ Mi Dài/Ngắn Tay</option>
                <option value="PoLo">Polo</option>
                <option value="Quần Tây">Quần Tây</option>
                <option value="Quần/Áo Jeans">Quần/Áo Jeans</option>
              </optgroup>
              <optgroup label="HÀNG NỮ">
                <option value="VÁY NGẮN/DÀI">VÁY NGẮN/DÀI</option>
                <option value="ĐẦM DẠO PHỐ">ĐẦM DẠO PHỐ</option>
                <option value="ÁO DÀI">ÁO DÀI</option>
                <option value="ÁO/QUẦN JEANS ">ÁO/QUẦN JEANS</option>
              </optgroup>
              <optgroup label="HÀNG MỚI">
                <option value="ÁO PHÔNG">ÁO PHÔNG</option>
                <option value="QUẦN SHORT NAM">QUẦN SHORT NAM</option>
                <option value="QUẦN SHORT NỮ">QUẦN SHORT NỮ</option>
                <option value="ÁO TANK NAM/NỮ">ÁO TANK NAM/NỮ</option>
                <option value="ÁO LEN NAM/NỮ">ÁO LEN NAM/NỮ</option>
              </optgroup>
            </select>
            <input
              name="categoryRoot"
              placeholder="Danh mục gốc"
              value={formData.categoryRoot}
              readOnly
              className={styles.readOnlyInput}
            />
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
              type="text"
              placeholder="Tìm theo tên sản phẩm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.filters}>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Tất cả giá</option>
                <option value="<500000">Dưới 500.000₫</option>
                <option value="500000-1000000">500.000₫ - 1.000.000₫</option>
                <option value=">1000000">Trên 1.000.000₫</option>
              </select>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Mô tả</th>
                  <th>Giá bán</th>
                  <th>Hình ảnh</th>
                  <th>Chất liệu</th>
                  <th>Màu sắc</th>
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
                    <td>
                      {expandedId === product.id ? (
                        <>
                          {product.description}
                          <span
                            onClick={() => setExpandedId(null)}
                            className={styles.viewMore}
                          >
                            &nbsp;Thu gọn
                          </span>
                        </>
                      ) : (
                        <>
                          {product.description.split(" ").slice(0, 5).join(" ")}
                          ...
                          <span
                            onClick={() => setExpandedId(product.id)}
                            className={styles.viewMore}
                          >
                            &nbsp;Xem thêm
                          </span>
                        </>
                      )}
                    </td>
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
                    <td>{product.material}</td>
                    <td>{product.color}</td>
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
              <input
                name="name"
                placeholder="Tên sản phẩm"
                value={formData.name}
                onChange={handleChange}
                disabled
                className={styles.readOnlyInput}
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
                name="material"
                placeholder="Chất liệu"
                value={formData.material}
                onChange={handleChange}
                required
              />
              <input
                name="color"
                placeholder="Màu sắc"
                value={formData.color}
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
                <option value="">Chọn danh mục con</option>
                <optgroup label="HÀNG NAM">
                  <option value="Vest-Nam">Vest-Nam</option>
                  <option value="Ghi-Lê">Ghi-Lê</option>
                  <option value="Sơ Mi Dài/Ngắn Tay">Sơ Mi Dài/Ngắn Tay</option>
                  <option value="PoLo">Polo</option>
                  <option value="Quần Tây">Quần Tây</option>
                  <option value="Quần/Áo Jeans">Quần/Áo Jeans</option>
                </optgroup>
                <optgroup label="HÀNG NỮ">
                  <option value="VÁY NGẮN/DÀI">VÁY NGẮN/DÀI</option>
                  <option value="ĐẦM DẠO PHỐ">ĐẦM DẠO PHỐ</option>
                  <option value="ÁO DÀI">ÁO DÀI</option>
                  <option value="ÁO/QUẦN JEANS">ÁO/QUẦN JEANS</option>
                </optgroup>
                <optgroup label="HÀNG MỚI">
                  <option value="ÁO PHÔNG">ÁO PHÔNG</option>
                  <option value="QUẦN SHORT NAM">QUẦN SHORT NAM</option>
                  <option value="QUẦN SHORT NỮ">QUẦN SHORT NỮ</option>
                  <option value="ÁO TANK NAM/NỮ">ÁO TANK NAM/NỮ</option>
                  <option value="ÁO LEN NAM/NỮ">ÁO LEN NAM/NỮ</option>
                </optgroup>
              </select>
              <input
                name="categoryRoot"
                placeholder="Danh mục gốc"
                value={formData.categoryRoot}
                readOnly
                className={styles.readOnlyInput}
              />

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

        {/* Modal Thêm danh mục sản phẩm mới */}
        {showAddCategoryModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>THÊM DANH MỤC SẢN PHẨM</h3>

              {/* Form thêm danh mục */}
              <div className={styles.addCategoryForm}>
                {/* Khung nhập tên sản phẩm mới */}
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryChange}
                  placeholder="Tên Danh Mục Gốc Mới"
                />

                {/* Khung nhập danh mục mới */}
                <input
                  type="text"
                  name="classification"
                  value={newCategory.classification}
                  onChange={handleCategoryChange}
                  placeholder="Tên Danh Mục Con Mới"
                />

                {/* Nút thêm */}
                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleAddCategory}
                    className={styles.addCategoryBtn}
                    disabled={
                      !newCategory.name.trim() ||
                      !newCategory.classification.trim()
                    }
                  >
                    Thêm
                  </button>

                  {/* Nút đóng */}
                  <button
                    onClick={() => setShowAddCategoryModal(false)}
                    className={styles.cancelCategoryBtn}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BẢNG DANH SÁCH DANH MỤC*/}
        <div className={styles.categoryList}>
          <h4>Danh sách danh mục:</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Danh Mục</th>
                <th>Sản Phẩm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.classification}</td>
                  <td>{category.name}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className={styles.deleteCategoryBtn}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
