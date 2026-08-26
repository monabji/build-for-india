# UDID service redesign

An accessible, stateful citizen-service prototype built for the **Build What Moves India** hackathon. It redesigns the public-facing Unique Disability ID (UDID) journey around real user tasks: applying, tracking, correcting a rejected document, attending an assessment, renewing, replacing, and downloading a clearly labelled synthetic certificate.

> Prototype using synthetic data. This is not an official government portal and is not connected to UDID, Aadhaar, medical authorities, notification providers, or government records.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Verify the build

```bash
npm run lint
npm test
npm run build
```

## Working journeys

- Task-first homepage and plain-language service recommender
- Seven-step new application with validation, review, local save and resume
- Self, caregiver and assisted-service modes
- Four coherent demo scenarios: draft, correction required, assessment scheduled and approved
- Event-backed dashboard, timeline and notifications
- Rejected document correction with version history and resubmission
- Appointment details and rescheduling
- Renewal and replacement confirmations
- Synthetic certificate preview and download
- Demo medical-authority locator, help, FAQ and support case
- Contextual simple-language and Hindi explanations using approved prototype content
- Persistent larger-text and high-contrast preferences

## Architecture

The app is a modular React and TypeScript prototype. Domain rules, seeded data, mock services, state, reusable components and route pages are separated. The mock service stores non-sensitive demo state in browser `localStorage`. Every application transition updates the current status, timeline and notification together.

The contextual assistant currently uses deterministic, approved content. A production version would call a governed server-side OpenAI integration with retrieval, sensitive-data filtering and output validation; no API key is required or exposed in this build.

## Important limitations

- No live government, identity, medical, appointment or dispatch integration
- No real document upload; only the selected filename is stored locally
- No real eligibility, disability percentage, approval or medical decision
- All names, IDs, dates, centres, documents and service events are synthetic
- Browser storage is for demonstration only and is not production persistence
