# Wedify Premium - Royal Palace Edition

A React + Vite luxury Muslim wedding digital invitation. The invitation is config-driven from `src/config/invitation.js`.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Edit Invitation Details

Update all names, families, dates, venues, RSVP settings, music, share copy, and feature toggles in:

```text
src/config/invitation.js
```

## Replace Couple Photo

Replace:

```text
public/couple.jpg
```

Optional optimized image:

```text
public/couple.webp
```

Recommended size: portrait ratio `4:5`, at least `1200px` wide.

## Replace Music

Replace:

```text
public/music.mp3
```

Then update `invitation.music.file` if you use another filename.

## Replace SEO Image

Replace:

```text
public/og-image.jpg
```

Recommended size: `1200x630`.

## Connect Google Form RSVP

In Google Forms:

1. Create fields matching the RSVP fields.
2. Get the form action URL from the form HTML.
3. Get each `entry.xxxxxxxxxx` ID.
4. Update the `rsvp` object in `src/config/invitation.js`.

The app submits silently with `no-cors`; guests are not redirected.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

## Public Assets

Placeholder assets are included for deployment safety:

```text
public/couple.jpg
public/music.mp3
public/favicon.ico
public/og-image.jpg
public/apple-touch-icon.png
public/site.webmanifest
```

Replace them with real wedding assets before launch.
