import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

export default function ClosingCeremony({ invitation, onFarewellVisible }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45, once: true });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (inView) {
      onFarewellVisible?.();
    }
  }, [inView, onFarewellVisible]);

  return (
    <footer className="closing-ceremony" ref={ref}>
      <div className="closing-moon" aria-hidden="true" />
      <div className="closing-lanterns" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="closing-doors" aria-hidden="true">
        <motion.span
          className="closing-door-left"
          initial={reduceMotion ? false : { x: "-62%" }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduceMotion ? 0.1 : 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="closing-door-right"
          initial={reduceMotion ? false : { x: "62%" }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduceMotion ? 0.1 : 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div
        className="closing-message"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, delay: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <Heart className="gold-icon" aria-hidden="true" />
        <p className="eyebrow">Thank You</p>
        <h2>Thank You</h2>
        <p className="lead">{invitation.messages.closing}</p>

        {invitation.brand.showBranding && (
          <div className="wedify-branding">
            <strong>Crafted with love by {invitation.brand.name}</strong>
            <span>{invitation.brand.tagline}</span>
          </div>
        )}
      </motion.div>
    </footer>
  );
}
