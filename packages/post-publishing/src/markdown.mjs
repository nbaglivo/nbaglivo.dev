import MarkdownIt from 'markdown-it'

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
  } else if (env.baseUrl && href && !href.startsWith('#') && !href.startsWith('mailto:')) {
    tokens[idx].attrs[hrefIndex][1] = new URL(href, env.baseUrl).href
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

export function renderMarkdown(content, { baseUrl } = {}) {
  return md.render(content, { baseUrl })
}
