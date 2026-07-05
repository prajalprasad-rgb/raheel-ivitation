import { CalendarPlus, Smartphone } from "lucide-react";
import { buildGoogleCalendarUrl, downloadIcsFile } from "../../utils/calendar";

export default function CalendarButtons({ event, durationHours }) {
  return (
    <div className="calendar-buttons">
      <a
        className="secondary-button calendar-button"
        href={buildGoogleCalendarUrl(event, durationHours)}
        target="_blank"
        rel="noreferrer"
      >
        <CalendarPlus size={18} aria-hidden="true" />
        Google Calendar
      </a>
      <button className="secondary-button calendar-button" type="button" onClick={() => downloadIcsFile(event, durationHours)}>
        <Smartphone size={18} aria-hidden="true" />
        Apple / iPhone
      </button>
    </div>
  );
}
