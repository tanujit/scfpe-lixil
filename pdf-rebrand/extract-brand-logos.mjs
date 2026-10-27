// Extracts the LIXIL and GROHE logos from the original program PDFs as PNGs
// for the website header.
//  - LIXIL: the logo image (1280x450 RGB + alpha mask) from Lixil_List of documents.pdf,
//    trimmed to its visible pixels.
//  - GROHE: the vector logo tile in the brochure (page 1, top right), rendered at
//    high resolution and cropped just inside its thin white outline.
// Usage: node extract-brand-logos.mjs <outDir>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { PDFDocument, PDFName, PDFDict } from 'pdf-lib'
import { createCanvas } from '@napi-rs/canvas'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { streamBytes } from './lib/content.mjs'

const outDir = process.argv[2] ?? 'out/logos'
mkdirSync(outDir, { recursive: true })

// ---- LIXIL --------------------------------------------------------------
{
  const doc = await PDFDocument.load(readFileSync('../source-audit/pdfs/Lixil_List_of_documents.pdf'))
  const xo = doc.getPages()[0].node.Resources().lookup(PDFName.of('XObject'), PDFDict)
  const img = doc.context.lookup(xo.get(PDFName.of('X7')))
  const W = Number(img.dict.get(PDFName.of('Width')).toString())
  const H = Number(img.dict.get(PDFName.of('Height')).toString())
  if (W !== 1280 || H !== 450 || String(img.dict.get(PDFName.of('ColorSpace'))) !== '/DeviceRGB') {
    throw new Error('Unexpected LIXIL image format')
  }
  const rgb = streamBytes(img)
  const alpha = streamBytes(doc.context.lookup(img.dict.get(PDFName.of('SMask'))))

  // Find the visible bounds, then copy that region out.
  let x0 = W, y0 = H, x1 = 0, y1 = 0
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (alpha[y * W + x] > 8) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x)
        y0 = Math.min(y0, y); y1 = Math.max(y1, y)
      }
    }
  }
  const w = x1 - x0 + 1
  const h = y1 - y0 + 1
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')
  const data = ctx.createImageData(w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (y0 + y) * W + (x0 + x)
      const d = (y * w + x) * 4
      data.data[d] = rgb[s * 3]
      data.data[d + 1] = rgb[s * 3 + 1]
      data.data[d + 2] = rgb[s * 3 + 2]
      data.data[d + 3] = alpha[s]
    }
  }
  ctx.putImageData(data, 0, 0)
  writeFileSync(join(outDir, 'lixil-logo.png'), canvas.toBuffer('image/png'))
  console.log(`lixil-logo.png ${w}x${h}`)
}

// ---- GROHE --------------------------------------------------------------
{
  // Tile drawn as "732.35 539.932 -44.584 34.31 re" with a 0.25pt white stroke.
  const tile = { x0: 687.766, y0: 539.932, x1: 732.35, y1: 574.242 }
  const inset = 0.2
  const scale = 16
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(readFileSync('../source-audit/pdfs/Lixil-Grohe_Brochure.pdf')), verbosity: 0 }).promise
  const page = await pdf.getPage(1)
  const view = page.getViewport({ scale })
  const full = createCanvas(Math.ceil(view.width), Math.ceil(view.height))
  await page.render({ canvasContext: full.getContext('2d'), viewport: view, canvas: full }).promise
  const H = page.getViewport({ scale: 1 }).height
  const sx = (tile.x0 + inset) * scale
  const sy = (H - tile.y1 + inset) * scale
  const w = Math.round((tile.x1 - tile.x0 - 2 * inset) * scale)
  const h = Math.round((tile.y1 - tile.y0 - 2 * inset) * scale)
  const crop = createCanvas(w, h)
  crop.getContext('2d').drawImage(full, sx, sy, w, h, 0, 0, w, h)
  writeFileSync(join(outDir, 'grohe-logo.png'), crop.toBuffer('image/png'))
  console.log(`grohe-logo.png ${w}x${h}`)
}
