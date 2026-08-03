// 투표 모달 열기, 투표 저장과 로그인 이동 처리
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitStadiumVote } from "../../api/voteApi";
import { getAccessToken } from "../../auth/tokenStorage";
import { getStadiumCode } from "../../data/stadiums";
import StadiumVoteModal from "./StadiumVoteModal";

function MonthlyStadiumVote({ onVoteSuccess }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const submitVote = async (stadiumId) => {
    if (!getAccessToken()) {
      closeModal();
      navigate("/login", {
        state: { from: { pathname: "/", hash: "#monthly-vote" } },
      });
      return false;
    }

    await submitStadiumVote(
      getStadiumCode(stadiumId),
    );
    await onVoteSuccess?.();
    return true;
  };

  return (
    <section className="section-block" id="monthly-vote">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AUGUST VOTE</p>
          <h3>8월의 구장 투표</h3>
        </div>
        <span className="period">8.1 — 8.31</span>
      </div>

      <article className="vote-card">
        <div className="vote-intro">
          <div className="vote-copy">
            <span className="vote-chip">이번 달 질문</span>
            <h4>맛집이 가장 많은 야구장은?</h4>
            <p>직접 경험한 구장 중 한 곳을 골라주세요.</p>
            <button
              type="button"
              className="open-vote-button"
              onClick={() => setIsModalOpen(true)}
            >
              투표하러 가기 →
            </button>
          </div>

          <div className="vote-visual" aria-hidden="true">
            <div className="vote-podium">
              <div className="vote-podium-step second"><strong>2</strong></div>
              <div className="vote-podium-step first"><strong>1</strong></div>
              <div className="vote-podium-step third"><strong>3</strong></div>
            </div>
          </div>
        </div>
      </article>

      {isModalOpen && (
        <StadiumVoteModal
          onClose={closeModal}
          onSubmit={submitVote}
        />
      )}
    </section>
  );
}

export default MonthlyStadiumVote;
