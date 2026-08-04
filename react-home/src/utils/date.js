// 백엔드 UTC 시간을 서울 시간으로 변환
export function formatSeoulDate(date, { withSeconds = false } = {}) {
  if (!date) return "";

  const value = String(date);
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
  const parsedDate = new Date(hasTimeZone ? value : `${value}Z`);

  if (Number.isNaN(parsedDate.getTime())) return value.replace("T", " ");

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" } : {}),
    hourCycle: "h23",
  }).formatToParts(parsedDate);
  const dateParts = Object.fromEntries(
    parts.map(({ type, value: partValue }) => [type, partValue]),
  );

  const formattedDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const formattedTime = `${dateParts.hour}:${dateParts.minute}`;

  return withSeconds
    ? `${formattedDate} ${formattedTime}:${dateParts.second}`
    : `${formattedDate} ${formattedTime}`;
}
