# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js App Router portfolio written in TypeScript. Routes and layouts live in `src/app/`; localized routes are under `src/app/[lang]/`. Reusable portfolio features belong in `src/components/portfolio/`, while generic ShadCN/Radix primitives live in `src/components/ui/`. Shared data, Markdown, slug, and locale helpers are in `src/lib/`, and custom React hooks are in `src/hooks/`. Update translated content consistently across `src/locales/en.json`, `fr.json`, and `de.json`. Static files, including project screenshots, belong in `public/`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the Turbopack development server at `http://localhost:9009`.
- `npm run typecheck` runs strict TypeScript checking without emitting files.
- `npm run lint` runs the configured Next.js lint command.
- `npm run build` creates a production build and catches routing or bundling failures.
- `npm run start` serves the previously built application.

Before submitting a change, run at least `npm run typecheck` and `npm run build`.

## Coding Style & Naming Conventions

Use TypeScript and functional React components with two-space indentation. Follow the existing style in nearby files for quote choice and JSX formatting. Name component files in kebab-case (`project-card.tsx`), React components in PascalCase, hooks with a `use-` prefix, and utilities with descriptive camelCase names. Prefer the `@/` alias for imports from `src/`. Keep route-specific logic in `src/app/`, reusable behavior in components or hooks, and content out of JSX when it belongs in locale JSON.

## Content model — projects & capabilities

The homepage ("Selected Engineering Work") is data-driven and **not capped**:
`ProjectList` renders **every** entry in `data.projects`, server-side (crawlable).
Adding/editing a project is a content change only — no component edits.

**To add a new project** (each system built becomes a card — a ktayl-solution IS
system, a Retrieva feature, or a standalone product): append one object to
`data.projects` in **all three** locales (`src/locales/en.json`, `fr.json`,
`de.json`), keeping the same array order across locales. Required card fields:
`title`, `oneLinePitch` (card tagline), `purpose`, `role` (its first clause is
shown as the eyebrow pill — keep it a short title), `impact` (the highlighted
band — lead with a metric), `features` (top 3 shown on the card), `stack`
(first 7 shown, then `+N`). Optional deep fields power the "View Case Study"
modal and are all guarded: `whyItMatters`, `differentiators`, `architecture`,
`scope`, `testPlan`, `interviewTalkingPoints`, `atsKeywords`, `liveEndpoints`,
`screenshots`, plus `link` / `repoUrl` (omit both for confidential work → the
footer shows only "View Case Study"). Ordering is display order; lead with the
strongest. The two layers both surface here: **ktayl-solution IS** systems (the
insurance business context) and **Retrieva** (the RNCP39583 certification
product) are separate cards, not merged.

Homepage capabilities live in the top-level `Capabilities` key (four blocks:
`{icon, title, description, tech[]}`); the exhaustive technology catalogue stays
on the dedicated `/skills` page (`data.skills`), which is intentionally separate.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. Treat type checking, linting, and a production build as the required baseline. Manually verify affected pages in all supported locales (`/en`, `/fr`, `/de`), responsive layouts, navigation, and PDF/print behavior when resume code changes. If adding tests, colocate them as `*.test.ts` or `*.test.tsx` and add the corresponding command to `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative, scoped subjects such as `perf: render page content server-side` and `content: align positioning`. Continue with `<scope>: <summary>` using scopes like `content`, `portfolio`, `perf`, `docs`, or `chore`. Pull requests should explain the user-visible change, list validation performed, link related issues, and include before/after screenshots for UI work. Call out locale updates, configuration changes, and known follow-up work explicitly.
