"use client";
import { useState } from "react";
import styles from "./staff.module.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Staff {
  id: number;
  name: string;
  phone: string;
  role: string;
  status: string;
}

export default function StaffPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [staffs, setStaffs] = useState<Staff[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      role: "Quản lý",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Trần Thị B",
      phone: "0902345678",
      role: "Nhân viên",
      status: "Khóa",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "",
    status: "Hoạt động",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: Staff = {
      id: Date.now(),
      ...formData,
    };
    setStaffs([...staffs, newStaff]);
    setFormData({ name: "", phone: "", role: "", status: "Hoạt động" });
    setIsAdding(false);
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    const updated = staffs.map((s) =>
      s.id === editingStaff.id ? { ...s, ...formData, id: s.id } : s
    );
    setStaffs(updated);
    setEditingStaff(null);
    setFormData({ name: "", phone: "", role: "", status: "Hoạt động" });
    setIsEditing(false);
  };

  const handleOpenEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
    });
    setIsEditing(true);
  };

  const handleToggleStatus = (id: number) => {
    const target = staffs.find((s) => s.id === id);
    if (!target) return;

    const newStatus = target.status === "Hoạt động" ? "Khóa" : "Hoạt động";

    setStaffs((prev) =>
      prev.map((staff) =>
        staff.id === id ? { ...staff, status: newStatus } : staff
      )
    );

    alert(`${newStatus === "Khóa" ? "Đã khóa" : "Đã mở khóa"} ${target.name}`);
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Quản lý nhân viên</h1>

        <div className={styles.actionBar}>
          <div className={styles.leftActions}>
            <button onClick={() => setIsAdding(true)} className={styles.addBtn}>
              + Thêm nhân viên
            </button>
          </div>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>Tìm kiếm</button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>SĐT</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffs.map((staff, idx) => (
              <tr key={staff.id}>
                <td>{idx + 1}</td>
                <td>{staff.name}</td>
                <td>{staff.phone}</td>
                <td>{staff.role}</td>
                <td>
                  {staff.status === "Hoạt động" ? (
                    <span className={styles.activeStatus}>🟢 Hoạt động</span>
                  ) : (
                    <span className={styles.inactiveStatus}>🔒 Khóa</span>
                  )}
                </td>
                <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleOpenEdit(staff)}
                  >
                    Cập nhật
                  </button>
                  <button
                    className={styles.lockBtn}
                    onClick={() => handleToggleStatus(staff.id)}
                  >
                    {staff.status === "Hoạt động" ? "Khóa" : "Mở khóa"}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setStaffs(staffs.filter((s) => s.id !== staff.id))
                    }
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
              <h2>{isAdding ? "Thêm nhân viên" : "Cập nhật nhân viên"}</h2>
              <form
                className={styles.form}
                onSubmit={isAdding ? handleAddStaff : handleEditStaff}
              >
                {isEditing && editingStaff && (
                  <input
                    type="text"
                    value={editingStaff.id}
                    readOnly
                    className={styles.inputReadOnly}
                  />
                )}

                <input
                  name="name"
                  type="text"
                  placeholder="Họ và tên"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <input
                  name="phone"
                  type="text"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Chọn chức vụ</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Nhân viên">Nhân viên</option>
                </select>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                </select>
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
                      setEditingStaff(null);
                      setFormData({
                        name: "",
                        phone: "",
                        role: "",
                        status: "Hoạt động",
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
    </div>
  );
}
