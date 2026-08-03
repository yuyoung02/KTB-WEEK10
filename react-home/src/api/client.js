// API 기본 주소, JSON 변환, 인증 헤더와 오류를 공통 처리
import { getAccessToken } from "../auth/tokenStorage";

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

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers: requestHeaders,
      body: requestBody,
    });
  } catch (cause) {
    const error = new Error("서버와 연결할 수 없습니다.");
    error.code = "NETWORK_ERROR";
    error.isNetworkError = true;
    error.cause = cause;
    throw error;
  }
  const contentType = response.headers.get("content-type") ?? "";
  const data = response.status === 204
    ? null
    : contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(`API 요청에 실패했습니다. (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// 네트워크·서버·상태 코드별 사용자 안내 문구 선택
export function getApiErrorMessage(error, messages = {}) {
  if (error?.isNetworkError) {
    return messages.network ?? "서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.";
  }

  if (error?.status >= 500) {
    return messages.server ?? "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return messages[error?.status] ?? messages.default ?? "요청을 처리하지 못했습니다.";
}
