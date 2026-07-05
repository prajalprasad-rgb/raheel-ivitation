import { useEffect } from "react";

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function appendLink(rel, href, attributes = {}) {
  const selector = `link[rel="${rel}"][href="${href}"]`;
  if (document.head.querySelector(selector)) return;

  const element = document.createElement("link");
  element.setAttribute("rel", rel);
  element.setAttribute("href", href);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  document.head.appendChild(element);
}

export default function SEO({ invitation }) {
  useEffect(() => {
    const url = window.location.href.split("#")[0];
    const title = `${invitation.couple.groomName} & ${invitation.couple.brideName} Wedding Invitation`;
    const description = `${invitation.messages.welcome} ${invitation.nikah.title}: ${invitation.nikah.date} at ${invitation.nikah.venue}. ${invitation.reception.title}: ${invitation.reception.date} at ${invitation.reception.venue}.`;
    const image = new URL("/og-image.jpg", window.location.origin).href;

    document.title = title;
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    setMeta('meta[property="og:url"]', { property: "og:url", content: url });
    setMeta('meta[property="og:image"]', { property: "og:image", content: image });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
    setMeta('meta[name="theme-color"]', { name: "theme-color", content: invitation.theme.colors.black });
    setLink("canonical", url);
    appendLink("preconnect", "https://www.google.com");
    appendLink("preconnect", "https://maps.gstatic.com");
    appendLink("dns-prefetch", "https://www.google.com");
    appendLink("dns-prefetch", "https://maps.gstatic.com");

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${invitation.couple.groomName} & ${invitation.couple.brideName} Wedding`,
      description,
      image,
      startDate: invitation.nikah.dateTimeISO,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: invitation.nikah.venue,
        address: invitation.nikah.address
      }
    };

    let script = document.head.querySelector('script[data-invitation-jsonld="event"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.invitationJsonld = "event";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [invitation]);

  return null;
}
