// Page content-stream helpers for pdf-lib documents.
import { PDFArray, PDFName, PDFDict, PDFRawStream, PDFRef } from 'pdf-lib'
import pako from 'pako'

export function streamBytes(stream) {
  const filter = stream.dict.get(PDFName.of('Filter'))
  if (!filter) return stream.contents
  if (String(filter) === '/FlateDecode') return pako.inflate(stream.contents)
  throw new Error(`Unsupported content filter ${filter}`)
}

/** The page's content as one latin1 string (multiple streams are joined). */
export function readContent(doc, page) {
  const c = page.node.get(PDFName.of('Contents'))
  const refs = c instanceof PDFArray ? c.asArray() : [c]
  return refs.map((r) => Buffer.from(streamBytes(doc.context.lookup(r))).toString('latin1')).join('\n')
}

/** Replaces the page's content with one Flate-compressed stream and drops the old streams. */
export function writeContent(doc, page, text) {
  const c = page.node.get(PDFName.of('Contents'))
  const oldRefs = (c instanceof PDFArray ? c.asArray() : [c]).filter((r) => r instanceof PDFRef)
  const stream = doc.context.flateStream(Buffer.from(text, 'latin1'))
  page.node.set(PDFName.of('Contents'), doc.context.register(stream))
  oldRefs.forEach((r) => doc.context.delete(r))
}

/** Font resource name → indirect ref string, for one page. */
export function pageFonts(page) {
  const fonts = page.node.Resources()?.lookup(PDFName.of('Font'), PDFDict)
  return new Map(fonts ? fonts.entries().map(([n, r]) => [n.asString(), String(r)]) : [])
}

/** Decodes a PDF literal string body (between the parentheses) to bytes as latin1. */
export function decodeLiteral(body) {
  let out = ''
  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    if (ch !== '\\') {
      out += ch
      continue
    }
    const n = body[++i]
    if (/[0-7]/.test(n)) {
      let oct = n
      while (oct.length < 3 && /[0-7]/.test(body[i + 1])) oct += body[++i]
      out += String.fromCharCode(parseInt(oct, 8))
    } else if (n === 'n') out += '\n'
    else if (n === 'r') out += '\r'
    else if (n === 't') out += '\t'
    else if (n === 'b') out += '\b'
    else if (n === 'f') out += '\f'
    else if (n === '\r' || n === '\n') continue
    else out += n
  }
  return out
}

/**
 * Walks literal strings in a content stream, tracking the current font name
 * (last Tf). Yields { start, end, body, text, font } where start/end span the
 * whole "( ... )" token.
 */
export function* literalStrings(content) {
  let font = null
  const tf = /\/([^\s/]+)\s+[-\d.]+\s+Tf/g
  let i = 0
  while (i < content.length) {
    const open = content.indexOf('(', i)
    if (open < 0) return
    // Update font from any Tf operators between the last position and this string.
    tf.lastIndex = i
    let m
    while ((m = tf.exec(content)) && m.index < open) font = m[1]
    let depth = 1
    let j = open + 1
    for (; j < content.length && depth > 0; j++) {
      if (content[j] === '\\') j++
      else if (content[j] === '(') depth++
      else if (content[j] === ')') depth--
    }
    const body = content.slice(open + 1, j - 1)
    yield { start: open, end: j, body, text: decodeLiteral(body), font }
    i = j
  }
}

/** Flate-compresses every stream in the document that has no filter yet. */
export function compressUnfilteredStreams(doc) {
  let before = 0
  let after = 0
  for (const [, obj] of doc.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream) || obj.dict.get(PDFName.of('Filter'))) continue
    before += obj.contents.length
    const packed = pako.deflate(obj.contents, { level: 9 })
    obj.contents = packed
    obj.dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'))
    obj.dict.set(PDFName.of('Length'), doc.context.obj(packed.length))
    after += packed.length
  }
  return { before, after }
}

/** Encodes text (latin1 code units) as a PDF literal string body. */
export function encodeLiteral(text) {
  let out = ''
  for (const ch of text) {
    const c = ch.charCodeAt(0)
    if (ch === '\\' || ch === '(' || ch === ')') out += `\\${ch}`
    else if (c < 32 || c > 126) out += `\\${c.toString(8).padStart(3, '0')}`
    else out += ch
  }
  return out
}

/**
 * Deletes every indirect object not reachable from the trailer (catalog and
 * info), so removed artwork, thumbnails and editing data don't stay in the file.
 */
export function removeUnreachableObjects(doc) {
  const ctx = doc.context
  const seen = new Set()
  const visit = (obj) => {
    if (!obj) return
    if (obj instanceof PDFRef) {
      const key = String(obj)
      if (seen.has(key)) return
      seen.add(key)
      visit(ctx.lookup(obj))
      return
    }
    if (obj instanceof PDFDict) obj.entries().forEach(([, v]) => visit(v))
    else if (obj instanceof PDFArray) obj.asArray().forEach(visit)
    else if (obj instanceof PDFRawStream || obj?.dict instanceof PDFDict) visit(obj.dict)
  }
  visit(ctx.trailerInfo.Root)
  visit(ctx.trailerInfo.Info)
  let removed = 0
  for (const [ref] of ctx.enumerateIndirectObjects()) {
    if (!seen.has(String(ref))) {
      ctx.delete(ref)
      removed++
    }
  }
  return removed
}
