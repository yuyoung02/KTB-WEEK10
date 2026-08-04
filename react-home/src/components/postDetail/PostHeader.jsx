// 게시글 구장, 제목, 작성자와 작성자용 버튼 표시
import { Link } from "react-router-dom";
import { formatSeoulDate } from "../../utils/date";
import StadiumBadge from "../common/StadiumBadge";

function PostHeader({ post, isOwner, onDelete }) {
  return (
    <section className="detail-post-top">
      <div className="detail-title-row">
        <div>
          {post.stadiumId || post.stadiumCode ? (
            <StadiumBadge
              stadiumCode={post.stadiumId ?? post.stadiumCode}
              className="post-stadium-badge"
            />
          ) : (
            <span className="post-stadium-badge pending">구장 정보 준비 중</span>
          )}
          <h2>{post.subject}</h2>
        </div>

        {isOwner && (
          <div className="post-button-box">
            <Link to={`/posts/${post.postId}/edit`} className="small-button">수정</Link>
            <button type="button" className="small-button" onClick={onDelete}>삭제</button>
          </div>
        )}
      </div>

      <div className="author-box">
        <img
          src={post.authorImage || "/assets/images/defaultProfileImage.png"}
          alt=""
        />
        <strong>{post.nickname || `작성자 ${post.userId}`}</strong>
        <span>{formatSeoulDate(post.date, { withSeconds: true })}</span>
      </div>
    </section>
  );
}

export default PostHeader;
