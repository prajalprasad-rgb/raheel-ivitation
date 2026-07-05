import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ImageIcon, Moon } from "lucide-react";
import EngravedNames from "./EngravedNames";

export default function Hero({ invitation }) {
  const { couple, messages } = invitation;
  const [photoMissing, setPhotoMissing] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(true);
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 32) {
        setShowScrollCue(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero-section premium-hero">
      <div className="hero-light-rays" aria-hidden="true" />
      <motion.div
        className="hero-copy"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <div className="crescent-glow" aria-hidden="true">
          <Moon size={34} />
        </div>
        <p className="eyebrow">You are warmly invited</p>
        <EngravedNames
          brideName={couple.brideName}
          groomName={couple.groomName}
          brideFamily={couple.brideFamily}
          groomFamily={couple.groomFamily}
        />
        <p className="lead hero-welcome">{messages.welcome}</p>
      </motion.div>

      <motion.div
        id="couple"
        className="hero-portrait-stage"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 26 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: shouldReduceMotion ? 0 : 0.25, ease: "easeOut" }}
      >
        <motion.div
          className="portrait-arch"
          aria-hidden="true"
          animate={shouldReduceMotion ? undefined : { y: [0, -8, 0], opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="hero-photo-wrap ornamental-frame">
          {!photoMissing ? (
            <img
              className="hero-photo"
              src={couple.photo}
              alt={`${couple.groomName} and ${couple.brideName}`}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 82vw, 380px"
              onError={() => setPhotoMissing(true)}
            />
          ) : (
            <div className="photo-fallback" role="img" aria-label={`${couple.groomName} and ${couple.brideName}`}>
              <ImageIcon size={46} aria-hidden="true" />
              <span>{couple.groomName}</span>
              <small>&</small>
              <span>{couple.brideName}</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className={`scroll-cue ${showScrollCue ? "visible" : "hidden"}`}
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: showScrollCue ? 1 : 0, y: showScrollCue ? 0 : 8 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <span>Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
