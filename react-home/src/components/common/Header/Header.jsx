// 공통 로고, 네비게이션과 프로필 메뉴
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../api/userApi";
import { clearAccessToken, getAccessToken } from "../../../auth/tokenStorage";

const DEFAULT_PROFILE_IMAGE = "/assets/images/defaultProfileImage.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()));
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      if (!getAccessToken()) {
        setIsAuthenticated(false);
        setProfileImage(DEFAULT_PROFILE_IMAGE);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!isCancelled) {
          setIsAuthenticated(true);
          setProfileImage(user.image || DEFAULT_PROFILE_IMAGE);
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          if (error.status === 401 || error.status === 403) {
            clearAccessToken();
            setIsAuthenticated(false);
          }
          setProfileImage(DEFAULT_PROFILE_IMAGE);
        }
      }
    };

    const handleProfileUpdated = (event) => {
      setProfileImage(event.detail?.image || DEFAULT_PROFILE_IMAGE);
    };

    loadProfile();
    window.addEventListener("user-profile-updated", handleProfileUpdated);

    return () => {
      isCancelled = true;
      window.removeEventListener("user-profile-updated", handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") return;

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <header className="header">
      <div className="header-top">
        <Link to="/" className="logo">
          <h1>구장 이야기 ⚾️</h1>
        </Link>

        {isAuthenticated ? (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="profile-button"
              aria-label="프로필 메뉴"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            >
              <img
                src={profileImage}
                className="header-profile-image"
                alt="프로필"
              />
            </button>

            {isProfileOpen && (
              <ul className="dropdown">
                <li><Link to="/mypage">마이페이지</Link></li>
                <li><Link to="/mypage/password">비밀번호수정</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      clearAccessToken();
                      setIsAuthenticated(false);
                      setProfileImage(DEFAULT_PROFILE_IMAGE);
                      setIsProfileOpen(false);
                      navigate("/login");
                    }}
                  >
                    로그아웃
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="header-auth-actions" aria-label="회원 메뉴">
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        )}
      </div>

      <nav className="header-nav" aria-label="주요 메뉴">
        <Link
          to="/"
          className={location.pathname === "/" && !location.hash ? "active" : ""}
        >
          홈
        </Link>
        <Link
          to="/#monthly-vote"
          className={location.pathname === "/" && location.hash === "#monthly-vote" ? "active" : ""}
          onClick={() => scrollToSection("monthly-vote")}
        >
          구장 투표
        </Link>
        <Link
          to="/posts"
          className={location.pathname.startsWith("/posts") ? "active" : ""}
        >
          구장 이야기
        </Link>
        <Link
          to="/#ranking"
          className={location.pathname === "/" && location.hash === "#ranking" ? "active" : ""}
          onClick={() => scrollToSection("ranking")}
        >
          구장 랭킹
        </Link>
      </nav>
    </header>
  );
}

export default Header;
