// 실시간 구장 TOP 3를 시상대 순서로 표시
import PodiumItem from "./PodiumItem";

function StadiumRanking({ rankings, isLoading, error }) {
  const displayOrder = [2, 1, 3];
  const orderedRankings = displayOrder
    .map((rank) => rankings.find((item) => item.rank === rank))
    .filter(Boolean);

  return (
    <section className="section-block" id="ranking">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BALLPARK TOP 3</p>
          <h3>구장 랭킹 TOP 3</h3>
        </div>
        <span className="period">7월 투표 기준</span>
      </div>

      {isLoading ? (
        <p className="ranking-status">구장 랭킹을 불러오는 중입니다.</p>
      ) : error ? (
        <p className="ranking-status error">{error}</p>
      ) : orderedRankings.length === 0 ? (
        <p className="ranking-status">아직 집계된 투표가 없습니다.</p>
      ) : (
        <div className="podium">
          {orderedRankings.map((ranking) => (
            <PodiumItem key={ranking.stadium.id} ranking={ranking} />
          ))}
        </div>
      )}
    </section>
  );
}

export default StadiumRanking;
