const petals = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  left: `${8 + index * 9}%`,
  delay: `${(index % 5) * 1.4}s`,
  duration: `${13 + (index % 4) * 2}s`
}));

export default function Petals() {
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
