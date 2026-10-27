// Helpers for raw (unfiltered) DeviceCMYK image data, 8 bits per component.

/** Naive CMYK → RGB, for previews and sampling only. */
export function cmykToRgb(c, m, y, k) {
  return [
    Math.round(255 * (1 - c / 255) * (1 - k / 255)),
    Math.round(255 * (1 - m / 255) * (1 - k / 255)),
    Math.round(255 * (1 - y / 255) * (1 - k / 255)),
  ]
}

/** Naive RGB → CMYK, used only for the new logo pixels painted into a CMYK image. */
export function rgbToCmyk(r, g, b) {
  const k = 1 - Math.max(r, g, b) / 255
  if (k >= 1) return [0, 0, 0, 255]
  const c = (1 - r / 255 - k) / (1 - k)
  const m = (1 - g / 255 - k) / (1 - k)
  const y = (1 - b / 255 - k) / (1 - k)
  return [c, m, y, k].map((v) => Math.round(v * 255))
}

/** Writes a region of a CMYK buffer into an RGBA ImageData-like array, for previews. */
export function regionToRgba(cmyk, width, x0, y0, w, h) {
  const out = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = ((y0 + y) * width + (x0 + x)) * 4
      const d = (y * w + x) * 4
      const [r, g, b] = cmykToRgb(cmyk[s], cmyk[s + 1], cmyk[s + 2], cmyk[s + 3])
      out[d] = r
      out[d + 1] = g
      out[d + 2] = b
      out[d + 3] = 255
    }
  }
  return out
}
