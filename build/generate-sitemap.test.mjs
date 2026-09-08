import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateSitemap } from './generate-sitemap.mjs'

test('generateSitemap lists the homepage and every writing post with an ISO lastmod date', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'sitemap-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-out-'))
  mkdirSync(join(rootDir, 'writing-md'))
  writeFileSync(
    join(rootDir, 'writing-md', 'my-post.md'),
    '---\ntitle: "My Post"\ndate: "Jan 5, 2026"\n---\n\nBody.\n'
  )

  generateSitemap(rootDir, outDir)

  const xml = readFileSync(join(outDir, 'sitemap.xml'), 'utf-8')
  assert.match(xml, /<loc>https:\/\/nbaglivo\.dev\/<\/loc>/)
  assert.match(xml, /<loc>https:\/\/nbaglivo\.dev\/writing\/my-post\.html<\/loc>/)
  assert.match(xml, /<lastmod>2026-01-05<\/lastmod>/)
})

test('generateSitemap includes one url entry per writing post', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'sitemap-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'sitemap-out-'))
  mkdirSync(join(rootDir, 'writing-md'))
  writeFileSync(join(rootDir, 'writing-md', 'post-a.md'), '---\ntitle: "A"\ndate: "Jan 1, 2026"\n---\n\nA.\n')
  writeFileSync(join(rootDir, 'writing-md', 'post-b.md'), '---\ntitle: "B"\ndate: "Jan 2, 2026"\n---\n\nB.\n')

  generateSitemap(rootDir, outDir)

  const xml = readFileSync(join(outDir, 'sitemap.xml'), 'utf-8')
  assert.equal(xml.match(/<url>/g).length, 3)
})
