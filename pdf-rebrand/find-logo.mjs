// Lists simple "q 1 0 0 1 x y cm ... Q" path blocks on brochure page 1 inside a box,
// with their page-space bounding boxes, to locate the vector XURITI wordmark.
import { readFileSync } from 'node:fs'
import { PDFDocument, PDFName, PDFArray } from 'pdf-lib'
import pako from 'pako'
const [file, x0, y0, x1, y1] = process.argv.slice(2).map((v, i) => (i ? Number(v) : v))
const doc = await PDFDocument.load(readFileSync(file))
const page = doc.getPages()[0]
const c = page.node.get(PDFName.of('Contents'))
const refs = c instanceof PDFArray ? c.asArray() : [c]
const text = refs.map((r) => Buffer.from(pako.inflate(doc.context.lookup(r).contents)).toString('latin1')).join('')
const re = /q 1 0 0 1 (-?[\d.]+) (-?[\d.]+) cm\n([^q]*?)\nQ/g
let m
while ((m = re.exec(text))) {
  const tx = +m[1], ty = +m[2]
  const nums = [...m[3].matchAll(/(-?[\d.]+) (-?[\d.]+) (?=[mlc] |-?[\d.]+ -?[\d.]+ [lc]|[\d.-]+ [\d.-]+ [\d.-]+ [\d.-]+ c)/g)].map((n) => [+n[1] + tx, +n[2] + ty])
  if (!nums.length) continue
  const xs = nums.map((p) => p[0]), ys = nums.map((p) => p[1])
  const bb = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
  if (bb[0] >= x0 && bb[2] <= x1 && bb[1] >= y0 && bb[3] <= y1) {
    const before = text.slice(Math.max(0, m.index - 40), m.index).replace(/\n/g, ' ⏎ ')
    console.log(`@${m.index} len=${m[0].length} bbox=${bb.map((v) => v.toFixed(1)).join(',')} | before: ${before}`)
  }
}
