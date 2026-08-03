// 게시글 작성 폼 데이터와 등록 API 관리
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/postsApi";
import { getApiErrorMessage } from "../../api/client";
import PostWriteForm from "../../components/postWrite/PostWriteForm";
import { getStadiumCode } from "../../data/stadiums";
import "./PostWritePage.css";

function PostWritePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async ({
    subject,
    text,
    selectedStadiumId,
    selectedFile,
  }) => {
    try {
      setIsSubmitting(true);
      setError("");

      await createPost({
        subject,
        text,
        image: selectedFile,
        stadiumId: getStadiumCode(selectedStadiumId),
      });

      navigate("/posts");
    } catch (requestError) {
      console.error({ requestError, selectedStadiumId, selectedFile });
      setError(getApiErrorMessage(requestError, {
        400: "제목, 본문과 구장 정보를 다시 확인해주세요.",
        401: "게시글을 작성하려면 로그인이 필요합니다.",
        403: "게시글 작성 권한이 없습니다.",
        413: "첨부 이미지 용량이 너무 큽니다.",
        default: "게시글 등록 요청을 처리하지 못했습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="write-page">
      <section className="write-container">
        <div className="write-heading">
          <p className="eyebrow">WRITE YOUR STORY</p>
          <h2>게시글 작성</h2>
          <p>구장 주변의 맛집과 핫플 이야기를 남겨보세요.</p>
        </div>
        <PostWriteForm
          isSubmitting={isSubmitting}
          serverError={error}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}

export default PostWritePage;
