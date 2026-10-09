import { execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'
import { renderWritingPages } from './render-writing-pages.mjs'
import { generateSitemap } from './generate-sitemap.mjs'

export function buildSite({ rootDir, siteUrl, siteName, author }) {
  const outDir = join(rootDir, 'dist')
  const sourceDir = join(rootDir, 'writing-md')

  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  execSync(`npx @tailwindcss/cli -i style.css -o ${join(outDir, 'style.css')} --minify`, {
    cwd: rootDir,
    stdio: 'inherit',
  })
  copyStaticFiles(rootDir, outDir)
  renderWritingPages(sourceDir, join(outDir, 'writing'), { siteName, author })
  generateSitemap(sourceDir, outDir, siteUrl)
}
