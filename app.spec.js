const http = require("./app");
const request = require("supertest");

test("아이디에는 알파벳과 숫자가 포함되어있어야한다", async () => {
  await request(http)
    .post("/users/signup")
    .send({
      id: "5544332211",
      nickname: "5544332211",
      password: "qwe123",
      confirmPassword: "qwe123",
    })
    .expect(400);
});
