"use client";

import { useState } from "react";
import styles from "./transaction.module.css";
import Sidebar from "@shared/components/Sidebar";
import Header from "@shared/components/Header";

type Product = {
  name: string;
  quantity: number;
  price: number;
};

type Transaction = {
  id: number;
  customerName: string;
  products: Product[];
  orderCode: string;
  status: string;
};

export default function TransactionManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 101010,
      orderCode: "HD10001",
      customerName: "Nguyễn Văn A",
      products: [
        { name: "Vest nam cao cấp", quantity: 2, price: 2500000 },
        { name: "Quần Tây", quantity: 1, price: 700000 },
      ],
      status: "CHƯA THANH TOÁN",
    },
    {
      id: 201010,
      orderCode: "HD10002",
      customerName: "Trần Thị B",
      products: [{ name: "Áo dài cưới", quantity: 1, price: 3200000 }],
      status: "ĐÃ THANH TOÁN",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customer: "",
    products: [{ name: "", quantity: 1, price: 0 }],
    orderCode: "",
  });
  const [paymentInvoice, setPaymentInvoice] = useState<Transaction | null>(
    null
  );

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredTransactions = transactions.filter(
    (item) =>
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    const newId = Math.max(...transactions.map((item) => item.id)) + 1;
    const newOrderCode = `HD${newId.toString().padStart(5, "0")}`;

    setInvoiceData({
      customer: "",
      products: [{ name: "", quantity: 1, price: 0 }],
      orderCode: newOrderCode,
    });

    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    const { customer, products } = invoiceData;

    if (
      !customer ||
      products.some(
        (product) =>
          !product.name || product.quantity <= 0 || product.price <= 0
      )
    ) {
      showNotification("Vui lòng nhập đầy đủ thông tin hóa đơn!");
      return;
    }

    const newTransaction: Transaction = {
      id: Math.max(...transactions.map((item) => item.id)) + 1,
      orderCode: invoiceData.orderCode,
      customerName: customer,
      products,
      status: "CHƯA THANH TOÁN",
    };

    setTransactions((prev) => [...prev, newTransaction]);
    setIsModalOpen(false);
    showNotification("Hóa đơn đã được lưu thành công!");
  };

  const handleConfirmPayment = (id: number) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "ĐÃ THANH TOÁN" } : item
      )
    );
    setPaymentInvoice(null);
    showNotification("Thanh toán thành công!");
  };

  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Quản Lý Giao Dịch</h1>

        <button
          className={styles.createInvoiceBtn}
          onClick={handleCreateInvoice}
        >
          +Tạo Hóa Đơn Mới
        </button>

        {notification && (
          <div className={styles.notification}>{notification}</div>
        )}

        <div className={styles.actionBar}>
          <input
            type="text"
            placeholder="Tìm theo ID, mã đơn hàng hoặc khách hàng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>MÃ ĐƠN HÀNG</th>
              <th>KHÁCH HÀNG</th>
              <th>SẢN PHẨM</th>
              <th>SỐ LƯỢNG</th>
              <th>TỔNG TIỀN</th>
              <th>TRẠNG THÁI</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.orderCode}</td>
                <td>{item.customerName}</td>
                <td>
                  {item.products.map((product, index) => (
                    <div key={index}>{product.name}</div>
                  ))}
                </td>
                <td>
                  {item.products.map((product, index) => (
                    <div key={index}>{product.quantity}</div>
                  ))}
                </td>
                <td>
                  {item.products
                    .reduce(
                      (total, product) =>
                        total + product.quantity * product.price,
                      0
                    )
                    .toLocaleString()}
                  ₫
                </td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className={styles.statusDropdown}
                  >
                    <option value="ĐÃ THANH TOÁN">ĐÃ THANH TOÁN</option>
                    <option value="CHƯA THANH TOÁN">CHƯA THANH TOÁN</option>
                  </select>
                </td>
                <td>
                  <button
                    className={styles.contactBtn}
                    onClick={() =>
                      alert(`Liên hệ khách hàng: ${item.customerName}`)
                    }
                  >
                    Liên hệ
                  </button>
                  {item.status === "CHƯA THANH TOÁN" && (
                    <button
                      className={styles.paymentBtn}
                      onClick={() => setPaymentInvoice(item)}
                    >
                      Thanh toán
                    </button>
                  )}
                  <button
                    className={styles.printBtn}
                    onClick={() => showNotification("In hóa đơn thành công!")}
                  >
                    In hóa đơn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Tạo Hóa Đơn */}
        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Tạo Hóa Đơn</h2>

              <div className={styles.formGroup}>
                <label>Mã Đơn Hàng</label>
                <input type="text" value={invoiceData.orderCode} disabled />
              </div>

              <div className={styles.formGroup}>
                <label>Khách Hàng</label>
                <input
                  type="text"
                  value={invoiceData.customer}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, customer: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Sản Phẩm</label>
                <input
                  type="text"
                  value={invoiceData.products[0].name}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      products: [
                        { ...invoiceData.products[0], name: e.target.value },
                      ],
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số Lượng</label>
                <input
                  type="number"
                  value={invoiceData.products[0].quantity}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      products: [
                        {
                          ...invoiceData.products[0],
                          quantity: +e.target.value,
                        },
                      ],
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>Số Tiền</label>
                <input
                  type="number"
                  value={invoiceData.products[0].price}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      products: [
                        { ...invoiceData.products[0], price: +e.target.value },
                      ],
                    })
                  }
                />
                <span>VNĐ</span>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  Hủy
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Hóa đơn Thanh Toán */}
        {paymentInvoice && (
          <div className={styles.modal}>
            <div className={styles.invoiceContainer}>
              <div className={styles.invoiceHeader}>
                <h2 className={styles.invoiceTitle}>🧾 HÓA ĐƠN THANH TOÁN</h2>
                <p className={styles.invoiceDate}>
                  Ngày lập hóa đơn: {new Date().toLocaleDateString()} -{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>

              <div className={styles.invoiceInfo}>
                <p>
                  <strong>Mã đơn hàng:</strong> {paymentInvoice.orderCode}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {paymentInvoice.customerName}
                </p>
              </div>

              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentInvoice.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{product.price.toLocaleString()}₫</td>
                      <td>
                        {(product.quantity * product.price).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.formGroup}>
                <label>Hình thức thanh toán</label>
                <select className={styles.selectPaymentMethod}>
                  <option value="Tiền mặt">Tiền mặt</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Quẹt thẻ">Quẹt thẻ</option>
                </select>
              </div>

              <div className={styles.invoiceTotal}>
                <p>
                  <strong>Tổng thanh toán:</strong>{" "}
                  {paymentInvoice.products
                    .reduce(
                      (total, product) =>
                        total + product.quantity * product.price,
                      0
                    )
                    .toLocaleString()}
                  ₫
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setPaymentInvoice(null)}
                >
                  Đóng
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleConfirmPayment(paymentInvoice.id)}
                >
                  Xác nhận Thanh Toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
