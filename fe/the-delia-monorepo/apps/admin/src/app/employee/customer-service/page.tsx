"use client";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Header from "@shared/components/Header";
import Sidebar from "@shared/components/Sidebar";
import styles from "./customerService.module.css"; // Có thể dùng hoặc sửa lại CSS

const socket = io("http://localhost:4000"); // Đúng port backend của bạn

export default function CustomerServicePage() {
  const [chat, setChat] = useState<{ nguoi_gui: string, noi_dung: string }[]>([]);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState(""); // Ghi chú nội bộ
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => { socket.off("receive_message"); };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
  if (message.trim()) {
    socket.emit("send_message", {
      nguoi_gui: "nhan_vien",
      noi_dung: message,
      thoi_gian: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), // hoặc ISOString
    });
    setMessage("");
  }
};


  return (
    <div className={styles.container}>
      <Header />
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)", // 60px là giả định chiều cao Header, chỉnh lại nếu cần
        padding: "36px 64px 36px 0"
      }}>
        <div style={{
          width: "100%",
          maxWidth: 700,
          margin: "0 auto",
          padding: 36,
          background: "#fff",
          border: "1.5px solid #e5e7eb",
          borderRadius: 18,
          boxShadow: "0 4px 24px 0 #e3e8f3"
        }}>
          <h2 style={{ marginBottom: 18, color: "#2563eb", fontWeight: 700 }}>Chat với khách hàng</h2>
          <div
  ref={chatBoxRef}
  style={{
    minHeight: 220,
    maxHeight: 400,
    overflowY: "auto",
    background: "#f8fafc",
    border: "1.5px solid #e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 10
  }}
>
  {chat.length === 0 && <div style={{ color: "#999" }}>Chưa có tin nhắn...</div>}
  {chat.map((msg, idx) => {
    const isStaff = msg.nguoi_gui === "nhan_vien";
    return (
      <div
        key={idx}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isStaff ? "flex-end" : "flex-start",
          width: "100%",
        }}
      >
        <div
          style={{
            background: isStaff ? "linear-gradient(90deg,#4f46e5 0%,#2563eb 100%)" : "#e5e7eb",
            color: isStaff ? "#fff" : "#22733b",
            borderRadius: 18,
            padding: "12px 18px",
            maxWidth: "70%",
            minWidth: "60px",
            fontSize: 15,
            fontWeight: isStaff ? 500 : 600,
            marginLeft: isStaff ? "auto" : 0,
            marginRight: isStaff ? 0 : "auto",
            boxShadow: "0 1px 4px 0 #e2e8f0"
          }}
        >
          <div>
            <span>
              <b>{isStaff ? "Tôi" : "Khách hàng"}:</b> {msg.noi_dung}
            </span>
          </div>
        </div>
        <div
          style={{
            color: "#b0b4ba",
            fontSize: 12,
            marginTop: 3,
            marginLeft: isStaff ? 0 : 10,
            marginRight: isStaff ? 10 : 0,
            fontWeight: 400
          }}
        >
          {msg.thoi_gian || ""}
        </div>
      </div>
    );
  })}
</div>

          <div style={{ display: "flex", gap: 12 }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{
                flex: 1,
                border: "1.5px solid #2563eb",
                borderRadius: 12,
                padding: 12,
                fontSize: 16
              }}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Nhập tin nhắn..."
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 600,
                padding: "0 36px",
                fontSize: 16,
                cursor: "pointer"
              }}
            >Gửi</button>
          </div>

          {/* Khung ghi chú nội bộ */}
          <div style={{ marginTop: 38 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#415" }}>
              Ghi chú nội bộ
            </h3>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho cuộc hội thoại này..."
              style={{
                width: "100%",
                minHeight: 80,
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                fontSize: 15,
                padding: 12,
                resize: "vertical"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
