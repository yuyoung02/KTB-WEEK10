// 댓글 한 개와 작성자용 수정, 삭제 버튼
function CommentItem({ comment, order, isOwner, onEdit, onDelete }) {
  return (
    <article className="comment-item">
      <div className="comment-top">
        <div className="author-box">
          <img
            src={comment.image || "/assets/images/defaultProfileImage.png"}
            alt=""
          />
          <div className="comment-author-info">
            <strong>{comment.nickname}</strong>
            <span>#{String(order).padStart(2, "0")}</span>
          </div>
        </div>

        {isOwner && (
          <div className="comment-button-box">
            <button type="button" className="comment-action-button" onClick={() => onEdit(comment)}>
              수정
            </button>
            <button type="button" className="comment-action-button delete" onClick={() => onDelete(comment)}>
              삭제
            </button>
          </div>
        )}
      </div>
      <p className="comment-text">{comment.commentText}</p>
    </article>
  );
}

export default CommentItem;
