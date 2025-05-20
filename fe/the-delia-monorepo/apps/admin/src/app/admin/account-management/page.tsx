"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";
import PermissionModal from "@shared/components/PermissionModal";

interface Account {
  address: string;
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: string;
  password?: string;
}

type AccountType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
};

export default function AccountManagement() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(
    null
  );

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (msg: string) => {
    setToastMsg(msg);
    setShowToast(false); // Reset animation
    setTimeout(() => setShowToast(true), 10); // Delay 10ms để trigger re-render & animation lại
  }

 const [accounts, setAccounts] = useState<Account[]>([
   {
     id: 0,
     name: "",
     phone: "",
     email: "",
     role: "",
     status: "",
     address: "",
   },
 ]);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenPermission = (account: AccountType) => {
    setSelectedAccount(account);
    setIsPermissionModalOpen(true);
  };

 const [formData, setFormData] = useState({
   name: "",
   phone: "",
   email: "",
   role: "",
   status: "Hoạt động",
   address: "",
   password: "",
 });

 const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:4000/users");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Lỗi khi fetch tài khoản:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

const handleFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === "role") {
    // Gán mật khẩu mặc định nếu là nhân viên, xóa nếu là admin
    setFormData((prev) => ({
      ...prev,
      role: value,
      password: value === "Nhân viên" ? "1234567890@" : "",
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleAddAccount = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const payload = {
      ho_ten: formData.name,
      email: formData.email,
      so_dien_thoai: formData.phone,
      dia_chi: formData.address,
      vai_tro: formData.role === "Admin" ? "admin" : "nhan_vien",
      password: "1234567890@", // bạn có thể đặt mặc định
    };

    const res = await fetch("http://localhost:4000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!formData.email.includes("@")) {
  alert("❗ Email không hợp lệ");
  return;
}


    if (!res.ok) {
      const err = await res.json();
      alert("❌ " + (err.message || "Thêm tài khoản thất bại"));
      return;
    }

    alert("✅ Thêm tài khoản thành công!");

    // Refetch lại danh sách người dùng
    const newUser = await res.json();
    setAccounts((prev) => [...prev, {
      id: newUser.id,
      name: newUser.ho_ten,
      email: newUser.email,
      phone: newUser.so_dien_thoai,
      address: newUser.dia_chi,
      role: newUser.vai_tro === "admin" ? "Admin" : "Nhân viên",
      status: newUser.trang_thai ? "Hoạt động" : "Khóa",
    }]);

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "",
      status: "Hoạt động",
      address: "",
      password: "",
    });
    setIsAdding(false);

  } catch (err) {
    console.error(err);
    alert("❌ Thêm tài khoản thất bại!");
  }
};


  const handleEditAccount = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingAccount) return;

  try {
    const payload = {
      ho_ten: formData.name,
      so_dien_thoai: formData.phone,
      dia_chi: formData.address,
      vai_tro: formData.role,
      trang_thai: formData.status === "1", // convert to boolean
    };

    const res = await fetch(`http://localhost:4000/users/${editingAccount.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Lỗi cập nhật tài khoản");
    }

    alert("✅ Cập nhật tài khoản thành công!");

    setIsEditing(false);
    setEditingAccount(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "",
      status: "1",
      address: "",
      password: "",
    });

    // reload danh sách tài khoản
    fetchAccounts();
  } catch (err: any) {
    console.error(err);
    alert(`❌ ${err.message || "Cập nhật thất bại!"}`);
  }
};

const handleDeleteAccount = async (id: number, name: string) => {
  const confirm = window.confirm(`Bạn có chắc muốn xóa tài khoản "${name}"?`);
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:4000/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Xóa tài khoản thất bại");
    }

    alert("✅ Đã xóa tài khoản thành công!");
    fetchAccounts(); // gọi lại danh sách mới
  } catch (err: any) {
    console.error(err);
    alert("❌ " + (err.message || "Xóa thất bại"));
  }
};



  const handleOpenEdit = (account: Account) => {
    if (account.role === "Khách hàng") {
      showToastMessage("🚫 Bạn không thể cập nhật thông tin khách hàng!");
      return;
    }
    setEditingAccount(account);
    
      setFormData({
  name: account.name,
  phone: account.phone || "",
  email: account.email,
  role: account.role === "Admin" ? "admin" : "nhan_vien", // standardized
  status: account.status === "Hoạt động" ? "1" : "0", // convert to string if using <select>
  address: account.address || "",
  password: "", // optional
    });
    setIsEditing(true);
  }

 const handleToggleStatus = async (id: number) => {
  try {
    const res = await fetch(`http://localhost:4000/users/${id}/status`, {
      method: "PATCH",
    });

    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

    // Cập nhật lại trạng thái local
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === id
          ? {
              ...acc,
              status: acc.status === "Hoạt động" ? "Khóa" : "Hoạt động",
            }
          : acc
      )
    );

    alert("✅ Cập nhật trạng thái thành công");
  } catch (err: any) {
    console.error(err);
    alert("❌ " + err.message || "Lỗi khi khóa/mở tài khoản");
  }
};


  const filteredAccounts = accounts.filter((acc) =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Quản Lý Tài Khoản(Admin)</h1>

        <div className={styles.actionBar}>
          <div className={styles.leftActions}>
            <button onClick={() => setIsAdding(true)} className={styles.addBtn}>
              + THÊM
            </button>
          </div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Đăng Nhập</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th>Mật khẩu</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredAccounts.map((acc, idx) => (
              <tr key={acc.id}>
                <td>{idx + 1}</td>
                <td>{acc.name}</td>
                <td>{acc.email}</td>
                <td>{acc.phone}</td>
                <td>{acc.address}</td>
                <td>
                  <span
                    className={
                      acc.role === "Admin"
                        ? styles.roleAdmin
                        : acc.role === "Nhân viên"
                          ? styles.roleStaff
                          : styles.roleCustomer
                    }
                  >
                    {acc.role}
                  </span>
                </td>

                <td>{acc.role === "Nhân viên" ? "********" : ""}</td>

                <td>
                  {acc.status === "Hoạt động" ? (
                    <span className={styles.activeStatus}>🟢 Hoạt động</span>
                  ) : (
                    <span className={styles.inactiveStatus}>🔒 Khóa</span>
                  )}
                </td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleOpenEdit(acc)}
                  >
                    Cập nhật
                  </button>
                  <button
                    className={styles.lockBtn}
                    onClick={() => handleToggleStatus(acc.id)}
                  >
                    {acc.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                  </button>
                  {acc.role !== "Khách hàng" && (
                    <button
                      className={styles.permissionBtn}
                      onClick={() => {
                        setSelectedAccount(acc);
                        setIsPermissionModalOpen(true);
                      }}
                    >
                      Phân quyền
                    </button>
                  )}

                  <PermissionModal
                    isOpen={isPermissionModalOpen}
                    onClose={() => setIsPermissionModalOpen(false)}
                    accountName={
                      selectedAccount ? selectedAccount.name : "Người dùng"
                    } // Nếu có tài khoản được chọn, sẽ hiển thị tên tài khoản, nếu không thì mặc định là "Người dùng"
                  />

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteAccount(acc.id, acc.name)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(isAdding || isEditing) && (
          <div className={styles.formOverlay}>
            <div className={styles.formPopup}>
              <h2>{isAdding ? "Thêm tài khoản" : "Cập nhật tài khoản"}</h2>
              <form
                className={styles.form}
                onSubmit={isAdding ? handleAddAccount : handleEditAccount}
              >
                {/* ID chỉ hiện khi cập nhật */}
                {(isAdding || isEditing) && (
  <>
    <div className={styles.formGroup}>
      <input
        name="name"
        type="text"
        placeholder="Nhập Họ và tên"
        value={formData.name}
        onChange={handleFormChange}
        required
      />
    </div>

    {!isEditing && (
      <div className={styles.formGroup}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormChange}
          required
        />
      </div>
    )}

    <div className={styles.formGroup}>
      <input
        name="phone"
        type="text"
        placeholder="Số điện thoại"
        value={formData.phone}
        onChange={handleFormChange}
      />
    </div>

    <div className={styles.formGroup}>
      <input
        name="address"
        type="text"
        placeholder="Địa chỉ"
        value={formData.address}
        onChange={handleFormChange}
      />
    </div>

    <div className={styles.formGroup}>
      <select
        name="role"
        value={formData.role}
        onChange={handleFormChange}
        required
      >
        <option value="">-- Chọn vai trò --</option>
        <option value="admin">Admin</option>
        <option value="nhan_vien">Nhân viên</option>
      </select>
    </div>

    <div className={styles.formGroup}>
      <select
        name="status"
        value={formData.status}
        onChange={handleFormChange}
        required
      >
        <option value="1">Hoạt động</option>
        <option value="0">Khóa</option>
      </select>
    </div>

    {/* Mật khẩu mặc định */}
    {!isEditing && (
      <div className={styles.formGroup}>
        <input
          name="password"
          type="text"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleFormChange}
          readOnly={formData.role === "nhan_vien"}
          disabled={formData.role === "admin"}
           className={
        formData.role === "admin" ? styles.inputReadOnly : ""
      }
        />
      </div>
    )}
  </>
)}

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
                      setEditingAccount(null);
                      setFormData({
                        name: "",
                        phone: "",
                        email: "",
                        role: "",
                        status: "Hoạt động",
                        address: "",
                        password: "Mật Khẩu",
                      });
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {showToast && <div className={styles.toast}>{toastMsg}</div>}
    </div>
  );
}
