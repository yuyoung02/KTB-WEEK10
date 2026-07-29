// 화면용 구장 정보와 백엔드 StadiumCode 매핑
const team = (id, name) => ({
  id,
  name,
  logoUrl: `/assets/images/teams/${id}.svg`,
});

export const stadiums = [
  { id: "jamsil", code: "JAMSIL", name: "잠실야구장", teams: [team("lg", "LG 트윈스"), team("doosan", "두산 베어스")] },
  { id: "daejeon", code: "DAEJEON", name: "대전 한화생명 볼파크", teams: [team("hanwha", "한화 이글스")] },
  { id: "gocheok", code: "GOCHEOK", name: "고척스카이돔", teams: [team("kiwoom", "키움 히어로즈")] },
  { id: "suwon", code: "SUWON", name: "수원 KT위즈파크", teams: [team("kt", "KT 위즈")] },
  { id: "incheon", code: "MUNHAK", name: "인천 SSG랜더스필드", teams: [team("ssg", "SSG 랜더스")] },
  { id: "daegu", code: "DAEGU", name: "대구 삼성라이온즈파크", teams: [team("samsung", "삼성 라이온즈")] },
  { id: "gwangju", code: "GWANGJU", name: "광주 챔피언스필드", teams: [team("kia", "KIA 타이거즈")] },
  { id: "busan", code: "SAJIK", name: "부산 사직야구장", teams: [team("lotte", "롯데 자이언츠")] },
  { id: "changwon", code: "CHANGWON", name: "창원 NC파크", teams: [team("nc", "NC 다이노스")] },
];

export const allStadium = {
  id: "all",
  code: "ALL",
  name: "전체 구장",
  teams: [],
};

export const findStadiumById = (id) => {
  if (id === allStadium.id) return allStadium;
  const stadium = stadiums.find((item) => item.id === id);
  return stadium;
};

export const findStadiumByCode = (code) => {
  const normalizedCode = String(code).toUpperCase();
  if (normalizedCode === allStadium.code) return allStadium;
  return stadiums.find((stadium) => stadium.code === normalizedCode);
};

export const getStadiumCode = (id) => findStadiumById(id)?.code ?? "";
