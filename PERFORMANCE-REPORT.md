# Portfolio Performance Optimization Report

**Date:** 2026-08-17
**Measured on:** `https://www.devandre.sbs/en` — Lighthouse 13.4.0, mobile, simulated throttling

---

## Real baseline (before this pass)

A real Lighthouse run — not an estimate — showed two categories below the 90 target:

| Category | Score | Status |
|---|---|---|
| **Performance** | **70** | ❌ below target |
| Accessibility | 95 | ✅ |
| **Best Practices** | **77** | ❌ below target |
| SEO | 100 | ✅ |

Key metric failures driving Performance down:

| Metric | Value | Score |
|---|---|---|
| First Contentful Paint | 3.3 s | 0.39 |
| Largest Contentful Paint | 5.0 s | 0.27 |
| Speed Index | 5.9 s | 0.48 |
| Total Blocking Time | 30 ms | 1.00 ✅ |
| Cumulative Layout Shift | ~0 | 1.00 ✅ |

TBT and CLS were already perfect — the problem was **how long the first paint takes**, not JS execution.

---

## Root causes and fixes

### 1. Render-blocking Google Fonts → migrated to `next/font/google`  *(main Performance fix)*

Lighthouse `render-blocking-insight` reported **~1,980 ms of render-blocking savings**, dominated by:
- `fonts.googleapis.com/css2?...` stylesheet — **774 ms**, render-blocking
- plus a third-party round trip to `fonts.gstatic.com` (108 KB of fonts)

The old `src/app/layout.tsx` loaded fonts with a plain `<link rel="stylesheet">` in `<head>` — a classic render-blocking pattern that stalls FCP/LCP.

**Fix:** replaced the manual links with `next/font/google` (`Inter` + `Playfair Display`). This self-hosts the fonts under `/_next/static/media/*.woff2`, inlines the critical `@font-face` CSS, and removes both the render-blocking request and the `fonts.gstatic.com` dependency. `display: swap` prevents FOIT.

Wired the generated CSS variables (`--font-inter`, `--font-playfair`) into `tailwind.config.ts` (`font-body`, `font-headline`) and the print rules in `globals.css`.

**Verified:** no `fonts.googleapis.com` request in served HTML; woff2 files self-hosted; page renders with self-hosted fonts.

### 2. `manifest.webmanifest` 404 → middleware matcher fix  *(main Best Practices fix)*

Lighthouse `errors-in-console` failed on:
```
Manifest fetch from https://www.devandre.sbs/en/manifest.webmanifest failed, code 404
```
The i18n middleware was rewriting `/manifest.webmanifest` → `/en/manifest.webmanifest` (307), which then 404'd because the metadata route only exists at the root.

**Fix:** excluded `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, and other metadata/static extensions from the middleware `matcher` in `src/middleware.ts`.

**Verified:** `<link rel="manifest" href="/manifest.webmanifest">` now resolves **200 with 0 redirects** (was 307→404). Console error gone.

### 3. Legacy JavaScript polyfills → modern `.browserslistrc`

`legacy-javascript-insight` flagged ~14 KiB of unnecessary transpilation (`Array.prototype.at/flat/flatMap`, `Object.fromEntries`, `String.trimStart/End`) shipped for browsers that already support them natively. Added a modern `.browserslistrc` so SWC stops emitting those polyfills.

---

## Files changed

| File | Change |
|---|---|
| `src/app/layout.tsx` | `next/font/google` self-hosting; removed render-blocking `<link>` tags |
| `tailwind.config.ts` | `font-body`/`font-headline` → `var(--font-inter)` / `var(--font-playfair)` |
| `src/app/globals.css` | print `font-family` → `var(--font-inter)` |
| `src/middleware.ts` | matcher excludes metadata routes (fixes manifest 404) |
| `.browserslistrc` | modern targets, drops legacy JS polyfills |

Build: `✓ Compiled successfully`, 0 warnings from app code.

---

## Expected impact

- **Performance 70 → ~88–92.** Removing ~1,980 ms of render-blocking font load directly attacks the two weakest metrics (FCP 25%+10% and LCP 25% of the score). Self-hosting also drops the two `fonts.gstatic.com` requests (86 KB) off the critical path.
- **Best Practices 77 → ~81 from the manifest fix alone** (see ceiling note below).

Re-run Lighthouse against the live site after Vercel redeploys to confirm.

---

## Best Practices ceiling — Cloudflare, not the app

The `deprecations` audit (weight 5 of ~26) fails on three warnings, **all** from
`https://www.devandre.sbs/cdn-cgi/challenge-platform/scripts/jsd/main.js`:
- Shared Storage API deprecated
- `StorageType.persistent` deprecated
- Protected Audience API deprecated

That script is injected by **Cloudflare Bot Fight Mode / JS challenge**, not by this repo — it cannot be fixed in code. To clear it and push Best Practices to ~96:

1. **Test on the Vercel URL directly** (e.g. `*.vercel.app`), which bypasses Cloudflare — the deprecations disappear, or
2. **Cloudflare dashboard →** Security → Bots → turn off *Bot Fight Mode* (or exclude the zone from the JS challenge).

With the manifest fix in code + Cloudflare script removed, Best Practices reaches **~96**.

---

## Optional follow-ups (already ≥90, not required)

- **Accessibility 95 → 100:** `color-contrast` (weight 7) fails on 4 low-contrast elements — the hero "View Projects"/"Contact Me" buttons and the CTA section text/button. Raising those foreground/background contrast ratios to ≥4.5:1 clears it, but it changes brand colors, so left as a design decision. `heading-order` (weight 3) also flags two out-of-sequence `<h4>`s.
- Add a real `og-image.jpg` and replace the Twitter handle / Google verification placeholders in `src/app/[lang]/layout.tsx`.
