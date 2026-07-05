import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function BismillahIntro({ opening, onComplete }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;

  useEffect(() => {
    const timer = window.setTimeout(onComplete, isMobile ? 3600 : shouldReduceMotion ? 900 : 3200);
    return () => window.clearTimeout(timer);
  }, [isMobile, onComplete, shouldReduceMotion]);

  return (
    <section className="opening-screen bismillah-screen" id="bismillah" aria-live="polite">
      <div className="bismillah-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <motion.div
        className="bismillah-card"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 1.05, ease: "easeOut" }}
      >
        <motion.p
          className="arabic-text cinematic-arabic"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  textShadow: [
                    "0 0 18px rgba(212,175,55,0.28)",
                    "0 0 44px rgba(212,175,55,0.58)",
                    "0 0 18px rgba(212,175,55,0.28)"
                  ]
                }
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {opening.bismillahArabic}
        </motion.p>
        <motion.p
          className="lead bismillah-english"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: shouldReduceMotion ? 0 : 0.8 }}
        >
          {opening.bismillahEnglish}
        </motion.p>
      </motion.div>
    </section>
  );
}
