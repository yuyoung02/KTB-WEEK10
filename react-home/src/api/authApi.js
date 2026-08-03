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

export function signup({ email, password, nickname, image }) {
  const formData = new FormData();
  formData.append(
    "user",
    new Blob([
      JSON.stringify({ email, password, nickname }),
    ], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }

  return apiClient("/users/signup", {
    method: "POST",
    body: formData,
  });
}
