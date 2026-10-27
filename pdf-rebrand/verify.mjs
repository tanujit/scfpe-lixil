// Verifies a rebranded PDF against its original:
//  - no "xuriti" (any case) in extracted text, in any decompressed stream, or in metadata
//  - same page count and page sizes
//  - extracted text equals the original's text with only the expected replacements
// Usage: node verify.mjs <original.pdf> <rebranded.pdf>
import { readFileSync } from 'node:fs'
import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib'
import pako from 'pako'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

const [origPath, newPath] = process.argv.slice(2)
const REPLACEMENTS = [
  ['hi@xuriti.com', 'customer@scfpe.tech'],
  ['.xuriti.com', '.scfpe.tech'],
  ['Xuriti', 'SCFPe'],
]
let failures = 0
const check = (ok, label) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) failures++
}

async function pagesText(path) {
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(path)), verbosity: 0 }).promise
  const out = []
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const { width, height } = page.getViewport({ scale: 1 })
    const text = (await page.getTextContent()).items.map((i) => i.str).join('')
    out.push({ width, height, text: text.replace(/\s+/g, '') })
  }
  return out
}

const before = await pagesText(origPath)
const after = await pagesText(newPath)
check(before.length === after.length, `page count ${after.length}`)
after.forEach((p, i) => {
  check(Math.abs(p.width - before[i].width) < 0.01 && Math.abs(p.height - before[i].height) < 0.01, `page ${i + 1} size ${p.width.toFixed(1)}x${p.height.toFixed(1)}`)
  check(!/xuriti/i.test(p.text), `page ${i + 1} text has no "xuriti"`)
  let expected = before[i].text
  for (const [from, to] of REPLACEMENTS) expected = expected.split(from.replace(/\s+/g, '')).join(to)
  check(p.text === expected, `page ${i + 1} text identical apart from the replacements (${p.text.length} chars)`)
})

const doc = await PDFDocument.load(readFileSync(newPath), { updateMetadata: false })
let streams = 0
let hits = 0
for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
  if (!(obj instanceof PDFRawStream)) continue
  streams++
  const filter = String(obj.dict.get(PDFName.of('Filter')) ?? '')
  let bytes = obj.contents
  if (filter === '/FlateDecode') bytes = pako.inflate(bytes)
  else if (filter && filter !== '/DCTDecode') continue
  if (/xuriti/i.test(Buffer.from(bytes).toString('latin1'))) {
    hits++
    console.log(`  "xuriti" found in stream ${ref}`)
  }
}
check(hits === 0, `no "xuriti" in any of ${streams} decompressed streams (including XMP metadata)`)
const info = ['Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer'].map((k) => doc[`get${k}`]?.() ?? '').join(' ')
check(!/xuriti/i.test(info), `document info has no "xuriti" (${info.trim() || 'empty'})`)
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
