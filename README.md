# DriveEase — LINE LIFF Car Rental App

A production-ready **LINE LIFF (LINE Front-end Framework)** car rental service application built with React 19, Tailwind CSS 4, and the official `@line/liff` SDK.

---

## Features

- **LINE LIFF Integration** — `liff.init()` and `liff.getProfile()` with graceful demo fallback
- **Mobile-First Design** — Optimized for LINE in-app browser (375px–480px)
- **Car Browsing** — Filter by category (Sedan, SUV, Compact, Van), search by name/brand
- **Car Detail & Booking** — Date picker, location selector, price calculator, booking confirmation
- **Booking Management** — View and cancel active bookings
- **LINE Profile Display** — Shows user avatar, display name, userId from `liff.getProfile()`
- **LIFF SDK Debug Panel** — Expandable panel showing `liff.isInClient()`, `liff.getVersion()`, `liff.getOS()`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| LIFF SDK | `@line/liff` v2.28.0 |
| Routing | Wouter |
| Fonts | Sora (headings) + Noto Sans (body) |
| Icons | Lucide React |
| Animations | Framer Motion + CSS keyframes |

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure your LIFF ID

Create a `.env.local` file in the project root:

```env
VITE_LIFF_ID=your-liff-id-here
```

> Get your LIFF ID from the [LINE Developers Console](https://developers.line.biz/console/) by creating a LINE Login channel and adding a LIFF app.

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## LIFF Integration Details

### Initialization (`liff.init`)

```typescript
await liff.init({
  liffId: process.env.VITE_LIFF_ID,
  withLoginOnExternalBrowser: true, // Auto-login in external browsers
});
```

### Profile Retrieval (`liff.getProfile`)

```typescript
const profile = await liff.getProfile();
// Returns: { userId, displayName, pictureUrl, statusMessage }
```

### Environment Detection

```typescript
liff.isInClient()  // true when opened in LINE app
liff.isLoggedIn()  // true when user is authenticated
liff.getOS()       // 'ios' | 'android' | 'web'
liff.getVersion()  // LIFF SDK version string
```

### Demo Mode

When `VITE_LIFF_ID` is not set, the app runs in **demo mode** with a mock profile. This allows UI development and testing without a real LINE channel.

---

## Project Structure

```
client/
  src/
    hooks/
      useLiff.ts          ← LIFF SDK hook (init + getProfile)
    contexts/
      LiffContext.tsx      ← App-wide LIFF state provider
      BookingContext.tsx   ← Booking state management
    pages/
      Home.tsx             ← Landing page with hero + car listings
      Cars.tsx             ← Full car browsing with search/filter
      CarDetail.tsx        ← Car detail + booking form
      Bookings.tsx         ← User booking history
      Profile.tsx          ← LINE profile + LIFF debug info
    components/
      BottomNav.tsx        ← Mobile bottom navigation
      CarCard.tsx          ← Car listing card
      LoadingScreen.tsx    ← LIFF initialization screen
    lib/
      carData.ts           ← Car data, types, utilities
```

---

## LINE Developers Console Setup

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Create a **LINE Login** channel
3. Navigate to the **LIFF** tab
4. Click **Add** to create a new LIFF app
5. Set the **Endpoint URL** to your deployed app URL
6. Enable the **profile** scope
7. Copy the **LIFF ID** and set it as `VITE_LIFF_ID`

---

## Design System

**"Coastal Breeze"** — Scandinavian minimalism meets Southeast Asian travel aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `oklch(0.42 0.09 200)` — Deep Teal | CTAs, active states, borders |
| Accent | `oklch(0.72 0.16 65)` — Warm Amber | Badges, ratings, highlights |
| Background | `oklch(0.98 0.005 90)` — Off-White | Page background |
| Heading Font | Sora | All headings and labels |
| Body Font | Noto Sans | Body text (Thai-compatible) |

---

## License

MIT © DriveEase
