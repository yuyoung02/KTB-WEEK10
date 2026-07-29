// 공통 로고, 네비게이션과 프로필 메뉴
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAccessToken } from "../../../auth/tokenStorage";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

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

        <div className="profile-menu" ref={profileMenuRef}>
          <button
            type="button"
            className="profile-button"
            aria-label="프로필 메뉴"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
          >
            <img
              src="/assets/images/defaultProfileImage.png"
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
