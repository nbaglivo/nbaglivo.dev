import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateFeed } from './generate-feed.mjs'

const site = {
  siteUrl: 'https://nbaglivo.dev',
  siteName: 'Nicolás Baglivo',
  siteDescription: 'Notes & essays.',
  author: 'Nicolás Baglivo',
}

function buildFeed(posts) {
  const sourceDir = mkdtempSync(join(tmpdir(), 'feed-src-'))
  const outDir = mkdtempSync(join(tmpdir(), 'feed-out-'))
  for (const [file, raw] of Object.entries(posts)) writeFileSync(join(sourceDir, file), raw)
  generateFeed(sourceDir, outDir, site)
  return readFileSync(join(outDir, 'feed.xml'), 'utf-8')
}

test('generateFeed writes an RSS 2.0 channel with escaped site metadata and a self link', () => {
  const xml = buildFeed({ 'a.md': '---\ntitle: "A"\ndate: "Jan 1, 2026"\n---\n\nA.\n' })

  assert.match(xml, /<rss version="2\.0"/)
  assert.match(xml, /<title>Nicolás Baglivo<\/title>/)
  assert.match(xml, /<link>https:\/\/nbaglivo\.dev\/<\/link>/)
  assert.match(xml, /<description>Notes &amp; essays\.<\/description>/)
  assert.match(xml, /<atom:link href="https:\/\/nbaglivo\.dev\/feed\.xml" rel="self" type="application\/rss\+xml"\/>/)
})

test('generateFeed lists posts newest first with link, guid, RFC 822 pubDate and full HTML content', () => {
  const xml = buildFeed({
    'older.md': '---\ntitle: "Older"\ndate: "Jan 1, 2026"\n---\n\nOld.\n',
    'newer.md': '---\ntitle: "Newer"\nsubtitle: "Sub <b>"\ndate: "Feb 2, 2026"\n---\n\nHello **world**.\n',
  })

  assert.ok(xml.indexOf('<title>Newer</title>') < xml.indexOf('<title>Older</title>'))
  assert.match(xml, /<link>https:\/\/nbaglivo\.dev\/writing\/newer\.html<\/link>/)
  assert.match(xml, /<guid isPermaLink="true">https:\/\/nbaglivo\.dev\/writing\/newer\.html<\/guid>/)
  assert.match(xml, /<pubDate>Mon, 02 Feb 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(xml, /<description>Sub &lt;b&gt;<\/description>/)
  assert.match(xml, /<content:encoded><!\[CDATA\[<p>Hello <strong>world<\/strong>\.<\/p>\n\]\]><\/content:encoded>/)
  assert.match(xml, /<lastBuildDate>Mon, 02 Feb 2026 00:00:00 GMT<\/lastBuildDate>/)
})

test('generateFeed resolves relative links in post content against the post URL', () => {
  const xml = buildFeed({
    'links.md': '---\ntitle: "Links"\ndate: "Jan 1, 2026"\n---\n\nSee [other](other-post.html) and [ext](https://example.com).\n',
  })

  assert.match(xml, /<a href="https:\/\/nbaglivo\.dev\/writing\/other-post\.html">other<\/a>/)
  assert.match(xml, /<a href="https:\/\/example\.com" target="_blank" rel="noopener noreferrer">ext<\/a>/)
})
