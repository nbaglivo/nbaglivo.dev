import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'

function toIsoDate(dateStr) {
  return new Date(`${dateStr} UTC`).toISOString().slice(0, 10)
}

function urlEntry(loc, lastmod) {
  return lastmod
    ? `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    : `  <url>\n    <loc>${loc}</loc>\n  </url>`
}

export function generateSitemap(sourceDir, outDir, siteUrl) {
  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md'))

  const urls = [urlEntry(`${siteUrl}/`)]

  for (const file of files) {
    const raw = readFileSync(join(sourceDir, file), 'utf-8')
    const { data } = matter(raw)
    const slug = basename(file, '.md')
    urls.push(urlEntry(`${siteUrl}/writing/${slug}.html`, toIsoDate(data.date)))
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`

  writeFileSync(join(outDir, 'sitemap.xml'), xml)
}
