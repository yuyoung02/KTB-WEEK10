// 게시글 상세, 좋아요, 댓글 API
import { apiClient } from "./client";

export const getPostDetail = (postId) =>
  apiClient(`/posts/${postId}`, { auth: true });

export const updatePost = (postId, {
  patchSubject,
  patchText,
  patchStadiumId,
  image,
}) => {
  const formData = new FormData();
  formData.append(
    "post",
    new Blob([
      JSON.stringify({ patchSubject, patchText, patchStadiumId }),
    ], { type: "application/json" }),
  );

  if (image) {
    formData.append("image", image);
  }

  return apiClient(`/posts/${postId}`, {
    method: "PATCH",
    auth: true,
    body: formData,
  });
};

export const deletePost = (postId) =>
  apiClient(`/posts/${postId}`, {
    method: "DELETE",
    auth: true,
  });

export const getLikeStatus = (postId) =>
  apiClient(`/posts/${postId}/likes`, {
    auth: true,
  });

export const addLike = (postId) =>
  apiClient(`/posts/${postId}/likes`, {
    method: "POST",
    auth: true,
  });

export const removeLike = (postId) =>
  apiClient(`/posts/${postId}/likes`, {
    method: "DELETE",
    auth: true,
  });

export const getComments = (postId) =>
  apiClient(`/posts/${postId}/comments`, { auth: true });

export const createComment = (postId, commentText) =>
  apiClient(`/posts/${postId}/comments`, {
    method: "POST",
    auth: true,
    body: { commentText },
  });

export const updateComment = (postId, commentId, commentText) =>
  apiClient(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    auth: true,
    body: { commentText },
  });

export const deleteComment = (postId, commentId) =>
  apiClient(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    auth: true,
  });
