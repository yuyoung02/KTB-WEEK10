// 구장, 제목, 본문, 첨부파일을 입력하는 작성 폼
import { useState } from "react";
import { stadiums } from "../../data/stadiums";
import StadiumSelect from "./StadiumSelect";

function PostWriteForm({ isSubmitting, serverError, onSubmit }) {
  const [selectedStadiumId, setSelectedStadiumId] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedStadiumId) {
      setValidationError("구장을 선택해주세요.");
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
    <form className="write-form" onSubmit={handleSubmit}>
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
        <label htmlFor="post-subject">제목*</label>
        <input
          id="post-subject"
          type="text"
          value={subject}
          maxLength={26}
          placeholder="제목을 입력해주세요. (최대 26글자)"
          onChange={(event) => {
            setSubject(event.target.value);
            setValidationError("");
          }}
        />
      </div>

      <div className="input-box">
        <label htmlFor="post-text">내용*</label>
        <textarea
          id="post-text"
          value={text}
          placeholder="내용을 입력해주세요."
          onChange={(event) => {
            setText(event.target.value);
            setValidationError("");
          }}
        />
      </div>

      <div className="file-box">
        <label>이미지</label>
        <div className="file-row">
          <label htmlFor="post-image" className="file-button">파일 선택</label>
          <span className="file-name">
            {selectedFile?.name ?? "파일을 선택해주세요."}
          </span>
          <input
            id="post-image"
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              // TODO: 이미지 업로드
              setSelectedFile(event.target.files?.[0] ?? null);
            }}
          />
        </div>
      </div>

      {(validationError || serverError) && (
        <p className="write-helper-text" role="alert">
          * {validationError || serverError}
        </p>
      )}

      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "등록 중" : "완료"}
      </button>
    </form>
  );
}

export default PostWriteForm;
