import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { renderPage } from './template.mjs'

const md = new MarkdownIt()

const defaultLinkOpen = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const hrefIndex = tokens[idx].attrIndex('href')
  const href = hrefIndex >= 0 ? tokens[idx].attrs[hrefIndex][1] : ''
  if (href.startsWith('http')) {
    tokens[idx].attrPush(['target', '_blank'])
    tokens[idx].attrPush(['rel', 'noopener noreferrer'])
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function renderWritingPages(sourceDir, outDir) {
  mkdirSync(outDir, { recursive: true })

  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md'))

  for (const file of files) {
    const raw = readFileSync(join(sourceDir, file), 'utf-8')
    const { data, content } = matter(raw)

    if (!data.title || !data.date) {
      throw new Error(`${file}: missing required frontmatter "title" and/or "date"`)
    }

    const html = renderPage({
      title: data.title,
      subtitle: data.subtitle,
      date: data.date,
      content: md.render(content),
      pageTitle: data.pageTitle,
      description: data.subtitle,
    })

    const slug = basename(file, '.md')
    writeFileSync(join(outDir, `${slug}.html`), html)
  }
}
