const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routers");
const connect = require("./models");

connect(); //DB 연결

app.set("views", __dirname + "/views"); // ejs 사용허가
app.set("view engine", "ejs");

app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
); // 메인 라우터 연결

app.listen(8080, () => {
  console.log("Server On!!");
});
