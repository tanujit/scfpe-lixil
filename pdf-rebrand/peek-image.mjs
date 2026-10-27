// Saves an enlarged preview of a region of the brochure phone image (Im0, raw CMYK).
// Usage: node peek-image.mjs x0 y0 w h zoom out.png
import { readFileSync, writeFileSync } from 'node:fs'
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib'
import { createCanvas } from '@napi-rs/canvas'
import { regionToRgba } from './lib/cmyk.mjs'
const [x0, y0, w, h, zoom] = process.argv.slice(2, 7).map(Number)
const out = process.argv[7]
const doc = await PDFDocument.load(readFileSync('../source-audit/pdfs/Lixil-Grohe_Brochure.pdf'))
const xo = doc.getPages()[0].node.Resources().lookup(PDFName.of('XObject'), PDFDict)
const img = doc.context.lookup(xo.get(PDFName.of('Im0')))
const width = Number(img.dict.get(PDFName.of('Width')).toString())
const small = createCanvas(w, h)
const id = small.getContext('2d').createImageData(w, h)
id.data.set(regionToRgba(img.contents, width, x0, y0, w, h))
small.getContext('2d').putImageData(id, 0, 0)
const big = createCanvas(w * zoom, h * zoom)
const ctx = big.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.drawImage(small, 0, 0, w * zoom, h * zoom)
writeFileSync(out, big.toBuffer('image/png'))
console.log('wrote', out)
