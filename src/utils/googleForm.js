const PLACEHOLDER_ACTION_URL = "PASTE_GOOGLE_FORM_ACTION_URL_HERE";
const PLACEHOLDER_ENTRY_ID = "entry.0000000000";

function hasValidGoogleFormConfig(rsvpConfig) {
  const entries = rsvpConfig?.googleFormEntries;
  const requiredKeys = ["name", "phone", "guests", "attendance", "event", "message"];

  return Boolean(
    rsvpConfig?.googleFormActionUrl &&
      rsvpConfig.googleFormActionUrl !== PLACEHOLDER_ACTION_URL &&
      entries &&
      requiredKeys.every((key) => entries[key] && entries[key] !== PLACEHOLDER_ENTRY_ID)
  );
}

export function buildGoogleFormData(formValues, rsvpConfig) {
  if (!hasValidGoogleFormConfig(rsvpConfig)) {
    throw new Error(
      "Google Forms RSVP is not configured. Add googleFormActionUrl and real googleFormEntries in src/config/invitation.js."
    );
  }

  const normalizedValues = {
    ...formValues,
    attendance:
      formValues.attendance === "Yes"
        ? "Yes, I will be there"
        : formValues.attendance === "No"
          ? "Sorry, I cannot attend"
          : formValues.attendance,
    event: formValues.event === "Both" ? "Both Nikah & Reception" : formValues.event,
    guests: Number(formValues.guests) >= 5 ? "5+" : String(formValues.guests ?? "")
  };

  const formData = new FormData();
  Object.entries(rsvpConfig.googleFormEntries).forEach(([fieldName, entryId]) => {
    formData.append(entryId, normalizedValues[fieldName] ?? "");
  });

  return formData;
}

export async function submitToGoogleForm(formValues, rsvpConfig) {
  const formData = buildGoogleFormData(formValues, rsvpConfig);

  await fetch(rsvpConfig.googleFormActionUrl, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });

  // Google Forms no-cors responses are opaque, so reaching this point is treated as success.
  return { ok: true };
}
