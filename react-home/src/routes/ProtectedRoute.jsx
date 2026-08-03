// 토큰과 현재 사용자를 확인해 인증 페이지 접근 제한
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "../api/userApi";
import { clearAccessToken, getAccessToken } from "../auth/tokenStorage";

function ProtectedRoute() {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState(
    getAccessToken() ? "checking" : "unauthenticated",
  );

  useEffect(() => {
    let isCancelled = false;

    async function verifyAuthentication() {
      if (!getAccessToken()) {
        setAuthStatus("unauthenticated");
        return;
      }

      try {
        await getCurrentUser();
        if (!isCancelled) setAuthStatus("authenticated");
      } catch (error) {
        console.error(error);
        if (error.status === 401 || error.status === 403) {
          clearAccessToken();
          if (!isCancelled) setAuthStatus("unauthenticated");
        } else if (!isCancelled) {
          setAuthStatus(error.isNetworkError ? "network-error" : "server-error");
        }
      }
    }

    verifyAuthentication();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (authStatus === "checking") {
    return <main className="route-status">로그인 정보를 확인하는 중입니다.</main>;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (authStatus === "network-error") {
    return <main className="route-status">서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.</main>;
  }

  if (authStatus === "server-error") {
    return <main className="route-status">서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</main>;
  }

  return <Outlet />;
}

export default ProtectedRoute;
