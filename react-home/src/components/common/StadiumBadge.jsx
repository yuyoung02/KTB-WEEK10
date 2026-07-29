// 백엔드 구장 코드에 맞는 구장명과 구단 로고 표시
import { findStadiumByCode } from "../../data/stadiums";

function StadiumBadge({ stadiumCode, className = "" }) {
  const stadium = findStadiumByCode(stadiumCode);
  if (!stadium) return null;

  return (
    <span className={`api-stadium-badge ${className}`.trim()}>
      {stadium.code === "ALL" ? (
        <span aria-hidden="true">⚾</span>
      ) : (
        <span className={`api-stadium-logos ${stadium.teams.length > 1 ? "double" : ""}`}>
          {stadium.teams.map((team) => (
            <img key={team.id} src={team.logoUrl} alt="" />
          ))}
        </span>
      )}
      <span>{stadium.name}</span>
    </span>
  );
}

export default StadiumBadge;
