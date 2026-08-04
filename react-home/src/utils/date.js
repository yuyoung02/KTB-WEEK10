// 백엔드에서 내려준 서울 시간을 화면 형식으로 표시
export function formatSeoulDate(date, { withSeconds = false } = {}) {
  if (!date) return "";

  return String(date)
    .replace(/Z$|[+-]\d{2}:?\d{2}$/i, "")
    .replace("T", " ")
    .slice(0, withSeconds ? 19 : 16);
}
