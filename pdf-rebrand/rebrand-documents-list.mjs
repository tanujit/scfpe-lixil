// Rebrands "Lixil_List of documents.pdf" (a Google Docs export) from Xuriti to SCFPe.
//  1. Text: each word is its own Tj with 2-byte glyph IDs (Identity-H). "Xuriti"
//     is re-encoded as "SCFPe" in the same Arial subset, and the words after it
//     on the same line are moved right by the width difference.
//  2. The Xuriti logo image (387x130 px) is removed from every page and the
//     SCFPe logo drawn in the same box as vector paths.
// Usage: node rebrand-documents-list.mjs <in.pdf> <out.pdf>
import { readFileSync, writeFileSync } from 'node:fs'
import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef } from 'pdf-lib'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { readContent, writeContent, streamBytes } from './lib/content.mjs'
import { drawLogoOnPdfPage } from './lib/logo.mjs'

const [input, output] = process.argv.slice(2)
const source = readFileSync(input)
const doc = await PDFDocument.load(source, { updateMetadata: false })
const ctx = doc.context
const pages = doc.getPages()

const FROM = 'Xuriti'
const TO = 'SCFPe'
const LOGO_PX = { w: 387, h: 130 }

// ---- Font tables ----------------------------------------------------------

/** Glyph-code ↔ Unicode maps and glyph widths for a Type0 Identity-H font. */
function fontTables(ref) {
  const font = ctx.lookup(ref, PDFDict)
  const cmap = Buffer.from(streamBytes(ctx.lookup(font.get(PDFName.of('ToUnicode'))))).toString('latin1')
  const toUni = new Map()
  for (const [, block] of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const [, code, uni] of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      toUni.set(code.toUpperCase(), String.fromCharCode(parseInt(uni, 16)))
    }
  }
  for (const [, block] of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const [, lo, hi, dst] of block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      for (let c = parseInt(lo, 16), u = parseInt(dst, 16); c <= parseInt(hi, 16); c++, u++) {
        toUni.set(c.toString(16).toUpperCase().padStart(4, '0'), String.fromCharCode(u))
      }
    }
  }
  const fromUni = new Map([...toUni].map(([code, ch]) => [ch, code]))

  const cid = ctx.lookup(font.lookup(PDFName.of('DescendantFonts'), PDFArray).get(0), PDFDict)
  const dw = Number(cid.get(PDFName.of('DW'))?.toString() ?? 1000)
  const widths = new Map()
  const w = cid.lookup(PDFName.of('W'), PDFArray)?.asArray().map((o) => (o instanceof PDFRef ? ctx.lookup(o) : o)) ?? []
  for (let i = 0; i < w.length; ) {
    const first = Number(w[i].toString())
    if (w[i + 1] instanceof PDFArray) {
      w[i + 1].asArray().forEach((v, k) => widths.set(first + k, Number(v.toString())))
      i += 2
    } else {
      const last = Number(w[i + 1].toString())
      for (let c = first; c <= last; c++) widths.set(c, Number(w[i + 2].toString()))
      i += 3
    }
  }
  const width = (hex) => {
    let total = 0
    for (let i = 0; i < hex.length; i += 4) total += widths.get(parseInt(hex.slice(i, i + 4), 16)) ?? dw
    return total
  }
  return { toUni, fromUni, width }
}

// ---- Logo boxes from the original (pdf.js gives image placement on the page) ----

const boxes = []
{
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(source), verbosity: 0 }).promise
  const mul = (a, b) => [
    a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
  ]
  for (let p = 1; p <= pdf.numPages; p++) {
    const ops = await (await pdf.getPage(p)).getOperatorList()
    let ctm = [1, 0, 0, 1, 0, 0]
    const stack = []
    ops.fnArray.forEach((fn, i) => {
      const a = ops.argsArray[i]
      if (fn === pdfjs.OPS.save) stack.push(ctm)
      else if (fn === pdfjs.OPS.restore) ctm = stack.pop() ?? ctm
      else if (fn === pdfjs.OPS.transform) ctm = mul(ctm, a)
      else if (fn === pdfjs.OPS.paintImageXObject && a[1] === LOGO_PX.w && a[2] === LOGO_PX.h) {
        boxes[p - 1] = { x: ctm[4], y: ctm[5], w: ctm[0], h: ctm[3] }
      }
    })
    if (!boxes[p - 1]) throw new Error(`No Xuriti logo image found on page ${p}`)
  }
}

// ---- Edit each page --------------------------------------------------------

const removedImages = new Set()
let textEdits = 0

pages.forEach((page, pi) => {
  let content = readContent(doc, page)
  const res = page.node.Resources()
  const fonts = res.lookup(PDFName.of('Font'), PDFDict)
  const tables = new Map(fonts.entries().map(([n, r]) => [n.asString(), fontTables(r)]))

  // A word is "BT /F 16 Tf 1 0 0 -1 X Y Tm" followed by one "<Td> <hex> Tj" per
  // run. Most words are one run; letter-spaced (justified) words have one run
  // per glyph, each moved along by "dx 0 Td".
  const wordRe = /BT\n\/(F\d+) ([\d.]+) Tf\n1 0 0 -1 (-?[\d.]+) (-?[\d.]+) Tm\n((?:[^\n<]*<[0-9A-F]+> Tj\n)+)ET/g
  const words = [...content.matchAll(wordRe)].map((m) => {
    const runs = [...m[5].matchAll(/([^\n<]*)<([0-9A-F]+)> Tj\n/g)].map((r) => ({ td: r[1], hex: r[2] }))
    return {
      index: m.index,
      length: m[0].length,
      font: `/${m[1]}`,
      size: Number(m[2]),
      x: Number(m[3]),
      y: m[4],
      body: m[5],
      runs,
      hex: runs.map((r) => r.hex).join(''),
      // Words on the same line share the preceding "cm" (each line is its own q … Q block).
      line: content.lastIndexOf(' cm\n', m.index),
    }
  })
  const decode = (w) => {
    const t = tables.get(w.font)
    let s = ''
    for (let i = 0; i < w.hex.length; i += 4) s += t.toUni.get(w.hex.slice(i, i + 4)) ?? '�'
    return s
  }
  /** Drawn width of a word in text space: the per-run advances plus the last run's glyphs. */
  const drawnWidth = (w) => {
    const t = tables.get(w.font)
    const advances = w.runs.slice(1).reduce((sum, r) => sum + Number(r.td.trim().split(/\s+/)[0]), 0)
    return advances + (t.width(w.runs.at(-1).hex) / 1000) * w.size
  }

  for (const w of words) {
    const text = decode(w)
    if (!text.includes(FROM)) continue
    const t = tables.get(w.font)
    const replaced = text.split(FROM).join(TO)
    const missing = [...replaced].filter((ch) => !t.fromUni.has(ch))
    if (missing.length) throw new Error(`Font ${w.font} lacks glyphs ${missing.join('')}`)
    const newHex = [...replaced].map((ch) => t.fromUni.get(ch)).join('')
    const shift = (t.width(newHex) / 1000) * w.size - drawnWidth(w)
    // One run with natural spacing, keeping the word's first Td (the baseline offset).
    w.body = `${w.runs[0].td}<${newHex}> Tj\n`
    textEdits++
    for (const other of words) {
      if (other.line === w.line && other.x > w.x) other.x += shift
    }
  }

  // Rewrite words from the end so indexes stay valid.
  for (const w of [...words].reverse()) {
    const fresh = `BT\n${w.font} ${w.size} Tf\n1 0 0 -1 ${+w.x.toFixed(6)} ${w.y} Tm\n${w.body}ET`
    content = content.slice(0, w.index) + fresh + content.slice(w.index + w.length)
  }

  // Remove the logo image: drop its "Do" and the XObject itself.
  const xo = res.lookup(PDFName.of('XObject'), PDFDict)
  for (const [name, ref] of xo.entries()) {
    const img = ctx.lookup(ref)
    const w = Number(img.dict.get(PDFName.of('Width'))?.toString())
    const h = Number(img.dict.get(PDFName.of('Height'))?.toString())
    if (w !== LOGO_PX.w || h !== LOGO_PX.h) continue
    const op = `${name.asString()} Do`
    if (!content.includes(op)) throw new Error(`Page ${pi + 1}: ${op} not found`)
    content = content.split(op).join('')
    xo.delete(name)
    removedImages.add(String(ref))
    const smask = img.dict.get(PDFName.of('SMask'))
    if (smask instanceof PDFRef) removedImages.add(String(smask))
  }

  writeContent(doc, page, content)
  drawLogoOnPdfPage(page, boxes[pi], 'center')
})

for (const r of removedImages) {
  const [num, gen] = r.split(' ').map(Number)
  ctx.delete(PDFRef.of(num, gen))
}
console.log(`text: ${textEdits} replacements; logo images removed: ${removedImages.size} objects; SCFPe logo drawn on ${pages.length} pages`)

const bytes = await doc.save()
writeFileSync(output, bytes)
console.log(`wrote ${output} (${(bytes.length / 1024).toFixed(0)} KB)`)
