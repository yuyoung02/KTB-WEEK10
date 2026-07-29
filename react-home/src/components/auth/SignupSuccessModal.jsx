// 회원가입 완료 안내 모달
function SignupSuccessModal({ isOpen, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="signup-modal-overlay" role="presentation">
      <section
        className="signup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-success-title"
      >
        <h3 id="signup-success-title">회원가입 완료되었습니다.</h3>
        <p>로그인 페이지로 이동합니다.</p>
        <button
          type="button"
          className="signup-modal-confirm-button"
          onClick={onConfirm}
          autoFocus
        >
          확인
        </button>
      </section>
    </div>
  );
}

export default SignupSuccessModal;
