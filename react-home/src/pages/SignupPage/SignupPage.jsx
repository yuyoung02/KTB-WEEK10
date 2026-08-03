// 회원가입 API와 성공 모달 -> 로그인 이동 처리
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/authApi";
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

      if (requestError.status === 409) {
        setError("이미 사용 중인 이메일 또는 닉네임입니다.");
      } else if (requestError.status === 400) {
        setError("입력값을 다시 확인해주세요.");
      } else {
        setError("회원가입에 실패했거나 서버와 연결할 수 없습니다.");
      }
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
