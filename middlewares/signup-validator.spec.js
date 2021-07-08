const signupValidator = require("./signup-validator");
jest.mock("../config/index.js");
const User = require("../models/user");
const http = require("../app");
const supertest = require("supertest");
const connect = require("../config");

test("닉네임은 최소 5자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 이루어져 있다.", async () => {
  const res = {
    status: () => ({
      send: () => {},
    }),
    locals: {},
  };

  User.findOne = jest.fn();

  const mockedSend = jest.spyOn(res, "status");
  await signupValidator(
    {
      body: {
        id: "1",
        nickname: "ninja123",
        password: "qwe123",
        confirmPassword: "qwe123",
      },
    },
    res
  );

  expect(mockedSend).toBeCalledTimes(1);

  await signupValidator(
    {
      body: {
        id: "1Q84",
        nickname: "ninja123",
        password: "qwe123",
        confirmPassword: "qwe123",
      },
    },
    res
  );

  expect(mockedSend).toBeCalledTimes(2);

  await signupValidator(
    {
      body: {
        id: "1Q8492X",
        nickname: "ninja123",
        password: "qwe123",
        confirmPassword: "qwe123",
      },
    },
    res,
    () => {}
  );

  expect(User.findOne).toBeCalledTimes(1);
});

test("비밀번호는 최소 4자 이상, 아이디가 포함되어 있으면 안된다.", async () => {
  const mockedSend = jest.fn();

  await signupValidator(
    {
      body: {
        id: "1Q8492X",
        nickname: "ninja123",
        password: "1Q8492X1",
        confirmPassword: "1Q8492X1",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    }
  );

  expect(mockedSend).toBeCalledWith({
    message: "비밀번호에 ID가 포함되어있습니다.",
  });

  await signupValidator(
    {
      body: {
        id: "1Q8492X",
        nickname: "ninja123",
        password: "1Q8",
        confirmPassword: "1Q8",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    }
  );

  expect(mockedSend).toBeCalledWith({
    message: "입력조건을 확인해주세요.",
  });
});

test("비밀번호 확인은 비밀번호와 일치한다.", async () => {
  const mockedSend = jest.fn();

  await signupValidator(
    {
      body: {
        id: "1Q8492X",
        nickname: "ninja123",
        password: "qwe123",
        confirmPassword: "qwe1234",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    }
  );

  expect(mockedSend).toBeCalledWith({
    message: "입력조건을 확인해주세요.",
  });

  await signupValidator(
    {
      body: {
        id: "1Q8492X",
        nickname: "ninja123",
        password: "qwe1234",
        confirmPassword: "qwe1",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    }
  );

  expect(mockedSend).toBeCalledWith({
    message: "입력조건을 확인해주세요.",
  });
});

test("아이디 또는 닉네임이 중복될 경우 [이미 존재하는 ID 또는 닉네임입니다.]를 출력한다.", async () => {
  const mockedSend = jest.fn();

  await signupValidator(
    {
      body: {
        id: "mrrightnow123",
        nickname: "ninja123",
        password: "qwe123456",
        confirmPassword: "qwe123456",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    },
    () => {}
  );

  expect(mockedSend).toBeCalledWith({
    message: "이미 존재하는 ID 또는 닉네임입니다.",
  });

  await signupValidator(
    {
      body: {
        id: "ninja123",
        nickname: "21savage",
        password: "qwe123456",
        confirmPassword: "qwe123456",
      },
    },
    {
      status: () => ({
        send: mockedSend,
      }),
      locals: {},
    },
    () => {}
  );

  expect(mockedSend).toBeCalledWith({
    message: "이미 존재하는 ID 또는 닉네임입니다.",
  });
});
