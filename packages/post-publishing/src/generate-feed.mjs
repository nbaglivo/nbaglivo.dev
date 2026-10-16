import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import matter from 'gray-matter'
import { renderMarkdown } from './markdown.mjs'

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function cdata(value) {
  return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
}

function toDate(dateStr) {
  return new Date(`${dateStr} UTC`)
}

function itemEntry({ title, link, pubDate, description, content }) {
  const descriptionXml = description ? `\n      <description>${escapeXml(description)}</description>` : ''
  return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>${descriptionXml}
      <content:encoded>${cdata(content)}</content:encoded>
    </item>`
}

export function generateFeed(sourceDir, outDir, { siteUrl, siteName, siteDescription, author }) {
  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md'))

  const posts = files
    .map((file) => {
      const { data, content } = matter(readFileSync(join(sourceDir, file), 'utf-8'))
      const link = `${siteUrl}/writing/${basename(file, '.md')}.html`
      return {
        title: data.title,
        link,
        pubDate: toDate(data.date),
        description: data.subtitle,
        content: renderMarkdown(content, { baseUrl: link }),
      }
    })
    .sort((a, b) => b.pubDate - a.pubDate)

  const lastBuildDate = posts[0]?.pubDate ?? new Date()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}/</link>
    <description>${escapeXml(siteDescription ?? `Writing by ${author}.`)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map(itemEntry).join('\n')}
  </channel>
</rss>
`

  writeFileSync(join(outDir, 'feed.xml'), xml)
}
