import { motion, useReducedMotion } from "framer-motion";
import { MailCheck } from "lucide-react";

export default function EnvelopeAnimation({ sent, message }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="envelope-animation" aria-live="polite">
      <motion.div
        className="envelope-scene"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="rsvp-letter"
          animate={sent && !reduceMotion ? { y: 46, scale: 0.88, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          RSVP
        </motion.div>
        <div className="royal-envelope">
          <span className="envelope-flap" />
          <motion.span
            className="wax-seal"
            initial={false}
            animate={sent ? { scale: 1, opacity: 1 } : { scale: 0.72, opacity: 0.72 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.45, delay: sent ? 0.55 : 0 }}
          />
        </div>
        <div className="envelope-sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </motion.div>

      {sent ? (
        <motion.div
          className="success-message"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.75 }}
        >
          <MailCheck className="gold-icon" aria-hidden="true" />
          <h3>RSVP Received</h3>
          <p>{message}</p>
        </motion.div>
      ) : (
        <div className="success-message idle-message">
          <MailCheck className="gold-icon" aria-hidden="true" />
          <h3>Royal Envelope</h3>
          <p>Your response will be sealed with grace.</p>
        </div>
      )}
    </div>
  );
}
