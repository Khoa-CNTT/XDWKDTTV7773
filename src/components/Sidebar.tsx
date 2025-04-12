"use client";

import { useRouter, usePathname } from "next/navigation";
import "./Sidebar.css";
import {
  FaSearch,
  FaChartBar,
  FaBullhorn,
  FaUser,
  FaWarehouse,
  FaList,
  FaMoneyBill,
  FaUsers,
  FaBox,
  FaUserCog,
  FaTachometerAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaTachometerAlt />, text: "Dashboard", path: "/dashboard" },
  {
    icon: <FaUserCog />,
    text: "Quản lý tài khoản",
    path: "/account-management",
  },
  { icon: <FaUsers />, text: "Quản lý nhân viên", path: "/staff" },
  { icon: <FaUser />, text: "Quản lý khách hàng", path: "/customer" },
  { icon: <FaWarehouse />, text: "Quản lý kho", path: "#" },
  { icon: <FaList />, text: "Quản lý danh mục", path: "#" },
  { icon: <FaMoneyBill />, text: "Quản lý thanh toán", path: "#" },
  { icon: <FaBox />, text: "Quản lý đơn hàng", path: "#" },
  { icon: <FaSearch />, text: "Tìm kiếm", path: "#" },
  { icon: <FaBullhorn />, text: "Marketing", path: "#" },
  { icon: <FaChartBar />, text: "Thống kê", path: "#" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // ← lấy path hiện tại

  const handleNavigation = (path: string) => {
    if (path !== "#") {
      router.push(path);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        THE DELIA
        <br />
        COUTURE
      </div>
      <div className="menu">
        {menuItems.map((item, idx) => {
          const isActive = pathname.startsWith(item.path); // so sánh path hiện tại
          return (
            <button
              key={idx}
              className={`menu-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
