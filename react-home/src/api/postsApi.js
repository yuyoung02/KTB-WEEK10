// 게시글 목록, 작성, 구장 필터 API
import { apiClient } from "./client";

export function getPosts({ page = 0, size = 10, stadiumId = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  if (stadiumId) params.set("stadiumId", stadiumId);

  return apiClient(`/posts?${params.toString()}`);
}

export function createPost({ subject, text, image, stadiumId }) {
  const formData = new FormData();
  formData.append(
    "post",
    new Blob([
      JSON.stringify({ subject, text, stadiumId }),
    ], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }

  return apiClient("/posts", {
    method: "POST",
    auth: true,
    body: formData,
  });
}

// TODO: 백엔드가 stadiumId 쿼리 필터를 지원하면 게시글 목록 드롭다운에 연결한다.
export function getPostsByStadium(stadiumId) {
  return getPosts({ stadiumId });
}
