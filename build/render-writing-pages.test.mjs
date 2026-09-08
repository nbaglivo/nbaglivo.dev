import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { renderWritingPages } from './render-writing-pages.mjs'

test('renderWritingPages converts a frontmatter markdown file into an HTML page in outDir', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'my-post.md'),
    '---\ntitle: "My Post"\nsubtitle: "A subtitle"\ndate: "Jan 1, 2026"\n---\n\nHello **world**.\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'my-post.html'), 'utf-8')
  assert.match(html, /My Post/)
  assert.match(html, /A subtitle/)
  assert.match(html, /Jan 1, 2026/)
  assert.match(html, /<strong>world<\/strong>/)
})

test('renderWritingPages omits the subtitle paragraph for a post with no subtitle frontmatter', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'no-subtitle.md'),
    '---\ntitle: "No Subtitle"\ndate: "Jan 1, 2026"\n---\n\nBody text.\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'no-subtitle.html'), 'utf-8')
  assert.doesNotMatch(html, /text-\[#6f6a60\] mt-1/)
})

test('renderWritingPages uses the subtitle frontmatter as the meta description', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'my-post.md'),
    '---\ntitle: "My Post"\nsubtitle: "A subtitle"\ndate: "Jan 1, 2026"\n---\n\nHello.\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'my-post.html'), 'utf-8')
  assert.match(html, /<meta name="description" content="A subtitle">/)
})

test('renderWritingPages falls back to a title-based meta description for a post with no subtitle frontmatter', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'no-subtitle.md'),
    '---\ntitle: "No Subtitle"\ndate: "Jan 1, 2026"\n---\n\nBody text.\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'no-subtitle.html'), 'utf-8')
  assert.match(html, /<meta name="description" content="No Subtitle — notes by Nicolás Baglivo\.">/)
})

test('renderWritingPages uses pageTitle frontmatter for the <title> tag while keeping the full title in the <h2>', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'long-title-post.md'),
    '---\ntitle: "A Very Long Full Title That Would Otherwise Blow The Length Limit"\ndate: "Jan 1, 2026"\npageTitle: "A Short Title"\n---\n\nBody text.\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'long-title-post.html'), 'utf-8')
  assert.match(html, /<title>A Short Title — Nicolás Baglivo<\/title>/)
  assert.match(
    html,
    /<h2 class="text-2xl font-medium tracking-tight text-\[#38352f\]">A Very Long Full Title That Would Otherwise Blow The Length Limit<\/h2>/
  )
})

test('renderWritingPages throws a clear error when a markdown file has no frontmatter', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(join(sourceDir, 'no-frontmatter.md'), 'Just some body text with no frontmatter at all.\n')

  assert.throws(
    () => renderWritingPages(sourceDir, outDir),
    /no-frontmatter\.md: missing required frontmatter "title" and\/or "date"/
  )
})

test('renderWritingPages throws a clear error when frontmatter is missing title or date', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'missing-date.md'),
    '---\ntitle: "Has A Title"\n---\n\nBody text.\n'
  )

  assert.throws(
    () => renderWritingPages(sourceDir, outDir),
    /missing-date\.md: missing required frontmatter "title" and\/or "date"/
  )
})

test('renderWritingPages adds target="_blank" rel="noopener noreferrer" to external http links but not to relative links', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')

  writeFileSync(
    join(sourceDir, 'links-post.md'),
    '---\ntitle: "Links Post"\ndate: "Jan 1, 2026"\n---\n\nSee [external](https://example.com) and [internal](other-post.html).\n'
  )

  renderWritingPages(sourceDir, outDir)

  const html = readFileSync(join(outDir, 'links-post.html'), 'utf-8')
  assert.match(html, /<a href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer">external<\/a>/)
  assert.match(html, /<a href="other-post\.html">internal<\/a>/)
})
