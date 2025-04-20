"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import AccountModal from "@admin/components/AccountModal";
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        {/* Toàn bộ này là một nút */}
        <button className="user-info-button" onClick={handleUserClick}>
          <div className="user-icon">
            <FaUserAlt style={{ color: "white" }} />
          </div>
          <div className="user-text">
            <div className="user-name">Nguyen Nam</div>
            <div className="user-role">Dev Admin</div>
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
