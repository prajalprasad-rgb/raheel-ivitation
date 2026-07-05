import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import CalendarButtons from "./CalendarButtons";
import LocationCard from "./LocationCard";
import { formatDisplayDate } from "../../utils/date";

const detailVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.18 + index * 0.12, ease: "easeOut" }
  })
};

export default function EventHall({ event, type }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;
  const durationHours = type === "reception" ? 4 : 2;

  return (
    <section className={`section event-section event-section-${type}`}>
      <motion.div
        className="event-arch"
        initial={shouldReduceMotion ? false : { opacity: 0.42, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <div className="event-hall-lanterns" aria-hidden="true">
          <span />
          <span />
        </div>

        <motion.article
          className="event-hall event-card"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.42 }}
        >
          <motion.div custom={0} variants={detailVariants}>
            <p className="eyebrow">{type === "nikah" ? "Sacred Ceremony" : "Royal Reception"}</p>
            <h2>{event.title}</h2>
          </motion.div>

          <div className="event-details-grid">
            <motion.div className="event-meta" custom={1} variants={detailVariants}>
              <CalendarDays className="gold-icon" aria-hidden="true" />
              <div>
                <strong>{formatDisplayDate(event.dateTimeISO)}</strong>
                <span>Date</span>
              </div>
            </motion.div>

            <motion.div className="event-meta" custom={2} variants={detailVariants}>
              <Clock className="gold-icon" aria-hidden="true" />
              <div>
                <strong>{event.time}</strong>
                <span>Time</span>
              </div>
            </motion.div>

            <motion.div className="event-meta event-meta-wide" custom={3} variants={detailVariants}>
              <MapPin className="gold-icon" aria-hidden="true" />
              <div>
                <strong>{event.venue}</strong>
                <span>Venue</span>
              </div>
            </motion.div>
          </div>

          <motion.div className="event-actions" custom={4} variants={detailVariants}>
            <CalendarButtons event={event} durationHours={durationHours} />
          </motion.div>

        </motion.article>

        <motion.div
          className="event-location-wrap"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          custom={5}
          variants={detailVariants}
        >
          <LocationCard
            venue={event.venue}
            address={event.address}
            mapLink={event.mapLink}
            mapEmbedUrl={event.mapEmbedUrl}
            eventTitle={event.title}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
