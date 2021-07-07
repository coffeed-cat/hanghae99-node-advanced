const socket = io("ws://localhost:8080");

socket.on("connect", () => {
  console.log("I'm here!");
});

function isItMe(callback) {
  axios
    .get("/users/me", {
      headers: {
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
    .then((res) => {
      callback(res.data.user);
      // callback(res); // 왜 res.data를 넣으면 로그인이 필요하다고 뜨지?
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

function openHomePage() {
  window.location.href = "/";
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
    window.location.href = "/";
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
  if (!getCookie("token")) {
    if (
      confirm(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      )
    ) {
      window.location.href = "/users/signin";
    }
    return;
  }
  window.location.href = "/newarticle";
}

function renderArticleDetail(article) {
  $(".detail-title").text(article.title);
  $(".detail-content").text(article.content);
  $(".detail-nickname").text(article.nickname);
  $(".detail-date").text(article.date);
}

function deleteArticle() {
  if (!confirm("글을 삭제하시겠습니까?")) {
    return;
  } else {
    axios
      .delete(`/articles/${articleId}`, {
        headers: {
          authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then(() => {
        alert("글 삭제가 완료되었습니다!");
        window.location.href = "/";
      })
      .catch((error) => {
        if (error.response.status == 401) {
          alert("다른 사용자의 글은 삭제할 수 없습니다.");
        } else {
          alert("글 삭제에 실패했습니다.");
        }
        window.location.href = "/";
      });
  }
}

function openUpdateArticlePage(articleId) {
  window.location.href = `/newarticle?articleId=${articleId}`;
}

function updateArticle(articleId) {
  if (!articleId) {
    alert("올바르지 않은 요청입니다.");
    return;
  }
  console.log("okok update"); ///////////////////////////////////
  const lastFixDate = new Date().getTime();
  const title = $(".newarticle-title").val();
  const content = $(".newarticle-content").val();

  axios
    .patch(
      `/newarticle/${articleId}`,
      {
        lastFixDate,
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
      alert("글 수정을 완료하였습니다!");
      window.location.href = `/articles/${articleId}`;
    })
    .catch((error) => {
      if (error.response.status == 401) {
        alert("다른 사용자의 글은 수정할 수 없습니다.");
      } else {
        alert("게시글 수정에 실패했습니다.");
      }
      window.location.href = "/";
    });
}

function loadComments(callback, articleId, nickname, commentId) {
  axios
    .get(`/articles/${articleId}/comments/${commentId ? commentId : ""}`)
    .then((res) => {
      callback(res.data, nickname);
    })
    .catch((error) => {
      alert("댓글 불러오기를 실패했습니다.");
    });
}

function renderComments(comments, nickname) {
  $(".comments").empty();
  for (i of comments) {
    const newComment = `<p id="${i.commentId}" class="comment">
                          <span class="comment-nickname">${i.nickname} : </span
                          ><span class="comment-content">${i.content}</span>
                          <span class="comment-date">${i.date}</span>
                        </p>`;
    $(".comments").append(newComment);
    if (i.nickname === nickname) {
      const newButton = `<button class="update-comment-button" onclick="openUpdateCommentForm('${i.commentId}')">수정하기</button>
                            <button class="delete-comment-button" onclick="deleteComment('${i.commentId}')">삭제하기</button>`;
      $(`#${i.commentId}`).append(newButton);
    } //만약 댓글의 닉네임과, 접속한 사람의 닉네임이 같으면 수정삭제 버튼 추가
  }
}

function postComment() {
  const content = $(".comment-input").val();
  const date = new Date().getTime();

  if (!content) {
    alert("내용을 입력해주세요.");
    return;
  }

  axios
    .post(
      `/articles/${articleId}/comments`,
      { date, content },
      {
        headers: {
          authorization: `Bearer ${getCookie("token")}`,
        },
      }
    )
    .then((res) => {
      $(".comment-input").val("");
      socket.emit("COMMENTS_CHANGED_FROM_FRONT", articleId);
    })
    .catch((error) => {
      alert("댓글 작성에 실패했습니다.");
    });
}

function openUpdateCommentForm(commentId) {
  isItMe((user) => {
    if (user.nickname !== nickname) {
      alert("다른 사용자의 댓글은 수정할 수 없습니다.");
      window.location.reload();
      return;
    }
    loadComments(
      (data, nickname) => {
        const updateCommentForm = `<input class="update-comment-form" type="text"/>`;
        $(`#${commentId} .comment-content`).text(" ");
        $(`#${commentId} .comment-content`).append(updateCommentForm);
        $(`#${commentId} .update-comment-form`).val(`${data.content}`);
        document
          .getElementById(`${commentId}`)
          .querySelector(".update-comment-button")
          .setAttribute(
            "onclick",
            `updateComment('${commentId}','${articleId}')`
          );
      },
      articleId,
      nickname,
      commentId
    );
  });
}

function updateComment(commentId, articleId) {
  const content = $(`#${commentId} .update-comment-form`).val();

  axios
    .patch(
      `/articles/${articleId}/comments/${commentId}`,
      { content },
      {
        headers: {
          authorization: `Bearer ${getCookie("token")}`,
        },
      }
    )
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      alert("수정에 실패했습니다.");
      window.location.reload();
    });
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
      window.location.href = `/articles/${res.data.articleId}`;
    })
    .catch((error) => {
      alert("게시글 작성에 실패했습니다.");
      window.location.href = "/";
    });
}
