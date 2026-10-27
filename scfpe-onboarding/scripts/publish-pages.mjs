// Copies the GitHub Pages build (dist/, built with `npm run build:pages`) into
// the repository root, where GitHub Pages serves it from: index.html must sit
// at the root. Files from the previous publish are removed first, using the
// manifest written last time, so renamed assets and pages don't pile up.
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const dist = join(projectDir, 'dist')
const repoRoot = resolve(projectDir, '..')
const manifestPath = join(repoRoot, '.pages-manifest')

if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/index.html not found: run `npm run build:pages` first')

// Never touch the source folders or repo files, even if a manifest lists them.
const protectedNames = new Set(['scfpe-onboarding', 'pdf-rebrand', 'source-audit', '.git', '.github', '.gitignore', '.claude', 'README.md'])

if (existsSync(manifestPath)) {
  for (const name of readFileSync(manifestPath, 'utf8').split('\n').filter(Boolean)) {
    if (protectedNames.has(name)) continue
    rmSync(join(repoRoot, name), { recursive: true, force: true })
  }
}

const entries = readdirSync(dist)
const clash = entries.filter((n) => protectedNames.has(n))
if (clash.length) throw new Error(`Build output would overwrite ${clash.join(', ')}`)

for (const name of entries) cpSync(join(dist, name), join(repoRoot, name), { recursive: true })
// Serve files as-is (no Jekyll processing).
writeFileSync(join(repoRoot, '.nojekyll'), '')
writeFileSync(manifestPath, [...entries, '.nojekyll'].join('\n') + '\n')
console.log(`Published ${entries.length} entries to ${repoRoot}`)
