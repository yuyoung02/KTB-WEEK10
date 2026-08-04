// 게시글 목록의 게시글 한 개 표시
import { Link } from "react-router-dom";
import { formatSeoulDate } from "../../utils/date";
import StadiumBadge from "../common/StadiumBadge";

function PostCard({ post }) {
  const postId = post.postId ?? post.id;
  const title = post.subject ?? post.title ?? "제목 없는 게시글";
  const nickname = post.userNickname ?? post.nickname ?? post.author?.nickname ?? "알 수 없는 사용자";
  const profileImage = post.image ?? post.author?.profileImageUrl ?? "/assets/images/defaultProfileImage.png";

  return (
    <article className="post-card">
      <Link to={`/posts/${postId}`} className="post-link">
        <div className="post-content">
          <div className="post-title-row">
            <div className="post-card-heading">
              <StadiumBadge stadiumCode={post.stadiumId ?? post.stadiumCode} />
              <h2>{title}</h2>
            </div>
            <span className="post-arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="m7.5 5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="post-stats">
            <span><b>{post.likeCount ?? 0}</b> 좋아요</span>
            <span><b>{post.commentCount ?? 0}</b> 댓글</span>
            <span><b>{post.viewNum ?? post.viewCount ?? 0}</b> 조회</span>
          </div>
        </div>

        <div className="post-author-row">
          <div className="post-author">
            <img src={profileImage} alt="" className="author-image" />
            <span>{nickname}</span>
          </div>
          <span className="post-date">{formatSeoulDate(post.date ?? post.createdAt)}</span>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
