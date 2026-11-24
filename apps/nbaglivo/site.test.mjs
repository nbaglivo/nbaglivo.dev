import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const read = (file) => readFileSync(join(import.meta.dirname, file), 'utf-8')

const { site } = JSON.parse(read('package.json'))
const redirects = read('_redirects')
const index = read('index.html')
const slugs = readdirSync(join(import.meta.dirname, 'writing-md'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => basename(file, '.md'))

test('feed ids stay on the engineering address', () => {
  assert.equal(site.url, 'https://nbaglivo.dev')
  assert.equal(site.feedIdUrl, 'https://engineering.nbaglivo.dev')
  assert.equal(site.canonical, true)
})

test('the only redirect is webfinger, so old writing links cannot loop', () => {
  assert.equal(redirects.trim(), '/.well-known/webfinger https://ap.nbaglivo.dev/.well-known/webfinger 302')
})

test('the index lists every post exactly once', () => {
  const listed = [...index.matchAll(/class="index-post" href="writing\/([^"]+)\.html"/g)].map((m) => m[1])
  assert.ok(slugs.length > 0)
  assert.deepEqual(listed.sort(), slugs.sort())
})

test('the index is the english work profile', () => {
  assert.match(index, /<html lang="en">/)
  assert.match(index, /<link rel="canonical" href="https:\/\/nbaglivo\.dev\/">/)
  assert.match(index, /<h1 class="index-title">Nicolás Baglivo<\/h1>/)
  assert.match(index, /mailto:hi@nbaglivo\.dev/)
  for (const heading of ['Selected work', 'Writing']) assert.match(index, new RegExp(`<h2[^>]*>${heading}</h2>`))
  assert.doesNotMatch(index, /canilla|innermonologue|lang="es"|gentedespierta/)
})
