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
        <svg viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>좋아요</span>
        <strong>{likeCount}</strong>
      </button>

      <div className="count-box">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        <span>조회</span>
        <strong>{viewCount}</strong>
      </div>

      <div className="count-box">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9.3 9.3 0 0 1-3.4-.64L4 20l1.42-3.79A7.1 7.1 0 0 1 4 12c0-4.14 3.58-7.5 8-7.5s8 2.86 8 7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>댓글</span>
        <strong>{commentCount}</strong>
      </div>
    </section>
  );
}

export default PostStats;
