import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

const WEDIFY_WHATSAPP_URL = "https://wa.me/916235088556?text=Hi%20Wedify%2C%20I%20would%20like%20to%20know%20more%20about%20digital%20wedding%20invitations.";

export default function ClosingCeremony({ invitation, onFarewellVisible }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45, once: true });
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;
  const shouldReduceMotion = reduceMotion && !isMobile;

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
          initial={shouldReduceMotion ? false : { x: "-62%" }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="closing-door-right"
          initial={shouldReduceMotion ? false : { x: "62%" }}
          whileInView={{ x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 2.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <motion.div
        className="closing-message"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, delay: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <Heart className="gold-icon" aria-hidden="true" />
        <p className="eyebrow">Thank You</p>
        <h2>Thank You</h2>
        <p className="lead">{invitation.messages.closing}</p>

        {invitation.brand.showBranding && (
          <div className="wedify-branding">
            <strong>Crafted with love by {invitation.brand.name}</strong>
            <span>{invitation.brand.tagline}</span>
            <a className="wedify-contact-button" href={WEDIFY_WHATSAPP_URL} target="_blank" rel="noreferrer">
              <MessageCircle size={16} aria-hidden="true" />
              Contact Wedify
            </a>
          </div>
        )}
      </motion.div>
    </footer>
  );
}
