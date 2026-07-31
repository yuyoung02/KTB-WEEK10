// 댓글 등록과 댓글 목록 전체 관리
import { useCallback, useState } from "react";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../api/postDetailApi";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import ConfirmModal from "./ConfirmModal";

function CommentSection({ postId, comments, currentUser, onCommentsChange }) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const closeDeleteModal = useCallback(() => setDeleteTarget(null), []);

  const resetForm = () => {
    setCommentText("");
    setEditingCommentId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedText = commentText.trim();
    if (!trimmedText || isProcessing) return;

    if (!currentUser) {
      setError("댓글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      if (editingCommentId) {
        await updateComment(postId, editingCommentId, trimmedText);
      } else {
        await createComment(postId, trimmedText);
      }

      resetForm();
      await onCommentsChange();
    } catch (requestError) {
      console.error(requestError);
      setError("댓글 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || isProcessing) return;

    try {
      setIsProcessing(true);
      setError("");
      await deleteComment(postId, deleteTarget.commentId);
      setDeleteTarget(null);
      await onCommentsChange();
    } catch (requestError) {
      console.error(requestError);
      setError("댓글 삭제에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <section className="comment-section" aria-labelledby="comment-section-title">
        <div className="comment-section-heading">
          <div>
            <span className="comment-section-label">COMMUNITY</span>
            <h3 id="comment-section-title">댓글</h3>
          </div>
          <span className="comment-count-badge" aria-label={`댓글 ${comments.length}개`}>
            {comments.length}
          </span>
        </div>

        <CommentForm
          value={commentText}
          isEditing={Boolean(editingCommentId)}
          isProcessing={isProcessing}
          onChange={setCommentText}
          onCancelEdit={resetForm}
          onSubmit={handleSubmit}
        />

        {error && <p className="detail-error" role="alert">{error}</p>}

        <div className="comment-list" aria-label="댓글 목록">
          {comments.length === 0 ? (
            <div className="empty-comments">
              <span className="empty-comments-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9.3 9.3 0 0 1-3.4-.64L4 20l1.42-3.79A7.1 7.1 0 0 1 4 12c0-4.14 3.58-7.5 8-7.5s8 2.86 8 7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 11.75h.01M12 11.75h.01M15.5 11.75h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <strong>아직 댓글이 없어요</strong>
              <p>첫 번째 댓글로 이야기를 시작해보세요.</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                order={index + 1}
                isOwner={currentUser?.userId === comment.userId}
                onEdit={(selectedComment) => {
                  setEditingCommentId(selectedComment.commentId);
                  setCommentText(selectedComment.commentText);
                  setError("");
                }}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>
      </section>

      {deleteTarget && (
        <ConfirmModal
          title="댓글을 삭제하시겠습니까?"
          description="삭제한 내용은 복구할 수 없습니다."
          isProcessing={isProcessing}
          onCancel={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}

export default CommentSection;
