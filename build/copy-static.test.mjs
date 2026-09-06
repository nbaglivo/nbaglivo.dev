import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { copyStaticFiles } from './copy-static.mjs'

test('copyStaticFiles copies index.html and the public directory into outDir', () => {
  const rootDir = mkdtempSync(join(tmpdir(), 'site-root-'))
  const outDir = mkdtempSync(join(tmpdir(), 'site-out-'))
  writeFileSync(join(rootDir, 'index.html'), '<html>root</html>')
  mkdirSync(join(rootDir, 'public', 'icons'), { recursive: true })
  writeFileSync(join(rootDir, 'public', 'icons', 'test.svg'), '<svg></svg>')

  copyStaticFiles(rootDir, outDir)

  assert.equal(readFileSync(join(outDir, 'index.html'), 'utf-8'), '<html>root</html>')
  assert.ok(existsSync(join(outDir, 'public', 'icons', 'test.svg')))
  assert.equal(readFileSync(join(outDir, 'public', 'icons', 'test.svg'), 'utf-8'), '<svg></svg>')
})
