# Wedify Premium Client Edit Guide

This guide explains the simple edits needed for each wedding invitation.

## 1. Main File to Edit

For each client, edit only this file:

```text
src/config/invitation.js
```

This file controls:

- Bride and groom names
- Family names
- Couple photo path
- Nikah details
- Reception details
- RSVP Google Form connection
- Music file
- Colors
- Wedify branding
- Share message
- Feature on/off settings

## 2. Replace the Couple Photo

Replace this file:

```text
public/couple.jpg
```

Use the same filename if possible. Recommended photo:

- Portrait photo
- Clear faces
- 4:5 ratio
- At least 1200px wide

Then confirm this line in `src/config/invitation.js`:

```js
photo: "/couple.jpg"
```

## 3. Replace the Music

Replace this file:

```text
public/music.mp3
```

Use the same filename if possible.

Then confirm this section in `src/config/invitation.js`:

```js
music: {
  enabled: true,
  file: "/music.mp3",
  volume: 0.45
}
```

To turn music off:

```js
enabled: false
```

## 4. Set Nikah Details

Edit this section in `src/config/invitation.js`:

```js
nikah: {
  title: "Nikah Ceremony",
  date: "2026-12-24",
  time: "10:30 AM",
  dateTimeISO: "2026-12-24T10:30:00+05:30",
  venue: "Grand Masjid Hall",
  address: "Bengaluru, Karnataka",
  mapLink: "https://maps.google.com"
}
```

Important:

- `date` is shown to guests.
- `time` is shown to guests.
- `dateTimeISO` is used for countdown and calendar buttons.
- `mapLink` should be the real Google Maps link.

## 5. Set Reception Details

Edit this section:

```js
reception: {
  title: "Wedding Reception",
  date: "2026-12-25",
  time: "7:30 PM",
  dateTimeISO: "2026-12-25T19:30:00+05:30",
  venue: "Royal Convention Centre",
  address: "Bengaluru, Karnataka",
  mapLink: "https://maps.google.com"
}
```

Use 24-hour time inside `dateTimeISO`.

Example:

```text
7:30 PM = 19:30:00
```

## 6. Connect Google Form RSVP

Create a Google Form with these fields:

- Full Name
- Phone Number
- Number of Guests
- Will Attend?
- Which Event?
- Blessing Message

Then find the Google Form action URL and each `entry.xxxxxxxxxx` ID.

Update this section:

```js
rsvp: {
  enabled: true,
  googleFormActionUrl: "PASTE_GOOGLE_FORM_ACTION_URL_HERE",
  googleFormEntries: {
    name: "entry.0000000000",
    phone: "entry.0000000000",
    guests: "entry.0000000000",
    attendance: "entry.0000000000",
    event: "entry.0000000000",
    message: "entry.0000000000"
  }
}
```

If this is not connected yet, the invitation still works in demo mode.

## 7. Change Colors

Edit this section:

```js
theme: {
  colors: {
    black: "#090909",
    gold: "#D4AF37",
    ivory: "#F8F5EE",
    emerald: "#0E3B2E",
    white: "#FFFDF9"
  }
}
```

Recommended:

- Keep `black` dark.
- Keep `gold` as the main luxury color.
- Avoid very bright backgrounds.

## 8. Enable or Disable Wedify Branding

Edit:

```js
brand: {
  name: "Wedify",
  showBranding: true,
  tagline: "Luxury Digital Wedding Invitations"
}
```

To hide branding:

```js
showBranding: false
```

## 9. Deploy on Vercel

Steps:

1. Upload or push the project to GitHub.
2. Open Vercel.
3. Click “Add New Project”.
4. Select the GitHub repository.
5. Use these settings:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Click Deploy.

## 10. Final Client Handover Checklist

Before sending the invitation link:

- Bride name is correct.
- Groom name is correct.
- Family names are correct.
- Couple photo is replaced.
- Music is replaced or disabled.
- Nikah date, time, venue, address are correct.
- Reception date, time, venue, address are correct.
- Google Maps links open correctly.
- Calendar buttons work.
- RSVP form is connected or demo mode is acceptable.
- Share buttons work.
- Mobile view looks good.
- Audio play/pause works.
- Final Vercel link opens correctly.
- Client has approved spelling, names, dates, and timings.

## Quick Edit Summary

Most client changes happen here:

```text
src/config/invitation.js
```

Main assets to replace:

```text
public/couple.jpg
public/music.mp3
public/og-image.jpg
```

