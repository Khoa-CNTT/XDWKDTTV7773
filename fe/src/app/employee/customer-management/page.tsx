"use client";
 import { useState } from "react";
 import Sidebar from "@shared/components/Sidebar";
 import Header from "@shared/components/Header";
 import styles from "./page.module.css";
 
 type Customer = {
   id: number;
   name: string;
   phone: string;
   email: string;
 };
 
 export default function CustomerPage() {
   const [isAdding, setIsAdding] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
 
   const mockCustomers: Customer[] = [
     {
       id: 1,
       name: "Phạm Văn C",
       phone: "0903456789",
       email: "phamc@example.com",
     },
     { id: 2, name: "Lê Thị D", phone: "0904567890", email: "led@example.com" },
   ];
 
   return (
     <div className={styles.container}>
       <Header /> {/* Header component */}
       <Sidebar /> {/* Sidebar component */}
       <div className={styles.content}>
         <h1 className={styles.title}>Quản lý khách hàng</h1>
 
         {!isAdding && !isEditing && (
           <>
             <div className={styles.actionBar}>
               <button
                 onClick={() => setIsAdding(true)}
                 className={styles.addBtn}
               >
                 + Thêm khách hàng
               </button>
             </div>
             <table className={styles.table}>
               <thead>
                 <tr>
                   <th>STT</th>
                   <th>Họ tên</th>
                   <th>SĐT</th>
                   <th>Email</th>
                   <th>Hành động</th>
                 </tr>
               </thead>
               <tbody>
                 {mockCustomers.map((customer, idx) => (
                   <tr key={customer.id}>
                     <td>{idx + 1}</td>
                     <td>{customer.name}</td>
                     <td>{customer.phone}</td>
                     <td>{customer.email}</td>
                     <td>
                       <button
                         className={styles.editBtn}
                         onClick={() => {
                           setEditingCustomer(customer);
                           setIsEditing(true);
                         }}
                       >
                         Cập nhật
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </>
         )}
 
         {(isAdding || isEditing) && (
           <div className={styles.formWrapper}>
             <h2>{isAdding ? "Thêm khách hàng" : "Cập nhật khách hàng"}</h2>
             <form className={styles.form}>
               <input
                 type="text"
                 placeholder="Họ và tên"
                 defaultValue={editingCustomer?.name || ""}
               />
               <input
                 type="text"
                 placeholder="Số điện thoại"
                 defaultValue={editingCustomer?.phone || ""}
               />
               <input
                 type="email"
                 placeholder="Email"
                 defaultValue={editingCustomer?.email || ""}
               />
               <div className={styles.formActions}>
                 <button type="submit" className={styles.submitBtn}>
                   {isAdding ? "Thêm" : "Cập nhật"}
                 </button>
                 <button
                   type="button"
                   className={styles.cancelBtn}
                   onClick={() => {
                     setIsAdding(false);
                     setIsEditing(false);
                     setEditingCustomer(null);
                   }}
                 >
                   Hủy
                 </button>
               </div>
             </form>
           </div>
         )}
       </div>
     </div>
   );
 }