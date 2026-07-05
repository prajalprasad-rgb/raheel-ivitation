import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sparkles } from "lucide-react";

export default function InvitationReveal({ opening, onComplete }) {
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0.2 : 2.4;

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 250 : 2500);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <section
      className="opening-screen invitation-reveal-screen muslim-opening"
      id="invitation-reveal"
      aria-label="Revealing wedding invitation"
      style={{ "--opening-image": `url("${opening.backgroundImage}")` }}
    >
      <div className="opening-image-layer" aria-hidden="true" />
      <div className="opening-floral-corners" aria-hidden="true">
        <span />
        <span />
      </div>
      {opening.showLanterns && (
        <div className="opening-lanterns" aria-hidden="true">
          <span />
          <span />
        </div>
      )}
      {opening.showMosqueSilhouette && <div className="opening-mosque-silhouette" aria-hidden="true" />}
      {opening.showCrescent && <div className="opening-crescent-halo" aria-hidden="true" />}

      <motion.div
        className="arch-curtain-light"
        initial={reduceMotion ? false : { opacity: 0, scaleY: 0.78 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      <motion.article
        className="luxury-invitation-card"
        initial={reduceMotion ? false : { opacity: 0, y: 46, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Moon className="gold-icon" size={44} aria-hidden="true" />
        <p className="opening-kicker">A blessed invitation</p>
        <div className="reveal-arch" aria-hidden="true" />
        <Sparkles className="reveal-sparkle" size={28} aria-hidden="true" />
      </motion.article>
    </section>
  );
}
