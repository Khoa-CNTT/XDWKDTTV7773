"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import AccountModal from "@shared/components/AccountModal";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Không rõ";
    const role = localStorage.getItem("userRole") || "Không rõ";
    setUserName(name);
    setUserRole(role === "admin" ? "Quản trị viên" : "Nhân viên");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const handleUserClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <div className="header-actions">
        <button className="user-info-button" onClick={handleUserClick}>
          <div className="user-icon">
            <FaUserAlt style={{ color: "white" }} />
          </div>
          <div className="user-text">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
          </div>
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Đăng Xuất
        </button>
      </div>

      <AccountModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </header>
  );
}
