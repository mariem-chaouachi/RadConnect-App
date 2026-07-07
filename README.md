# RadConnect (Expo / React Native)

A runnable mobile prototype of RadConnect — secure radiology workflow & communication between
technicians and radiologists. All data is in-memory (no backend yet), so it resets on reload.

## Run it

```bash
npm install
npx expo start
```

Then:
- Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the **Expo Go** app on your phone.
- You can also press `w` to run it in a browser tab (Expo's web target), though the phone experience is the real target.

## Demo accounts (or just tap "Create an account")

| Role | Email | Password |
|---|---|---|
| Technician | amine.tech@radconnect.demo | demo1234 |
| Radiologist | sami.rad@radconnect.demo | demo1234 |

## What's included

- **English / French** — a language switcher (top bar once signed in, top-right of the sign-in/sign-up screens)
  swaps every label, button, and message in the UI. Translation strings live in `src/i18n/translations.js`.
- **Sign in / Sign up** — first-time registration collects first & last name, technician/medical ID,
  specialization, email, phone, and password. Accounts persist only for the current app session.
- **Responsive layout** — single-column, bottom-tab layout on phones; sidebar + side-by-side case
  detail panel on tablets/wide screens (breakpoint at 760px width, via `useWindowDimensions`).
- **Case queue dashboard** with a pinned emergency band, status filters.
- **New case creation** with modality, anonymized patient ID, priority, and structured clinical questions.
- **Case detail** — image panel (preview placeholders) + messaging thread with one-tap Yes/No on
  structured questions, assign-to-me / mark-completed actions gated by role.
- **Notifications** — role-specific, unread badges, tap-through to the case.
- **Audit trail** — collapsible, per-case, append-style log of created/viewed/messaged/decided/completed events.

## Structure

```
App.js                       — auth gate + top bar/sidebar/tab routing + shared state
src/theme.js                 — color tokens (blue as primary), priority/status/modality constants
src/i18n/translations.js     — English & French strings + translate() helper
src/components/Logo.js       — hospital-building logo (react-native-svg)
src/components/LanguageSwitch.js — EN/FR toggle used on auth screens and the top bar
src/components/UI.js         — Pill, Avatar, Field, ActionBtn, EmptyState
src/data/seed.js             — demo users, cases, messages, audit log seed data
src/screens/*.js             — SignIn, SignUp, Dashboard, NewCase, CaseDetail, Notifications
```

## Known limitations (prototype, by design)

- No real backend/auth — accounts and cases live only in memory for the session.
- Image "attachments" are placeholders, not real uploads.
- No DICOM/PACS integration yet.

## Suggested next step

Wire this UI to a real API (see the earlier RadConnect project spec for the suggested Node/Express +
PostgreSQL schema) and swap the in-memory state in `App.js` for network calls.
