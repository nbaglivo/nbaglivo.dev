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

  assert.match(html, /<h2 class="text-2xl font-medium tracking-tight text-\[#38352f\]">Test Title<\/h2>/)
  assert.match(html, /<p class="text-sm text-\[#8a857b\] mb-8">Jan 1, 2026<\/p>/)
  assert.match(html, /<div class="prose prose-neutral max-w-none">/)
  assert.match(html, /<p>Hello<\/p>/)
})

test('renderPage omits the subtitle paragraph when subtitle is absent', () => {
  const html = renderPage({ title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.doesNotMatch(html, /text-\[#6f6a60\] mt-1/)
})

test('renderPage includes the subtitle paragraph when subtitle is present', () => {
  const html = renderPage({ title: 'T', subtitle: 'Sub', date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<p class="text-\[#6f6a60\] mt-1">Sub<\/p>/)
})

test('renderPage uses the given description for the meta description tag', () => {
  const html = renderPage({
    title: 'T',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>x</p>',
    description: 'A custom description',
  })
  assert.match(html, /<meta name="description" content="A custom description">/)
})

test('renderPage falls back to a title-based description when none is given', () => {
  const html = renderPage({ title: 'Test Title', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<meta name="description" content="Test Title — notes by Nicolás Baglivo\.">/)
})

test('renderPage escapes double quotes in the description', () => {
  const html = renderPage({
    title: 'T',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>x</p>',
    description: 'A "quoted" description',
  })
  assert.match(html, /<meta name="description" content="A &quot;quoted&quot; description">/)
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
    /<h2 class="text-2xl font-medium tracking-tight text-\[#38352f\]">A Very Long Full Title That Would Otherwise Blow The Limit<\/h2>/
  )
})

test('renderPage falls back to title for the <title> tag when pageTitle is absent', () => {
  const html = renderPage({ title: 'Test Title', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<title>Test Title — Nicolás Baglivo<\/title>/)
})
