import { motion, useReducedMotion } from "framer-motion";

export function AppFrame({ children }) {
  return (
    <div className="app-shell">
      <main>{children}</main>
    </div>
  );
}

export default function PageShell({ id, variant = "entrance", children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={`page-shell page-shell-${variant}`}
      id={id}
      data-palace-variant={variant}
      initial={reduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="palace-arch-overlay" aria-hidden="true" />
      <div className="page-shell-inner">{children}</div>
    </motion.section>
  );
}
