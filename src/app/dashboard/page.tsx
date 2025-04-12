"use client";

import styles from "./dashboard.module.css";
import {
  FaUserAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChartBar,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import { useState } from "react";

const PieChartBox = dynamic(() => import("@/components/PieChartBox"), {
  ssr: false,
});
const BarChartBox = dynamic(() => import("@/components/BarChartBox"), {
  ssr: false,
});

import { bestSellingData, revenueDataByYear } from "@/data/dashboardData"; // optional tách data

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState("Tháng 3");
  const [selectedYear, setSelectedYear] = useState("2024");

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const years = Object.keys(revenueDataByYear);

  return (
    <>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statCards}>
        <div className={styles.card + " " + styles.orange}>
          <FaUserAlt />
          <div>
            <div className={styles.cardTitle}>TỔNG SỐ KHÁCH HÀNG</div>
            <div>178 Khách hàng</div>
          </div>
        </div>
        <div className={styles.card + " " + styles.blue}>
          <FaBoxOpen />
          <div>
            <div className={styles.cardTitle}>TỔNG SỐ SẢN PHẨM</div>
            <div>610 Sản phẩm</div>
          </div>
        </div>
        <div className={styles.card + " " + styles.red}>
          <FaShoppingCart />
          <div>
            <div className={styles.cardTitle}>TỔNG SỐ ĐƠN HÀNG</div>
            <div>60 Đơn hàng</div>
          </div>
        </div>
        <div className={styles.card + " " + styles.green}>
          <FaChartBar />
          <div>
            <div className={styles.cardTitle}>TỔNG LƯỢT GHÉ THĂM</div>
            <div>1258 lượt truy cập</div>
          </div>
        </div>
      </div>

      <div className={styles.charts}>
        {/* Left: Pie Chart */}
        <div className={styles.chartBox}>
          <h2>SẢN PHẨM BÁN CHẠY</h2>
          <div className={styles.chartCenter}>
            <PieChartBox data={bestSellingData} />
          </div>
        </div>

        {/* Right: Bar Chart */}
        <div className={styles.chartBox}>
          <div className={styles.chartHeader}>
            <h2>THỐNG KÊ DOANH THU</h2>
            <div className={styles.selectGroup}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
          <BarChartBox
            data={
              (revenueDataByYear[selectedYear]?.[selectedMonth] ?? []) as {
                name: string;
                value: number;
              }[]
            }
          />
        </div>
      </div>
    </>
  );
}
