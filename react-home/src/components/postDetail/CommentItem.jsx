// 댓글 한 개와 작성자용 수정, 삭제 버튼
function CommentItem({ comment, isOwner, onEdit, onDelete }) {
  return (
    <article className="comment-item">
      <div className="comment-top">
        <div className="author-box">
          <img
            src={comment.image || "/assets/images/defaultProfileImage.png"}
            alt=""
          />
          <strong>{comment.nickname}</strong>
        </div>

        {isOwner && (
          <div className="comment-button-box">
            <button type="button" className="small-button" onClick={() => onEdit(comment)}>
              수정
            </button>
            <button type="button" className="small-button" onClick={() => onDelete(comment)}>
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
