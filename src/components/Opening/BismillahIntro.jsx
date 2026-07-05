import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function BismillahIntro({ opening, onComplete }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

  useEffect(() => {
    const timer = window.setTimeout(onComplete, reduceMotion ? 300 : isMobile ? 4300 : 3000);
    return () => window.clearTimeout(timer);
  }, [isMobile, onComplete, reduceMotion]);

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
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 1.4, ease: "easeOut" }}
      >
        <motion.p
          className="arabic-text cinematic-arabic"
          animate={
            reduceMotion
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
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: reduceMotion ? 0 : 0.8 }}
        >
          {opening.bismillahEnglish}
        </motion.p>
      </motion.div>
    </section>
  );
}
