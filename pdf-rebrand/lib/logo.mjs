// The official SCFPe logo (assets/scfpe-logo.svg, from scfpe.tech), drawn either
// as vector paths into a PDF page or rasterised onto pixels.
import { readFileSync } from 'node:fs'
import { createCanvas, Path2D } from '@napi-rs/canvas'
import { rgb } from 'pdf-lib'

const svg = readFileSync(new URL('../assets/scfpe-logo.svg', import.meta.url), 'utf8')

/** Paths in drawing order. Indexes 0-4 are the mark, 5-10 the "SCFPe" wordmark and symbol. */
export const logoPaths = [...svg.matchAll(/<path([^>]*)\/>/g)].map((m, i) => ({
  d: m[1].match(/ d="([^"]+)"/)[1],
  fill: m[1].match(/fill="([^"]+)"/)[1],
  part: i <= 4 ? 'mark' : 'wordmark',
  cutout: m[1].includes('fill="white"'),
}))

const hexToRgb = (hex) => {
  const h = hex === 'white' ? 'FFFFFF' : hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}

/** Tight bounding box of the drawn logo in SVG units, measured from a raster. */
export const logoBounds = (() => {
  const k = 10
  const c = createCanvas(271 * k, 70 * k)
  const ctx = c.getContext('2d')
  ctx.scale(k, k)
  for (const p of logoPaths) {
    ctx.fillStyle = '#000'
    ctx.fill(new Path2D(p.d))
  }
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height)
  let x0 = width, y0 = height, x1 = 0, y1 = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 0) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  return { x: x0 / k, y: y0 / k, w: (x1 + 1 - x0) / k, h: (y1 + 1 - y0) / k }
})()

/**
 * Fits the logo inside a box (PDF points, origin bottom-left), keeping its aspect
 * ratio. `align` is 'left' | 'center' | 'right'. Returns the placed rectangle.
 */
export function fitLogo(box, align = 'center') {
  const s = Math.min(box.w / logoBounds.w, box.h / logoBounds.h)
  const w = logoBounds.w * s
  const h = logoBounds.h * s
  const x = align === 'left' ? box.x : align === 'right' ? box.x + box.w - w : box.x + (box.w - w) / 2
  const y = box.y + (box.h - h) / 2
  return { x, y, w, h, scale: s }
}

/** Draws the full-colour logo as vector paths onto a pdf-lib page. */
export function drawLogoOnPdfPage(page, box, align = 'center') {
  const fit = fitLogo(box, align)
  // drawSvgPath puts the SVG origin at (x, y) with SVG y running downwards.
  const originX = fit.x - logoBounds.x * fit.scale
  const originY = fit.y + fit.h + logoBounds.y * fit.scale
  for (const p of logoPaths) {
    const [r, g, b] = hexToRgb(p.fill)
    page.drawSvgPath(p.d, { x: originX, y: originY, scale: fit.scale, color: rgb(r / 255, g / 255, b / 255) })
  }
  return fit
}

/**
 * Rasterises the logo for a dark background: the wordmark in `wordmarkColor`,
 * the mark in brand colours, and the mark's white cut-out in `cutoutColor`.
 * Returns RGBA pixels of exactly width x height, logo fitted and left-aligned.
 */
export function rasterLogo(width, height, { wordmarkColor = '#FFFFFF', cutoutColor }) {
  const c = createCanvas(width, height)
  const ctx = c.getContext('2d')
  const s = Math.min(width / logoBounds.w, height / logoBounds.h)
  const drawnH = logoBounds.h * s
  ctx.translate(-logoBounds.x * s, (height - drawnH) / 2 - logoBounds.y * s)
  ctx.scale(s, s)
  for (const p of logoPaths) {
    ctx.fillStyle = p.cutout ? cutoutColor : p.part === 'wordmark' ? wordmarkColor : p.fill
    ctx.fill(new Path2D(p.d))
  }
  return ctx.getImageData(0, 0, width, height).data
}
