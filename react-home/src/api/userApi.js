// 내 정보 조회, 수정, 탈퇴와 비밀번호 변경 API
import { apiClient } from "./client";

export function getCurrentUser() {
  return apiClient("/users/me", {
    method: "GET",
    auth: true,
  });
}

export function updateCurrentUser({ nickname, image }) {
  return apiClient("/users/me", {
    method: "PATCH",
    auth: true,
    body: {
      nickname,
      image,
    },
  });
}

export function deleteCurrentUser(password) {
  return apiClient("/users/me", {
    method: "DELETE",
    auth: true,
    body: {
      password,
    },
  });
}

export function updatePassword({ originalPwd, newPwd, oneMoreNewPwd }) {
  return apiClient("/users/me/password", {
    method: "PATCH",
    auth: true,
    body: {
      originalPwd,
      newPwd,
      oneMoreNewPwd,
    },
  });
}
