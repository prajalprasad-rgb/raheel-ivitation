import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export function formatDisplayDate(dateTimeISO) {
  return dayjs(dateTimeISO).format("dddd, D MMMM YYYY");
}

export function formatElegantDateTime(dateTimeISO) {
  return dayjs(dateTimeISO).format("dddd, D MMMM YYYY [at] h:mm A");
}

export function calculateEndDate(dateTimeISO, durationHours = 2) {
  return dayjs(dateTimeISO).add(durationHours, "hour");
}

export function getCountdownParts(dateTimeISO) {
  const target = dayjs(dateTimeISO);
  const now = dayjs();
  const totalSeconds = Math.max(target.diff(now, "second"), 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: minutes },
    { label: "Secs", value: seconds }
  ];
}
