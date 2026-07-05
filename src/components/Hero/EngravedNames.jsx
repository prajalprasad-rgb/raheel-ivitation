import { motion, useReducedMotion } from "framer-motion";

function NameLine({ children, family, delay }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;

  return (
    <motion.span
      className="engraved-line name-family-pair"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, delay, ease: "easeOut" }}
    >
      <span className="name-text">{children}</span>
      {family && <span className="name-family">{family}</span>}
    </motion.span>
  );
}

export default function EngravedNames({ brideName, groomName, brideFamily, groomFamily }) {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;

  return (
    <div className="engraved-names">
      <motion.div
        className="gold-dust"
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: shouldReduceMotion ? 0.28 : [0, 0.72, 0.28], scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <h1>
        <NameLine delay={0.15} family={groomFamily}>{groomName}</NameLine>
        <NameLine delay={0.42}>&</NameLine>
        <NameLine delay={0.68} family={brideFamily}>{brideName}</NameLine>
      </h1>
      <motion.span
        className="name-shine"
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { x: "-120%", opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 0 } : { x: "140%", opacity: [0, 0.95, 0] }}
        transition={{ duration: 1.8, delay: 1.1, ease: "easeInOut" }}
      />
      <p>Insha Allah</p>
    </div>
  );
}
