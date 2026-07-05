import { MapPin, Navigation } from "lucide-react";

function buildEmbedUrl(mapEmbedUrl, mapLink, venue, address) {
  if (mapEmbedUrl) return mapEmbedUrl;

  const query = [venue, address].filter(Boolean).join(", ");
  if (!query && !mapLink) return "";

  if (mapLink?.startsWith("https://www.google.com/maps")) {
    const separator = mapLink.includes("?") ? "&" : "?";
    return `${mapLink}${separator}output=embed`;
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(query || mapLink)}&output=embed`;
}

export default function LocationCard({ venue, address, mapLink, mapEmbedUrl, eventTitle }) {
  const embedUrl = buildEmbedUrl(mapEmbedUrl, mapLink, venue, address);

  return (
    <section className="location-card" aria-label={`${eventTitle} location`}>
      <div className="location-card-copy">
        <span className="location-pin" aria-hidden="true">
          <MapPin size={28} />
        </span>
        <p className="eyebrow">Location</p>
        <h3>{venue}</h3>
        <p>{address}</p>
        <a className="primary-button location-map-button" href={mapLink} target="_blank" rel="noreferrer">
          <Navigation size={18} aria-hidden="true" />
          Open in Google Maps
        </a>
      </div>

      <div className="location-map-panel">
        {embedUrl ? (
          <iframe
            className="location-map-frame"
            src={embedUrl}
            title={`${eventTitle} map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="location-map-placeholder">
            <MapPin size={42} aria-hidden="true" />
            <strong>{venue}</strong>
            <span>Map preview will appear here when mapEmbedUrl is added.</span>
            <a className="secondary-button" href={mapLink} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
