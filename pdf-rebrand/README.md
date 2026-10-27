# PDF rebranding (Xuriti → SCFPe)

Scripts that produce the SCFPe-branded PDFs served by the website from
`../scfpe-onboarding/public/files/`. Originals are in `../source-audit/pdfs/`
(downloaded from the Google Drive files the old Google Site linked).

```bash
npm install
node rebrand-brochure.mjs ../source-audit/pdfs/Lixil-Grohe_Brochure.pdf out/final/Lixil-Grohe_Brochure.pdf
node rebrand-documents-list.mjs ../source-audit/pdfs/Lixil_List_of_documents.pdf out/final/Lixil_List_of_documents.pdf
node verify.mjs ../source-audit/pdfs/Lixil-Grohe_Brochure.pdf out/final/Lixil-Grohe_Brochure.pdf
node verify.mjs ../source-audit/pdfs/Lixil_List_of_documents.pdf out/final/Lixil_List_of_documents.pdf
cp out/final/*.pdf ../scfpe-onboarding/public/files/
```

The edits are made in place, so fonts, layout and everything else stay as in
the originals:

- **Text** is changed inside the existing content streams using the PDFs' own
  embedded fonts. Each script stops with an error if a font subset lacks a
  glyph a replacement needs.
- **Logos** are removed (the image in the documents list, the vector wordmark
  in the brochure) and the official SCFPe logo (`assets/scfpe-logo.svg`, from
  scfpe.tech) is drawn in the same box as vector paths. The XURITI header
  inside the brochure's phone screenshot is repainted pixel by pixel.
- **Hidden copies** of the old artwork (Illustrator editing data, page and XMP
  thumbnails) are removed, and unreferenced objects are garbage-collected.

`verify.mjs` checks page count and sizes, that the extracted text equals the
original's apart from the intended replacements, and that "xuriti" appears
nowhere in text, decompressed streams or metadata.

Helpers: `inspect.mjs` (find text, images, render pages), `crop.mjs` (render a
region), `dump.mjs` (fonts and content streams), `peek-image.mjs` (preview the
brochure's phone image), `find-logo.mjs` (locate vector path blocks).
