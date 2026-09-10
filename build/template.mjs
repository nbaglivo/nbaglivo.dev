export function renderPage({ title, subtitle, date, content, pageTitle, description }) {
  const subtitleHtml = subtitle ? `<p class="text-[#6f6a60] mt-1">${subtitle}</p>\n\t\t\t\t` : ''
  const resolvedPageTitle = pageTitle ?? title
  const resolvedDescription = description ?? `${title} — notes by Nicolás Baglivo.`

  return `<!DOCTYPE html>
<html lang="en">
	<head>
		<title>${resolvedPageTitle} — Nicolás Baglivo</title>
		<meta name="description" content="${resolvedDescription.replace(/"/g, '&quot;')}">
		<link rel="icon" type="image/svg+xml" href="../public/icons/favicon.svg">
		<link rel="stylesheet" href="../style.css">
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>

	<body>
		<main class="mx-auto max-w-2xl px-4 pt-4 pb-16 md:pt-16">
			<a class="inline-block text-sm text-[#8a857b] hover:underline" href="../index.html">← Back</a>

			<article class="mt-6">
				<h2 class="text-2xl font-medium tracking-tight text-[#38352f]">${title}</h2>
				${subtitleHtml}<p class="text-sm text-[#8a857b] mb-8">${date}</p>

				<div class="prose prose-neutral max-w-none">
					${content}
				</div>
			</article>
		</main>
	</body>
</html>
`
}
