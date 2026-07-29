// 내 구장 투표와 실시간 랭킹 API
import { apiClient } from "./client";

export function getMyStadiumVote() {
  return apiClient("/stadiumVotes/me", {
    method: "GET",
    auth: true,
  });
}

export function submitStadiumVote(stadiumId) {
  return apiClient("/stadiumVotes", {
    method: "PUT",
    auth: true,
    body: { stadiumId },
  });
}

export function getStadiumVoteRankings() {
  return apiClient("/stadiumVotes/rankings");
}
