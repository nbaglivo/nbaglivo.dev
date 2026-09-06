export function renderPage({ title, subtitle, date, content }) {
  const subtitleHtml = subtitle ? `<p class="text-zinc-400 mt-1">${subtitle}</p>\n\t\t\t\t` : ''

  return `<html lang="en">
	<head>
		<title>${title} — Nicolás Baglivo</title>
		<link rel="stylesheet" href="../style.css">
		<meta charset="UTF-8">
	</head>

	<body class="min-w-sm">
		<main class="mx-auto max-w-2xl px-4 pt-4 pb-16 md:pt-16">
			<a class="inline-block text-sm text-zinc-400 hover:underline" href="../index.html">← Back</a>

			<article class="mt-6">
				<h2 class="text-2xl font-medium tracking-tight text-zinc-200">${title}</h2>
				${subtitleHtml}<p class="text-sm text-zinc-500 mb-8">${date}</p>

				<div class="prose prose-invert prose-zinc max-w-none">
					${content}
				</div>
			</article>
		</main>
	</body>
</html>
`
}
