# Open items before production

Checked on 2026-10-23. All destinations live in `src/config/site.ts`.
Items marked `needs-review` there show a yellow "Review before release" note in
`npm run dev` only; production builds never show it.

## Blocking

Also see MIGRATION_AUDIT.md section 6: provider wording in program text (B3) needs business confirmation. The payment account (B1) was confirmed on 2026-10-23.

| Item | Configured value | Finding |
| --- | --- | --- |
| Dealer Android App | `https://rb.gy/6dstl` | Redirects to `play.google.com/store/apps/details?id=com.xuriti.app`, which returned **"Not Found"**. The listing appears to be removed. |
| Dealer iOS App | `https://rb.gy/zu51h` | Redirects to `apps.apple.com/in/app/xuriti-buyer/id6446220214` (**"Xuriti Buyer"**), which showed an error page. |

Both links are kept exactly as published on the original Google Site, as the
brief requires. Replace them with the current SCFPe dealer-app listings once
those are confirmed. No new store URLs were invented.

## Should fix

| Item | Finding |
| --- | --- |
| Brochure QR codes and helpline | The rebranded brochure's "Scan the QR to download the app" codes still encode `rb.gy/vzov4` (iOS) and `rb.gy/7wbvp` (Android), from the original artwork; replace them with the SCFPe app links once confirmed. Its "SCFPe Helpline No. +91 7676030711" keeps the original number, which is the one scfpe.tech's phone link dials. |
| Support contact | Only SCFPe's general contact (`customer@scfpe.tech`, `scfpe.tech/contact-us`) is used, and it is labelled as general. scfpe.tech displays one phone number (7483492943) but dials another (7676030711), so no phone number is shown. |

## Verified

- Brochure: `/files/Lixil-Grohe_Brochure.pdf` (3.3 MB, 2 pages), SCFPe-rebranded copy of the Google Drive original
- Documents list: `/files/Lixil_List_of_documents.pdf` (97 KB, 3 pages), SCFPe-rebranded copy of the Google Drive original
- Both pass `node verify.mjs <original> <rebranded>` in `../pdf-rebrand/` (no "xuriti" in text, streams or metadata; all other text unchanged)
- SCFPe logo and favicon: copied from scfpe.tech (`/_next/static/media/logo-.b8b1e5ac.svg`, `/images/SCF-title-logo.svg`)
- SCFPe links: home, contact-us, privacy, terms-of-service, LinkedIn (all linked from scfpe.tech's own footer)
