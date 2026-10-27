// Rebrands Lixil-Grohe_Brochure.pdf from Xuriti to SCFPe.
//  1. Text: "Xuriti" → "SCFPe" in the original Trade Gothic fonts, and the
//     Xuriti email/website → SCFPe's published email/website.
//  2. The vector XURITI wordmark in the "Initiative Partner" box is removed and
//     the SCFPe logo drawn in its place as vector paths.
//  3. The XURITI header in the phone screenshot (image Im0, raw CMYK) is painted
//     over and replaced with the SCFPe logo.
//  4. All uncompressed streams are Flate-compressed (lossless).
// Usage: node rebrand-brochure.mjs <in.pdf> <out.pdf>
import { readFileSync, writeFileSync } from 'node:fs'
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib'
import {
  readContent,
  writeContent,
  pageFonts,
  literalStrings,
  encodeLiteral,
  compressUnfilteredStreams,
  removeUnreachableObjects,
  streamBytes,
} from './lib/content.mjs'
import { drawLogoOnPdfPage, rasterLogo } from './lib/logo.mjs'
import { rgbToCmyk, cmykToRgb } from './lib/cmyk.mjs'

const [input, output] = process.argv.slice(2)
const doc = await PDFDocument.load(readFileSync(input), { updateMetadata: false })
const pages = doc.getPages()

// Order matters: contact details first, then the bare name.
const TEXT_REPLACEMENTS = [
  ['hi@xuriti.com', 'customer@scfpe.tech'],
  ['.xuriti.com', '.scfpe.tech'],
  ['Xuriti', 'SCFPe'],
]

// ---- 1. Text --------------------------------------------------------------

// Characters each font object can already draw (glyphs present in its subset).
const usedChars = new Map()
const contents = pages.map((p) => readContent(doc, p))
pages.forEach((page, i) => {
  const fonts = pageFonts(page)
  for (const s of literalStrings(contents[i])) {
    const ref = fonts.get(`/${s.font}`)
    if (!usedChars.has(ref)) usedChars.set(ref, new Set())
    for (const ch of s.text) usedChars.get(ref).add(ch)
  }
})

let textEdits = 0
pages.forEach((page, i) => {
  const fonts = pageFonts(page)
  let content = contents[i]
  const edits = []
  for (const s of literalStrings(content)) {
    // Match on decoded text: a word can be split by an escaped line break, e.g. "Xu\<CR>riti".
    let text = s.text
    let changed = false
    for (const [from, to] of TEXT_REPLACEMENTS) {
      if (!text.includes(from)) continue
      const ref = fonts.get(`/${s.font}`)
      const missing = [...to].filter((ch) => !usedChars.get(ref)?.has(ch))
      if (missing.length) throw new Error(`Font ${s.font} (${ref}) lacks glyphs ${missing.join('')} for "${to}"`)
      textEdits += text.split(from).length - 1
      text = text.split(from).join(to)
      changed = true
    }
    if (changed) edits.push({ start: s.start, end: s.end, text: `(${encodeLiteral(text)})` })
  }
  for (const e of edits.reverse()) content = content.slice(0, e.start) + e.text + content.slice(e.end)
  contents[i] = content
})
console.log(`text: ${textEdits} replacements`)

// The SCFPe email is longer than the old one and would touch the contact box's
// right border, so that one line is condensed to 90% width.
{
  const line = '(customer@scfpe.tech)Tj'
  if (contents[0].split(line).length !== 2) throw new Error('Expected the contact email once on page 1')
  contents[0] = contents[0].replace(line, `90 Tz\n${line}\n100 Tz`)
}

// ---- 2. Vector wordmark on page 1 ----------------------------------------

{
  let content = contents[0]
  // Letter blocks of the wordmark sit inside this box; the box border, divider
  // and contact icons fall outside it.
  const box = { x0: 362, y0: 66, x1: 414, y1: 88 }
  const re = /q 1 0 0 1 (-?[\d.]+) (-?[\d.]+) cm\n([^q]*?)\nQ\n?/g
  const remove = []
  let m
  while ((m = re.exec(content))) {
    const tx = +m[1]
    const ty = +m[2]
    const pts = [...m[3].matchAll(/(-?[\d.]+) (-?[\d.]+) [mlc]\b/g)].map((n) => [+n[1] + tx, +n[2] + ty])
    if (!pts.length) continue
    const inside = pts.every(([x, y]) => x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1)
    if (inside) remove.push({ start: m.index, end: m.index + m[0].length })
  }
  if (remove.length !== 7) throw new Error(`Expected 7 wordmark blocks (6 letters + accent), found ${remove.length}`)
  for (const r of remove.reverse()) content = content.slice(0, r.start) + content.slice(r.end)
  contents[0] = content
  console.log(`wordmark: removed ${remove.length} path blocks`)
}

pages.forEach((page, i) => writeContent(doc, page, contents[i]))
// Inner area of the "Initiative Partner" box left of the divider (x 359.5–415).
const placed = drawLogoOnPdfPage(pages[0], { x: 363.5, y: 68.5, w: 47.5, h: 16.5 }, 'center')
console.log(`logo drawn at x=${placed.x.toFixed(1)} y=${placed.y.toFixed(1)} w=${placed.w.toFixed(1)} h=${placed.h.toFixed(1)}`)

// ---- 3. Phone screenshot header ------------------------------------------

{
  const xo = pages[0].node.Resources().lookup(PDFName.of('XObject'), PDFDict)
  const img = doc.context.lookup(xo.get(PDFName.of('Im0')))
  const W = Number(img.dict.get(PDFName.of('Width')).toString())
  if (img.dict.get(PDFName.of('Filter')) || String(img.dict.get(PDFName.of('ColorSpace'))) !== '/DeviceCMYK') {
    throw new Error('Im0 is no longer raw DeviceCMYK; the pixel edit needs updating')
  }
  const px = img.contents
  // XURITI header wordmark, in image pixels (measured from a preview).
  const R = { x0: 510, y0: 196, x1: 614, y1: 240 }
  const at = (x, y) => (y * W + x) * 4

  // Fill the region by interpolating each row between the pixels just outside it,
  // which keeps the subtle background texture continuous.
  for (let y = R.y0; y < R.y1; y++) {
    const L = at(R.x0 - 1, y)
    const Rr = at(R.x1, y)
    for (let x = R.x0; x < R.x1; x++) {
      const t = (x - R.x0 + 1) / (R.x1 - R.x0 + 1)
      const d = at(x, y)
      for (let c = 0; c < 4; c++) px[d + c] = Math.round(px[L + c] * (1 - t) + px[Rr + c] * t)
    }
  }

  // Background colour for the logo's white cut-out, sampled from the left edge.
  const s = at(R.x0 - 1, Math.round((R.y0 + R.y1) / 2))
  const [br, bg, bb] = cmykToRgb(px[s], px[s + 1], px[s + 2], px[s + 3])
  const cut = `rgb(${br}, ${bg}, ${bb})`

  // Same height as the old wordmark's letters (about 32 px), left-aligned.
  const L = { x: 516, y: 202, w: 110, h: 31 }
  const logo = rasterLogo(L.w, L.h, { wordmarkColor: '#FFFFFF', cutoutColor: cut })
  for (let y = 0; y < L.h; y++) {
    for (let x = 0; x < L.w; x++) {
      const o = (y * L.w + x) * 4
      const a = logo[o + 3] / 255
      if (!a) continue
      const target = at(L.x + x, L.y + y)
      const cmyk = rgbToCmyk(logo[o], logo[o + 1], logo[o + 2])
      for (let c = 0; c < 4; c++) px[target + c] = Math.round(px[target + c] * (1 - a) + cmyk[c] * a)
    }
  }
  console.log('phone image: header logo replaced')
}

// ---- 4. Hidden copies of the old artwork, and metadata --------------------

// Illustrator editing data (PieceInfo) and page thumbnails both hold the old
// Xuriti artwork; viewers don't need either.
for (const page of pages) {
  page.node.delete(PDFName.of('PieceInfo'))
  page.node.delete(PDFName.of('Thumb'))
}
const title = doc.getTitle()
if (title) doc.setTitle(title.split('Xuriti').join('SCFPe'))

// ---- 5. Compression, clean-up and save -----------------------------------

const { before, after } = compressUnfilteredStreams(doc)
console.log(`compressed raw streams ${(before / 1e6).toFixed(1)} MB → ${(after / 1e6).toFixed(1)} MB`)

// XMP metadata: rename the title and drop the embedded preview thumbnails.
// Left uncompressed so tools that read raw XMP still can.
{
  const ref = doc.catalog.get(PDFName.of('Metadata'))
  const xmpStream = doc.context.lookup(ref)
  let xmp = Buffer.from(streamBytes(xmpStream)).toString('utf8')
  xmp = xmp.replace(/<xmp:Thumbnails>[\s\S]*?<\/xmp:Thumbnails>\s*/g, '')
  xmp = xmp.split('Xuriti').join('SCFPe').split('xuriti').join('scfpe')
  const fresh = doc.context.stream(Buffer.from(xmp, 'utf8'), { Type: 'Metadata', Subtype: 'XML' })
  doc.context.assign(ref, fresh)
}

const removed = removeUnreachableObjects(doc)
console.log(`removed ${removed} unreferenced objects (editing data, thumbnails, replaced streams)`)
const bytes = await doc.save()
writeFileSync(output, bytes)
console.log(`wrote ${output} (${(bytes.length / 1e6).toFixed(2)} MB)`)
