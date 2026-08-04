// 기존 게시글 값과 구장 선택을 관리하는 수정 폼
import { useEffect, useRef, useState } from "react";
import { findStadiumByCode, stadiums } from "../../data/stadiums";
import { prepareImageUpload } from "../../utils/imageUpload";
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
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState("");
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedPreviewUrl(objectUrl);

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
      setIsExistingImageRemoved(false);
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
      removeImage: isExistingImageRemoved,
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
          <label htmlFor="edit-image" className="file-button">
            {isConvertingImage ? "변환 중" : "파일 선택"}
          </label>
          <span className="file-name">
            {selectedFile?.name
              ?? (post.image && !isExistingImageRemoved ? "기존 이미지 있음" : "이미지 없음")}
          </span>
          <input
            ref={fileInputRef}
            id="edit-image"
            type="file"
            accept="image/*,.heic,.heif"
            hidden
            onChange={handleImageChange}
          />
        </div>

        {(selectedPreviewUrl || (post.image && !isExistingImageRemoved)) && (
          <div className="post-image-preview">
            <img
              src={selectedPreviewUrl || post.image}
              alt={selectedPreviewUrl ? "새 첨부 이미지 미리보기" : "기존 첨부 이미지"}
            />
            <button
              type="button"
              className="preview-remove-button"
              aria-label={selectedPreviewUrl ? "새로 선택한 이미지 삭제" : "기존 이미지 삭제"}
              onClick={() => {
                if (selectedPreviewUrl) {
                  clearSelectedFile();
                } else {
                  setIsExistingImageRemoved(true);
                }
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>

      {(selectedFile || isExistingImageRemoved || validationError || serverError) && (
        <p className="edit-helper-text" role="alert">
          * {validationError || serverError || (isExistingImageRemoved
            ? "수정하면 기존 이미지가 삭제됩니다."
            : "새 이미지를 선택했습니다. 수정 시 기존 이미지를 교체합니다.")}
        </p>
      )}

      <button type="submit" className="edit-button" disabled={isSubmitting || isConvertingImage}>
        {isSubmitting ? "수정 중" : "수정하기"}
      </button>
    </form>
  );
}

export default PostEditForm;
