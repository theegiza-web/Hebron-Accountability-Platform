# Hebron Accountability Platform – Bakwena ba Mogopa

A community-maintained, public-interest archive presenting documented concerns, supporting material, and timelines relating to governance, finance, and accountability within the Bakwena ba Mogopa community (including matters affecting Hebron).

## Purpose
This platform:
- Centralises documents and references in one place
- Provides readable summaries and tags for navigation
- Presents a timeline to understand sequence and context
- Supports transparency and accountable governance

## Important Disclaimer
This platform is not a court of law and does not determine guilt or innocence. It presents documented concerns, recorded allegations, and unanswered questions for public understanding and independent scrutiny. Readers should verify information independently. Individuals and institutions referenced are invited to submit responses with supporting evidence.

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- react-router-dom
- framer-motion
- lucide-react

## Project Structure
- `src/pages/` – application pages (Home, About, Evidence, Timeline, Issues, Resources, Contact)
- `src/content/` – content data (evidence entries, timeline entries, page copy)
- `public/downloads/` – PDFs and downloadable source documents

## Adding Documents (Read-only by practice)
Place PDFs into:
- `public/downloads/`

Use stable, versioned filenames (recommended):
- `high-level-community-report-2021-v1.pdf`
- `dossier-final-2016-v1.pdf`

Avoid overwriting existing files. If a correction is required, upload a new version (e.g. `-v2`) and keep the original available.

Then set your evidence entry:
```ts
downloadUrl: "/downloads/high-level-community-report-2021-v1.pdf"
