import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateSitemap } from './generate-sitemap.mjs'

test('generateSitemap lists the homepage and every writing post with an ISO lastmod date', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'sitemap-src-'))
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-out-'))
  writeFileSync(
    join(sourceDir, 'my-post.md'),
    '---\ntitle: "My Post"\ndate: "Jan 5, 2026"\n---\n\nBody.\n'
  )

  generateSitemap(sourceDir, outDir, 'https://nbaglivo.dev')

  const xml = readFileSync(join(outDir, 'sitemap.xml'), 'utf-8')
  assert.match(xml, /<loc>https:\/\/nbaglivo\.dev\/<\/loc>/)
  assert.match(xml, /<loc>https:\/\/nbaglivo\.dev\/writing\/my-post\.html<\/loc>/)
  assert.match(xml, /<lastmod>2026-01-05<\/lastmod>/)
})

test('generateSitemap includes one url entry per writing post', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'sitemap-src-'))
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-out-'))
  writeFileSync(join(sourceDir, 'post-a.md'), '---\ntitle: "A"\ndate: "Jan 1, 2026"\n---\n\nA.\n')
  writeFileSync(join(sourceDir, 'post-b.md'), '---\ntitle: "B"\ndate: "Jan 2, 2026"\n---\n\nB.\n')

  generateSitemap(sourceDir, outDir, 'https://nbaglivo.dev')

  const xml = readFileSync(join(outDir, 'sitemap.xml'), 'utf-8')
  assert.equal(xml.match(/<url>/g).length, 3)
})
