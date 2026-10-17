import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'

test('copyStaticFiles copies index.html, robots.txt, and the public directory into outDir', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'site-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'site-out-'))
  writeFileSync(join(rootDir, 'index.html'), '<html>root</html>')
  writeFileSync(join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  mkdirSync(join(rootDir, 'public', 'icons'), { recursive: true })
  writeFileSync(join(rootDir, 'public', 'icons', 'test.svg'), '<svg></svg>')

  copyStaticFiles(rootDir, outDir)

  assert.equal(readFileSync(join(outDir, 'index.html'), 'utf-8'), '<html>root</html>')
  assert.equal(readFileSync(join(outDir, 'robots.txt'), 'utf-8'), 'User-agent: *\nAllow: /\n')
  assert.ok(existsSync(join(outDir, 'public', 'icons', 'test.svg')))
  assert.equal(readFileSync(join(outDir, 'public', 'icons', 'test.svg'), 'utf-8'), '<svg></svg>')
})

test('copyStaticFiles copies _headers and .well-known when the site has them', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'site-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'site-out-'))
  writeFileSync(join(rootDir, 'index.html'), '<html>root</html>')
  writeFileSync(join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  mkdirSync(join(rootDir, 'public'))
  writeFileSync(join(rootDir, '_headers'), '/.well-known/webfinger\n  Content-Type: application/jrd+json\n')
  mkdirSync(join(rootDir, '.well-known'))
  writeFileSync(join(rootDir, '.well-known', 'webfinger'), '{"subject":"acct:me@example.dev"}')

  copyStaticFiles(rootDir, outDir)

  assert.equal(readFileSync(join(outDir, '_headers'), 'utf-8'), '/.well-known/webfinger\n  Content-Type: application/jrd+json\n')
  assert.equal(readFileSync(join(outDir, '.well-known', 'webfinger'), 'utf-8'), '{"subject":"acct:me@example.dev"}')
})

test('copyStaticFiles skips _headers and .well-known when the site has none', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'site-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'site-out-'))
  writeFileSync(join(rootDir, 'index.html'), '<html>root</html>')
  writeFileSync(join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  mkdirSync(join(rootDir, 'public'))

  copyStaticFiles(rootDir, outDir)

  assert.ok(!existsSync(join(outDir, '_headers')))
  assert.ok(!existsSync(join(outDir, '.well-known')))
})

test('copyStaticFiles copies _redirects when the site has one', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'site-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'site-out-'))
  writeFileSync(join(rootDir, 'index.html'), '<html>root</html>')
  writeFileSync(join(rootDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  mkdirSync(join(rootDir, 'public'))
  writeFileSync(join(rootDir, '_redirects'), '/old /new 301\n')

  copyStaticFiles(rootDir, outDir)

  assert.equal(readFileSync(join(outDir, '_redirects'), 'utf-8'), '/old /new 301\n')
})
