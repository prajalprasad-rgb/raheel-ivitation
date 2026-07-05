import { warnDeveloper } from "./logger";

const PLACEHOLDER_FORM_URL = "PASTE_GOOGLE_FORM_ACTION_URL_HERE";
const PLACEHOLDER_ENTRY = "entry.0000000000";

export function validateInvitationConfig(invitation) {
  const warnings = [];

  if (!invitation?.couple?.photo) {
    warnings.push("Missing couple photo path.");
  }

  if (invitation?.music?.enabled && !invitation.music.file) {
    warnings.push("Music is enabled but no music file is configured.");
  }

  if (invitation?.rsvp?.enabled) {
    const entries = invitation.rsvp.googleFormEntries || {};
    const requiredEntries = ["name", "phone", "guests", "attendance", "event", "message"];

    if (!invitation.rsvp.googleFormActionUrl || invitation.rsvp.googleFormActionUrl === PLACEHOLDER_FORM_URL) {
      warnings.push("Google Form action URL is missing or still using the placeholder.");
    }

    requiredEntries.forEach((entryName) => {
      if (!entries[entryName] || entries[entryName] === PLACEHOLDER_ENTRY) {
        warnings.push(`Google Form entry ID missing for RSVP field: ${entryName}.`);
      }
    });
  }

  ["nikah", "reception"].forEach((eventKey) => {
    const event = invitation?.[eventKey];
    if (!event?.dateTimeISO || !event?.mapLink) {
      warnings.push(`Calendar/map configuration is incomplete for ${eventKey}.`);
    }
  });

  if (warnings.length > 0) {
    warnDeveloper("[Invitation Config] Production configuration warnings:", warnings);
  }

  return warnings;
}
