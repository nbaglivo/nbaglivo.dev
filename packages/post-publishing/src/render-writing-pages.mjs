import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'
import { renderMarkdown } from './markdown.mjs'
import { renderPage, renderSubscribePage, SUBSCRIBE_PAGES } from './template.mjs'

export function renderWritingPages(sourceDir, outDir, { siteName, author, subscribe }) {
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
      content: renderMarkdown(content),
      pageTitle: data.pageTitle,
      description: data.subtitle,
      siteName,
      author,
      lang: data.lang,
      subscribe,
    })

    const slug = basename(file, '.md')
    writeFileSync(join(outDir, `${slug}.html`), html)
  }
}

export function renderSubscribePages(outDir, { subscribe }) {
  if (!subscribe) return

  for (const page of SUBSCRIBE_PAGES) {
    const pageDir = join(outDir, 'subscribe', page)
    mkdirSync(pageDir, { recursive: true })
    writeFileSync(join(pageDir, 'index.html'), renderSubscribePage({ page, subscribe }))
  }
}
