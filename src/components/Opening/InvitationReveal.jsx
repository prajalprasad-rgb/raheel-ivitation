import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sparkles } from "lucide-react";

export default function InvitationReveal({ opening, onComplete }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const mobileLite = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  const duration = isMobile ? 2.7 : reduceMotion ? 0.35 : 2.4;

  useEffect(() => {
    const revealDuration = isMobile ? 3000 : reduceMotion ? 900 : 2600;
    const timer = window.setTimeout(onComplete, revealDuration);
    return () => window.clearTimeout(timer);
  }, [isMobile, onComplete, reduceMotion]);

  return (
    <section
      className="opening-screen invitation-reveal-screen muslim-opening"
      id="invitation-reveal"
      aria-label="Revealing wedding invitation"
      style={{ "--opening-image": `url("${opening.backgroundImage}")` }}
    >
      {!mobileLite && <div className="opening-image-layer" aria-hidden="true" />}
      {!mobileLite && (
        <div className="opening-floral-corners" aria-hidden="true">
          <span />
          <span />
        </div>
      )}
      {!mobileLite && opening.showLanterns && (
        <div className="opening-lanterns" aria-hidden="true">
          <span />
          <span />
        </div>
      )}
      {!mobileLite && opening.showMosqueSilhouette && <div className="opening-mosque-silhouette" aria-hidden="true" />}
      {!mobileLite && opening.showCrescent && <div className="opening-crescent-halo" aria-hidden="true" />}

      <motion.div
        className="arch-curtain-light"
        initial={reduceMotion ? false : { opacity: 0, y: mobileLite ? 10 : 0, scaleY: mobileLite ? 1 : 0.78 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />

      <motion.article
        className="luxury-invitation-card"
        initial={reduceMotion ? false : { opacity: 0, y: mobileLite ? 18 : 46, scale: mobileLite ? 1 : 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration, delay: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Moon className="gold-icon" size={44} aria-hidden="true" />
        <p className="opening-kicker">A blessed invitation</p>
        {!mobileLite && <div className="reveal-arch" aria-hidden="true" />}
        {!mobileLite && <Sparkles className="reveal-sparkle" size={28} aria-hidden="true" />}
      </motion.article>
    </section>
  );
}
