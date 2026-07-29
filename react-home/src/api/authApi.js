// 로그인, 회원가입 API
import { apiClient } from "./client";

export function login({ email, password }) {
  return apiClient("/users/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
}

export function signup({ email, password, nickname, image = null }) {
  return apiClient("/users/signup", {
    method: "POST",
    body: {
      email,
      password,
      nickname,
      image,
    },
  });
}
