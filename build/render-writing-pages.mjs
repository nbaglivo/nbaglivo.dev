import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { renderPage } from './template.mjs'

const md = new MarkdownIt()

export function renderWritingPages(sourceDir, outDir) {
  mkdirSync(outDir, { recursive: true })

  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md'))

  for (const file of files) {
    const raw = readFileSync(join(sourceDir, file), 'utf-8')
    const { data, content } = matter(raw)

    const html = renderPage({
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      content: md.render(content),
      pageTitle: data.pageTitle,
    })

    const slug = basename(file, '.md')
    writeFileSync(join(outDir, `${slug}.html`), html)
  }
}
