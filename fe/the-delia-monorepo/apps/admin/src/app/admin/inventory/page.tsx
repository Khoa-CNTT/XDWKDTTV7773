"use client";
import { useState } from "react";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";
import styles from "./inventory.module.css";
import { FaHistory } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  supplier: string;
  quantity: number;
  price: string;
  size: string;
  material: string;
  color: string;
  status: string;
};


export default function InventoryPage() {
 const [products, setProducts] = useState<Product[]>([
   {
     id: 0,
     name: "",
     supplier: "",
     quantity: 0,
     price: "",
     size: "",
     material: "",
     color: "",
     status: "",
   },
 ]);

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


  const handleDelete = (id: number) => {
    const confirm = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (confirm) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "quantity" ? value.replace(/\D/, "") : value, }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const quantityNumber = parseInt(formData.quantity) || 0;
  
    if (!formData.name || !formData.supplier || quantityNumber <= 0) {
      alert("Vui lòng nhập đầy đủ thông tin và số lượng hợp lệ.");
      return;
    }
  
    // Kiểm tra trùng sản phẩm theo name + supplier
    const existingIndex = products.findIndex(
      (item) =>
        item.name.trim().toLowerCase() === formData.name.trim().toLowerCase() &&
        item.supplier.trim().toLowerCase() === formData.supplier.trim().toLowerCase()
    );
  
    if (existingIndex !== -1) {
      // Nếu trùng thì cộng dồn số lượng
      const updated = [...products];
      updated[existingIndex].quantity += quantityNumber;
      setProducts(updated);
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      // Nếu không trùng thì thêm mới
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name.trim(),
        supplier: formData.supplier.trim(),
        quantity: quantityNumber,
        price: formData.price.trim(),
        size: formData.size,
        material: formData.material.trim(),
        color: formData.color.trim(),
        status: "Đang bán",
      };
      setProducts((prev) => [...prev, newProduct]);
    }
  
    resetForm();
  };
  

  const handleEditClick = (product: Product) => {
    setFormData({
      id: product.id.toString(),
      name: product.name,
      supplier: product.supplier,
      quantity: product.quantity.toString(),
      price: product.price,
      size: product.size,
      material: product.material,
      color: product.color,
    });
    setIsEditing(true);
  };


const handleSaveEdit = () => {
const updated = products.map((p) =>
  p.id === parseInt(formData.id)
    ? {
        ...p,
        supplier: formData.supplier,
        quantity: parseInt(formData.quantity),
        price: formData.price,
        size: formData.size,
        material: formData.material,
        color: formData.color,
      }
    : p
);
  setProducts(updated);
  setIsEditing(false);
  resetForm();
};

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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
               placeholder="Tên hàng hóa"
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
               {filtered.map((product) => (
                 <tr key={product.id}>
                   <td>{String(product.id).padStart(2, "0")}</td>
                   <td>{product.name}</td>
                   <td>{product.supplier}</td>
                   <td>{product.price}</td>
                   <td>{product.quantity}</td>
                   <td>{product.size}</td>
                   <td>{product.material}</td>
                   <td>{product.color}</td>
                   <td>
                     {product.quantity === 0 ? (
                       <span className={styles.outOfStock}>Hết hàng</span>
                     ) : (
                       <span className={styles.inStock}>Còn hàng</span>
                     )}
                   </td>

                   <td>
                     <div className={styles.actionButtons}>
                       <button
                         className={styles.editBtn}
                         onClick={() => handleEditClick(product)}
                       >
                         Sửa
                       </button>
                       <button
                         className={styles.deleteBtn}
                         onClick={() => handleDelete(product.id)}
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
               <input type="text" value={formData.name} disabled />
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
                 <tr>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                   <td></td>
                 </tr>
               </tbody>
             </table>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}