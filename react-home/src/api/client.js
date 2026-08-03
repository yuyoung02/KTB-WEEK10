// API 기본 주소, JSON 변환, 인증 헤더와 오류를 공통 처리
import { clearAccessToken, getAccessToken } from "../auth/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function apiClient(path, options = {}) {
  const {
    auth = false,
    headers,
    body,
    ...fetchOptions
  } = options;
  const requestHeaders = new Headers(headers);

  if (auth) {
    const accessToken = getAccessToken();
    if (!accessToken) {
      const error = new Error("로그인이 필요한 요청입니다.");
      error.status = 401;
      throw error;
    }
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const isFormData = body instanceof FormData;
  const requestBody = body && typeof body !== "string" && !isFormData
    ? JSON.stringify(body)
    : body;

  if (requestBody && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: requestHeaders,
    body: requestBody,
  });
  const contentType = response.headers.get("content-type") ?? "";
  const data = response.status === 204
    ? null
    : contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (auth && response.status === 401) {
      clearAccessToken();
    }
    const error = new Error(`API 요청에 실패했습니다. (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
