// 좋아요, 조회수, 댓글 수 표시
function PostStats({
  likeCount,
  viewCount,
  commentCount,
  isLiked,
  isLikeProcessing,
  onToggleLike,
}) {
  return (
    <section className="count-row" aria-label="게시글 정보">
      <button
        type="button"
        className={`count-box like-count ${isLiked ? "active" : ""}`}
        disabled={isLikeProcessing}
        aria-pressed={isLiked}
        onClick={onToggleLike}
      >
        <strong>{likeCount}</strong>
        <span>좋아요수</span>
      </button>

      <div className="count-box">
        <strong>{viewCount}</strong>
        <span>조회수</span>
      </div>

      <div className="count-box">
        <strong>{commentCount}</strong>
        <span>댓글</span>
      </div>
    </section>
  );
}

export default PostStats;
