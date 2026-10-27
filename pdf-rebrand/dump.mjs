// Dumps fonts and the start of each page's content stream.
// Usage: node dump.mjs <file.pdf> [chars] [search]
import { readFileSync } from 'node:fs'
import { PDFDocument, PDFName, PDFDict, PDFRawStream, PDFArray, PDFRef } from 'pdf-lib'
import pako from 'pako'

const [file, charsArg, search] = process.argv.slice(2)
const doc = await PDFDocument.load(readFileSync(file), { updateMetadata: false })
const ctx = doc.context

const streamBytes = (s) => {
  const filter = s.dict.get(PDFName.of('Filter'))
  return filter && String(filter).includes('FlateDecode') ? pako.inflate(s.contents) : s.contents
}

doc.getPages().forEach((page, i) => {
  console.log(`\n=== page ${i + 1}`)
  const res = page.node.Resources()
  const fonts = res?.lookup(PDFName.of('Font'), PDFDict)
  fonts?.entries().forEach(([name, ref]) => {
    const f = ctx.lookup(ref, PDFDict)
    console.log(`FONT ${name} ${f.get(PDFName.of('Subtype'))} ${f.get(PDFName.of('BaseFont'))} enc=${f.get(PDFName.of('Encoding'))} toUnicode=${!!f.get(PDFName.of('ToUnicode'))}`)
  })
  const xo = res?.lookup(PDFName.of('XObject'), PDFDict)
  xo?.entries().forEach(([name, ref]) => {
    const x = ctx.lookup(ref)
    console.log(`XOBJ ${name} ${ref} ${x.dict.get(PDFName.of('Subtype'))} ${x.dict.get(PDFName.of('Width')) ?? ''}x${x.dict.get(PDFName.of('Height')) ?? ''} filter=${x.dict.get(PDFName.of('Filter'))}`)
  })
  const contents = page.node.get(PDFName.of('Contents'))
  const refs = contents instanceof PDFArray ? contents.asArray() : [contents]
  let text = ''
  for (const r of refs) text += Buffer.from(streamBytes(ctx.lookup(r instanceof PDFRef ? r : r))).toString('latin1')
  console.log(`content length ${text.length}`)
  const n = Number(charsArg ?? 600)
  if (search) {
    let idx = text.indexOf(search)
    let shown = 0
    while (idx >= 0 && shown < 3) {
      console.log('--- around', idx, '\n' + text.slice(Math.max(0, idx - n / 2), idx + n / 2))
      idx = text.indexOf(search, idx + 1)
      shown++
    }
  } else {
    const bt = text.indexOf('BT')
    console.log(text.slice(bt, bt + n))
  }
})
