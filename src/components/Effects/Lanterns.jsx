const lanterns = [
  { id: "left-top", side: "left", top: "8rem", delay: "0s" },
  { id: "left-low", side: "left", top: "18rem", delay: "1.8s" },
  { id: "right-top", side: "right", top: "7rem", delay: "0.9s" },
  { id: "right-low", side: "right", top: "20rem", delay: "2.4s" }
];

export default function Lanterns() {
  const visibleLanterns = typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches ? lanterns.slice(0, 2) : lanterns;

  return (
    <div className="lantern-layer" aria-hidden="true">
      {visibleLanterns.map((lantern) => (
        <span
          key={lantern.id}
          className={`hanging-lantern ${lantern.side}`}
          style={{
            "--lantern-top": lantern.top,
            "--lantern-delay": lantern.delay
          }}
        />
      ))}
    </div>
  );
}
