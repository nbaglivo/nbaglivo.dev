import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderFollowBox, renderPage, renderSubscribePage } from './template.mjs'

const site = { siteName: 'Nicolás Baglivo', author: 'Nicolás Baglivo' }

test('renderPage includes title, date, and content inside a prose container', () => {
  const html = renderPage({
    ...site,
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
  const html = renderPage({ ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.doesNotMatch(html, /text-\[#6f6a60\] mt-1/)
})

test('renderPage includes the subtitle paragraph when subtitle is present', () => {
  const html = renderPage({ ...site, title: 'T', subtitle: 'Sub', date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<p class="text-\[#6f6a60\] mt-1">Sub<\/p>/)
})

test('renderPage uses the given description for the meta description tag', () => {
  const html = renderPage({
    ...site,
    title: 'T',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>x</p>',
    description: 'A custom description',
  })
  assert.match(html, /<meta name="description" content="A custom description">/)
})

test('renderPage falls back to a title-based description when none is given', () => {
  const html = renderPage({ ...site, title: 'Test Title', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<meta name="description" content="Test Title — notes by Nicolás Baglivo\.">/)
})

test('renderPage escapes double quotes in the description', () => {
  const html = renderPage({
    ...site,
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
    ...site,
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
  const html = renderPage({ ...site, title: 'Test Title', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<title>Test Title — Nicolás Baglivo<\/title>/)
})

test('renderPage uses siteName for the <title> suffix and author for the fallback description', () => {
  const html = renderPage({
    title: 'Test Title',
    subtitle: undefined,
    date: 'Jan 1, 2026',
    content: '<p>x</p>',
    siteName: 'The Open Inner Monologue',
    author: 'Nicolás Baglivo',
  })
  assert.match(html, /<title>Test Title — The Open Inner Monologue<\/title>/)
  assert.match(html, /<meta name="description" content="Test Title — notes by Nicolás Baglivo\.">/)
})

test('renderPage advertises the site RSS feed for autodiscovery', () => {
  const html = renderPage({ ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<link rel="alternate" type="application\/rss\+xml" title="Nicolás Baglivo" href="\.\.\/feed\.xml">/)
})

test('renderPage defaults the document language to English', () => {
  const html = renderPage({ ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<html lang="en">/)
})

test('renderPage uses the given lang for the document language', () => {
  const html = renderPage({ ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>', lang: 'es' })
  assert.match(html, /<html lang="es">/)
})

test('renderPage declares the charset as the first element in <head>', () => {
  const html = renderPage({ ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' })
  assert.match(html, /<head>\s*<meta charset="UTF-8">/)
})

const engineering = {
  siteId: 'engineering',
  lang: 'en',
  blogName: 'Engineering ideas and projects',
  handle: '@engineering@nbaglivo.dev',
  feedUrl: 'https://engineering.nbaglivo.dev/feed.xml',
}
const monologue = {
  siteId: 'inner-monologue',
  lang: 'es',
  blogName: 'The Open Inner Monologue',
  handle: '@innermonologue@nbaglivo.dev',
  feedUrl: 'https://innermonologue.nbaglivo.dev/feed.xml',
}
const post = { ...site, title: 'T', subtitle: undefined, date: 'Jan 1, 2026', content: '<p>x</p>' }
const subscribePage = (page, subscribe = engineering) => renderSubscribePage({ ...site, page, subscribe })

test('renderPage leaves the signup form out when the site has no subscribe config', () => {
  assert.doesNotMatch(renderPage(post), /<form/)
})

test('renderPage posts the signup form to the site id on warmhole', () => {
  const html = renderPage({ ...post, subscribe: monologue })
  assert.match(html, /<form [^>]*method="post" action="https:\/\/ap\.nbaglivo\.dev\/sites\/inner-monologue\/subscribe">/)
})

test('renderPage names the email field for warmhole and labels it for screen readers', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<input [^>]*type="email" name="email" required placeholder="you@example\.com" autocomplete="email" aria-label="Email address">/)
})

test('renderPage includes the hidden honeypot field with the attributes warmhole expects', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<input type="text" name="website" tabindex="-1" autocomplete="off" hidden>/)
})

test('renderPage gives the subscribe button a visible focus style', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<button class="[^"]*focus-visible:outline-2[^"]*"[^>]*>Subscribe<\/button>/)
})

test('renderPage declares the button as a submit button', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<button [^>]*type="submit">Subscribe<\/button>/)
})

test('renderPage marks the form language so a Spanish form reads correctly on an English post', () => {
  const html = renderPage({ ...post, lang: 'en', subscribe: monologue })
  assert.match(html, /<section [^>]*lang="es"/)
  assert.match(html, /¿Cómo querés recibir mis actualizaciones\?/)
  assert.match(html, />Suscribirme<\/button>/)
})

test('renderSubscribePage uses the site language for the document', () => {
  assert.match(subscribePage('confirmed', monologue), /<html lang="es">/)
})

test('renderSubscribePage keeps every page out of search results', () => {
  for (const page of ['check-your-inbox', 'confirmed', 'unsubscribed']) {
    assert.match(subscribePage(page), /<meta name="robots" content="noindex">/)
  }
})

test('renderSubscribePage points shared assets two levels up', () => {
  const html = subscribePage('confirmed')
  assert.match(html, /<link rel="stylesheet" href="\.\.\/\.\.\/style\.css">/)
  assert.match(html, /href="\.\.\/\.\.\/public\/icons\/favicon\.svg"/)
})

test('renderSubscribePage titles the page with the blog name', () => {
  assert.match(subscribePage('confirmed'), /<title>You're in — Engineering ideas and projects<\/title>/)
})

test('check-your-inbox shows the normal message and keeps the error hidden until JS reveals it', () => {
  const html = subscribePage('check-your-inbox')
  assert.match(html, /<div id="subscribe-sent">[\s\S]*We sent a link to your inbox\. Click it to confirm\./)
  assert.match(html, /<div id="subscribe-invalid" hidden>[\s\S]*That doesn't look like an email address\. Try again\?[\s\S]*<form /)
})

test('check-your-inbox swaps to the error only for error=invalid', () => {
  const html = subscribePage('check-your-inbox')
  assert.match(html, /new URLSearchParams\(location\.search\)\.get\('error'\) === 'invalid'/)
})

test('confirmed links back to the blog home by name', () => {
  const html = subscribePage('confirmed')
  assert.match(html, /New posts will arrive in your inbox\./)
  assert.match(html, /<a [^>]*href="\.\.\/\.\.\/index\.html">← Engineering ideas and projects<\/a>/)
})

test('unsubscribed links home and offers the form again', () => {
  const html = subscribePage('unsubscribed')
  assert.match(html, /You won't get any more emails\./)
  assert.match(html, /href="\.\.\/\.\.\/index\.html"/)
  assert.match(html, /Was that a mistake\?/)
  assert.match(html, />Subscribe again<\/button>/)
})

test('renderSubscribePage uses the reviewed Spanish copy', () => {
  assert.match(subscribePage('check-your-inbox', monologue), /Te mandé un link por email\. Abrilo para confirmar\./)
  assert.match(subscribePage('confirmed', monologue), /Los posts nuevos te van a llegar por email\./)
  assert.match(subscribePage('unsubscribed', monologue), />Suscribirme de nuevo<\/button>/)
})

test('renderPage asks how to receive updates as a labelled group of choices', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<fieldset [^>]*>\s*<legend[^>]*>How do you want to receive my updates\?<\/legend>/)
})

test('renderPage offers RSS, Email and Fediverse in that order', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  const labels = [...html.matchAll(/<label [^>]*for="follow-[a-z]+"[^>]*>([^<]+)<\/label>/g)].map((match) => match[1])
  assert.deepEqual(labels, ['RSS', 'Email', 'Fediverse'])
})

test('renderPage uses the Spanish name for the fediverse on a Spanish blog', () => {
  assert.match(renderPage({ ...post, subscribe: monologue }), /for="follow-fediverse"[^>]*>Fediverso<\/label>/)
})

test('renderPage leaves every choice unselected so no option leads', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.equal([...html.matchAll(/type="radio"/g)].length, 3)
  assert.doesNotMatch(html, /\bchecked>/)
})

test('renderPage stacks the panels in one grid cell so switching never moves the page', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  const panels = [...html.matchAll(/<div class="([^"]*)" data-follow-panel>/g)].map((match) => match[1])
  assert.equal(panels.length, 3)
  for (const panel of panels) {
    assert.match(panel, /\bcol-start-1\b/)
    assert.match(panel, /\brow-start-2\b/)
    assert.match(panel, /\binvisible\b/)
  }
})

test('renderPage reveals each panel from its own choice using only CSS', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  for (const name of ['rss', 'email', 'fediverse']) {
    assert.match(html, new RegExp(`<input class="peer/${name} [^"]*" type="radio"`))
    assert.match(html, new RegExp(`<div class="[^"]*peer-checked/${name}:visible[^"]*" data-follow-panel>`))
  }
})

test('renderPage shows the feed address and the fediverse handle with copy buttons', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, />https:\/\/engineering\.nbaglivo\.dev\/feed\.xml<\/span>/)
  assert.match(html, />@engineering@nbaglivo\.dev<\/span>/)
  assert.match(html, /data-copy="https:\/\/engineering\.nbaglivo\.dev\/feed\.xml"/)
  assert.match(html, /data-copy="@engineering@nbaglivo\.dev"/)
})

test('renderPage hides the copy buttons until JS can make them work', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.equal([...html.matchAll(/<button [^>]*data-copy="[^"]*"[^>]*hidden/g)].length, 2)
  assert.match(html, /<script>[\s\S]*querySelectorAll\('\[data-copy\]'\)[\s\S]*<\/script>/)
})

test('renderFollowBox has no margin label, keeping only the box in the blog language', () => {
  for (const subscribe of [engineering, monologue]) {
    const html = renderFollowBox(subscribe)
    assert.match(html, new RegExp(`<section data-follow-box class="[^"]*" lang="${subscribe.lang}">`))
    assert.doesNotMatch(html, /index-year/)
    assert.doesNotMatch(html, />(follow|seguí)</)
  }
})

test('renderFollowBox fills the content width with no side margins', () => {
  assert.doesNotMatch(renderFollowBox(engineering).match(/<section [^>]*>/)[0], /\bmx-/)
})

test('renderPage highlights the follow options in a tinted box without a margin label', () => {
  const html = renderPage({ ...post, subscribe: engineering })
  assert.match(html, /<section data-follow-box class="[^"]*bg-\[#f3eee4\][^"]*" lang="en">/)
  assert.doesNotMatch(html, />follow</)
})

test('the subscribe pages keep their email margin label', () => {
  assert.match(subscribePage('confirmed'), /aria-hidden="true">email<\/span>/)
})

test('renderFollowBox posts to the site id with the site copy', () => {
  const html = renderFollowBox(monologue)
  assert.match(html, /¿Cómo querés recibir mis actualizaciones\?/)
  assert.match(html, /action="https:\/\/ap\.nbaglivo\.dev\/sites\/inner-monologue\/subscribe"/)
})

test('the error and unsubscribed pages keep only the email form', () => {
  for (const page of ['check-your-inbox', 'unsubscribed']) {
    const html = subscribePage(page)
    assert.doesNotMatch(html, /<fieldset/)
    assert.match(html, /<form /)
  }
})
