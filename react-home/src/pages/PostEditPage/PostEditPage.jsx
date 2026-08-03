// 게시글 조회, 작성자 확인과 수정 API 관리
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPostDetail, updatePost } from "../../api/postDetailApi";
import { getApiErrorMessage } from "../../api/client";
import { getCurrentUser } from "../../api/userApi";
import PostEditForm from "../../components/postEdit/PostEditForm";
import { getStadiumCode } from "../../data/stadiums";
import "./PostEditPage.css";

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState("");

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

        const [postData, userData] = await Promise.all([
          getPostDetail(postId),
          getCurrentUser(),
        ]);

        if (isCancelled) return;
        setPost(postData);
        setIsOwner(Boolean(userData && userData.userId === postData.userId));
      } catch (requestError) {
        if (isCancelled) return;
        console.error(requestError);
        setError(getApiErrorMessage(requestError, {
          404: "게시글을 찾을 수 없습니다.",
          default: "게시글을 불러오지 못했습니다.",
        }));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    initializePage();
    return () => {
      isCancelled = true;
    };
  }, [navigate, postId]);

  const handleSubmit = async ({
    subject,
    text,
    selectedStadiumId,
    selectedFile,
    removeImage,
  }) => {
    try {
      setIsSubmitting(true);
      setError("");

      await updatePost(postId, {
        patchSubject: subject,
        patchText: text,
        patchStadiumId: getStadiumCode(selectedStadiumId),
        image: selectedFile,
        removeImage,
      });

      navigate(`/posts/${postId}`);
    } catch (requestError) {
      console.error({ requestError, selectedFile });
      setError(getApiErrorMessage(requestError, {
        400: "수정할 게시글 내용을 다시 확인해주세요.",
        401: "로그인이 만료되었습니다. 다시 로그인해주세요.",
        403: "게시글 작성자만 수정할 수 있습니다.",
        404: "게시글을 찾을 수 없습니다.",
        413: "첨부 이미지 용량이 너무 큽니다.",
        default: "게시글 수정 요청을 처리하지 못했습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="edit-page"><p className="edit-status">게시글을 불러오는 중입니다.</p></main>;
  }

  if (!post || !isOwner) {
    return (
      <main className="edit-page">
        <section className="edit-access-denied">
          <p>{error || "게시글 작성자만 수정할 수 있습니다."}</p>
          <Link to={`/posts/${postId}`}>게시글로 돌아가기</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="edit-page">
      <section className="edit-container">
        <div className="edit-heading">
          <p className="eyebrow">EDIT YOUR STORY</p>
          <h2>게시글 수정</h2>
          <p>작성한 구장 이야기를 수정할 수 있어요.</p>
        </div>
        <PostEditForm
          post={post}
          isSubmitting={isSubmitting}
          serverError={error}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}

export default PostEditPage;
