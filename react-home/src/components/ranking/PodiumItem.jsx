// TOP 3 시상대의 구장 한 개 표시
function PodiumItem({ ranking }) {
  const { rank, stadium, percentage } = ranking;

  return (
    <article className={`podium-place rank-${rank}`}>
      <div className="podium-stadium">
        {rank === 1 && <span className="winner-label">CURRENT NO.1</span>}

        <span className={`podium-logos ${stadium.teams.length > 1 ? "dual-logo" : ""}`}>
          {stadium.teams.map((team) => (
            <img key={team.id} src={team.logoUrl} alt={team.name} />
          ))}
        </span>

        <strong>{stadium.name}</strong>
        <span className="percentage">{percentage}%</span>
      </div>

      <div className="podium-step">
        <b>{rank}위</b>
      </div>
    </article>
  );
}

export default PodiumItem;
