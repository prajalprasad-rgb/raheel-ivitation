import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { formatDisplayDate } from "../../utils/date";

const DESKTOP_SCRATCH_REVEAL_THRESHOLD = 0.16;
const MOBILE_SCRATCH_REVEAL_THRESHOLD = 0.2;
const DESKTOP_SCRATCH_BRUSH_RADIUS = 46;
const MOBILE_SCRATCH_BRUSH_RADIUS = 38;
const MIN_SCRATCH_TIME_MS = 850;

export default function ScratchReveal({ opening, nikah, reception, scratchDone, onScratchComplete, onEnter, onMusicStart }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const hasCelebratedRef = useRef(false);
  const isScratchingRef = useRef(false);
  const scratchStartedAtRef = useRef(0);
  const revealedRef = useRef(scratchDone);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(scratchDone);
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

  useEffect(() => {
    revealedRef.current = scratchDone;
    setRevealed(scratchDone);
  }, [scratchDone]);

  const celebrate = () => {
    if (hasCelebratedRef.current) return;
    hasCelebratedRef.current = true;
    confetti({
      particleCount: 90,
      spread: 72,
      origin: { y: 0.72 },
      colors: ["#C9A14A", "#E8D8B3", "#F8F2E7", "#261B12"]
    });
  };

  const completeReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    onMusicStart?.();
    setRevealed(true);
    onScratchComplete();
    celebrate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || revealed) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    const pixelRatio = window.devicePixelRatio || 1;
    const { width, height } = wrapper.getBoundingClientRect();

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(pixelRatio, pixelRatio);

    // The foil layer is drawn on canvas so guests can scratch it with mouse or touch.
    const foil = context.createLinearGradient(0, 0, width, height);
    foil.addColorStop(0, "#8A6A24");
    foil.addColorStop(0.22, "#E8D8B3");
    foil.addColorStop(0.45, "#C9A14A");
    foil.addColorStop(0.72, "#6E501C");
    foil.addColorStop(1, "#F8F2E7");
    context.fillStyle = foil;
    context.fillRect(0, 0, width, height);

    context.globalAlpha = 0.28;
    context.strokeStyle = "#FFF7DA";
    context.lineWidth = 1;
    for (let x = -height; x < width; x += 18) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }
    context.globalAlpha = 1;

    context.fillStyle = "#261B12";
    context.font = `${isMobile ? 700 : 700} ${isMobile ? 14 : 18}px Cinzel, serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(opening.scratchTitle, width / 2, height / 2);
  }, [isMobile, opening.scratchTitle, revealed]);

  useEffect(() => {
    if (!revealed) return undefined;
    const timer = window.setTimeout(onEnter, isMobile ? 3200 : 2200);
    return () => window.clearTimeout(timer);
  }, [isMobile, onEnter, revealed]);

  const getPointerPosition = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event;

    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    };
  };

  const getScratchPercent = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return 0;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent += 1;
    }

    return transparent / (pixels.length / 4);
  };

  const scratchAt = (event) => {
    if (revealedRef.current) return;
    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    const position = getPointerPosition(event);
    if (!context || !position) return;

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(position.x, position.y, isMobile ? MOBILE_SCRATCH_BRUSH_RADIUS : DESKTOP_SCRATCH_BRUSH_RADIUS, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";

    const threshold = isMobile ? MOBILE_SCRATCH_REVEAL_THRESHOLD : DESKTOP_SCRATCH_REVEAL_THRESHOLD;
    const scratchedLongEnough = Date.now() - scratchStartedAtRef.current >= MIN_SCRATCH_TIME_MS;
    if (scratchedLongEnough && getScratchPercent() >= threshold) {
      completeReveal();
    }
  };

  const handleStart = (event) => {
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    scratchStartedAtRef.current = Date.now();
    isScratchingRef.current = true;
    setIsScratching(true);
    scratchAt(event);
  };

  const handleMove = (event) => {
    if (!isScratchingRef.current && !isScratching) return;
    scratchAt(event);
  };

  const handleEnd = () => {
    const scratchedLongEnough = Date.now() - scratchStartedAtRef.current >= MIN_SCRATCH_TIME_MS;
    if (isScratchingRef.current && scratchedLongEnough && getScratchPercent() >= (isMobile ? MOBILE_SCRATCH_REVEAL_THRESHOLD : DESKTOP_SCRATCH_REVEAL_THRESHOLD)) {
      completeReveal();
    }
    isScratchingRef.current = false;
    setIsScratching(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return undefined;

    const startTouch = (event) => handleStart(event);
    const moveTouch = (event) => handleMove(event);
    const endTouch = () => handleEnd();
    const options = { passive: false };

    canvas.addEventListener("touchstart", startTouch, options);
    canvas.addEventListener("touchmove", moveTouch, options);
    canvas.addEventListener("touchend", endTouch, options);
    canvas.addEventListener("touchcancel", endTouch, options);

    return () => {
      canvas.removeEventListener("touchstart", startTouch);
      canvas.removeEventListener("touchmove", moveTouch);
      canvas.removeEventListener("touchend", endTouch);
      canvas.removeEventListener("touchcancel", endTouch);
    };
  }, [handleEnd, handleMove, handleStart, revealed]);

  return (
    <section
      className="opening-screen scratch-screen muslim-opening"
      id="reveal"
      style={{ "--opening-image": `url("${opening.scratchBackgroundImage}")` }}
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
        className="scratch-experience"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="scratch-intro">
          <Sparkles className="gold-icon" aria-hidden="true" />
          <h1>{opening.scratchHeading}</h1>
          <p>{opening.scratchInstruction}</p>
        </div>

        <div className="scratch-card" ref={wrapperRef}>
          <div className="scratch-pattern-border" aria-hidden="true" />
          <div className="scratch-content">
            <CalendarDays className="gold-icon" aria-hidden="true" />
            <div className="revealed-date-card">
              <p className="eyebrow">Nikah</p>
              <h2>{formatDisplayDate(nikah.date)}</h2>
              <span>{nikah.title}</span>
            </div>
            <div className="date-divider" />
            <div className="revealed-date-card">
              <p className="eyebrow">Reception</p>
              <h2>{formatDisplayDate(reception.date)}</h2>
              <span>{reception.title}</span>
            </div>
          </div>

          {!revealed && (
            <canvas
              ref={canvasRef}
              className="scratch-canvas"
              onPointerDown={handleStart}
              onPointerMove={handleMove}
              onPointerUp={handleEnd}
              onPointerCancel={handleEnd}
              onPointerLeave={handleEnd}
              aria-label={opening.scratchTitle}
            />
          )}
        </div>

        <motion.div className="scratch-actions" initial={false} animate={{ opacity: revealed ? 1 : 0.72 }}>
          <p className="muted">{revealed ? "Opening your invitation..." : opening.scratchInstruction}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
