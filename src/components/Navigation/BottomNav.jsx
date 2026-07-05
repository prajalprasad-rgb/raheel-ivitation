import { useEffect, useState } from "react";
import { CalendarHeart, HeartHandshake, Home, Mail, MapPinned, UsersRound } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "couple", label: "Couple", icon: UsersRound },
  { id: "nikah", label: "Nikah", icon: CalendarHeart },
  { id: "reception", label: "Reception", icon: MapPinned },
  { id: "rsvp", label: "RSVP", icon: Mail },
  { id: "farewell", label: "Farewell", icon: HeartHandshake }
];

export default function BottomNav({ onActiveChange, dimmed = false }) {
  const [activeId, setActiveId] = useState("home");

  useEffect(() => {
    const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
          onActiveChange?.(visible.target.dataset.palaceVariant || visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.45, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onActiveChange]);

  const scrollToSection = (id) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <nav className={`bottom-nav${dimmed ? " dimmed" : ""}`} aria-label="Invitation journey">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeId === item.id;

        return (
          <button
            key={item.id}
            className={`bottom-nav-item${active ? " active" : ""}`}
            type="button"
            onClick={() => scrollToSection(item.id)}
            aria-label={`Go to ${item.label}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
