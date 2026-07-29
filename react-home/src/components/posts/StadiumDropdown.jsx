// 게시글 목록을 구장별로 조회하는 필터 드롭다운
import { useEffect, useRef, useState } from "react";

function StadiumLogos({ stadium }) {
  if (!stadium) {
    return <span className="all-stadium-icon">⚾</span>;
  }

  return (
    <span className={`option-logo-wrap ${stadium.teams.length > 1 ? "double" : "single"}`}>
      {stadium.teams.map((team) => (
        <img
          key={team.id}
          src={team.logoUrl}
          alt={team.name}
          className="team-logo"
        />
      ))}
    </span>
  );
}

function StadiumDropdown({ stadiums, selectedStadiumId, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);
  const selectedStadium = stadiums.find(
    (stadium) => stadium.id === selectedStadiumId,
  );

  useEffect(() => {
    const closeDropdown = (event) => {
      if (!filterRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const selectStadium = (stadiumId) => {
    onChange(stadiumId);
    setIsOpen(false);
  };

  return (
    <div className="stadium-filter" ref={filterRef}>
      <button
        type="button"
        className={`stadium-button ${isOpen ? "open" : ""}`}
        aria-expanded={isOpen}
        aria-controls="stadium-dropdown"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="selected-stadium">
          <StadiumLogos stadium={selectedStadium} />
          <span className="selected-stadium-name">
            {selectedStadium?.name ?? "전체 구장"}
          </span>
        </span>
        <span className="chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="posts-stadium-dropdown" id="stadium-dropdown">
          <li>
            <button
              type="button"
              className={`filter-stadium-option ${selectedStadiumId === "" ? "active" : ""}`}
              onClick={() => selectStadium("")}
            >
              <span className="option-logo-wrap single">
                <span className="all-stadium-icon">⚾</span>
              </span>
              <span className="option-name">전체 구장</span>
            </button>
          </li>

          {stadiums.map((stadium) => (
            <li key={stadium.id}>
              <button
                type="button"
                className={`filter-stadium-option ${selectedStadiumId === stadium.id ? "active" : ""}`}
                onClick={() => selectStadium(stadium.id)}
              >
                <StadiumLogos stadium={stadium} />
                <span className="option-name">{stadium.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StadiumDropdown;
