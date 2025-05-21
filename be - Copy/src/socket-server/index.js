const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2/promise");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "123123",
  database: "fashion_app",
});

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

httpServer.listen(4001, () => {
  console.log("Live chat server listening on *:4001");
});

async function getCustomers() {
  const [rows] = await db.query(
    `
    SELECT
      id_nguoidung,
      MAX(thoi_gian) AS last_time,
      MAX(CASE WHEN trang_thai = 'dang_cho' THEN 'dang_cho' ELSE 'da_tra_loi' END) AS trang_thai,
      MAX(CASE WHEN nguoi_gui='khach' THEN noi_dung END) AS last_message
    FROM chat_ho_tro
    GROUP BY id_nguoidung
    ORDER BY last_time DESC
    `
  );
  for (const row of rows) {
    row.ten_khach = `Khách #${row.id_nguoidung}`;
  }
  return rows;
}

io.on("connection", (socket) => {
  socket.on("list_customers", async () => {
    const customers = await getCustomers();
    socket.emit("customers", customers);
  });

  socket.on("get_history", async ({ id_nguoidung }) => {
    const [messages] = await db.query(
      "SELECT * FROM chat_ho_tro WHERE id_nguoidung = ? ORDER BY thoi_gian ASC",
      [id_nguoidung]
    );
    socket.emit("chat_history", messages);
  });

  socket.on("send_message", async (msg) => {
  if (!msg.id_nguoidung) return;
  // Kiểm tra id_nguoidung có tồn tại thật trong bảng nguoi_dung
  const [users] = await db.query("SELECT id_nguoidung FROM nguoi_dung WHERE id_nguoidung = ?", [msg.id_nguoidung]);
  if (users.length === 0) {
    console.log("id_nguoidung không hợp lệ:", msg.id_nguoidung);
    return;
  }
  await db.query(
    "INSERT INTO chat_ho_tro (id_nguoidung, nguoi_gui, noi_dung, trang_thai) VALUES (?, ?, ?, ?)",
    [
      msg.id_nguoidung,
      msg.nguoi_gui,
      msg.noi_dung,
      msg.nguoi_gui === "nhan_vien" ? "da_tra_loi" : "dang_cho"
    ]
  );
  io.emit("receive_message", msg);
});

  socket.on("mark_done", async ({ id_nguoidung }) => {
    await db.query(
      `UPDATE chat_ho_tro SET trang_thai = 'da_tra_loi' WHERE id_nguoidung = ?`,
      [id_nguoidung]
    );
    const customers = await getCustomers();
    io.emit("customers", customers);
  });
});
