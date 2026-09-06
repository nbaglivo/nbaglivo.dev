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
  assert.doesNotMatch(html, /text-zinc-400 mt-1/)
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
    /<h2 class="text-2xl font-medium tracking-tight text-zinc-200">A Very Long Full Title That Would Otherwise Blow The Length Limit<\/h2>/
  )
})
