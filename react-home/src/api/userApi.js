// 내 정보 조회, 수정, 탈퇴와 비밀번호 변경 API
import { apiClient } from "./client";

export function getCurrentUser() {
  return apiClient("/users/me", {
    method: "GET",
    auth: true,
  });
}

export function updateCurrentUser({ nickname, image }) {
  const formData = new FormData();
  formData.append(
    "user",
    new Blob([
      JSON.stringify({ nickname }),
    ], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }

  return apiClient("/users/me", {
    method: "PATCH",
    auth: true,
    body: formData,
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
