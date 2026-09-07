import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderPage } from './template.mjs'

test('renderPage includes title, date, and content inside a prose container', () => {
  const html = renderPage({
    title: 'Test Title',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>Hello</p>',
  })

  assert.match(html, /<h2 class="text-2xl font-medium tracking-tight text-zinc-200">Test Title<\/h2>/)
  assert.match(html, /<p class="text-sm text-zinc-500 mb-8">Jan 1, 2026<\/p>/)
  assert.match(html, /<div class="prose prose-invert prose-zinc max-w-none">/)
  assert.match(html, /<p>Hello<\/p>/)
})

test('renderPage omits the subtitle paragraph when subtitle is absent', () => {
  const html = renderPage({ title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.doesNotMatch(html, /text-zinc-400 mt-1/)
})

test('renderPage includes the subtitle paragraph when subtitle is present', () => {
  const html = renderPage({ title: 'T', subtitle: 'Sub', date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<p class="text-zinc-400 mt-1">Sub<\/p>/)
})

test('renderPage uses pageTitle for the <title> tag when provided, keeping the full title in the <h2>', () => {
  const html = renderPage({
    title: 'A Very Long Full Title That Would Otherwise Blow The Limit',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>Hello</p>',
    pageTitle: 'A Short Title',
  })

  assert.match(html, /<title>A Short Title — Nicolás Baglivo<\/title>/)
  assert.match(
    html,
    /<h2 class="text-2xl font-medium tracking-tight text-zinc-200">A Very Long Full Title That Would Otherwise Blow The Limit<\/h2>/
  )
})

test('renderPage falls back to title for the <title> tag when pageTitle is absent', () => {
  const html = renderPage({ title: 'Test Title', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<title>Test Title — Nicolás Baglivo<\/title>/)
})
