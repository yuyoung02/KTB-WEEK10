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
      <CommentForm
        value={commentText}
        isEditing={Boolean(editingCommentId)}
        isProcessing={isProcessing}
        onChange={setCommentText}
        onCancelEdit={resetForm}
        onSubmit={handleSubmit}
      />

      {error && <p className="detail-error" role="alert">{error}</p>}

      <section className="comment-list" aria-label="댓글 목록">
        {comments.length === 0 ? (
          <p className="empty-comments">첫 번째 댓글을 남겨보세요.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
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
