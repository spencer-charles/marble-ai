# Marble AI

**Marble AI** is an interactive stone restoration field operations platform, estimator, and knowledge-capture application connecting **Sales / Estimators**, **Field Craftsmen**, **Project Managers**, and **Owner / GMs** on a shared customer job record.

## Key Features

- **4-Role Switcher (`Sales / Estimator`, `Field Craftsman`, `Project Manager`, `Owner / GM`)**:
  - **1. Sales / Estimator**: Site intake (10% HCl drop test, Tramex moisture %, lippage level) synced per job, plus the **Estimator & Bid Co-Pilot** (calculates crew hours, crew-days, grit progression stages, chemical quantities, risk buffers, price range, and a plain-text proposal draft).
  - **2. Field Craftsman**: Photo attachment (downscaled and stored locally in IndexedDB), symptom tags, and decision-tree clarifying questions that match against the Knowledge Base (`Draft` vs. `Owner-approved` badges, `Matched on:` reasons, unticked step-by-step checkboxes, safety warnings, and thumbs-down crew corrections).
  - **3. Project Manager**: Live escalation queue with **Approve**, **Reject**, and **Ask Crew a Question** actions that credit the escalation job's assigned PM and log to the shared timeline.
  - **4. Owner / GM Knowledge Hub**:
    - **Today's Prompt**: Daily knowledge-capture prompts (*Rookie vs. Master*, *Sight/Sound/Feel Cues*, *Pre-Mortem Scenarios*) with browser speech recognition dictation or typing, saved as draft entries.
    - **Review Queue**: Triage unverified draft entries, crew corrections, and unanswered team questions; edit tags/steps/warnings and mark entries **Owner-approved**.
    - **KB Library**: Browse and filter entries across all 8 sub-domains with gap indicators, edit placeholder estimator rates, and export/import the Knowledge Base as JSON.
- **Operations & Technical Q&A (`Ask` Tab)**:
  - Role-aware search across the Knowledge Base (`Field Tech` SOPs for Crew/Sales; both `Tech` and `Owner/PM` bidding & P&L playbooks for PM/Owner), with thumbs-down corrections and 1-tap routing of unanswered questions to the Owner queue.
- **Responsive Mobile & Desktop Layout**:
  - Full-bleed native mobile layout under `1024px` with fixed bottom navigation and minimum `44px` tap targets; optional split demo view on desktop (`>= 1024px`).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React icons
- **Language**: TypeScript
- **State & Storage**: React Context + Reducer (`src/lib/store.tsx`), versioned `localStorage` persistence, and IndexedDB photo storage (`src/lib/photoStore.ts`)
- **Simulated AI Layer**: `src/lib/ai/index.ts` (`diagnose()`, `estimate()`, `answer()`)

## Development

```bash
npm install
npm run dev:stable
```

Open [http://localhost:9002](http://localhost:9002).
