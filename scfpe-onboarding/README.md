# LIXIL | GROHE Dealer Onboarding, powered by SCFPe

Phase 1 rebuild of the dealer onboarding Google Site
(`sites.google.com/xuriti.com/lixilgrohe`) as a standalone, SCFPe-branded
site. All seven original pages are migrated to local routes; the Google Site
is untouched.

**Before release, read [VERIFICATION.md](VERIFICATION.md) and
[MIGRATION_AUDIT.md](MIGRATION_AUDIT.md).** Both dealer app links and the
provider wording in the program text still need confirming.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc -b) + production build to dist/
npm run lint     # oxlint
npm run typecheck
npm test         # Vitest route and navigation tests
npm run preview  # serve dist/
```

The output in `dist/` is static and can be hosted anywhere. Every route gets its
own `index.html`, so deep links work without server rewrites. No backend, API
or environment variables are needed.

## Stack

React 19, TypeScript, Vite 8, wouter 3 (routing), Motion 14 (`motion/react`, loaded through
`LazyMotion` + `domAnimation`), lucide-react icons, and self-hosted Plus
Jakarta Sans (`@fontsource-variable`). Styling is plain CSS with design tokens;
there is no CSS framework.

## Routes

| Route | Page | Replaces |
| --- | --- | --- |
| `/` | Home | `/home` |
| `/program-workflow` | Program Workflow | `/program-workflow` |
| `/program-details` | Program Details | `/more-details` |
| `/documents` | Documents List | `/documents-list` |
| `/documents/examples` | Documents With Examples | `/documents-with-example` |
| `/payments` | Payment Workflow | `/payment-workflow` |
| `/communications` | Communications | `/communications` |

Old Google Sites slugs redirect to their new route. The map lives in
`src/config/routes.ts`.

## Structure

```
src/
  config/routes.ts   page migration map: routes, titles, original URLs, legacy aliases
  config/site.ts     links, documents, app URLs and navigation, with verification status
  content/           transcribed page content (program, documents, payments, communications)
  styles/tokens.css  colour, type, spacing, radius, shadow, motion and z-index tokens
  routing/           title, scroll and focus handling; links to home-page sections
  pages/             one component per route
  components/        header, footer, home sections, shared page parts (page/) and
                     page-specific parts (program/, documents/, payments/, communications/)
  test/              Vitest setup and route and navigation tests
```

Components keep their CSS in a file next to them.

## Brand

Colours come from the official SCFPe logo: navy `#182A75`, blues `#2364DB` /
`#003AA4`, greens `#00A16E` / `#00D592`. Mint `#00D592` is used for accents and
buttons on dark backgrounds only. Green text on light backgrounds uses
`--green-ink` (`#007A53`) for contrast.

SCFPe is the provider brand. LIXIL | GROHE stays the program name in the
header lockup, hero badge, metadata and footer.

## Accessibility and motion

- Skip link, landmarks, one `h1`, sequential headings.
- Visible focus rings; 44px+ touch targets for primary controls.
- Mobile menu: `aria-expanded`/`aria-controls`, focus moves into the menu,
  Escape closes it and returns focus, page scroll locks while open.
- External links open in a new tab with `rel="noopener noreferrer"` and a
  screen-reader "(opens in a new tab)" hint.
- `MotionConfig reducedMotion="user"` plus CSS `prefers-reduced-motion` rules
  turn off movement for people who ask for it.

## Phase 2 suggestions

1. Resolve the open items in MIGRATION_AUDIT.md: app
   links (B2), provider wording (B3), discount basis (B4), and the brochure's
   QR codes (see B5).
2. Commission SCFPe-branded illustrations for the document examples and
   program diagrams, which are text-only for now.
3. Add a dedicated LIXIL | GROHE support channel if one is agreed.
4. Pre-render pages so content is in the HTML before JavaScript runs.
