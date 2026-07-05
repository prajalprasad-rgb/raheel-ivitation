const sparkles = Array.from({ length: 14 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 19) % 84)}%`,
  top: `${12 + ((index * 23) % 72)}%`,
  delay: `${(index % 7) * 0.7}s`
}));

export default function Particles() {
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
