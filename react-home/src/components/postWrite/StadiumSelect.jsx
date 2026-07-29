// 게시글 작성, 수정에서 공통으로 사용하는 구장 드롭다운
import { useEffect, useRef, useState } from "react";

function StadiumLogo({ stadium }) {
  return (
    <span className={`option-logo-wrap ${stadium.teams.length > 1 ? "double" : ""}`}>
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

function StadiumSelect({ stadiums, selectedStadiumId, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedStadium = stadiums.find(
    (stadium) => stadium.id === selectedStadiumId,
  );

  useEffect(() => {
    const closeSelect = (event) => {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", closeSelect);
    return () => document.removeEventListener("mousedown", closeSelect);
  }, []);

  return (
    <div className="stadium-select" ref={selectRef}>
      <button
        type="button"
        className="stadium-select-button"
        aria-expanded={isOpen}
        aria-controls="write-stadium-dropdown"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="write-selected-stadium">
          {selectedStadiumId === "all" ? (
            <>
              <span className="all-stadium-icon">⚾</span>
              <span>전체 구장</span>
            </>
          ) : selectedStadium ? (
            <>
              <StadiumLogo stadium={selectedStadium} />
              <span>{selectedStadium.name}</span>
            </>
          ) : (
            "구장을 선택해주세요."
          )}
        </span>
        <span className="chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="write-stadium-dropdown" id="write-stadium-dropdown">
          <li>
            <button
              type="button"
              className={`write-stadium-option ${selectedStadiumId === "all" ? "active" : ""}`}
              onClick={() => {
                onChange("all");
                setIsOpen(false);
              }}
            >
              <span className="option-logo-wrap">
                <span className="all-stadium-icon">⚾</span>
              </span>
              <span className="option-name">전체 구장</span>
            </button>
          </li>

          {stadiums.map((stadium) => (
            <li key={stadium.id}>
              <button
                type="button"
                className={`write-stadium-option ${selectedStadiumId === stadium.id ? "active" : ""}`}
                onClick={() => {
                  onChange(stadium.id);
                  setIsOpen(false);
                }}
              >
                <StadiumLogo stadium={stadium} />
                <span className="option-name">{stadium.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StadiumSelect;
