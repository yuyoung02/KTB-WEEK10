// 기본 소개와 9개 구장을 순환해서 보여주는 홈 상단 배너
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { stadiums } from "../../data/stadiums";

const stadiumCopy = {
  jamsil: { region: "SEOUL · JAMSIL", tagline: "두 팀의 열기가\n한 지붕 아래 모이는 곳", description: "서울 야구의 중심, 잠실에서 즐긴 이야기를 만나보세요.", background: "linear-gradient(135deg, #132f49 0%, #315b73 100%)" },
  daejeon: { region: "DAEJEON · HANWHA", tagline: "새로운 야구의 설렘이\n시작되는 볼파크", description: "뜨거운 응원과 새로운 풍경이 있는 대전의 이야기를 만나보세요.", background: "linear-gradient(135deg, #6f231f 0%, #c34b32 100%)" },
  gocheok: { region: "SEOUL · GOCHEOK", tagline: "날씨 걱정 없이\n야구에 빠지는 돔", description: "도심 속 돔구장에서 즐기는 특별한 직관 경험을 나눠보세요.", background: "linear-gradient(135deg, #351d43 0%, #74445e 100%)" },
  suwon: { region: "SUWON · KT WIZ", tagline: "마법 같은 승부가\n펼쳐지는 수원", description: "수원 위즈파크 주변의 맛집과 생생한 직관 후기를 만나보세요.", background: "linear-gradient(135deg, #1f2329 0%, #505862 100%)" },
  incheon: { region: "INCHEON · LANDERS", tagline: "랜더스의 함성이\n인천을 채우는 밤", description: "먹거리부터 응원까지, 인천 야구의 매력을 발견해보세요.", background: "linear-gradient(135deg, #641f2b 0%, #a93b4d 100%)" },
  daegu: { region: "DAEGU · LIONS", tagline: "푸른 사자들의 열정이\n빛나는 구장", description: "라이온즈파크의 시원한 시야와 대구의 야구 문화를 만나보세요.", background: "linear-gradient(135deg, #17375f 0%, #3274a8 100%)" },
  gwangju: { region: "GWANGJU · TIGERS", tagline: "타이거즈의 역사가\n이어지는 챔피언스필드", description: "광주의 뜨거운 응원과 구장 주변 로컬 맛집을 공유해보세요.", background: "linear-gradient(135deg, #742421 0%, #c3463d 100%)" },
  busan: { region: "BUSAN · SAJIK", tagline: "부산 갈매기의 노래가\n울려 퍼지는 곳", description: "사직의 독보적인 응원 문화와 부산의 야구 이야기를 만나보세요.", background: "linear-gradient(135deg, #172d4c 0%, #365c80 100%)" },
  changwon: { region: "CHANGWON · NC PARK", tagline: "야구가 더 가까워지는\n창원의 밤", description: "탁 트인 NC파크에서 찾은 직관 포인트를 함께 나눠보세요.", background: "linear-gradient(135deg, #183653 0%, #39718a 100%)" },
};

const defaultSlide = {
  id: "intro",
  name: "구장 이야기",
  region: "BALLPARK COMMUNITY",
  tagline: "오늘의 야구장,\n어디까지 즐겨봤나요?",
  description: "구장 주변 맛집과 핫플을 발견하고 직관러들의 생생한 이야기를 나눠보세요.",
  background: "linear-gradient(135deg, #163452 0%, #244e73 100%)",
  teams: [],
};

const slides = [
  defaultSlide,
  ...stadiums.map((stadium) => ({ ...stadium, ...stadiumCopy[stadium.id] })),
];

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = slides[activeIndex];
  const postsLink = activeSlide.id === "intro"
    ? "/posts"
    : `/posts?stadium=${activeSlide.id}`;

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const moveSlide = (direction) => {
    setActiveIndex((index) => (index + direction + slides.length) % slides.length);
  };

  return (
    <section
      className="hero hero-carousel"
      style={{ background: activeSlide.background }}
      aria-label="구장 소개"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="hero-slide" key={activeSlide.id}>
        <div className="hero-copy">
          <p className="eyebrow">{activeSlide.region}</p>
          <h2>{activeSlide.tagline.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
          <p>{activeSlide.description}</p>
          <Link to={postsLink} className="primary-button">
            {activeSlide.id === "intro" ? "구장 이야기 둘러보기" : "구장 이야기 보기"}
          </Link>
        </div>

        {activeSlide.id === "intro" ? (
          <div className="hero-ball" aria-hidden="true">⚾</div>
        ) : (
          <div className={`hero-team-visual ${activeSlide.teams.length > 1 ? "double" : ""}`} aria-hidden="true">
            {activeSlide.teams.map((team) => (
              <img key={team.id} src={team.logoUrl} alt="" />
            ))}
            <strong>{activeSlide.name}</strong>
          </div>
        )}
      </div>

      <div className="hero-carousel-controls">
        <button type="button" className="hero-arrow previous" aria-label="이전 구장" onClick={() => moveSlide(-1)}>‹</button>
        <div className="hero-indicators" aria-label="구장 배너 선택">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={index === activeIndex ? "active" : ""}
              aria-label={`${slide.name} 배너`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" className="hero-arrow next" aria-label="다음 구장" onClick={() => moveSlide(1)}>›</button>
      </div>
    </section>
  );
}

export default HeroSection;
