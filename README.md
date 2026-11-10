# Marble AI

**Marble AI** is an interactive stone restoration field operations platform and AI diagnostic assistant designed for cross-team handoffs between Sales/Estimators, Field Craftsmen, and Project Managers.

Built as a responsive web app with full PWA and mobile packaging readiness (iOS and Android via Capacitor).

## Key Features

- **Role Switcher Bar**: Flip seamlessly between:
  - **Sales / Estimator**: Site intake, 10% HCl drop test, Tramex moisture %, and lippage assessment.
  - **Field Craftsman**: High-contrast "Glove UI" with large tap targets for wet/dusty hands, SOP diamond grit progression checklists, and before/after gloss photo verification.
  - **Project Manager**: Dispatch control, escalation queue approval, and client notifications.
- **AI Stone Troubleshooter**: Fast diagnostics on common stone floor defects:
  - Cloudy/hazy ring after honing (acid etch & efflorescence)
  - Orange grout picture-framing (iron oxidation)
  - Deep lippage & chipped edges (tile step differential)
  - Dark oil stains (organic lipid intrusion)
  - Provides root cause analysis, step-by-step diamond grit sequences, safety warnings, and 1-tap logging/escalations.
- **Shared Customer & Job Record**: Single source of truth containing stone profile diagnostics and a real-time chronological Activity & Handoff Timeline.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React icons
- **Language**: TypeScript
- **Mobile Support**: PWA Web App Manifest, Capacitor configuration (`com.marbleai.fieldops`)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# or for stable dev server on port 9002
npm run dev:stable
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

### Build

```bash
npm run build
```
