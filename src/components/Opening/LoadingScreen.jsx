import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon } from "lucide-react";

function renderWelcomeText(text) {
  const [names, ...lines] = text.split("\n");

  return (
    <h1 className="loading-welcome">
      <span className="loading-welcome-names">{names}</span>
      <span className="loading-welcome-copy">{lines.join("\n")}</span>
    </h1>
  );
}

export default function LoadingScreen({ opening, onComplete }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 250 : 2000);
    return () => window.clearTimeout(timer);
  }, [onComplete, reduceMotion]);

  return (
    <section
      className="opening-screen loading-screen muslim-opening"
      id="loading"
      aria-live="polite"
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
        className="loading-card"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="crescent-mark"
          animate={reduceMotion ? undefined : { opacity: [0.72, 1, 0.72], scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Moon size={46} aria-hidden="true" />
        </motion.div>
        {renderWelcomeText(opening.loadingText)}
        <div className="progress-track" aria-hidden="true">
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0.2 : 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
