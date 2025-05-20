"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import AccountModal from "@shared/components/AccountModal";
import "./Header.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export default function Header() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const res = await fetch(`http://localhost:4000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser({
        id: data.id_nguoidung,
        name: data.ho_ten,
        email: data.email,
        role: data.vai_tro === "quan_ly" ? "Quản trị viên" : "Nhân viên",
        phone: data.so_dien_thoai,
        address: data.dia_chi,
        avatar: data.anh_dai_dien,
      });
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="header">
      <div className="header-actions">
        <button className="user-info-button" onClick={() => setIsModalOpen(true)}>
          <div className="user-icon"><FaUserAlt style={{ color: "white" }} /></div>
          <div className="user-text">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </button>
        <button className="logout-button" onClick={handleLogout}>Đăng Xuất</button>
      </div>

      {user && (
        <AccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
          onUpdated={fetchUserInfo}
        />
      )}
    </header>
  );
}
