# UDID Saathi — Current Design System

## 1. Product identity

**Product name:** UDID Saathi / साथी  
**Purpose:** A welcoming, accessible guide for disability certificate and Unique Disability ID (UDID) services in India.

The experience is organised around citizen tasks rather than department terminology:

- Apply for a UDID card
- Track an application
- Correct a document
- Renew or replace a card
- Find a medical centre
- Get practical help and support

The visual identity should feel distinctly Indian without becoming decorative or ceremonial. It uses a warm, human photographic direction, deep blue public-service clarity, terracotta warmth, teal support cues, and restrained saffron accents.

The site is a prototype using synthetic data. The disclosure remains visible at the top of every page:

> Prototype using synthetic data. This is not an official government portal.

## 2. Design principles

1. **Start with the citizen’s task.** The first question on every route should be “What are you trying to do?”
2. **Explain before asking.** Forms are introduced with plain-language guidance and visible next steps.
3. **Make progress obvious.** Use breadcrumbs, journey ribbons, timelines, status labels, and next-action copy.
4. **Use warmth with restraint.** Photography and Indian colour cues create welcome; spacing and typography preserve trust.
5. **Accessibility is structural.** Keyboard access, focus states, readable contrast, live announcements, and mobile fallbacks are part of the design rather than optional enhancements.
6. **Protect privacy.** Personal information and application status appear only after a reference and date-of-birth lookup match.

## 3. Visual language

### Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#17202a` | Body text and headings |
| Muted | `#59636e` | Supporting copy and metadata |
| Page | `#fbfaf7` | Main background |
| Surface | `#ffffff` | Cards, forms, panels |
| Surface warm | `#fff7ea` | Warm guidance areas |
| Surface blue | `#eef6fa` | Informational/support areas |
| Primary | `#214a63` | Navigation, headings, primary actions |
| Primary hover | `#17384b` | Hover and pressed states |
| Link | `#005ea8` | Text links and underlined actions |
| Teal | `#4d8c86` | Positive progress and service highlights |
| Teal dark | `#2f6c67` | Accessible teal text and map controls |
| Warm | `#d9783f` | Terracotta accents, active navigation underline |
| Warm soft | `#f6dfcb` | Soft warm card surfaces |
| Saffron soft | `#f4d58d` | Hero eyebrow, highlights, focus-related accents |
| Success | `#176b4d` | Saved, accepted, and completed states |
| Warning | `#95651a` | Caution and action-needed states |
| Error | `#b42318` | Validation and correction states |

High-contrast mode overrides the palette with black, white, and stronger borders. Components must continue to communicate state through text and structure, not colour alone.

### Typography

- Primary family: `Noto Sans`, with `Noto Sans Devanagari` for Hindi, then system fallbacks.
- Body size: 17px desktop, 16px on small screens.
- Body line-height: approximately 1.58.
- Headings use tight line-height, slight negative tracking, and responsive `clamp()` sizing.
- Eyebrows are uppercase, bold, and letter-spaced. They identify context, not decoration.
- Lead copy is larger, muted, and limited to a readable measure of roughly 720px.
- Hindi appears beside brand and service language where useful; it must not be used as a substitute for meaningful interface translation.

### Shape, spacing, and depth

- Base spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, and 64px.
- Content width: `min(1160px, 100% - 40px)`; narrow reading/form width: approximately 780px.
- Cards use restrained 12–16px radii in the warm redesign.
- Borders are light and visible; shadows are soft and short, used to separate interactive cards from the page.
- Buttons retain a compact public-service shape, with a subtle lower shadow on primary actions.

## 4. Global page shell

### Disclosure bar

A pale saffron disclosure strip sits above the header. It is short, persistent, and clearly states that the experience uses synthetic data and is not an official portal.

### Utility row

The top utility row contains:

- Larger text toggle
- High contrast toggle
- Help link

Controls use native buttons, `aria-pressed`, visible focus, and persistent local preferences.

### Brand row

The brand row contains:

- State Emblem of India at a clearly visible size
- UDID Saathi / साथी wordmark
- “Accessible UDID services” context line
- Swavlamban / Unique Disability ID logo
- Contextual “Track application” or “My application” link

The government marks identify the service context but do not imply official government ownership; the disclosure remains authoritative.

### Primary navigation

The public navigation is a light surface bar with an amber active underline:

1. Home
2. Apply
3. Track
4. Renew or replace
5. Find help

Each item uses a large enough click target, a clear active state, and an accessible mobile menu. The Home link is directly to the left of Apply.

### Footer

The full footer appears on the public homepage and contains:

- UDID Saathi description and privacy/service information
- Citizen service links
- Accessibility and help links
- Compact legal/service information row

Journey routes use the compact footer to keep attention on the active task.

The homepage also contains a smooth, pausable affiliate strip for public organisations. Logos are local assets and external links open in a new tab with an explicit accessible label.

## 5. Shared components

### Breadcrumbs

Breadcrumbs appear near the top of every substantive page. They use visible text plus small hand-authored SVG icons for Home, Apply, Track, Renew, Replace, and Find help. Icons are decorative and remain `aria-hidden`; text is always present.

### Page introduction

The page intro contains an optional eyebrow, one clear H1, and a short lead paragraph. The H1 explains the task in citizen language, for example “Track an application” or “Find a medical centre”.

### Buttons and links

- Primary button: deep blue fill, white text, strong contrast, subtle depth.
- Secondary button: white surface with blue border.
- Text action: underlined link-style button for lower-emphasis actions.
- Destructive or correction actions use error colour in supporting copy, not an alarming full-page treatment.

### Alerts

Alerts have a coloured left edge, plain-language title, and supporting content. They use `role="status"` for informational/success states and `role="alert"` for errors.

### Journey ribbon

The journey ribbon is the signature progress component. It communicates:

- Current step/stage
- What happens next
- Saved state or responsible team
- Completed, current, and upcoming stages

On small screens it becomes a collapsible linear summary. State is represented by labels and markers as well as colour.

### Task cards

Task cards are large, linked cards with a short title, supporting sentence, icon, and directional arrow. They lift slightly on hover and use a visible border so they remain discoverable on touch devices.

## 6. Page-by-page design

### Homepage (`/`)

The homepage opens with a photographic hero:

- Full-width wheelchair-inclusive image
- Deep blue-green gradient from left to right for readable copy
- “Namaste · UDID Saathi / साथी” eyebrow
- Large white headline: “Disability services that start with you”
- Supporting sentence and caregiver route

The hero uses `background-size: cover`. On wide screens the focal point is positioned at approximately `center 22%` so the subject’s face remains visible; the mobile crop uses a separate position to preserve the subject and text.

Below the hero:

1. Three priority task cards: Apply, Track, Fix.
2. A “Help me choose” guidance strip.
3. Secondary cards for renewal, replacement, and certificates.
4. Notices and circulars panel.
5. A synthetic UDID certificate preview.
6. Interactive India service map.
7. Assisted/caregiver routes.
8. Public-organisation affiliate strip and full footer.

### Application start (`/apply`)

The page uses a narrow reading column, breadcrumbs, a plain-language intro, and two balanced information columns:

- What you will need
- What happens next

Actions are “Start application” and “Resume saved draft”. A saved-draft return state can show a success alert with a direct resume link.

### Application flow (`/apply/:step`)

The seven-step journey is:

1. About the applicant
2. Identity and address
3. Caregiver details
4. Disability information
5. Documents
6. Medical authority
7. Review and submit

Each step uses the journey ribbon, a context banner, one focused form, visible validation, and “Save and come back later”. The first step can show a document-preparation photo. The review step summarises each answer with a change link before submission.

### Tracking (`/track`)

Tracking begins with a privacy-safe lookup form. The user must supply:

- Application reference
- Applicant’s date of birth

No personal name or status is displayed until both values match. The page includes a safe sample lookup panel and can route verified users to status, correction, or certificate journeys.

### Dashboard and detail routes

The dashboard is organised around the current action:

- Current status panel
- Next action card
- Appointment card
- Document list
- Notifications
- Compact timeline

Detail routes for the timeline, correction, appointment, and certificate retain the breadcrumb chain Home → Dashboard → current page. Status panels use supporting images where they improve orientation, not as decoration.

### Renewal and replacement (`/renew`, `/replace`)

Both services use a guided three-stage journey:

1. Verify the existing card
2. Provide request details
3. Confirmation

The user enters a reference and date of birth, chooses a reason, confirms the current address, and receives a request reference. Existing history is explicitly preserved.

### Find help (`/find-help`)

The page combines a welcoming accessibility photograph with a filterable centre catalogue. The interactive map and list share the same data:

- Select a state or union territory
- Zoom into the selected region
- Reveal service-centre markers
- Select a marker or list item
- Show address, hours, accessibility notes, and contact context

The map has a list fallback for mobile and keyboard users. Centre data is visibly synthetic and must never be presented as live government availability.

### Help and FAQs (`/help`)

The page uses expandable practical answers covering eligibility, documents, assessment, validity, DigiLocker, delivery, delays, corrections, caregiver applications, and appointments. A real support form collects a topic, contact method, and problem description, then returns a case reference without asking for sensitive documents or OTPs.

## 7. Imagery and iconography

Photography should be human, inclusive, calm, and relevant to the service moment. It should explain the task rather than act as generic decoration.

Current local assets include:

- `udid-hero-woman-wheelchair.jpg` — homepage hero
- `service-application-documents.jpg` — application/document preparation
- `service-dashboard-consultation.jpg` — assessment/status context
- `service-centre-accessibility.jpg` — accessible centre approach
- `service-correction-path.jpg` — correction/service journey context
- State Emblem, Swavlamban, NIC, Digital India, NIEPVD, NIEPID, ALIMCO, and RCI assets

Images are local copies so the interface remains reliable on low-connectivity connections. Source and reuse notes are maintained in [`IMAGE_SOURCES.md`](./IMAGE_SOURCES.md). Do not replace the photographic direction with AI-generated imagery without a deliberate design decision and an updated source/licensing record.

The small service icons are inline, hand-authored SVGs from `src/components/ServiceIcon.tsx`. They are used sparingly in breadcrumbs, task cards, notices, map headings, and status contexts.

## 8. Motion and interaction

- Hero and cards use calm hover/focus transitions.
- Task cards lift by a few pixels and move their arrow slightly.
- The map zooms smoothly into a selected state and animates the selected result panel.
- Centre markers pulse gently to invite discovery.
- The affiliate logo strip scrolls continuously and includes a pause/play control.
- The journey ribbon collapses on small screens.
- `prefers-reduced-motion: reduce` disables transitions, animations, and smooth scrolling.

Motion must support orientation or feedback. It must never delay access to content or communicate information through movement alone.

## 9. Responsive behaviour

- Around 900px: multi-column maps and dashboard layouts collapse toward one column.
- Around 820px: application, dashboard, demo-toolbar, task, and authority grids become single-column layouts.
- Around 760px: journey ribbons switch to compact, collapsible progress.
- Around 720px: the homepage hero switches to a taller, bottom-aligned mobile composition and a dedicated image crop.
- Around 640px: photo cards stack vertically and status panels put their image above copy.
- Around 600px: utility links scroll, navigation becomes a mobile menu, forms and buttons become full width, and map view defaults to the accessible list.

Touch targets must remain comfortable, text must reflow without horizontal scrolling, and no essential information may depend on hover.

## 10. Accessibility and content rules

- Provide a skip link to the main content.
- Move focus to the main content after route changes without causing unwanted scroll.
- Use semantic headings, landmarks, fieldsets, labels, and descriptions.
- Keep keyboard support for state shapes, centre markers, accordions, and all actions.
- Use visible `:focus-visible` styling with a saffron focus ring and dark outline.
- Support larger text and high contrast preferences persistently.
- Use live regions for map changes, save confirmation, upload progress, and support outcomes.
- Do not expose synthetic applicant records before verification.
- Never request Aadhaar, passwords, OTPs, bank details, or medical records in demo support flows.
- Keep the top prototype disclosure; avoid repeated “demo” or “prototype” wording in the rest of the interface.

## 11. Implementation references

- Global shell: `src/components/Shell.tsx`
- Shared UI primitives: `src/components/UI.tsx`
- Service icons: `src/components/ServiceIcon.tsx`
- Journey progress: `src/components/JourneyRibbon.tsx`
- Interactive map: `src/components/IndiaServiceMap.tsx`
- Public routes: `src/pages/PublicPages.tsx`
- Application routes: `src/pages/ApplicationPage.tsx`
- Dashboard routes: `src/pages/DashboardPages.tsx`
- Visual tokens and responsive styling: `src/styles.css`
- Centre catalogue: `src/data/centres.ts`
- Image/source record: `IMAGE_SOURCES.md`

## 12. Design QA checklist

Before presenting a change:

- Check the homepage at narrow, standard, and wide desktop widths; confirm the hero subject’s face is not clipped.
- Test Home, Apply, Track, Renew or replace, and Find help navigation states.
- Confirm every substantive page has a Home breadcrumb.
- Test map selection by mouse, keyboard, state list, and mobile layout.
- Test save/resume, invalid routes, upload errors, support validation, and direct route refreshes.
- Run `npm run lint`, `npm test`, and `npm run build`.
- Confirm image sources and licensing notes are updated for every new asset.
