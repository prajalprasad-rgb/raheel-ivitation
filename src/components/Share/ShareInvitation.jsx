import { useMemo, useState } from "react";
import { Mail, MessageCircle, Network, Send, Share2, Link as LinkIcon } from "lucide-react";
import { warnDeveloper } from "../../utils/logger";

function getShareUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href.split("#")[0];
}

export default function ShareInvitation({ invitation }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl();
  const shareText = useMemo(
    () =>
      `You're invited to celebrate the wedding of ${invitation.couple.groomName} & ${invitation.couple.brideName}. View the invitation here: ${shareUrl}`,
    [invitation.couple.groomName, invitation.couple.brideName, shareUrl]
  );

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(invitation.share.title);

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedText}`
    },
    {
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
        `You're invited to celebrate the wedding of ${invitation.couple.groomName} & ${invitation.couple.brideName}.`
      )}`
    },
    {
      label: "Facebook",
      icon: Network,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`
    }
  ];

  const shareNative = async () => {
    if (!navigator.share) return false;

    try {
      await navigator.share({
        title: invitation.share.title,
        text: shareText,
        url: shareUrl
      });
      return true;
    } catch (error) {
      if (error.name !== "AbortError") {
        warnDeveloper("[Invitation Share] Native share failed:", error);
      }
      return false;
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      if (await shareNative()) return;
      warnDeveloper("[Invitation Share] Copy link failed:", error);
    }
  };

  return (
    <section className="section share-section" aria-labelledby="share-title">
      <div className="share-card">
        <div className="share-copy">
          <Share2 className="gold-icon" aria-hidden="true" />
          <p className="eyebrow">Share</p>
          <h2 id="share-title">{invitation.share.title}</h2>
          <p>{invitation.share.message}</p>
        </div>

        <div className="share-buttons">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                className="share-button"
                href={item.href}
                target={item.label === "Email" ? undefined : "_blank"}
                rel={item.label === "Email" ? undefined : "noreferrer"}
                aria-label={`Share invitation on ${item.label}`}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
          <button className="share-button" type="button" onClick={copyLink} aria-label={copied ? "Invitation link copied" : "Copy invitation link"}>
            <LinkIcon size={18} aria-hidden="true" />
            <span aria-live="polite">{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
