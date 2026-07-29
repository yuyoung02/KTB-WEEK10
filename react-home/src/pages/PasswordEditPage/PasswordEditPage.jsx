// 비밀번호 변경 API와 성공 토스트, -> 재로그인 처리
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../auth/tokenStorage";
import { updatePassword } from "../../api/userApi";
import PasswordEditForm from "../../components/passwordEdit/PasswordEditForm";
import "./PasswordEditPage.css";

const EMPTY_SERVER_ERRORS = {
  currentPassword: "",
  newPassword: "",
  newPasswordCheck: "",
};

function PasswordEditPage() {
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [serverErrors, setServerErrors] = useState(EMPTY_SERVER_ERRORS);

  useEffect(() => () => clearTimeout(redirectTimerRef.current), []);

  const handleSubmit = async (passwords) => {
    try {
      setIsSubmitting(true);
      setServerErrors(EMPTY_SERVER_ERRORS);
      await updatePassword(passwords);
      setIsToastOpen(true);

      redirectTimerRef.current = setTimeout(() => {
        clearAccessToken();
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        setServerErrors({
          ...EMPTY_SERVER_ERRORS,
          currentPassword: "기존 비밀번호가 일치하지 않습니다.",
        });
      } else if (error.status === 400) {
        setServerErrors({
          ...EMPTY_SERVER_ERRORS,
          newPasswordCheck: "새 비밀번호를 다시 확인해주세요.",
        });
      } else if (error.status === 403) {
        setServerErrors({
          ...EMPTY_SERVER_ERRORS,
          currentPassword: "비밀번호 수정 권한이 없습니다.",
        });
      } else if (error.status === 404) {
        setServerErrors({
          ...EMPTY_SERVER_ERRORS,
          currentPassword: "사용자를 찾을 수 없습니다.",
        });
      } else {
        setServerErrors({
          ...EMPTY_SERVER_ERRORS,
          currentPassword: "비밀번호 수정에 실패했거나 서버와 연결할 수 없습니다.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="password-edit-page">
      <section className="password-edit-container">
        <h2>비밀번호 수정</h2>
        <PasswordEditForm
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
          onSubmit={handleSubmit}
        />
        {isToastOpen && (
          <div className="password-edit-toast" role="status">
            변경 완료
          </div>
        )}
      </section>
    </main>
  );
}

export default PasswordEditPage;
