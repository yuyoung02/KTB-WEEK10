// 게시글, 댓글 삭제 확인 모달
import { useEffect, useRef } from "react";

function ConfirmModal({ title, description, isProcessing, onCancel, onConfirm }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();

    const closeWithEscape = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [onCancel]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="detail-modal">
        <h3 id="confirm-modal-title">{title}</h3>
        <p>{description}</p>
        <div className="modal-button-row">
          <button ref={cancelButtonRef} type="button" className="cancel-button" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="confirm-button" disabled={isProcessing} onClick={onConfirm}>
            {isProcessing ? "처리 중" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
