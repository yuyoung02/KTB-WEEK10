// 현재, 새 비밀번호 입력과 검증
import { useState } from "react";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/;
const EMPTY_ERRORS = {
  currentPassword: "",
  newPassword: "",
  newPasswordCheck: "",
};

function PasswordEditForm({ isSubmitting, serverErrors, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [validationErrors, setValidationErrors] = useState(EMPTY_ERRORS);

  const validate = () => {
    const nextErrors = { ...EMPTY_ERRORS };

    if (!currentPassword) {
      nextErrors.currentPassword = "기존 비밀번호를 입력해주세요.";
    }

    if (!newPassword) {
      nextErrors.newPassword = "새 비밀번호를 입력해주세요.";
    } else if (!PASSWORD_PATTERN.test(newPassword)) {
      nextErrors.newPassword = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
    } else if (currentPassword && currentPassword === newPassword) {
      nextErrors.newPassword = "기존 비밀번호와 다른 비밀번호를 입력해주세요.";
    }

    if (!newPasswordCheck) {
      nextErrors.newPasswordCheck = "새 비밀번호를 한번 더 입력해주세요.";
    } else if (newPassword !== newPasswordCheck) {
      nextErrors.newPasswordCheck = "새 비밀번호가 일치하지 않습니다.";
    }

    setValidationErrors(nextErrors);
    return Object.values(nextErrors).every((message) => !message);
  };

  const clearError = (field) => {
    setValidationErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      originalPwd: currentPassword,
      newPwd: newPassword,
      oneMoreNewPwd: newPasswordCheck,
    });
  };

  const errors = {
    currentPassword: validationErrors.currentPassword || serverErrors.currentPassword,
    newPassword: validationErrors.newPassword || serverErrors.newPassword,
    newPasswordCheck: validationErrors.newPasswordCheck || serverErrors.newPasswordCheck,
  };

  return (
    <form className="password-edit-form" noValidate onSubmit={handleSubmit}>
      <div className="password-edit-input-box">
        <label htmlFor="current-password">기존 비밀번호</label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          autoComplete="current-password"
          placeholder="기존 비밀번호를 입력하세요"
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            clearError("currentPassword");
          }}
        />
        {errors.currentPassword && (
          <p className="password-edit-helper-text" role="alert">
            * {errors.currentPassword}
          </p>
        )}
      </div>

      <div className="password-edit-input-box">
        <label htmlFor="new-password">새 비밀번호</label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          autoComplete="new-password"
          placeholder="새 비밀번호를 입력하세요"
          onChange={(event) => {
            setNewPassword(event.target.value);
            clearError("newPassword");
            clearError("newPasswordCheck");
          }}
        />
        {errors.newPassword && (
          <p className="password-edit-helper-text" role="alert">
            * {errors.newPassword}
          </p>
        )}
      </div>

      <div className="password-edit-input-box">
        <label htmlFor="new-password-check">새 비밀번호 확인</label>
        <input
          id="new-password-check"
          type="password"
          value={newPasswordCheck}
          autoComplete="new-password"
          placeholder="새 비밀번호를 한번 더 입력하세요"
          onChange={(event) => {
            setNewPasswordCheck(event.target.value);
            clearError("newPasswordCheck");
          }}
        />
        {errors.newPasswordCheck && (
          <p className="password-edit-helper-text" role="alert">
            * {errors.newPasswordCheck}
          </p>
        )}
      </div>

      <button className="password-edit-submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "수정 중" : "수정하기"}
      </button>
    </form>
  );
}

export default PasswordEditForm;
