const WARMHOLE_URL = 'https://ap.nbaglivo.dev'

export const SUBSCRIBE_PAGES = ['check-your-inbox', 'confirmed', 'unsubscribed']

const SUBSCRIBE_COPY = {
  en: {
    follow: {
      question: 'How do you want to receive my updates?',
      fediverse: 'Fediverse',
      copy: 'Copy',
      copied: 'Copied',
      rssHint: 'Paste this address into your RSS reader.',
      fediverseHint: 'Paste this into Mastodon search or your app.',
    },
    form: {
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
    follow: {
      question: '¿Cómo querés recibir mis actualizaciones?',
      fediverse: 'Fediverso',
      copy: 'Copiar',
      copied: 'Copiado',
      rssHint: 'Pegá esta dirección en tu lector de RSS.',
      fediverseHint: 'Pegá esto en el buscador de Mastodon o de tu app.',
    },
    form: {
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

const BUTTON_CLASSES = "cursor-pointer rounded border border-[#e3ddd0] bg-[#f1ece2] px-3 py-1.5 font-['IBM_Plex_Mono',monospace] text-[0.82rem] text-[#38352f] transition-colors hover:border-[#38352f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38352f]"

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
						<button class="${BUTTON_CLASSES}" type="submit">${buttonLabel}</button>
					</form>`
}

function renderCopyValue(value, hint, { copy, copied }) {
  return `<div class="mt-2 flex flex-wrap gap-2.5">
							<span class="min-w-0 grow basis-full rounded border border-[#e3ddd0] bg-white px-2.5 py-1.5 font-['IBM_Plex_Mono',monospace] text-[0.82rem] text-[#38352f] select-all [overflow-wrap:anywhere] sm:basis-0">${value}</span>
							<button class="${BUTTON_CLASSES} min-w-[5.25rem]" type="button" data-copy="${value}" data-copied="${copied}" hidden>${copy}</button>
						</div>
						<p class="mt-1.5 text-[0.82rem] text-[#6f6a60]">${hint}</p>`
}

function renderFollowOptions(subscribe) {
  const copy = SUBSCRIBE_COPY[subscribe.lang].follow
  const { handle, feedUrl } = subscribe

  return `<fieldset class="relative grid min-w-0 grid-cols-[auto_auto_auto_1fr] justify-items-start gap-x-4">
						<legend class="text-[#38352f]">${copy.question}</legend>
						<input class="peer/rss sr-only" type="radio" name="follow" id="follow-rss">
						<label class="mt-1 cursor-pointer border-b-2 border-dotted border-[#cfc7b8] text-[#38352f] transition-colors hover:border-[#38352f] peer-checked/rss:border-solid peer-checked/rss:border-[#38352f] peer-focus-visible/rss:outline-2 peer-focus-visible/rss:outline-offset-2 peer-focus-visible/rss:outline-[#38352f]" for="follow-rss">RSS</label>
						<input class="peer/email sr-only" type="radio" name="follow" id="follow-email">
						<label class="mt-1 cursor-pointer border-b-2 border-dotted border-[#cfc7b8] text-[#38352f] transition-colors hover:border-[#38352f] peer-checked/email:border-solid peer-checked/email:border-[#38352f] peer-focus-visible/email:outline-2 peer-focus-visible/email:outline-offset-2 peer-focus-visible/email:outline-[#38352f]" for="follow-email">Email</label>
						<input class="peer/fediverse sr-only" type="radio" name="follow" id="follow-fediverse">
						<label class="mt-1 cursor-pointer border-b-2 border-dotted border-[#cfc7b8] text-[#38352f] transition-colors hover:border-[#38352f] peer-checked/fediverse:border-solid peer-checked/fediverse:border-[#38352f] peer-focus-visible/fediverse:outline-2 peer-focus-visible/fediverse:outline-offset-2 peer-focus-visible/fediverse:outline-[#38352f]" for="follow-fediverse">${copy.fediverse}</label>
						<div class="invisible col-span-4 col-start-1 row-start-2 w-full min-w-0 peer-checked/rss:visible" data-follow-panel>
						${renderCopyValue(feedUrl, copy.rssHint, copy)}
						</div>
						<div class="invisible col-span-4 col-start-1 row-start-2 w-full min-w-0 peer-checked/email:visible" data-follow-panel>
						${renderSubscribeForm(subscribe)}
						</div>
						<div class="invisible col-span-4 col-start-1 row-start-2 w-full min-w-0 peer-checked/fediverse:visible" data-follow-panel>
						${renderCopyValue(handle, copy.fediverseHint, copy)}
						</div>
					</fieldset>
					<script>
						for (const button of document.querySelectorAll('[data-copy]')) {
							if (!navigator.clipboard) continue
							const label = button.textContent
							button.hidden = false
							button.addEventListener('click', async () => {
								await navigator.clipboard.writeText(button.dataset.copy)
								button.textContent = button.dataset.copied
								setTimeout(() => {
									button.textContent = label
								}, 1200)
							})
						}
					</script>`
}

export function renderFollowBox(subscribe) {
  return `<section data-follow-box class="rounded-lg bg-[#f3eee4] px-5 py-4 [&_button]:bg-[#faf8f4]" lang="${subscribe.lang}">
					${renderFollowOptions(subscribe)}
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
			</article>${subscribe ? `\n\n\t\t\t<div class="mt-12">\n\t\t\t\t${renderFollowBox(subscribe)}\n\t\t\t</div>` : ''}`,
  })
}
