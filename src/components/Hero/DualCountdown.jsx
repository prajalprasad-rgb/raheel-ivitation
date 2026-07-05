import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { CheckCircle2, Clock } from "lucide-react";

function getLiveParts(dateTimeISO) {
  const target = dayjs(dateTimeISO);
  const now = dayjs();
  const totalSeconds = Math.max(target.diff(now, "second"), 0);

  return {
    completed: totalSeconds === 0,
    parts: [
      { label: "Days", value: Math.floor(totalSeconds / 86400) },
      { label: "Hours", value: Math.floor((totalSeconds % 86400) / 3600) },
      { label: "Minutes", value: Math.floor((totalSeconds % 3600) / 60) },
      { label: "Seconds", value: totalSeconds % 60 }
    ]
  };
}

function CountdownCard({ event, label }) {
  const countdown = getLiveParts(event.dateTimeISO);

  return (
    <article className="countdown-card luxury-countdown-card">
      <div className="countdown-title">
        {countdown.completed ? (
          <CheckCircle2 className="gold-icon" aria-hidden="true" />
        ) : (
          <Clock className="gold-icon" aria-hidden="true" />
        )}
        <h3>{countdown.completed ? `✔ ${label} Completed` : label}</h3>
      </div>

      {countdown.completed ? (
        <p className="completed-message">Blessed celebration completed</p>
      ) : (
        <div className="countdown-grid">
          {countdown.parts.map((part) => (
            <span key={part.label}>
              <strong>{String(part.value).padStart(2, "0")}</strong>
              <small>{part.label}</small>
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function DualCountdown({ nikah, reception }) {
  const [, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const events = useMemo(
    () => [
      { event: nikah, label: "Nikah" },
      { event: reception, label: "Reception" }
    ],
    [nikah, reception]
  );

  return (
    <section className="section countdown-section" id="countdown">
      <div className="section-heading">
        <p className="eyebrow">Counting down</p>
        <h2>Blessed Celebrations Await</h2>
      </div>
      <div className="two-column countdown-columns">
        {events.map(({ event, label }) => (
          <CountdownCard key={label} event={event} label={label} />
        ))}
      </div>
    </section>
  );
}
