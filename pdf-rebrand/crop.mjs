// Renders a region of a PDF page to PNG for close inspection.
// Usage: node crop.mjs <file.pdf> <page> <scale> <x0> <y0> <x1> <y1> <out.png>
// Coordinates are PDF points with the origin at the bottom-left.
import { readFileSync, writeFileSync } from 'node:fs'
import { createCanvas } from '@napi-rs/canvas'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

const [file, pageNo, scaleArg, x0, y0, x1, y1, out] = process.argv.slice(2)
const scale = Number(scaleArg)
const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise
const page = await doc.getPage(Number(pageNo))
const view = page.getViewport({ scale })
const full = createCanvas(Math.ceil(view.width), Math.ceil(view.height))
await page.render({ canvasContext: full.getContext('2d'), viewport: view, canvas: full }).promise

const H = page.getViewport({ scale: 1 }).height
const sx = Number(x0) * scale
const sy = (H - Number(y1)) * scale
const w = (Number(x1) - Number(x0)) * scale
const h = (Number(y1) - Number(y0)) * scale
const crop = createCanvas(Math.ceil(w), Math.ceil(h))
crop.getContext('2d').drawImage(full, sx, sy, w, h, 0, 0, w, h)
writeFileSync(out, crop.toBuffer('image/png'))
console.log(`wrote ${out} (${Math.ceil(w)}x${Math.ceil(h)})`)
