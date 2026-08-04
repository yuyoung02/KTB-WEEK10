// 투표 모달의 구장 라디오 항목
function StadiumOption({ stadium, isSelected, onSelect }) {
  return (
    <label className="stadium-option">
      <input
        type="radio"
        name="stadium"
        value={stadium.id}
        checked={isSelected}
        onChange={() => {}}
        onClick={() => onSelect(isSelected ? "" : stadium.id)}
      />

      <span className={`option-logos ${stadium.teams.length > 1 ? "dual-logo" : ""}`}>
        {stadium.teams.map((team) => (
          <img key={team.id} src={team.logoUrl} alt={team.name} />
        ))}
      </span>

      <b>{stadium.name}</b>
    </label>
  );
}

export default StadiumOption;
