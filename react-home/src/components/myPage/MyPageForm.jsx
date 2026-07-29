// 회원 프로필 미리보기와 닉네임 수정 폼
import { useEffect, useState } from "react";

const DEFAULT_PROFILE_IMAGE = "/assets/images/defaultProfileImage.png";

function MyPageForm({ user, isSubmitting, serverError, onSubmit }) {
  const [nickname, setNickname] = useState(user.nickname ?? "");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setNickname(user.nickname ?? "");
  }, [user.nickname]);

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
      image: user.image ?? null,
      profileFile,
    });
  };

  return (
    <form className="mypage-form" noValidate onSubmit={handleSubmit}>
      <div className="mypage-profile-area">
        <label htmlFor="mypage-profile-image">프로필 사진*</label>
        <input
          id="mypage-profile-image"
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => setProfileFile(event.target.files?.[0] ?? null)}
        />
        <label className="mypage-profile-image-box" htmlFor="mypage-profile-image">
          <img
            src={profilePreviewUrl || user.image || DEFAULT_PROFILE_IMAGE}
            alt="프로필 사진"
          />
          <span>변경</span>
        </label>
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

        {(profileFile || validationError || serverError) && (
          <p
            className={`mypage-helper-text ${profileFile && !validationError && !serverError ? "notice" : ""}`}
            role={validationError || serverError ? "alert" : undefined}
          >
            * {validationError || serverError || "이미지 업로드 기능은 준비 중이며 기존 이미지는 유지됩니다."}
          </p>
        )}

        <button className="mypage-submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "수정 중" : "수정하기"}
        </button>
      </div>
    </form>
  );
}

export default MyPageForm;
