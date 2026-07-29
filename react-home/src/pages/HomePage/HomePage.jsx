// 홈의 소개·월간 투표·실시간 랭킹 구성
import { useCallback, useEffect, useState } from "react";
import { getStadiumVoteRankings } from "../../api/voteApi";
import HeroSection from "../../components/home/HeroSection";
import StadiumRanking from "../../components/ranking/StadiumRanking";
import MonthlyStadiumVote from "../../components/vote/MonthlyStadiumVote";
import {
  findStadiumByCode,
} from "../../data/stadiums";

function HomePage() {
  const [rankings, setRankings] = useState([]);
  const [isRankingLoading, setIsRankingLoading] = useState(true);
  const [rankingError, setRankingError] = useState("");

  const loadRankings = useCallback(async () => {
    try {
      setIsRankingLoading(true);
      setRankingError("");
      const data = await getStadiumVoteRankings();
      const mappedRankings = (Array.isArray(data) ? data : [])
        .map((ranking, index) => ({
          rank: index + 1,
          stadium: findStadiumByCode(ranking.stadiumId),
          percentage: ranking.percentage ?? 0,
          voteCount: ranking.voteCount ?? 0,
        }))
        .filter(
          (ranking) =>
            ranking.stadium && ranking.voteCount > 0,
        );

      setRankings(mappedRankings);
    } catch (error) {
      console.error(error);
      setRankings([]);
      setRankingError("구장 랭킹을 불러오지 못했습니다.");
    } finally {
      setIsRankingLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRankings();
  }, [loadRankings]);

  return (
    <main className="home-page">
      <div className="home-container">
        <HeroSection />
        <MonthlyStadiumVote
          onVoteSuccess={loadRankings}
        />
        <StadiumRanking
          rankings={rankings}
          isLoading={isRankingLoading}
          error={rankingError}
        />
      </div>
    </main>
  );
}

export default HomePage;
