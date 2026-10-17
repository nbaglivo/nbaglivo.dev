import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'
import { renderWritingPages } from './render-writing-pages.mjs'
import { generateSitemap } from './generate-sitemap.mjs'
import { generateFeed } from './generate-feed.mjs'

export function buildSite({ rootDir, siteUrl, siteName, siteDescription, author }) {
  const outDir = join(rootDir, 'dist')
  const sourceDir = join(rootDir, 'writing-md')

  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  execSync(`npx @tailwindcss/cli -i style.css -o ${join(outDir, 'style.css')} --minify`, {
    cwd: rootDir,
    stdio: 'inherit',
  })
  copyStaticFiles(rootDir, outDir)
  if (existsSync(sourceDir)) {
    renderWritingPages(sourceDir, join(outDir, 'writing'), { siteName, author })
    generateFeed(sourceDir, outDir, { siteUrl, siteName, siteDescription, author })
  }
  generateSitemap(sourceDir, outDir, siteUrl)
}
