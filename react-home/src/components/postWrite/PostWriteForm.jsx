// 구장, 제목, 본문, 첨부파일을 입력하는 작성 폼
import { useEffect, useRef, useState } from "react";
import { stadiums } from "../../data/stadiums";
import { prepareImageUpload } from "../../utils/imageUpload";
import StadiumSelect from "./StadiumSelect";

function PostWriteForm({ isSubmitting, serverError, onSubmit }) {
  const [selectedStadiumId, setSelectedStadiumId] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    try {
      setIsConvertingImage(true);
      setValidationError("");
      setSelectedFile(await prepareImageUpload(file));
    } catch (error) {
      clearSelectedFile();
      setValidationError(
        error.message || "이미지를 처리하지 못했습니다. JPG 또는 PNG 파일을 선택해주세요.",
      );
    } finally {
      setIsConvertingImage(false);
    }
  };

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
          <label htmlFor="post-image" className="file-button">
            {isConvertingImage ? "변환 중" : "파일 선택"}
          </label>
          <span className="file-name">
            {selectedFile?.name ?? "파일을 선택해주세요."}
          </span>
          <input
            ref={fileInputRef}
            id="post-image"
            type="file"
            accept="image/*,.heic,.heif"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {previewUrl && (
          <div className="post-image-preview">
            <img src={previewUrl} alt="첨부 이미지 미리보기" />
            <button
              type="button"
              className="preview-remove-button"
              aria-label="선택한 이미지 삭제"
              onClick={clearSelectedFile}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {(validationError || serverError) && (
        <p className="write-helper-text" role="alert">
          * {validationError || serverError}
        </p>
      )}

      <button type="submit" className="submit-button" disabled={isSubmitting || isConvertingImage}>
        {isSubmitting ? "등록 중" : "완료"}
      </button>
    </form>
  );
}

export default PostWriteForm;
