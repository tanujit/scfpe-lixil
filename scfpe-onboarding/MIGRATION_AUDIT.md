# Google Site migration audit

Audit of `sites.google.com/xuriti.com/lixilgrohe`, carried out 2026-10-23, and
how each page was migrated into this site. The original Google Site was not
changed.

The routes live in [`src/config/routes.ts`](src/config/routes.ts), which is the
single source for navigation, page titles, legacy redirects, the build's
per-route HTML files and the tests.

## 1. Pages found

The site navigation (including the "More" menu) links to exactly seven pages.
No other internal URLs appear in any page's links, menus or embeds.

| # | Original title | Original URL | Original content |
| --- | --- | --- | --- |
| 1 | Onboarding guide | `/home` | Text: "Complete Document + Validation = Successful Onboarding". Brochure embed (Drive `1l6DB3HtvB2kTDDXV2DoEEluMyroZWaUP`). Android and iOS app links. |
| 2 | Program Workflow | `/program-workflow` | Heading "Sample Calculations" plus 5 images: discount plan chart, Benefits for Partners, sample calculation table, "How does the program work?" diagram, "Dealer Onboarding Overview" diagram. |
| 3 | Documents List | `/documents-list` | Heading plus embedded PDF `Lixil_List of documents.pdf` (Drive `1fsWf7Udw9VTps_c6CZKFGiiQl7qrH-mi`, 3 pages) and a "Share list of documents" link to the same file. |
| 4 | Documents With Example | `/documents-with-example` | Heading "List of Mandatory Documents" plus 13 images ("3 steps to follow", then one example per document) and a "Contact Xuriti Support" WhatsApp link. |
| 5 | Payment Workflow | `/payment-workflow` | Heading "What is Virtual Account Number [ VAN ]" plus 1 image of bank account details. No explanatory text. |
| 6 | More Details | `/more-details` | Heading "More details on the Program & Stakeholders" plus 2 images: credit note table, program flyer. |
| 7 | Communications | `/communications` | 7 images: Important Communications header, channels, and five communication types with timing. |

All content except page headings was in images or PDFs. It was read from the
images and transcribed into typed data in `src/content/`.

## 2. Original page to new route

| Original | New route | Legacy alias (redirects) |
| --- | --- | --- |
| `/home` | `/` | `/home` |
| `/program-workflow` | `/program-workflow` | (same path) |
| `/more-details` | `/program-details` | `/more-details` |
| `/documents-list` | `/documents` | `/documents-list` |
| `/documents-with-example` | `/documents/examples` | `/documents-with-example` |
| `/payment-workflow` | `/payments` | `/payment-workflow` |
| `/communications` | `/communications` | (same path) |

Unknown paths show a "page not found" page that links to every page.

## 3. What changed on each page

- **Home (`/`)**: unchanged sections from Phase 1. The "Program guide" cards
  and the onboarding-steps button now link to local routes. The "Source:
  Original onboarding guide" link was removed.
- **Program Workflow**: discount plan as an animated bar chart; Benefits for
  Partners; sample calculation table (discount on gross value); the program
  diagram rebuilt as six numbered steps with labelled parties; the onboarding
  overview grouped by who does what.
- **Program Details**: flyer introduction and seven benefits; discount slabs;
  flyer sample table (discount on invoice value); credit note example table.
- **Documents List**: the full PDF checklist for Proprietorship, Partnership
  Firm / LLP and Private Limited Company, as keyboard-accessible tabs with the
  PDF's bracketed notes; view and download cards for the list PDF and the
  brochure.
- **Documents With Examples**: "3 steps to follow" and one card per example
  document describing what the example showed, including the five-step
  e-sign flow.
- **Payments**: VAN heading and payment account card (see B1, published); payment timing
  and discounts; who pays when (steps 5 and 6 of the program flow); payment
  messages; a note that the page doesn't take or process payments.
- **Communications**: four channels and a timeline of the five communication
  types with their timing and channels.

Every inner page has the same header (breadcrumb, eyebrow, title, intro),
section layout, tokens, focus styles and reduced-motion handling, and ends
with "Continue with" links to related pages.

## 4. Internal Google Sites URLs replaced

Removed from all navigation, cards and footer (previously in `site.ts`):

- `…/lixilgrohe/home` (footer "Original onboarding guide", program-guide source line)
- `…/lixilgrohe/program-workflow`
- `…/lixilgrohe/documents-list`
- `…/lixilgrohe/documents-with-example`
- `…/lixilgrohe/payment-workflow`
- `…/lixilgrohe/more-details`
- `…/lixilgrohe/communications`

The only remaining reference is `LEGACY_SITE` in `src/config/routes.ts`,
which records each page's original URL for the migration map. It is never
rendered as a link. A test checks that no page links to it.

## 5. External URLs kept, and why

| URL | Where | Why |
| --- | --- | --- |
| `rb.gy/6dstl`, `rb.gy/zu51h` | Dealer app cards | The published app links. Kept as the brief requires; see B2. |
| `scfpe.tech`, `/contact-us`, `/privacy`, `/terms-of-service`, `linkedin.com/company/scfpe`, `mailto:customer@scfpe.tech` | Support section, footer | Official SCFPe destinations, all linked from scfpe.tech's own footer. |

The two PDFs are no longer linked on Google Drive (`1l6DB3…`, `1fsWf7…`):
those originals still show Xuriti branding. The site serves SCFPe-rebranded
copies from `public/files/` instead (see B5).

Not migrated: "Contact Xuriti Support", `wa.me/919019668345` on Documents With
Example. It is the previous provider's WhatsApp support number, so linking it
from an SCFPe site would misdirect dealers. Support links now go to the SCFPe
support section instead.

## 6. Open items

### Resolved

- **B1. Payment account.** The Payment Workflow page shows an ICICI escrow
  account `ESCROWXURTI2IND99000` (name "India Sanitary Solutions", IFSC
  `ICIC0000104`). The number contains "XURTI", so it was held back pending
  confirmation. **The project owner confirmed on 2026-10-23 that it is the
  program's current collection account**, and it is now published on
  `/payments` (`VERIFIED = true` in `src/content/payments.ts`). Setting it
  back to `false` hides the details from dealers and compiles them out of
  production builds.
- **B5. PDFs rebranded.** On the project owner's instruction (2026-10-23),
  both PDFs were rebranded with the scripts in `../pdf-rebrand/` and are
  served from `public/files/`:
  - `Lixil-Grohe_Brochure.pdf` (3.3 MB, was 31.5 MB): 42 "Xuriti" →
    "SCFPe" replacements in the original Trade Gothic fonts; the vector
    XURITI wordmark in the "Initiative Partner" box and the XURITI header in
    the phone screenshot replaced with the SCFPe logo; `hi@xuriti.com` →
    `customer@scfpe.tech` and `www.xuriti.com` → `www.scfpe.tech` (SCFPe's
    published contacts, rather than the non-existent `hi@scfpe.com`);
    document title updated; Illustrator editing data and old thumbnails
    removed; images losslessly compressed.
  - `Lixil_List_of_documents.pdf` (97 KB): 6 replacements in the original
    Arial, following words moved to fit; the Xuriti logo image replaced with
    the vector SCFPe logo on all 3 pages.
  - `pdf-rebrand/verify.mjs` confirms for both: same pages and sizes, text
    identical to the original apart from the replacements, and no "xuriti"
    in any text, stream or metadata.
  - Still to confirm: the brochure keeps "+91 7676030711" (now "SCFPe
    Helpline No."), which matches the number scfpe.tech's phone link dials;
    and its "Scan the QR to download the app" codes still point to
    `rb.gy/vzov4` (iOS) and `rb.gy/7wbvp` (Android), which were not changed
    and could not be resolved. Replace them once SCFPe app links exist (B2).

### Blocking before release

- **B2. Dealer apps.** Both short links resolve to Xuriti store listings:
  Android `com.xuriti.app` returns "Not Found", and iOS "Xuriti Buyer"
  shows an error page. (Also in VERIFICATION.md.)
- **B3. Provider name in program text.** Where the source said Xuriti does
  something, the site now says SCFPe: "SCFPe will create [Udyam Aadhaar] for
  no cost", "SCFPe will initiate [eNACH]", "SCFPe Platform" in the program
  flow, "Program Education through telecalling and digital campaigns", and
  "in partnership with SCFPe" in the program introduction. This follows the
  brief's rebrand, but these are business commitments, so the business needs
  to confirm them. They all come from `brand.provider` in `site.ts`.

### Should fix

- **B4. Two discount calculations.** Program Workflow computes the discount
  on the gross value (2.5% of 1,18,000 = 2,950). The flyer on More Details
  computes it on the invoice value (2.5% of 1,00,000 = 2,500). The program
  diagram says "Discount calculated on Net Invoice value". Both tables are
  reproduced exactly, with a note on the page that they differ. Ask the
  business which is current and remove the other.
- **B6. Checklist wording kept as published.** "3 Security Cheques in the name
  of" ends without a name in the PDF. The Proprietorship photos are numbered
  9 to 11 in the PDF and are shown as a plain list here.

### Content not migrated

- **G1. "POD pushed\*".** The program diagram marks this step with an
  asterisk but gives no footnote, so the asterisk was dropped.
- **G2. Example images.** The 13 images on Documents With Example (sample PAN,
  Aadhaar, GST and Udyam certificates, bills, a bank statement, a cheque,
  photos of a person and a real shop, and SignDesk screenshots) were not
  copied. They contain third-party or sample personal data and Xuriti app
  screenshots. Each is described in text instead. Commission SCFPe-branded
  illustrations if visuals are needed.
- **G3. Diagram screenshots.** Phone mock-ups of Xuriti app messages on the
  Communications page and app screenshots in the onboarding overview were not
  copied. Their text content (titles, timing, channels) is migrated.

Nothing was inaccessible: every page, image and PDF opened. The images only
load with a Google session, so they were read in the browser rather than
downloaded.

## 7. Checks run

All run on 2026-10-23 in `scfpe-onboarding/`:

| Command | Result |
| --- | --- |
| `npm run typecheck` (`tsc -b`) | Passed |
| `npm run lint` (oxlint) | Passed, no warnings |
| `npm test` (Vitest, `src/test/routes.test.tsx`) | 27 tests passed |
| `npm run build` | Passed; writes `index.html` for every route and legacy alias, plus `404.html` |

The tests cover: each route renders its own `h1`; no page links to the
legacy site or to `#`; every legacy slug redirects; the not-found page; a
journey Home → Payments → Documents → Program Workflow → Home through header,
related card, dropdown and breadcrumb; home program cards point to local
routes; home-section links from inner pages, plus browser back; keyboard tab
switching on the documents checklist; the confirmed payment account published in
production builds with no review note in development; no visible "Xuriti" text on
any page in production.

Browser checks (in-app browser, dev and production preview):

- Click-through of every page-to-page path listed in the brief, by header,
  dropdown, related cards, buttons, breadcrumb and logo, with correct URL,
  heading and tab title at each step; back and forward.
- Direct load and refresh of each route; legacy `/more-details` lands on
  `/program-details` in the production build.
- No horizontal overflow on any route at 360, 390, 768 and 1024px. The one
  failure found (Program Details at 390px) was fixed.
- Mobile menu: grouped links, current page marked, closes on navigation.
- Production build: confirmed payment account published on /payments, no "Xuriti" text.

## 8. Deployment notes

- The build is static (`dist/`). Each route has its own `index.html`, so deep
  links and refreshes work on any static host without rewrite rules. Hosts
  that serve `404.html` (Netlify, Cloudflare Pages, GitHub Pages) also render
  the in-app not-found page for unknown paths.
- If the site is served from a sub-path rather than a domain root, set
  Vite's `base` and wouter's `base` to match.
- Content is rendered by JavaScript. A `<noscript>` fallback links to the
  brochure and SCFPe contact. Pre-rendering is a Phase 2 option.
