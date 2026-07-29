// 로딩, 오류, 빈 목록 상태와 게시글 목록 표시
import PostCard from "./PostCard";

function PostList({ posts, isLoading, error }) {
  if (isLoading) {
    return <p className="posts-status">게시글을 불러오는 중입니다.</p>;
  }

  if (error) {
    return <p className="posts-status error">{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="posts-status">등록된 게시글이 없습니다.</p>;
  }

  return (
    <section className="post-list" aria-label="게시글 목록">
      {posts.map((post) => (
        <PostCard key={post.postId ?? post.id} post={post} />
      ))}
    </section>
  );
}

export default PostList;
