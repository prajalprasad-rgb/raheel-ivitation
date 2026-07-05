import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import EnvelopeAnimation from "./EnvelopeAnimation";
import { submitToGoogleForm } from "../../utils/googleForm";
import { warnDeveloper } from "../../utils/logger";

const rsvpSchema = z.object({
  name: z.string().trim().min(1, "Full name is required."),
  phone: z.string().trim().min(1, "Phone number is required."),
  guests: z.coerce.number({ invalid_type_error: "Number of guests is required." }).min(1, "At least one guest is required."),
  attendance: z.string().min(1, "Please select whether you will attend."),
  event: z.string().min(1, "Please select an event."),
  message: z.string().optional()
});

function validateWithZod(values) {
  const parsed = rsvpSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  return {
    values: {},
    errors: parsed.error.issues.reduce((fieldErrors, issue) => {
      const name = issue.path[0];
      fieldErrors[name] = { type: "validation", message: issue.message };
      return fieldErrors;
    }, {})
  };
}

export default function RSVPForm({ rsvp, thankYouMessage }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: validateWithZod,
    defaultValues: {
      name: "",
      phone: "",
      guests: 1,
      attendance: "",
      event: "",
      message: ""
    }
  });

  const onSubmit = async (formValues) => {
    setSubmitError("");

    try {
      await submitToGoogleForm(formValues, rsvp);
    } catch (error) {
      if (error.message.includes("Google Forms RSVP is not configured")) {
        warnDeveloper("[Invitation RSVP] Google Forms submission is running in demo mode:", error.message);
        await new Promise((resolve) => window.setTimeout(resolve, 650));
      } else {
        setSubmitError("We could not submit your RSVP right now. Please try again.");
        return;
      }
    }

    setSubmitted(true);
  };

  return (
    <section className="section rsvp-section">
      <div className="rsvp-card">
        <EnvelopeAnimation sent={submitted} message={thankYouMessage} />

        <form className="rsvp-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="eyebrow">RSVP</p>
          <h2>Share Your Blessings</h2>

          <div className="rsvp-field">
            <label htmlFor="rsvp-name">Full Name</label>
            <input id="rsvp-name" {...register("name")} placeholder="Your full name" autoComplete="name" />
            {errors.name && <span className="rsvp-error">{errors.name.message}</span>}
          </div>

          <div className="rsvp-field">
            <label htmlFor="rsvp-phone">Phone Number</label>
            <input id="rsvp-phone" {...register("phone")} placeholder="Phone number" autoComplete="tel" />
            {errors.phone && <span className="rsvp-error">{errors.phone.message}</span>}
          </div>

          <div className="rsvp-field">
            <label htmlFor="rsvp-guests">Number of Guests</label>
            <input id="rsvp-guests" {...register("guests")} min="1" type="number" inputMode="numeric" />
            {errors.guests && <span className="rsvp-error">{errors.guests.message}</span>}
          </div>

          <fieldset className="rsvp-field rsvp-choice-group">
            <legend>Will Attend?</legend>
            <label>
              <input {...register("attendance")} type="radio" value="Yes" />
              <span>Yes</span>
            </label>
            <label>
              <input {...register("attendance")} type="radio" value="No" />
              <span>No</span>
            </label>
            {errors.attendance && <span className="rsvp-error">{errors.attendance.message}</span>}
          </fieldset>

          <div className="rsvp-field rsvp-event-field">
            <span className="rsvp-field-label">Which Event?</span>
            <div className="rsvp-event-options" role="radiogroup" aria-label="Which event will you attend?">
              <label>
                <input {...register("event")} type="radio" value="Nikah" />
                <span>Nikah</span>
              </label>
              <label>
                <input {...register("event")} type="radio" value="Reception" />
                <span>Reception</span>
              </label>
              <label>
                <input {...register("event")} type="radio" value="Both" />
                <span>Both</span>
              </label>
            </div>
            {errors.event && <span className="rsvp-error">{errors.event.message}</span>}
          </div>

          <div className="rsvp-field">
            <label htmlFor="rsvp-message">Blessing Message</label>
            <textarea id="rsvp-message" {...register("message")} placeholder="Your dua or message" rows="4" />
          </div>

          {submitError && <p className="rsvp-error">{submitError}</p>}

          <button className="rsvp-submit" type="submit" disabled={isSubmitting}>
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? "Sealing RSVP..." : "Seal & Send RSVP"}
          </button>
        </form>
      </div>
    </section>
  );
}
