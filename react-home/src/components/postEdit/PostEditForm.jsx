// 기존 게시글 값과 구장 선택을 관리하는 수정 폼
import { useState } from "react";
import { findStadiumByCode, stadiums } from "../../data/stadiums";
import StadiumSelect from "../postWrite/StadiumSelect";

function getInitialStadiumId(post) {
  const stadiumId = post.stadium?.stadiumId ?? post.stadiumId ?? post.stadiumCode;
  return findStadiumByCode(stadiumId)?.id ?? "all";
}

function PostEditForm({ post, isSubmitting, serverError, onSubmit }) {
  const [selectedStadiumId, setSelectedStadiumId] = useState(
    () => getInitialStadiumId(post),
  );
  const [subject, setSubject] = useState(post.subject ?? "");
  const [text, setText] = useState(post.text ?? "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedStadiumId) {
      setValidationError("기존 게시글에 구장 정보가 없습니다. 구장을 선택해주세요.");
      return;
    }

    if (!subject.trim()) {
      setValidationError("제목을 입력해주세요.");
      return;
    }

    if (!text.trim()) {
      setValidationError("내용을 입력해주세요.");
      return;
    }

    setValidationError("");
    onSubmit({
      subject: subject.trim(),
      text: text.trim(),
      selectedStadiumId,
      selectedFile,
    });
  };

  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <div className="input-box">
        <label>구장*</label>
        <StadiumSelect
          stadiums={stadiums}
          selectedStadiumId={selectedStadiumId}
          onChange={(stadiumId) => {
            setSelectedStadiumId(stadiumId);
            setValidationError("");
          }}
        />
      </div>

      <div className="input-box">
        <label htmlFor="edit-subject">제목*</label>
        <input
          id="edit-subject"
          type="text"
          value={subject}
          maxLength={26}
          onChange={(event) => {
            setSubject(event.target.value);
            setValidationError("");
          }}
        />
      </div>

      <div className="input-box">
        <label htmlFor="edit-text">내용*</label>
        <textarea
          id="edit-text"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setValidationError("");
          }}
        />
      </div>

      <div className="file-box">
        <label>이미지</label>
        <div className="file-row">
          <label htmlFor="edit-image" className="file-button">파일 선택</label>
          <span className="file-name">
            {selectedFile?.name ?? (post.image ? "기존 이미지 있음" : "파일을 선택해주세요.")}
          </span>
          <input
            id="edit-image"
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0] ?? null);
              setValidationError("");
            }}
          />
        </div>
      </div>

      {(selectedFile || validationError || serverError) && (
        <p className="edit-helper-text" role="alert">
          * {validationError || serverError || "새 이미지를 선택했습니다. 수정 시 기존 이미지를 교체합니다."}
        </p>
      )}

      <button type="submit" className="edit-button" disabled={isSubmitting}>
        {isSubmitting ? "수정 중" : "수정하기"}
      </button>
    </form>
  );
}

export default PostEditForm;
