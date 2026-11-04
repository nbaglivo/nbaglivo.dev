const WARMHOLE_URL = 'https://ap.nbaglivo.dev'

export const SUBSCRIBE_PAGES = ['check-your-inbox', 'confirmed', 'unsubscribed']

const SUBSCRIBE_COPY = {
  en: {
    form: {
      heading: 'Get new posts by email',
      placeholder: 'you@example.com',
      fieldLabel: 'Email address',
      button: 'Subscribe',
      buttonAgain: 'Subscribe again',
    },
    sent: { heading: 'Almost there', body: 'We sent a link to your inbox. Click it to confirm.' },
    invalid: { heading: "Let's try that again", body: "That doesn't look like an email address. Try again?" },
    confirmed: { heading: "You're in", body: 'New posts will arrive in your inbox.' },
    unsubscribed: { heading: "You're unsubscribed", body: "You won't get any more emails.", mistake: 'Was that a mistake?' },
  },
  es: {
    form: {
      heading: 'Recibí los posts nuevos por email',
      placeholder: 'vos@ejemplo.com',
      fieldLabel: 'Tu email',
      button: 'Suscribirme',
      buttonAgain: 'Suscribirme de nuevo',
    },
    sent: { heading: 'Ya casi', body: 'Te mandé un link por email. Abrilo para confirmar.' },
    invalid: { heading: 'Probemos de nuevo', body: 'Eso no parece una dirección de email. ¿Probás otra vez?' },
    confirmed: { heading: 'Ya estás', body: 'Los posts nuevos te van a llegar por email.' },
    unsubscribed: { heading: 'Listo, te diste de baja', body: 'No vas a recibir más emails.', mistake: '¿Fue un error?' },
  },
}

function renderDocument({ lang, title, feedTitle, description, assetBase, fontWeights, robots, body }) {
  const preloads = fontWeights
    .map((weight) => `<link rel="preload" href="${assetBase}public/fonts/ibm-plex-sans/ibm-plex-sans-latin-${weight}-normal.woff2" as="font" type="font/woff2" crossorigin>`)
    .join('\n\t\t')
  const robotsTag = robots ? `<meta name="robots" content="${robots}">\n\t\t` : ''

  return `<!DOCTYPE html>
<html lang="${lang}">
	<head>
		<meta charset="UTF-8">
		<title>${title}</title>
		<meta name="description" content="${description.replace(/"/g, '&quot;')}">
		${robotsTag}<link rel="icon" type="image/svg+xml" href="${assetBase}public/icons/favicon.svg">
		${preloads}
		<link rel="stylesheet" href="${assetBase}style.css">
		<link rel="alternate" type="application/rss+xml" title="${feedTitle}" href="${assetBase}feed.xml">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>

	<body>
		<main class="mx-auto max-w-2xl px-4 pt-4 pb-16 md:pt-16">
			${body}
		</main>
	</body>
</html>
`
}

function renderSubscribeRow(content) {
  return `<div class="grid grid-cols-[56px_1fr] gap-4 items-start">
				<span class="pt-1 font-['IBM_Plex_Mono',monospace] text-[0.78rem] text-[#756e60]" aria-hidden="true">email</span>
				<div class="min-w-0">
					${content}
				</div>
			</div>`
}

function renderSubscribeForm({ siteId, lang }, buttonLabel = SUBSCRIBE_COPY[lang].form.button) {
  const { placeholder, fieldLabel } = SUBSCRIBE_COPY[lang].form

  return `<form class="mt-2 flex flex-wrap gap-2.5" method="post" action="${WARMHOLE_URL}/sites/${siteId}/subscribe">
						<input class="min-w-40 flex-1 rounded border border-[#e3ddd0] bg-white px-2.5 py-1.5 font-['IBM_Plex_Mono',monospace] text-sm text-[#38352f] placeholder:text-[#8a857b] focus:outline-2 focus:outline-offset-1 focus:outline-[#38352f]" type="email" name="email" required placeholder="${placeholder}" autocomplete="email" aria-label="${fieldLabel}">
						<input type="text" name="website" tabindex="-1" autocomplete="off" hidden>
						<button class="cursor-pointer rounded border border-[#e3ddd0] bg-[#f1ece2] px-3 py-1.5 font-['IBM_Plex_Mono',monospace] text-[0.82rem] text-[#38352f] transition-colors hover:border-[#38352f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38352f]" type="submit">${buttonLabel}</button>
					</form>`
}

function renderPostSignup(subscribe) {
  const { heading } = SUBSCRIBE_COPY[subscribe.lang].form

  return `

			<section class="mt-12 border-t border-[#ebe6dc] pt-[1.375rem]" lang="${subscribe.lang}">
			${renderSubscribeRow(`<h3 class="text-[#38352f]">${heading}</h3>
					${renderSubscribeForm(subscribe)}`)}
			</section>`
}

const renderSubscribeHeading = (heading) => `<h1 class="text-xl tracking-tight text-[#38352f]">${heading}</h1>`
const renderSubscribeBody = (body) => `<p class="text-[#6f6a60]">${body}</p>`

function renderHomeLink(blogName) {
  return `<a class="mt-4 inline-block border-b-2 border-dotted border-[#cfc7b8] text-sm text-[#38352f] transition-colors hover:border-[#38352f]" href="../../index.html">← ${blogName}</a>`
}

const SUBSCRIBE_PAGE_RENDERERS = {
  'check-your-inbox': (subscribe, { sent, invalid }) => ({
    ...sent,
    content: `<div id="subscribe-sent">
						${renderSubscribeHeading(sent.heading)}
						${renderSubscribeBody(sent.body)}
					</div>
					<div id="subscribe-invalid" hidden>
						${renderSubscribeHeading(invalid.heading)}
						<p class="text-[#9a4a2f]" role="alert">${invalid.body}</p>
						${renderSubscribeForm(subscribe)}
					</div>
					<script>
						if (new URLSearchParams(location.search).get('error') === 'invalid') {
							document.getElementById('subscribe-sent').hidden = true
							document.getElementById('subscribe-invalid').hidden = false
						}
					</script>`,
  }),
  confirmed: ({ blogName }, { confirmed }) => ({
    ...confirmed,
    content: `${renderSubscribeHeading(confirmed.heading)}
					${renderSubscribeBody(confirmed.body)}
					${renderHomeLink(blogName)}`,
  }),
  unsubscribed: (subscribe, { unsubscribed, form }) => ({
    ...unsubscribed,
    content: `${renderSubscribeHeading(unsubscribed.heading)}
					${renderSubscribeBody(unsubscribed.body)}
					${renderHomeLink(subscribe.blogName)}
					<p class="mt-5 text-[#6f6a60]">${unsubscribed.mistake}</p>
					${renderSubscribeForm(subscribe, form.buttonAgain)}`,
  }),
}

export function renderSubscribePage({ page, subscribe }) {
  const { heading, body, content } = SUBSCRIBE_PAGE_RENDERERS[page](subscribe, SUBSCRIBE_COPY[subscribe.lang])

  return renderDocument({
    lang: subscribe.lang,
    title: `${heading} — ${subscribe.blogName}`,
    feedTitle: subscribe.blogName,
    description: body,
    assetBase: '../../',
    fontWeights: [400],
    robots: 'noindex',
    body: renderSubscribeRow(content),
  })
}

export function renderPage({ title, subtitle, date, content, pageTitle, description, siteName, author, lang = 'en', subscribe }) {
  const subtitleHtml = subtitle ? `<p class="text-[#6f6a60] mt-1">${subtitle}</p>\n\t\t\t\t` : ''
  const resolvedPageTitle = pageTitle ?? title
  const resolvedDescription = description ?? `${title} — notes by ${author}.`

  return renderDocument({
    lang,
    title: `${resolvedPageTitle} — ${siteName}`,
    feedTitle: siteName,
    description: resolvedDescription,
    assetBase: '../',
    fontWeights: [400, 500],
    body: `<a class="inline-block text-sm text-[#8a857b] border-b-2 border-dotted border-[#cfc7b8] transition-colors hover:border-[#38352f]" href="../index.html">← Back</a>

			<article class="mt-6">
				<h2 class="text-2xl font-medium tracking-tight text-[#38352f]">${title}</h2>
				${subtitleHtml}<p class="text-sm text-[#8a857b] mb-8">${date}</p>

				<div class="prose prose-neutral max-w-none">
					${content}
				</div>
			</article>${subscribe ? renderPostSignup(subscribe) : ''}`,
  })
}
