// 탈퇴 확인과 비밀번호 확인을 순서대로 표시
import { useState } from "react";

function WithdrawModal({ isOpen, isSubmitting, serverError, onClose, onWithdraw }) {
  const [step, setStep] = useState("confirm");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const closeModal = () => {
    setStep("confirm");
    setPassword("");
    setValidationError("");
    onClose();
  };

  const moveToPasswordStep = () => {
    setStep("password");
    setPassword("");
    setValidationError("");
  };

  const handleWithdraw = () => {
    if (!password.trim()) {
      setValidationError("비밀번호를 입력해주세요.");
      return;
    }
    onWithdraw(password);
  };

  return (
    <div
      className="mypage-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className="mypage-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-modal-title"
      >
        {step === "confirm" ? (
          <>
            <h3 id="withdraw-modal-title">회원탈퇴 하시겠습니까?</h3>
            <p>
              작성된 게시글과 댓글은 삭제되며,
              <br />
              회원정보는 탈퇴일로부터 1개월 후 완전히 삭제됩니다.
            </p>
            <div className="mypage-modal-button-row">
              <button type="button" className="mypage-cancel-button" onClick={closeModal}>
                취소
              </button>
              <button type="button" className="mypage-confirm-button" onClick={moveToPasswordStep}>
                확인
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 id="withdraw-modal-title">비밀번호 확인</h3>
            <p>회원탈퇴를 위해 비밀번호를 입력해주세요.</p>
            <input
              className="mypage-withdraw-password"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="비밀번호"
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleWithdraw();
              }}
              autoFocus
            />
            <p className="mypage-withdraw-helper-text" role="alert">
              {(validationError || serverError) && `* ${validationError || serverError}`}
            </p>
            <div className="mypage-modal-button-row">
              <button type="button" className="mypage-cancel-button" onClick={closeModal}>
                취소
              </button>
              <button
                type="button"
                className="mypage-confirm-button"
                disabled={isSubmitting}
                onClick={handleWithdraw}
              >
                {isSubmitting ? "처리 중" : "확인"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default WithdrawModal;
