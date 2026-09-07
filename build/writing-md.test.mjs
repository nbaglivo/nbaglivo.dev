import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

const sourceDir = join(import.meta.dirname, '..', 'writing-md')

test('every writing-md source has title and date frontmatter, and no leading heading in the body', () => {
  const files = readdirSync(sourceDir).filter((f) => f.endsWith('.md'))
  assert.ok(files.length > 0, 'expected at least one markdown file in writing-md/')

  for (const file of files) {
    const raw = readFileSync(join(sourceDir, file), 'utf-8')
    const { data, content } = matter(raw)

    assert.ok(data.title, `${file} is missing frontmatter "title"`)
    assert.ok(data.date, `${file} is missing frontmatter "date"`)

    const firstLine = content.trim().split('\n')[0] ?? ''
    assert.ok(!firstLine.startsWith('#'), `${file} body still starts with a markdown heading: "${firstLine}"`)
  }
})
