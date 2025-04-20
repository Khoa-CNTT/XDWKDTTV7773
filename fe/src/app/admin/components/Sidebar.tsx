"use client";

import { useRouter, usePathname } from "next/navigation";
import "./Sidebar.css";
import {

  FaChartBar,
  FaBullhorn,

  FaWarehouse,
  FaList,
  FaMoneyBill,
  
  FaBox,
  FaUserCog,
  FaTachometerAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaTachometerAlt />, text: "Dashboard", path: "/admin/dashboard" },
  {
    icon: <FaUserCog />,
    text: "Quản lý tài khoản",
    path: "/admin/account-management",
  },
  { icon: <FaWarehouse />, text: "Quản lý kho", path: "/admin/inventory" },
  { icon: <FaList />, text: "Quản lý danh mục", path: "/admin/category" },
  { icon: <FaMoneyBill />, text: "Quản lý thanh toán", path: "/admin/payment" },
  { icon: <FaBox />, text: "Quản lý đơn hàng", path: "/admin/order" },
  { icon: <FaBullhorn />, text: "Marketing", path: "/admin/marketing" },
  { icon: <FaChartBar />, text: "Thống kê", path: "/admin/statistic" },
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
