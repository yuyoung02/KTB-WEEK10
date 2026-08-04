// 회원가입 입력값, 프로필 미리보기와 helper text 관리
import { useEffect, useRef, useState } from "react";
import { prepareImageUpload } from "../../utils/imageUpload";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/;

const EMPTY_ERRORS = {
  email: "",
  password: "",
  passwordCheck: "",
  nickname: "",
};

function SignupForm({ isSubmitting, serverError, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isConvertingImage, setIsConvertingImage] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const profileInputRef = useRef(null);

  useEffect(() => {
    if (!profileFile) {
      setProfilePreviewUrl("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(profileFile);
    setProfilePreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [profileFile]);

  const validate = () => {
    const nextErrors = { ...EMPTY_ERRORS };
    const trimmedEmail = email.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedEmail) {
      nextErrors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!password) {
      nextErrors.password = "비밀번호를 입력해주세요.";
    } else if (!PASSWORD_PATTERN.test(password)) {
      nextErrors.password = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
    }

    if (!passwordCheck) {
      nextErrors.passwordCheck = "비밀번호를 한번 더 입력해주세요.";
    } else if (password !== passwordCheck) {
      nextErrors.passwordCheck = "비밀번호가 일치하지 않습니다.";
    }

    if (!trimmedNickname) {
      nextErrors.nickname = "닉네임을 입력해주세요.";
    } else if (trimmedNickname.length > 30) {
      nextErrors.nickname = "닉네임은 최대 30자까지 가능합니다.";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((message) => !message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      email: email.trim(),
      password,
      nickname: nickname.trim(),
      profileFile,
    });
  };

  const clearError = (field) => {
    setErrors((current) => ({ ...current, [field]: "" }));
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
      setProfileError("");
      setProfileFile(await prepareImageUpload(file));
    } catch (error) {
      clearProfileFile();
      setProfileError(
        error.message || "프로필 이미지를 처리하지 못했습니다.",
      );
    } finally {
      setIsConvertingImage(false);
    }
  };

  return (
    <form className="signup-form" noValidate onSubmit={handleSubmit}>
      <div className="signup-profile-area">
        <label htmlFor="signup-profile">프로필 사진</label>
        <input
          ref={profileInputRef}
          id="signup-profile"
          type="file"
          accept="image/*,.heic,.heif"
          hidden
          onChange={handleProfileChange}
        />
        <div className="signup-profile-control">
          <label className="signup-profile-upload" htmlFor="signup-profile">
            {profilePreviewUrl ? (
              <img src={profilePreviewUrl} alt="프로필 미리보기" />
            ) : (
              <span>{isConvertingImage ? "…" : "+"}</span>
            )}
          </label>
          {profilePreviewUrl && (
            <button
              type="button"
              className="profile-remove-button"
              aria-label="선택한 프로필 이미지 삭제"
              onClick={clearProfileFile}
            >
              ×
            </button>
          )}
        </div>
        {profileError && (
          <p className="signup-helper-text" role="alert">* {profileError}</p>
        )}
      </div>

      <div className="signup-input-box">
        <label htmlFor="signup-email">이메일*</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          autoComplete="email"
          placeholder="이메일을 입력하세요"
          onChange={(event) => {
            setEmail(event.target.value);
            clearError("email");
          }}
        />
        {(errors.email || serverError) && (
          <p className="signup-helper-text" role="alert">
            * {errors.email || serverError}
          </p>
        )}
      </div>

      <div className="signup-input-box">
        <label htmlFor="signup-password">비밀번호*</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          autoComplete="new-password"
          placeholder="비밀번호를 입력하세요"
          onChange={(event) => {
            setPassword(event.target.value);
            clearError("password");
            clearError("passwordCheck");
          }}
        />
        {errors.password && <p className="signup-helper-text">* {errors.password}</p>}
      </div>

      <div className="signup-input-box">
        <label htmlFor="signup-password-check">비밀번호 확인*</label>
        <input
          id="signup-password-check"
          type="password"
          value={passwordCheck}
          autoComplete="new-password"
          placeholder="비밀번호를 한번 더 입력하세요"
          onChange={(event) => {
            setPasswordCheck(event.target.value);
            clearError("passwordCheck");
          }}
        />
        {errors.passwordCheck && (
          <p className="signup-helper-text">* {errors.passwordCheck}</p>
        )}
      </div>

      <div className="signup-input-box">
        <label htmlFor="signup-nickname">닉네임*</label>
        <input
          id="signup-nickname"
          type="text"
          value={nickname}
          maxLength={30}
          autoComplete="nickname"
          placeholder="닉네임을 입력하세요"
          onChange={(event) => {
            setNickname(event.target.value);
            clearError("nickname");
          }}
        />
        {errors.nickname && <p className="signup-helper-text">* {errors.nickname}</p>}
      </div>

      <button className="signup-button" type="submit" disabled={isSubmitting || isConvertingImage}>
        {isSubmitting ? "가입 중" : "회원가입"}
      </button>
    </form>
  );
}

export default SignupForm;
