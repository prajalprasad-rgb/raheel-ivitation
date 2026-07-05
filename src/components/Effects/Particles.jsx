const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

const createSparkles = (count) => Array.from({ length: count }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 19) % 84)}%`,
  top: `${12 + ((index * 23) % 72)}%`,
  delay: `${(index % 7) * 0.7}s`
}));

export default function Particles() {
  const sparkles = createSparkles(isSmallScreen() ? 5 : 14);

  return (
    <div className="effect-layer particles palace-particles" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          style={{
            "--sparkle-left": sparkle.left,
            "--sparkle-top": sparkle.top,
            "--sparkle-delay": sparkle.delay
          }}
        />
      ))}
    </div>
  );
}
