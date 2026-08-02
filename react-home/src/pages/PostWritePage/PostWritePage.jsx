// 게시글 작성 폼 데이터와 등록 API 관리
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/postsApi";
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

      // TODO: 업로드 API가 추가 예정
      await createPost({
        subject,
        text,
        image: null,
        stadiumId: getStadiumCode(selectedStadiumId),
      });

      navigate("/posts");
    } catch (requestError) {
      console.error({ requestError, selectedStadiumId, selectedFile });
      setError("게시글 등록에 실패했습니다.");
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
