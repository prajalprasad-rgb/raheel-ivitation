import dayjs from "dayjs";
import { calculateEndDate } from "./date.js";

function escapeIcsText(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;")
    .replaceAll("\n", "\\n");
}

function eventLocation(event) {
  return `${event.venue}, ${event.address}`;
}

function eventDescription(event) {
  return `${event.title}\nVenue: ${event.venue}\nAddress: ${event.address}\nMap: ${event.mapLink}`;
}

function slugifyTitle(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function formatDateForCalendar(date) {
  return dayjs(date).utc().format("YYYYMMDDTHHmmss[Z]");
}

export function buildGoogleCalendarUrl(event, durationHours = 2) {
  const start = dayjs(event.dateTimeISO);
  const end = calculateEndDate(event.dateTimeISO, durationHours);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDateForCalendar(start)}/${formatDateForCalendar(end)}`,
    details: eventDescription(event),
    location: eventLocation(event)
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function createIcsContent(event, durationHours = 2) {
  const start = dayjs(event.dateTimeISO);
  const end = calculateEndDate(event.dateTimeISO, durationHours);
  const timestamp = formatDateForCalendar(dayjs());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Premium Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slugifyTitle(event.title)}-${formatDateForCalendar(start)}@invitation`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${formatDateForCalendar(start)}`,
    `DTEND:${formatDateForCalendar(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(eventLocation(event))}`,
    `DESCRIPTION:${escapeIcsText(eventDescription(event))}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export function downloadIcsFile(event, durationHours = 2) {
  const ics = createIcsContent(event, durationHours);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${slugifyTitle(event.title)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
