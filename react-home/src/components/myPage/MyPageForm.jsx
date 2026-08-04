// 회원 프로필 미리보기와 닉네임 수정 폼
import { useEffect, useRef, useState } from "react";
import { prepareImageUpload } from "../../utils/imageUpload";

const DEFAULT_PROFILE_IMAGE = "/assets/images/defaultProfileImage.png";

function MyPageForm({ user, isSubmitting, serverError, onSubmit }) {
  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [isExistingImageRemoved, setIsExistingImageRemoved] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const profileInputRef = useRef(null);

  useEffect(() => {
    setNickname(user.nickname ?? "");
    setProfileFile(null);
    setIsExistingImageRemoved(false);
  }, [user.image, user.nickname]);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(profileFile);
    setProfilePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [profileFile]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setValidationError("닉네임을 입력해주세요.");
      return;
    }

    if (trimmedNickname.length > 30) {
      setValidationError("닉네임은 최대 30자까지 가능합니다.");
      return;
    }

    setValidationError("");
    onSubmit({
      nickname: trimmedNickname,
      profileFile,
      removeImage: isExistingImageRemoved,
    });
  };

  const clearProfileFile = () => {
    setProfileFile(null);
    if (profileInputRef.current) profileInputRef.current.value = "";
  };

  const handleProfileChange = async (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    try {
      setIsConvertingImage(true);
      setValidationError("");
      setProfileFile(await prepareImageUpload(file));
      setIsExistingImageRemoved(false);
    } catch (error) {
      clearProfileFile();
      setValidationError(
        error.message || "프로필 이미지를 처리하지 못했습니다.",
      );
    } finally {
      setIsConvertingImage(false);
    }
  };

  return (
    <form className="mypage-form" noValidate onSubmit={handleSubmit}>
      <div className="mypage-profile-area">
        <label htmlFor="mypage-profile-image">프로필 사진*</label>
        <input
          ref={profileInputRef}
          id="mypage-profile-image"
          type="file"
          accept="image/*,.heic,.heif"
          hidden
          onChange={handleProfileChange}
        />
        <div className="mypage-profile-control">
          <label className="mypage-profile-image-box" htmlFor="mypage-profile-image">
            <img
              src={profilePreviewUrl
                || (!isExistingImageRemoved && user.image)
                || DEFAULT_PROFILE_IMAGE}
              alt="프로필 사진"
            />
            <span>{isConvertingImage ? "변환 중" : "변경"}</span>
          </label>
          {(profilePreviewUrl || (user.image && !isExistingImageRemoved)) && (
            <button
              type="button"
              className="profile-remove-button"
              aria-label={profilePreviewUrl ? "새로 선택한 프로필 이미지 삭제" : "기존 프로필 이미지 삭제"}
              onClick={() => {
                if (profilePreviewUrl) {
                  clearProfileFile();
                } else {
                  setIsExistingImageRemoved(true);
                }
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mypage-form-box">
        <label>이메일</label>
        <p className="mypage-email-text">{user.email}</p>

        <label htmlFor="mypage-nickname">닉네임</label>
        <input
          id="mypage-nickname"
          type="text"
          value={nickname}
          maxLength={30}
          onChange={(event) => {
            setNickname(event.target.value);
            setValidationError("");
          }}
        />

        {(profileFile || isExistingImageRemoved || validationError || serverError) && (
          <p
            className={`mypage-helper-text ${(profileFile || isExistingImageRemoved) && !validationError && !serverError ? "notice" : ""}`}
            role={validationError || serverError ? "alert" : undefined}
          >
            * {validationError || serverError || (isExistingImageRemoved
              ? "수정하면 기존 프로필 이미지가 삭제됩니다."
              : "새 이미지를 선택했습니다. 수정 시 기존 이미지를 교체합니다.")}
          </p>
        )}

        <button className="mypage-submit-button" type="submit" disabled={isSubmitting || isConvertingImage}>
          {isSubmitting ? "수정 중" : "수정하기"}
        </button>
      </div>
    </form>
  );
}

export default MyPageForm;
