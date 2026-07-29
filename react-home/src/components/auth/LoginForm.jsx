// 로그인 입력값과 helper text 검증
import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm({ isSubmitting, serverError, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const validate = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setValidationError("이메일을 입력해주세요.");
      return false;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setValidationError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    if (!password.trim()) {
      setValidationError("비밀번호를 입력해주세요.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      email: email.trim(),
      password,
    });
  };

  const handleEmailChange = (event) => {
    const nextEmail = event.target.value;
    setEmail(nextEmail);
    setValidationError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setValidationError("");
  };

  const helperMessage = validationError || serverError;

  return (
    <form className="login-form" noValidate onSubmit={handleSubmit}>
      <div className="login-form-area">
        <div className="login-input-box">
          <label htmlFor="login-email">이메일</label>
          <input
            id="login-email"
            type="email"
            value={email}
            autoComplete="email"
            placeholder="이메일을 입력하세요"
            onChange={handleEmailChange}
          />
        </div>

        <div className="login-input-box">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            type="password"
            value={password}
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            onChange={handlePasswordChange}
          />
          {helperMessage && (
            <p className="login-helper-text" role="alert">
              * {helperMessage}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="login-button" disabled={isSubmitting}>
        {isSubmitting ? "로그인 중" : "로그인"}
      </button>
    </form>
  );
}

export default LoginForm;
