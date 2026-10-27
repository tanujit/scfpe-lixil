/// <reference types="vitest/config" />
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { legacyAliases, pageRoutes } from './src/config/routes.ts'

/**
 * Writes dist/<route>/index.html for every route (and legacy alias) so that
 * opening or refreshing a deep link works on any static host, with no
 * server-side rewrite rules. dist/404.html covers unknown paths on hosts that
 * serve it (GitHub Pages, Netlify, Cloudflare Pages).
 */
function routeHtml(): Plugin {
  let outDir = 'dist'
  return {
    name: 'route-html',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = join(outDir, 'index.html')
      const paths = [...pageRoutes.map((r) => r.path), ...legacyAliases.map((a) => a.from)]
      for (const path of paths) {
        if (path === '/') continue
        const target = join(outDir, path, 'index.html')
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(index, target)
      }
      copyFileSync(index, join(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeHtml()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
