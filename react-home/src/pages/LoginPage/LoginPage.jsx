// 로그인 API 호출, 토큰 저장과 로그인 후 이동 처리
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { setAccessToken } from "../../auth/tokenStorage";
import LoginForm from "../../components/auth/LoginForm";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    try {
      setIsSubmitting(true);
      setError("");

      const data = await login({ email, password });
      setAccessToken(data.accessToken);
      const requestedLocation = location.state?.from;
      const destination = requestedLocation
        ? `${requestedLocation.pathname ?? "/"}${requestedLocation.hash ?? ""}`
        : "/";
      navigate(destination, { replace: true });
    } catch (requestError) {
      console.error(requestError);

      if (requestError.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (requestError.status === 400) {
        setError("입력값을 다시 확인해주세요.");
      } else {
        setError("로그인에 실패했거나 서버와 연결할 수 없습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="login-header">
        <Link to="/" className="login-logo">
          <h1>구장 이야기 ⚾️</h1>
        </Link>
      </header>

      <main className="login-page">
        <section className="login-container">
          <h2>로그인</h2>
          <LoginForm
            isSubmitting={isSubmitting}
            serverError={error}
            onSubmit={handleLogin}
          />
          <Link to="/signup" className="signup-link">회원가입</Link>
        </section>
      </main>
    </>
  );
}

export default LoginPage;
