// 홈 상단 소개 영역
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">BALLPARK COMMUNITY</p>
        <h2>오늘의 야구장,<br />어디까지 즐겨봤나요?</h2>
        <p>구장 주변 맛집과 핫플을 발견하고<br />직관러들의 생생한 이야기를 나눠보세요.</p>
        <Link to="/posts" className="primary-button">구장 이야기 둘러보기</Link>
      </div>
      <div className="hero-ball" aria-hidden="true">⚾</div>
    </section>
  );
}

export default HeroSection;
