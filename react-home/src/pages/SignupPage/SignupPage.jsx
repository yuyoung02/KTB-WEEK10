// 회원가입 API와 성공 모달 -> 로그인 이동 처리
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/authApi";
import { getApiErrorMessage } from "../../api/client";
import SignupForm from "../../components/auth/SignupForm";
import SignupSuccessModal from "../../components/auth/SignupSuccessModal";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async ({ email, password, nickname, profileFile }) => {
    try {
      setIsSubmitting(true);
      setError("");

      await signup({
        email,
        password,
        nickname,
        image: profileFile,
      });
      setIsSuccessModalOpen(true);
    } catch (requestError) {
      console.error(requestError);

      setError(getApiErrorMessage(requestError, {
        400: "입력값을 다시 확인해주세요.",
        409: "이미 사용 중인 이메일 또는 닉네임입니다.",
        413: "프로필 이미지 용량이 너무 큽니다.",
        default: "회원가입 요청을 처리하지 못했습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="signup-header">
        <Link to="/login" className="signup-back-button" aria-label="로그인으로 돌아가기">
          ‹
        </Link>
        <Link to="/" className="signup-logo">
          <h1>구장 이야기 ⚾️</h1>
        </Link>
      </header>

      <main className="signup-page">
        <section className="signup-container">
          <h2>회원가입</h2>
          <SignupForm
            isSubmitting={isSubmitting}
            serverError={error}
            onSubmit={handleSignup}
          />
          <Link to="/login" className="signup-login-link">
            로그인하러 가기
          </Link>
        </section>
      </main>

      <SignupSuccessModal
        isOpen={isSuccessModalOpen}
        onConfirm={() => navigate("/login", { replace: true })}
      />
    </>
  );
}

export default SignupPage;
