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
      alert("로그인이 필요한 서비스입니다.");
      deleteCookie("token");
      openSigninPage();
    });
}

function loginChecker() {
  if (getCookie("token")) {
    isItMe(() => {
      window.location.href = "/";
      alert("이미 로그인되어있습니다. 홈페이지로 돌아갑니다.");
    });
  }
}

function deleteCookie(key) {
  document.cookie = key + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;";
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

function openSigninPage() {
  window.location.href = "/users/signin";
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
      setCookie("token", res.data.token, 2);
      window.location.href = "/";
    })
    .catch((error) => {
      alert("아이디 또는 비밀번호를 확인해주세요.");
    });
}

function logout() {
  if (getCookie("token")) {
    deleteCookie("token");
    alert("성공적으로 로그아웃되었습니다!");
    window.location.href = "/users/signin";
  }
}

function openSignupPage() {
  window.location.href = "/users/signup";
}

function signup() {
  const id = $(".signup-id").val();
  const nickname = $(".signup-nickname").val();
  const password = $(".signup-password").val();
  const confirmPassword = $(".signup-confirmPassword").val();
  axios
    .post("/users/signup", {
      id,
      nickname,
      password,
      confirmPassword,
    })
    .then((res) => {
      alert("회원가입을 축하드립니다!");
      window.location.href = "/users/signin";
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
}

function loadArticles(callback, articleId) {
  axios
    .get(`/articles/${articleId ? articleId + "/data" : ""}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((error) => {
      alert("게시글 불러오기를 실패했습니다.");
    });
}

function makeArticleCard(i, v) {
  const newArticleCard = `<p id=${v.articleId}>${i + 1} <a href="/articles/${
    v.articleId
  }">${v.title}</a> ${v.nickname} ${v.date}</p>`;
  $(".articles-container").append(newArticleCard);
}

function openPostNewArticlePage() {
  window.location.href = "/newarticle";
}

function renderArticleDetail(article) {
  $(".detail-title").text(article.title);
  $(".detail-content").text(article.content);
  $(".detail-nickname").text(article.nickname);
  $(".detail-date").text(article.date);
}

function postNewArticle() {
  const date = new Date().getTime();
  const title = $(".newarticle-title").val();
  const content = $(".newarticle-content").val();

  axios
    .post(
      "/newarticle",
      {
        date,
        title,
        content,
      },
      {
        headers: {
          authorization: `Bearer ${getCookie("token")}`,
        },
      }
    )
    .then((res) => {
      window.location.href = "/"; // 여기 detail로 가도록 수정
    })
    .catch((error) => {
      alert(error.response.data.error);
    });
}
