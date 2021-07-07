const express = require("express");
const Http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const mainRouter = require("./routers");
const connect = require("./config");

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);

io.on("connect", (socket) => {
  // 방에 입장하는 이벤트
  socket.on("ENTER_DETAIL", (data) => {
    socket.join(data);
    socket.on("COMMENTS_CHANGED_FROM_FRONT", (data) => {
      io.to(data).emit("COMMENTS_CHANGED_FROM_BACK");
    });
  });
});

connect(); //DB 연결

app.set("views", __dirname + "/views"); // ejs 사용허가
app.set("view engine", "ejs");

app.use("/public", express.static("public"));
app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
); // 메인 라우터 연결

http.listen(8080, () => {
  console.log("Server On!!");
});
