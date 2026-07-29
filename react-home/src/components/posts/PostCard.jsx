// 게시글 목록의 게시글 한 개 표시
import { Link } from "react-router-dom";
import StadiumBadge from "../common/StadiumBadge";

function formatDate(date) {
  if (!date) return "";
  return date.replace("T", " ").slice(0, 16);
}

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
            <span className="post-date">{formatDate(post.date ?? post.createdAt)}</span>
          </div>

          <div className="post-stats">
            <span>좋아요 {post.likeCount ?? 0}</span>
            <span>댓글 {post.commentCount ?? 0}</span>
            <span>조회수 {post.viewNum ?? post.viewCount ?? 0}</span>
          </div>
        </div>

        <div className="post-author">
          <img src={profileImage} alt="" className="author-image" />
          <span>{nickname}</span>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
