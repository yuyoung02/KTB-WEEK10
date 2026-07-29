// 댓글 등록, 수정 입력 폼
function CommentForm({
  value,
  isEditing,
  isProcessing,
  onChange,
  onCancelEdit,
  onSubmit,
}) {
  return (
    <form className="comment-write-box" onSubmit={onSubmit}>
      <textarea
        value={value}
        placeholder="댓글을 남겨주세요!"
        aria-label="댓글 내용"
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="comment-submit-row">
        {isEditing && (
          <button type="button" className="comment-cancel-button" onClick={onCancelEdit}>
            수정 취소
          </button>
        )}
        <button type="submit" disabled={isProcessing || !value.trim()}>
          {isProcessing ? "처리 중" : isEditing ? "댓글 수정" : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
