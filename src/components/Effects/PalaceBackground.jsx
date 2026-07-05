import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function PalaceBackground({ theme, variant = "entrance" }) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    if (reduceMotion || isMobile) return undefined;

    let frameId = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setScrollOffset(Math.min(window.scrollY * 0.035, 42));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [reduceMotion]);

  return (
    <div
      className={`palace-background palace-background-${variant}`}
      aria-hidden="true"
      style={{
        "--theme-gold": theme.colors.gold,
        "--theme-shadow": theme.colors.shadow || theme.colors.emerald,
        "--palace-shift": `${scrollOffset}px`
      }}
    >
      <div className="palace-light" />
      <div className="palace-moon" />
      <div className="palace-arches" />
      <div className="palace-silhouette" />
      <div className="palace-floor" />
      <div className="palace-pattern" />
    </div>
  );
}
