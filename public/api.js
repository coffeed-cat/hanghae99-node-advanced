// const { default: axios } = require('axios');

$(document).ready(() => {
  console.log("ok");
  isItMe(console.log);
});

function isItMe(callback) {
  axios
    .get("/users/me", {
      headers: {
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
    .then((res) => {
      callback(res);
    })
    .catch((error) => {
      console.log(error.response.data.errorMessage);
      alert(error.response.data.errorMessage);
    });
}

function getCookie(key) {
  const value = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return value ? value[2] : null;
}

function setCookie(key, value, exp) {
  let date = new Date();
  date.setTime(date.getTime() + exp * 60 * 60 * 1000);
  document.cookie =
    key + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
}

function signin() {
  const id = $(".signin-id").val();
  const password = $(".signin-password").val();

  axios
    .post("/users/signin", {
      id,
      password,
    })
    .then((res) => {
      console.log(res.data.token);
      setCookie("token", res.data.token, 2);
      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
      alert(error);
    });
}
