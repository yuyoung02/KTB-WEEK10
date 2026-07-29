// 회원정보 조회, 수정, 탈퇴 상태와 API 관리
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../auth/tokenStorage";
import {
  deleteCurrentUser,
  getCurrentUser,
  updateCurrentUser,
} from "../../api/userApi";
import MyPageForm from "../../components/myPage/MyPageForm";
import UpdateToast from "../../components/myPage/UpdateToast";
import WithdrawModal from "../../components/myPage/WithdrawModal";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const toastTimerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
        if (error.status === 401 || error.status === 403) {
          clearAccessToken();
          navigate("/login", { replace: true });
        } else {
          setFormError("회원정보를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    return () => clearTimeout(toastTimerRef.current);
  }, [navigate]);

  const showToast = () => {
    clearTimeout(toastTimerRef.current);
    setIsToastOpen(true);
    toastTimerRef.current = setTimeout(() => setIsToastOpen(false), 1500);
  };

  const handleUpdate = async ({ nickname, image }) => {
    try {
      setIsSubmitting(true);
      setFormError("");
      const updatedUser = await updateCurrentUser({ nickname, image });
      setUser(updatedUser);
      showToast();
    } catch (error) {
      console.error(error);
      if (error.status === 409) {
        setFormError("이미 사용중인 닉네임입니다.");
      } else if (error.status === 403) {
        setFormError("수정 권한이 없습니다.");
      } else {
        setFormError("회원정보 수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (password) => {
    try {
      setIsWithdrawing(true);
      setWithdrawError("");
      await deleteCurrentUser(password);
      clearAccessToken();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        setWithdrawError("비밀번호가 일치하지 않습니다.");
      } else if (error.status === 403) {
        setWithdrawError("삭제 권한이 없습니다.");
      } else {
        setWithdrawError("회원탈퇴에 실패했거나 서버와 연결할 수 없습니다.");
      }
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return <main className="mypage-status">회원정보를 불러오는 중입니다.</main>;
  }

  if (!user) {
    return <main className="mypage-status">{formError}</main>;
  }

  return (
    <main className="mypage">
      <section className="mypage-container">
        <h2>마이페이지</h2>
        <h3 className="mypage-section-title">회원정보 수정</h3>

        <MyPageForm
          user={user}
          isSubmitting={isSubmitting}
          serverError={formError}
          onSubmit={handleUpdate}
        />

        <button
          type="button"
          className="mypage-withdraw-button"
          onClick={() => {
            setWithdrawError("");
            setIsWithdrawModalOpen(true);
          }}
        >
          회원 탈퇴
        </button>

        <UpdateToast isOpen={isToastOpen} />
      </section>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        isSubmitting={isWithdrawing}
        serverError={withdrawError}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          setWithdrawError("");
        }}
        onWithdraw={handleWithdraw}
      />
    </main>
  );
}

export default MyPage;
