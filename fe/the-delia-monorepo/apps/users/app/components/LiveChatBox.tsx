"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000"); // Đúng địa chỉ BE

export default function LiveChatBox() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ nguoi_gui: string, noi_dung: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
    return () => { socket.off("receive_message"); };
  }, []);

   useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const sendMessage = () => {
  if (message.trim()) {
    socket.emit("send_message", {
      nguoi_gui: "khach",
      noi_dung: message,
      thoi_gian: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), // hoặc ISOString
    });
    setMessage("");
  }
};


  if (!isOpen) {
    return (
      <button
        style={{
          position: "fixed", bottom: 100, right: 100, zIndex: 1100,
          background: "#2b7cff", color: "#fff", borderRadius: "50%",
          width: 52, height: 52, border: "none", boxShadow: "0 2px 8px #aaa",
          cursor: "pointer", fontSize: 28
        }}
        title="Chat với nhân viên"
        onClick={() => setIsOpen(true)}
      >
        <i className="bi bi-chat-dots"></i>
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: 20, right: 80,
      background: "#fff", border: "1px solid #eee", width: 380, padding: 15,
      borderRadius: 12, boxShadow: "0 2px 20px #bbb", zIndex: 1101
    }}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <h3 style={{ margin: 0, fontWeight: 600 }}>Live Chat với nhân viên</h3>
        <button
          style={{ background: "none", border: "none", fontSize: 22, color: "#666", cursor: "pointer" }}
          onClick={() => setIsOpen(false)}
          title="Đóng"
        >×</button>
      </div>
      <div style={{
        maxHeight: 180,
        overflowY: "auto",
        marginBottom: 8,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
        {chat.map((msg, idx) => {
          const isMe = msg.nguoi_gui === "khach";
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              {/* Tên người gửi */}
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: isMe ? "#2563eb" : "#16a34a",
                marginBottom: 2,
                textAlign: isMe ? "right" : "left"
              }}>
                {isMe ? "Tôi" : "Nhân viên"}
              </div>
              {/* Bubble chat */}
              <div style={{
                background: isMe
                  ? "linear-gradient(90deg,#2563eb 0%,#3b82f6 100%)"
                  : "#e5e7eb",
                color: isMe ? "#fff" : "#222",
                borderRadius: 16,
                padding: "9px 16px",
                maxWidth: "90%",
                fontSize: 15,
                fontWeight: 500,
                marginLeft: isMe ? "auto" : 0,
                marginRight: isMe ? 0 : "auto",
                boxShadow: "0 1px 4px 0 #e2e8f0",
                wordBreak: "break-word"
              }}>
                {msg.noi_dung}
              </div>
              {/* Thời gian gửi */}
              <div style={{
                color: "#b0b4ba",
                fontSize: 11,
                marginTop: 2,
                textAlign: isMe ? "right" : "left"
              }}>
                {msg.thoi_gian || ""}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, border: "1px solid #ccc", padding: 5, borderRadius: 4 }}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>Gửi</button>
      </div>
    </div>
  );
}