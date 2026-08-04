// 기존 투표 조회, 9개 구장 선택과 투표 요청 상태 관리
import { useEffect, useRef, useState } from "react";
import { getMyStadiumVote } from "../../api/voteApi";
import { getApiErrorMessage } from "../../api/client";
import { getAccessToken } from "../../auth/tokenStorage";
import {
  findStadiumByCode,
  stadiums,
} from "../../data/stadiums";
import StadiumOption from "./StadiumOption";

function StadiumVoteModal({
  onClose,
  onSubmit,
  onCancelVote,
}) {
  const [selectedId, setSelectedId] = useState("");
  const [hasExistingVote, setHasExistingVote] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const loadMyVote = async () => {
      if (!getAccessToken()) return;

      try {
        setIsVoteLoading(true);
        const vote = await getMyStadiumVote();
        if (isCancelled) return;

        if (!vote?.stadiumId) {
          setSelectedId("");
          setHasExistingVote(false);
          setMessage("");
          return;
        }

        setSelectedId(
          findStadiumByCode(vote.stadiumId)?.id ?? "",
        );
        setHasExistingVote(true);
      } catch (error) {
        if (isCancelled) return;

        if (error.status === 404) {
          setSelectedId("");
          setHasExistingVote(false);
          setMessage("");
        } else {
          console.error(error);
          setMessage(getApiErrorMessage(error, {
            401: "투표하려면 로그인이 필요합니다.",
            403: "투표 조회 권한이 없습니다.",
            default: "기존 투표를 불러오지 못했습니다.",
          }));
        }
      } finally {
        if (!isCancelled) setIsVoteLoading(false);
      }
    };

    loadMyVote();
    closeButtonRef.current?.focus();

    const closeWithEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      isCancelled = true;
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if ((!selectedId && !hasExistingVote) || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setMessage("");

      if (!selectedId && hasExistingVote) {
        await onCancelVote();
        setHasExistingVote(false);
        setMessage("투표를 취소했습니다.");
        return;
      }

      const didVote = await onSubmit(selectedId);
      if (didVote === false) return;

      const selectedStadium = stadiums.find(
        (stadium) => stadium.id === selectedId,
      );
      setHasExistingVote(true);
      setMessage(`✓ ${selectedStadium?.name}에 투표했습니다.`);
    } catch (error) {
      console.error(error);
      setMessage(getApiErrorMessage(error, {
        400: "투표할 구장을 다시 선택해주세요.",
        401: "투표하려면 로그인이 필요합니다.",
        403: "투표 권한이 없습니다.",
        404: "사용자 또는 구장 정보를 찾을 수 없습니다.",
        default: "투표 요청을 처리하지 못했습니다.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="vote-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vote-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="vote-modal-panel">
        <div className="modal-heading">
          <div>
            {/* 투표 달, 투표 주제 */}
            <p className="eyebrow">AUGUST VOTE</p>
            <h3 id="vote-modal-title">맛집이 가장 많은 야구장은?</h3>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="modal-close"
            aria-label="투표 창 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {isVoteLoading ? (
          <p className="vote-loading">기존 투표를 불러오는 중입니다.</p>
        ) : (
          <form className="stadium-options" onSubmit={handleSubmit}>
            {stadiums.map((stadium) => (
              <StadiumOption
                key={stadium.id}
                stadium={stadium}
                isSelected={selectedId === stadium.id}
                onSelect={(stadiumId) => {
                  setSelectedId(stadiumId);
                  setMessage("");
                }}
              />
            ))}

            <button
              type="submit"
              className="vote-submit"
              disabled={(!selectedId && !hasExistingVote) || isSubmitting}
            >
              {isSubmitting
                ? "투표 처리 중"
                : hasExistingVote && !selectedId
                  ? "투표 취소하기"
                  : hasExistingVote
                  ? "선택한 구장 변경하기"
                  : "이 구장에 투표하기"}
            </button>
          </form>
        )}

        {message && <p className="vote-message" aria-live="polite">{message}</p>}
      </div>
    </div>
  );
}

export default StadiumVoteModal;
