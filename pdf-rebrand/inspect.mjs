// Inspects a PDF: page sizes, every text item mentioning "xuriti", every
// image drawn (with its on-page box), and renders each page to PNG.
// Usage: node inspect.mjs <file.pdf> <outDir> [scale]
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import { createCanvas } from '@napi-rs/canvas'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

const [file, outDir, scaleArg] = process.argv.slice(2)
const scale = Number(scaleArg ?? 1)
mkdirSync(outDir, { recursive: true })

const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise
const mul = (a, b) => [
  a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5],
]

for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p)
  const vp = page.getViewport({ scale: 1 })
  console.log(`\n=== ${basename(file)} page ${p}: ${vp.width.toFixed(1)} x ${vp.height.toFixed(1)} pt`)

  const text = await page.getTextContent()
  for (const it of text.items) {
    if (/xuriti/i.test(it.str)) {
      console.log(`TEXT "${it.str}" font=${it.fontName} x=${it.transform[4].toFixed(1)} y=${it.transform[5].toFixed(1)} size=${Math.hypot(it.transform[0], it.transform[1]).toFixed(1)} w=${it.width.toFixed(1)}`)
    }
  }

  const ops = await page.getOperatorList()
  let ctm = [1, 0, 0, 1, 0, 0]
  const stack = []
  ops.fnArray.forEach((fn, i) => {
    const args = ops.argsArray[i]
    if (fn === pdfjs.OPS.save) stack.push(ctm)
    else if (fn === pdfjs.OPS.restore) ctm = stack.pop() ?? ctm
    else if (fn === pdfjs.OPS.transform) ctm = mul(ctm, args)
    else if (fn === pdfjs.OPS.paintImageXObject || fn === pdfjs.OPS.paintInlineImageXObject) {
      const name = typeof args[0] === 'string' ? args[0] : 'inline'
      console.log(`IMAGE ${name} x=${ctm[4].toFixed(1)} y=${ctm[5].toFixed(1)} w=${ctm[0].toFixed(1)} h=${ctm[3].toFixed(1)} (px ${args[1]}x${args[2]})`)
    }
  })

  const view = page.getViewport({ scale })
  const canvas = createCanvas(Math.ceil(view.width), Math.ceil(view.height))
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: view, canvas }).promise
  const out = join(outDir, `${basename(file, '.pdf')}-p${p}.png`)
  writeFileSync(out, canvas.toBuffer('image/png'))
  console.log(`rendered ${out}`)
}
