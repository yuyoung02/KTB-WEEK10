// 게시글 상세, 좋아요, 댓글, 삭제 상태와 API 관리
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addLike,
  deletePost,
  getComments,
  getLikeStatus,
  getPostDetail,
  removeLike,
} from "../../api/postDetailApi";
import { getCurrentUser } from "../../api/userApi";
import CommentSection from "../../components/postDetail/CommentSection";
import ConfirmModal from "../../components/postDetail/ConfirmModal";
import PostBody from "../../components/postDetail/PostBody";
import PostHeader from "../../components/postDetail/PostHeader";
import PostStats from "../../components/postDetail/PostStats";
import "./PostDetailPage.css";

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    if (!postId) return;
    try {
      const data = await getComments(postId);
      setComments(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error(requestError);
      setComments([]);
    }
  }, [postId]);

  useEffect(() => {
    let isCancelled = false;

    async function initializePage() {
      if (!postId) {
        navigate("/posts", { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [postData, commentData, userData] = await Promise.all([
          getPostDetail(postId),
          getComments(postId),
          getCurrentUser(),
        ]);

        if (isCancelled) return;
        setPost(postData);
        setComments(Array.isArray(commentData) ? commentData : []);
        setCurrentUser(userData);

        if (userData) {
          try {
            const liked = await getLikeStatus(postId);
            if (!isCancelled) setIsLiked(Boolean(liked));
          } catch (likeError) {
            console.error(likeError);
          }
        }
      } catch (requestError) {
        if (isCancelled) return;
        console.error(requestError);
        setError(
          requestError.status === 404
            ? "게시글을 찾을 수 없습니다."
            : "게시글을 불러오지 못했습니다.",
        );
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    initializePage();
    return () => {
      isCancelled = true;
    };
  }, [navigate, postId]);

  const handleToggleLike = async () => {
    if (!post || isLikeProcessing) return;

    if (!currentUser) {
      setError("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    try {
      setIsLikeProcessing(true);
      setError("");

      if (isLiked) {
        await removeLike(postId);
      } else {
        await addLike(postId);
      }

      setIsLiked((liked) => !liked);
      setPost((currentPost) => ({
        ...currentPost,
        likeCount: Math.max(0, (currentPost.likeCount ?? 0) + (isLiked ? -1 : 1)),
      }));
    } catch (requestError) {
      console.error(requestError);
      setError("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLikeProcessing(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleteProcessing) return;

    try {
      setIsDeleteProcessing(true);
      await deletePost(postId);
      navigate("/posts", { replace: true });
    } catch (requestError) {
      console.error(requestError);
      setError("게시글 삭제에 실패했습니다.");
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleteProcessing(false);
    }
  };

  if (isLoading) {
    return <main className="detail-page"><p className="detail-status">게시글을 불러오는 중입니다.</p></main>;
  }

  if (!post) {
    return <main className="detail-page"><p className="detail-status error">{error}</p></main>;
  }

  const isOwner = currentUser?.userId === post.userId;

  return (
    <main className="detail-page">
      <article className="detail-container">
        {error && <p className="detail-error" role="alert">{error}</p>}

        <PostHeader
          post={post}
          isOwner={isOwner}
          onDelete={() => setIsDeleteModalOpen(true)}
        />

        <PostBody text={post.text} image={post.image} />

        <PostStats
          likeCount={post.likeCount ?? 0}
          viewCount={post.viewNum ?? 0}
          commentCount={comments.length}
          isLiked={isLiked}
          isLikeProcessing={isLikeProcessing}
          onToggleLike={handleToggleLike}
        />

        <CommentSection
          postId={postId}
          comments={comments}
          currentUser={currentUser}
          onCommentsChange={loadComments}
        />
      </article>

      {isDeleteModalOpen && (
        <ConfirmModal
          title="게시글을 삭제하시겠습니까?"
          description="삭제한 내용은 복구할 수 없습니다."
          isProcessing={isDeleteProcessing}
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeletePost}
        />
      )}
    </main>
  );
}

export default PostDetailPage;
