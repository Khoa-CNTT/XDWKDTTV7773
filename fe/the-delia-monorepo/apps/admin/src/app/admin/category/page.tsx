"use client";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";
import styles from "./category.module.css";

// TYPES
type Product = {
  id: number;
  ten_san_pham: string;
  mo_ta: string;
  gia: number;
  hinh_anh: string;
  mau_sac: string;
  chat_lieu: string;
  so_luong: number;
  size: string;
  id_danh_muc: number;
  category?: {
    id: number;
    ten_danh_muc: string;
    parent?: { ten_danh_muc: string };
  };
};

interface InventoryItem {
  id: number;
  name: string;
  supplier: string;
  material: string;
  status: string;
  quantity: number;
  color: string;
  id_kho: number;
  ten_hang_hoa: string;
  nha_cung_cap: string;
  so_luong: number;
  gia_nhap: number;
  size?: string;
  chat_lieu?: string;
  mau_sac?: string;
  trang_thai: string;
}

interface Category {
  id: number;
  id_danh_muc: number;
  ten_danh_muc: string;
  parent: Category | null;
  children?: Category[];
}

// COMPONENT
export default function CategoryPage() {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    khoId: "",
    name: "",
    description: "",
    price: "",
    image: "",
    quantity: "",
    size: "",
    material: "",
    color: "",
    category_id: "",
    categoryRoot: "",
  });
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [isCreatingNewRootCategory, setIsCreatingNewRootCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    parentId: "",
    newRootCategoryName: "",
    subCategoryName: "",
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch Data ---
  useEffect(() => {
    fetchCategories();
    fetchRootCategories();
    fetchProducts();
    fetchInventoryList();
  }, []);

  // Lấy lại dữ liệu khi thêm/sửa/xóa danh mục
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/categories");
      const data = await res.json();
      setCategories(data);
      // Nếu chưa có API /categories/roots thì filter
      const roots = data.filter((cat: any) => cat.parent === null);
      setRootCategories(roots);
    } catch (err) {
      alert("Không load được danh mục");
    }
  };

  // Nếu có sẵn API /categories/roots, bạn có thể gọi
  const fetchRootCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/categories/roots");
      const data = await res.json();
      setRootCategories(data);
    } catch (err) {
      // Nếu không có, thì thôi, đã set ở fetchCategories rồi
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:4000/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchInventoryList = async () => {
    try {
      const res = await fetch("http://localhost:4000/inventory");
      if (!res.ok) throw new Error("Không thể tải danh sách kho");
      const data = await res.json();
      setInventoryList(data);
    } catch (err) {
      alert("Lỗi tải danh sách kho");
    }
  };

  // --- Form binding ---
  const resetForm = () => {
    setFormData({
      id: "",
      khoId: "",
      name: "",
      description: "",
      price: "",
      image: "",
      quantity: "",
      size: "",
      material: "",
      color: "",
      category_id: "",
      categoryRoot: "",
    });
    setAvailableSizes([]);
    setAvailableMaterials([]);
    setAvailableColors([]);
    setSelectedItem(null);
  };

  // --- Xử lý chọn lô hàng (kho) ---
  const handleSelectKho = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const khoId = e.target.value;
  const item = inventoryList.find(i => String(i.id) === khoId || String(i.id_kho) === khoId);

  setFormData(prev => ({
    ...prev,
    khoId,
    name: item?.ten_hang_hoa || item?.name || "",
    material: item?.chat_lieu || item?.material || "",
    color: item?.mau_sac || item?.color || "",
    size: item?.size || "",
    price: item?.gia_nhap ? item.gia_nhap.toString() : "",
    quantity: item?.so_luong ? item.so_luong.toString() : "",
  }));

  // Cập nhật các lựa chọn filter
  const items = inventoryList.filter(i => String(i.id) === khoId || String(i.id_kho) === khoId);
  setAvailableMaterials([...new Set(items.map(i => i.chat_lieu || i.material).filter(Boolean))]);
  setAvailableColors([...new Set(items.map(i => i.mau_sac || i.color).filter(Boolean))]);
  setAvailableSizes([...new Set(items.map(i => i.size).filter((v): v is string => !!v))]);
};



  // --- Cập nhật các trường trong form ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Cập nhật danh mục con ---
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["parentId", "newRootCategoryName", "subCategoryName"].includes(name)) {
      setNewCategory(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "category_id") {
      const subCat = categories.find(cat => String(cat.id) === value);
      const parentCat = subCat?.parent?.ten_danh_muc || "";
      setFormData(prev => ({
        ...prev,
        category_id: value,
        categoryRoot: parentCat,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // --- Hiển thị số lượng còn lại khi chọn đủ thuộc tính ---
  useEffect(() => {
    if (formData.size && formData.material && formData.color && formData.khoId) {
      const selectedItem = inventoryList.find(
        item =>
          String(item.id_kho) === formData.khoId &&
          item.size === formData.size &&
          item.chat_lieu === formData.material &&
          item.mau_sac === formData.color
      );
      setFormData(prev => ({
        ...prev,
        quantity: selectedItem ? selectedItem.so_luong.toString() : "0",
      }));
      setSelectedItem(selectedItem || null);
    }
  }, [formData.size, formData.material, formData.color, formData.khoId, inventoryList]);
console.log("formData:", formData);

  // --- Thêm sản phẩm ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.category_id || !formData.khoId) {
      alert("Bạn phải nhập đầy đủ thông tin sản phẩm!");
      return;
    }
    // Kiểm tra số lượng không vượt quá kho
    if (selectedItem && Number(formData.quantity) > selectedItem.so_luong) {
      alert("Số lượng vượt quá tồn kho!");
      return;
    }
    const payload = {
      ten_san_pham: formData.name,
      mo_ta: formData.description,
      gia: Number(formData.price),
      hinh_anh: formData.image,
      mau_sac: formData.color,
      chat_lieu: formData.material,
      so_luong: Number(formData.quantity),
      size: formData.size,
      id_danh_muc: Number(formData.category_id),
      id_kho: Number(formData.khoId), // BẮT BUỘC
    };

    const res = await fetch("http://localhost:4000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Thêm sản phẩm thất bại!");
      return;
    }
    await fetchProducts();
    resetForm();
    alert("✅ Thêm sản phẩm thành công!");
  };

  // --- Thêm danh mục ---
  const handleAddCategory = async () => {
    try {
      if (isCreatingNewRootCategory) {
        // Thêm danh mục gốc trước
        const resRoot = await fetch("http://localhost:4000/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ten_danh_muc: newCategory.newRootCategoryName.trim(),
            parent_id: null,
          }),
        });
        if (!resRoot.ok) throw new Error("Thêm danh mục gốc thất bại");
        const root = await resRoot.json();
        const rootId = root.id || root.id_danh_muc;
        // Nếu nhập luôn danh mục con
        if (newCategory.subCategoryName.trim()) {
          const resSub = await fetch("http://localhost:4000/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ten_danh_muc: newCategory.subCategoryName.trim(),
              parent_id: rootId,
            }),
          });
          if (!resSub.ok) throw new Error("Thêm danh mục con thất bại");
        }
      } else {
        // Thêm danh mục con vào danh mục gốc đã có
        const parentId = Number(newCategory.parentId);
        if (!parentId) {
          alert("Vui lòng chọn danh mục gốc.");
          return;
        }
        const resSub = await fetch("http://localhost:4000/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ten_danh_muc: newCategory.subCategoryName.trim(),
            parent_id: parentId,
          }),
        });
        if (!resSub.ok) throw new Error("Thêm danh mục con thất bại");
      }

      setNewCategory({ parentId: "", newRootCategoryName: "", subCategoryName: "" });
      await fetchCategories();
      await fetchRootCategories();
      setShowAddCategoryModal(false);
      alert("✅ Thêm danh mục thành công!");
    } catch (err: any) {
      alert("❌ " + (err.message || "Lỗi khi thêm danh mục"));
    }
  };

  // --- Xóa danh mục ---
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      const res = await fetch(`http://localhost:4000/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa danh mục thất bại");
      await fetchCategories();
      await fetchRootCategories();
    } catch (err: any) {
      alert("❌ " + (err.message || "Lỗi khi xóa danh mục"));
    }
  };

  // --- Sửa sản phẩm ---
  const handleEditClick = (product: Product) => {
    setFormData({
      id: product.id.toString(),
      khoId: "", // không sửa kho, hoặc bạn có thể cho sửa
      name: product.ten_san_pham,
      description: product.mo_ta,
      price: product.gia.toString(),
      image: product.hinh_anh,
      quantity: product.so_luong.toString(),
      size: product.size,
      material: product.chat_lieu,
      color: product.mau_sac,
      category_id: product.id_danh_muc.toString(),
      categoryRoot: product.category?.parent?.ten_danh_muc || "",
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const payload = {
      ten_san_pham: formData.name,
      mo_ta: formData.description,
      gia: Number(formData.price),
      hinh_anh: formData.image,
      mau_sac: formData.color,
      chat_lieu: formData.material,
      so_luong: Number(formData.quantity),
      size: formData.size,
      id_danh_muc: Number(formData.category_id),
    };

    const res = await fetch(`http://localhost:4000/products/${formData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Sửa sản phẩm thất bại!");
      return;
    }
    await fetchProducts();
    setIsEditing(false);
    resetForm();
  };

  // --- Xóa sản phẩm ---
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    const res = await fetch(`http://localhost:4000/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Xóa sản phẩm thất bại!");
      return;
    }
    await fetchProducts();
  };

  // --- List danh mục phẳng cho hiển thị bảng ---
  const flatList = useMemo(() => {
    const result: { id: number; parent: string; child: string }[] = [];
    categories.forEach((cat) => {
      if (cat.parent === null && cat.children && cat.children.length > 0) {
        cat.children.forEach((child) => {
          result.push({
            id: child.id,
            parent: cat.ten_danh_muc,
            child: child.ten_danh_muc,
          });
        });
      }
    });
    return result;
  }, [categories]);

  // --- Filter sản phẩm theo tên ---
  const filteredProducts = products.filter((p) =>
    p.ten_san_pham.toLowerCase().includes(searchQuery.toLowerCase())
  );
console.log(inventoryList);

  // --- Render ---
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
            {/* Chọn lô kho */}
            <select name="khoId" value={formData.khoId || ""} onChange={handleSelectKho} required>
  <option value="">Chọn hàng hóa</option>
  {inventoryList.map(item => (
    <option key={item.id} value={item.id}>
      {item.ten_hang_hoa || item.name}
    </option>
  ))}
</select>


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
            <select name="material" value={formData.material} onChange={handleChange}>
  <option value="">Chọn chất liệu</option>
  {availableMaterials.map(m => (
    <option key={m} value={m}>{m}</option>
  ))}
</select>
<select name="color" value={formData.color} onChange={handleChange}>
  <option value="">Chọn màu sắc</option>
  {availableColors.map(c => (
    <option key={c} value={c}>{c}</option>
  ))}
</select>
            <input
              name="quantity"
              type="number"
              placeholder="Số lượng nhập vào sản phẩm"
              value={formData.quantity}
              onChange={handleChange}
              required
              max={selectedItem?.so_luong || ""}
            />
            <select name="size" value={formData.size} onChange={handleChange}>
  <option value="">Chọn Size</option>
  {availableSizes.map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Chọn danh mục con</option>
              {categories
                .filter(c => c.parent) // chỉ danh mục con
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.ten_danh_muc}
                  </option>
                ))}
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
                {filteredProducts.map((sp, idx) => (
                  <tr key={sp.id}>
                    <td>{idx + 1}</td>
                    <td>{sp.ten_san_pham}</td>
                    <td>
                      {expandedId === sp.id ? (
                        <>
                          {sp.mo_ta}
                          <span
                            onClick={() => setExpandedId(null)}
                            className={styles.viewMore}
                          >
                            &nbsp;Thu gọn
                          </span>
                        </>
                      ) : (
                        <>
                          {sp.mo_ta
                            ? sp.mo_ta.split(" ").slice(0, 5).join(" ") + " ..."
                            : ""}
                          <span
                            onClick={() => setExpandedId(sp.id)}
                            className={styles.viewMore}
                          >
                            Xem thêm
                          </span>
                        </>
                      )}
                    </td>
                    <td>{Number(sp.gia).toLocaleString("vi-VN")}đ</td>
                    <td>
                      <img
                        src={sp.hinh_anh}
                        alt="Ảnh sản phẩm"
                        className={styles.productImage}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.onerror = null;
                          target.src = "https://via.placeholder.com/100";
                        }}
                      />
                    </td>
                    <td>{sp.chat_lieu}</td>
                    <td>{sp.mau_sac}</td>
                    <td>{sp.so_luong}</td>
                    <td>{sp.size}</td>
                    <td>
                      {typeof sp.category === "object" && sp.category
                        ? sp.category.parent
                          ? `${sp.category.parent.ten_danh_muc} - ${sp.category.ten_danh_muc}`
                          : sp.category.ten_danh_muc
                        : sp.category || ""}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEditClick(sp)}
                          className={styles.editBtn}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(sp.id)}
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
                name="material"
                value={formData.material}
                onChange={handleChange}
              />
              <input
                name="color"
                value={formData.color}
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
                name="category_id"
                value={formData.category_id}
                onChange={handleCategoryChange}
              >
                <option value="">Chọn danh mục con</option>
                {categories
                  .filter(c => c.parent) // chỉ danh mục con
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.ten_danh_muc}
                    </option>
                  ))}
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
              <div className={styles.addCategoryForm}>
                {/* Checkbox tạo danh mục gốc mới */}
                <div className={styles.checkboxRow}>
                  <label htmlFor="createRootCheckbox" className={styles.checkboxLabel}>
                    LƯU Ý! Nếu bạn muốn tạo thêm một Danh mục gốc mới xin vui lòng nhấn 👉👉👉
                  </label>
                  <input
                    type="checkbox"
                    checked={isCreatingNewRootCategory}
                    onChange={() => setIsCreatingNewRootCategory(prev => !prev)}
                    className={styles.bigCheckbox}
                    id="createRootCheckbox"
                  />
                </div>
                {/* Nếu chưa chọn tạo mới, dropdown danh mục gốc đã có */}
                {!isCreatingNewRootCategory && (
                  <select
                    name="parentId"
                    value={newCategory.parentId}
                    onChange={handleCategoryChange}
                    className={styles.dropdown}
                    required
                  >
                    <option value="">Chọn Danh mục gốc đã có</option>
                    {rootCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.ten_danh_muc}
                      </option>
                    ))}
                  </select>
                )}
                {/* Nếu tick checkbox, hiện ô nhập danh mục gốc mới */}
                {isCreatingNewRootCategory && (
                  <input
                    type="text"
                    name="newRootCategoryName"
                    value={newCategory.newRootCategoryName || ""}
                    onChange={handleCategoryChange}
                    placeholder="Nhập tên danh mục gốc mới"
                    className={styles.input}
                  />
                )}
                {/* Ô nhập danh mục con mới */}
                <input
                  type="text"
                  name="subCategoryName"
                  value={newCategory.subCategoryName || ""}
                  onChange={handleCategoryChange}
                  placeholder="Tên danh mục con mới"
                  className={styles.input}
                />
                <div className={styles.buttonGroup}>
                  <button
                    onClick={handleAddCategory}
                    className={styles.addCategoryBtn}
                    disabled={
                      isCreatingNewRootCategory
                        ? !newCategory.newRootCategoryName?.trim() || !newCategory.subCategoryName?.trim()
                        : !newCategory.parentId || !newCategory.subCategoryName?.trim()
                    }
                  >
                    Thêm
                  </button>
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

        {/* BẢNG DANH SÁCH DANH MỤC */}
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
              {flatList.map((row, idx) => (
                <tr key={row.id}>
                  <td>{idx + 1}</td>
                  <td>{row.parent}</td>
                  <td>{row.child}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteCategory(row.id)}
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
