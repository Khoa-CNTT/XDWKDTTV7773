// src/data/dashboardData.ts

export const bestSellingData = [
  { name: "Sản phẩm A", value: 400 },
  { name: "Sản phẩm B", value: 300 },
  { name: "Sản phẩm C", value: 300 },
  { name: "Sản phẩm D", value: 200 },
];

export const revenueDataByYear: {
  [year: string]: {
    [month: string]: { name: string; value: number }[];
  };
} = {
  "2023": {
    "Tháng 1": [
      { name: "Tuần 1", value: 1000 },
      { name: "Tuần 2", value: 1200 },
      { name: "Tuần 3", value: 1100 },
      { name: "Tuần 4", value: 900 },
    ],
    "Tháng 2": [
      { name: "Tuần 1", value: 1300 },
      { name: "Tuần 2", value: 1400 },
      { name: "Tuần 3", value: 1200 },
      { name: "Tuần 4", value: 1000 },
    ],
    // Thêm tháng khác nếu cần
  },
  "2024": {
    "Tháng 1": [
      { name: "Tuần 1", value: 1500 },
      { name: "Tuần 2", value: 1600 },
      { name: "Tuần 3", value: 1400 },
      { name: "Tuần 4", value: 1300 },
    ],
    "Tháng 3": [
      { name: "Tuần 1", value: 2000 },
      { name: "Tuần 2", value: 2200 },
      { name: "Tuần 3", value: 2100 },
      { name: "Tuần 4", value: 1800 },
    ],
  },
};
