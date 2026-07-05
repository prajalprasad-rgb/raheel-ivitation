const isSmallScreen = () => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches;

const createPetals = (count) => Array.from({ length: count }, (_, index) => ({
  id: index,
  left: `${8 + index * 9}%`,
  delay: `${(index % 5) * 1.4}s`,
  duration: `${13 + (index % 4) * 2}s`
}));

export default function Petals() {
  const petals = createPetals(isSmallScreen() ? 4 : 10);

  return (
    <div className="effect-layer petals" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          style={{
            "--petal-left": petal.left,
            "--petal-delay": petal.delay,
            "--petal-duration": petal.duration
          }}
        />
      ))}
    </div>
  );
}
