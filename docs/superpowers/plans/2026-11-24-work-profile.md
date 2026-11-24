# Work Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn nbaglivo.dev into Nico's work profile, with the engineering posts on it, without re-sending any post or breaking any URL.

**Architecture:** `apps/nbaglivo` absorbs `apps/engineering`. Two opt-in settings in `post-publishing` keep the feed IDs on the old address and mark nbaglivo.dev as canonical. CI deploys the one build to both existing Cloudflare projects.

**Tech Stack:** Node 26 (`node --test`), Tailwind CLI 4, gray-matter, markdown-it, Cloudflare Pages, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-24-work-profile-design.md`

## Global Constraints

- Feed `guid` stays `https://engineering.nbaglivo.dev/writing/<slug>.html` with `isPermaLink="true"`, for existing and future posts.
- Feed `link` and canonical use `https://nbaglivo.dev`; post canonicals have no `.html`.
- The built output of `the-open-inner-monologue` and `now-what` stays byte-identical.
- `subscribe` stays `siteId: engineering`, `lang: en`, `blogName: Engineering ideas and projects`, `handle: @engineering@nbaglivo.dev`.
- The page is English, uses the approved copy verbatim and keeps the current look.
- No changes to post content, spread-the-word or Cloudflare settings.
- Config files stay comment-free. Commits are lowercase conventional commits.
- Work on branch `feat/work-profile`. Never push unless Nico asks: pushing `main` deploys.

## Review Focus

- Old `/writing/*` link opened with the 301 cached: it must end on a post, never a loop. Pinned by the `_redirects` test in Task 3.
- `feedIdUrl` mistyped or with a trailing slash: every post would be re-sent. Pinned by the exact-value test in Task 3.
- A post file missing from the index list, or listed twice: each post must appear exactly once. Pinned in Task 3.
- A site without the new settings: its feed and pages must not change. Pinned in Tasks 1 and 2, and by the byte comparison in Task 5.
- The page on a 375px phone: nothing overflows sideways. Checked in Task 4.

---

### Task 1: Feed IDs on their own address

**Files:**
- Modify: `packages/post-publishing/src/generate-feed.mjs`, `packages/post-publishing/src/build-site.mjs`, `packages/post-publishing/bin/post-publishing.mjs`
- Test: `packages/post-publishing/src/generate-feed.test.mjs`

**Interfaces:**
- Produces: optional `site.feedIdUrl: string` in an app's `package.json`; `buildSite({ ..., feedIdUrl })`; `generateFeed(sourceDir, outDir, { ..., feedIdUrl = siteUrl })`.

- [ ] **Step 1: Branch, commit the docs, and save a baseline**

```bash
cd /Users/nico/devel/nbaglivo.dev
git switch -c feat/work-profile
git add docs/superpowers/specs/2026-11-24-work-profile-design.md docs/superpowers/plans/2026-11-24-work-profile.md
git commit -m "docs: add work profile design and plan"
npm ci && npm test && npm run build
BASE=/private/tmp/claude-501/-Users-nico-devel-nbaglivo-dev/3806b2b3-c493-4488-8149-c6f18da5919a/scratchpad/baseline
mkdir -p "$BASE"
cp -R apps/the-open-inner-monologue/dist "$BASE/monologue"
cp -R apps/now-what/dist "$BASE/now-what"
curl -fsS https://engineering.nbaglivo.dev/feed.xml -o "$BASE/live-feed.xml"
```

Expected: tests and builds pass; `grep -c '<guid' "$BASE/live-feed.xml"` prints 16.

- [ ] **Step 2: Write the failing test.** Give the `buildFeed(posts, overrides = {})` helper a second argument spread after `site`.

```js
test('generateFeed keeps guids on feedIdUrl while links use the site URL', () => {
  const xml = buildFeed({ 'a.md': '---\ntitle: "A"\ndate: "Jan 1, 2026"\n---\n\nA.\n' }, { feedIdUrl: 'https://engineering.nbaglivo.dev' })

  assert.match(xml, /<link>https:\/\/nbaglivo\.dev\/writing\/a\.html<\/link>/)
  assert.match(xml, /<guid isPermaLink="true">https:\/\/engineering\.nbaglivo\.dev\/writing\/a\.html<\/guid>/)
})
```

The existing "lists posts newest first" test already pins the guid when `feedIdUrl` is absent.

- [ ] **Step 3:** Run `npm test --workspace=packages/post-publishing`. Expected: the new test FAILS.
- [ ] **Step 4: Implement.** The guid is `${feedIdUrl}/writing/${slug}.html`. `bin` passes `site.feedIdUrl` through `buildSite` to `generateFeed`. `link` and the Markdown `baseUrl` stay on `siteUrl`.
- [ ] **Step 5:** Run the same command. Expected: all PASS.
- [ ] **Step 6:** Commit the four files: `feat: let a site keep its feed ids on another address`

### Task 2: Canonical links on post pages

**Files:**
- Modify: `packages/post-publishing/src/template.mjs`, `packages/post-publishing/src/render-writing-pages.mjs`, `packages/post-publishing/src/build-site.mjs`, `packages/post-publishing/bin/post-publishing.mjs`
- Test: `packages/post-publishing/src/template.test.mjs`, `packages/post-publishing/src/render-writing-pages.test.mjs`

**Interfaces:**
- Produces: optional `site.canonical: boolean`; `buildSite({ ..., canonical })`; `renderWritingPages(sourceDir, outDir, { ..., canonicalUrl })`, where `canonicalUrl` is the site URL or undefined; `renderPage({ ..., canonicalUrl })`, where it is the full page URL or undefined.

- [ ] **Step 1: Write the failing tests**

```js
test('renderPage links the canonical URL only when one is given', () => {
  const page = { ...site, title: 'T', date: 'Jan 1, 2026', content: '<p>x</p>' }
  assert.match(renderPage({ ...page, canonicalUrl: 'https://nbaglivo.dev/writing/t' }), /<link rel="canonical" href="https:\/\/nbaglivo\.dev\/writing\/t">/)
  assert.doesNotMatch(renderPage(page), /canonical/)
})
```

```js
test('renderWritingPages points each post at its canonical URL without .html', () => {
  const sourceDir = mkdtempSync(join(tmpdir(), 'writing-src-'))
  const outDir = join(mkdtempSync(join(tmpdir(), 'writing-out-')), 'writing')
  writeFileSync(join(sourceDir, 'my-post.md'), '---\ntitle: "My Post"\ndate: "Jan 1, 2026"\n---\n\nHello.\n')

  renderWritingPages(sourceDir, outDir, { ...site, canonicalUrl: 'https://nbaglivo.dev' })

  assert.match(readFileSync(join(outDir, 'my-post.html'), 'utf-8'), /<link rel="canonical" href="https:\/\/nbaglivo\.dev\/writing\/my-post">/)
})
```

- [ ] **Step 2:** Run `npm test --workspace=packages/post-publishing`. Expected: both FAIL.
- [ ] **Step 3: Implement.** `renderDocument` emits the tag like `robotsTag`, so that an absent value adds no whitespace. `buildSite` passes `canonicalUrl: canonical ? siteUrl : undefined`. Subscribe pages get none.
- [ ] **Step 4:** Run the same command. Expected: all PASS.
- [ ] **Step 5:** Commit the six files: `feat: add opt-in canonical links to post pages`

### Task 3: One app, deployed to both addresses

**Files:**
- Move (`git mv`) from `apps/engineering/` to `apps/nbaglivo/`: `writing-md/`, `writing-md.test.mjs`, `public/images/my-own-phone/`
- Create: `apps/nbaglivo/site.test.mjs`
- Modify: `apps/nbaglivo/package.json`, `apps/nbaglivo/_redirects`, `apps/nbaglivo/index.html`, `apps/nbaglivo/style.css`, `.github/workflows/deploy.yml`, `package-lock.json`
- Delete: `apps/engineering/`

**Interfaces:**
- Consumes: `site.feedIdUrl` (Task 1) and `site.canonical` (Task 2).
- Produces: `apps/nbaglivo/index.html` with the writing list and the `<!-- follow -->` marker, and the `.index-group*`, `.index-year`, `.index-post*` and `.prose` styles, for Task 4.

- [ ] **Step 1: Write the failing tests** in `apps/nbaglivo/site.test.mjs`, reading files next to it:

```js
test('feed ids stay on the engineering address', () => {
  assert.equal(site.url, 'https://nbaglivo.dev')
  assert.equal(site.feedIdUrl, 'https://engineering.nbaglivo.dev')
  assert.equal(site.canonical, true)
})

test('the only redirect is webfinger, so old writing links cannot loop', () => {
  assert.equal(redirects.trim(), '/.well-known/webfinger https://ap.nbaglivo.dev/.well-known/webfinger 302')
})

test('the index lists every post exactly once', () => {
  const listed = [...index.matchAll(/class="index-post" href="writing\/([^"]+)\.html"/g)].map((m) => m[1])
  assert.deepEqual(listed.sort(), slugs.sort())
})
```

`site` is `package.json`'s `site`; `slugs` are the names of `writing-md/*.md` without the extension.

- [ ] **Step 2:** Add `"test": "node --test *.test.mjs"` to `apps/nbaglivo/package.json` and run `npm test --workspace=apps/nbaglivo`. Expected: all three FAIL.
- [ ] **Step 3: Move the files and settings.** In `site`, set `feedIdUrl` and `canonical` as the test says, copy `subscribe` unchanged, and set `description` to `Engineering ideas and projects by Nicolás Baglivo.` Add the `gray-matter` dev dependency at engineering's version. Keep only the webfinger line in `_redirects`.
- [ ] **Step 4: Move the list and styles.** Copy engineering's `.index-groups` block, with the marker, into the index after `.about`. Add the RSS `<link rel="alternate">`. Copy the list and `.prose` rules into `style.css`.
- [ ] **Step 5: Delete the app and update CI.** `git rm -r apps/engineering`, remove its leftover untracked `dist` and `node_modules`, and run `npm install`. In `deploy.yml`, change `app: engineering` to `app: nbaglivo` on the `engineering-nbaglivo` entry; keep its `project`, `warmhole_site` and `warmhole_token_secret`.
- [ ] **Step 6:** Run `npm test && npm run build --workspace=apps/nbaglivo`. Expected: PASS; `apps/nbaglivo/dist` has 16 files in `writing/`, `feed.xml` and three pages under `subscribe/`.
- [ ] **Step 7:** Commit: `feat: merge the engineering site into nbaglivo.dev`

### Task 4: The profile page

**Files:**
- Modify: `apps/nbaglivo/index.html`, `apps/nbaglivo/style.css`
- Delete: `apps/nbaglivo/public/images/canilla.svg`
- Test: `apps/nbaglivo/site.test.mjs`

**Interfaces:**
- Consumes: the writing list, marker and styles from Task 3.

- [ ] **Step 1: Write the failing test**

```js
test('the index is the english work profile', () => {
  assert.match(index, /<html lang="en">/)
  assert.match(index, /<link rel="canonical" href="https:\/\/nbaglivo\.dev\/">/)
  assert.match(index, /<h1 class="index-title">Nicolás Baglivo<\/h1>/)
  assert.match(index, /mailto:hi@nbaglivo\.dev/)
  for (const heading of ['Selected work', 'Writing']) assert.match(index, new RegExp(`<h2[^>]*>${heading}</h2>`))
  assert.doesNotMatch(index, /canilla|innermonologue|lang="es"|gentedespierta/)
})
```

- [ ] **Step 2:** Run `npm test --workspace=apps/nbaglivo`. Expected: the new test FAILS.
- [ ] **Step 3: Write the page** in the spec's order, with its copy verbatim. Role line: `Software engineer, Barcelona`. Meta description: `Nicolás Baglivo, software engineer in Barcelona. Selected work and writing.` Each work item has an `h3` title and a `p` with the rest; the phone item links `writing/my-own-phone.html` as `My own phone`. Headings read "Selected work" and "Writing", in uppercase through CSS. Keep the four existing link targets. No footer.
- [ ] **Step 4: Style it** with the current palette and fonts: section headings in the mono style of `.index-year`, links with the dotted underline. Remove `.about-figure`, `.about-image`, `.about-caption`, `.index-footer` and any other rule left unused.
- [ ] **Step 5:** Run `npm test --workspace=apps/nbaglivo && npx html-validate apps/nbaglivo/index.html && npm run build --workspace=apps/nbaglivo`. Expected: PASS.
- [ ] **Step 6: Look at it.** Run `npm run dev --workspace=apps/nbaglivo` and take screenshots at 1280px and 375px. Expected: the approved order, no sideways scroll, a working follow box, a post whose "← Back" returns to the profile.
- [ ] **Step 7:** Commit: `feat: turn nbaglivo.dev into a work profile`

### Task 5: Prove nothing gets re-sent, then deploy

**Files:** none

- [ ] **Step 1: Run everything.** `npm test && npm run lighthouse`. Expected: PASS, performance ≥ 0.9 for every app.
- [ ] **Step 2: Compare feed IDs with the saved live feed** (`BASE` as in Task 1).

```bash
ids() { grep -o '<guid[^<]*' "$1" | sort; }
diff <(ids "$BASE/live-feed.xml") <(ids apps/nbaglivo/dist/feed.xml) && echo same
```

Expected: `same`. Anything else blocks the deploy. If a post was published meanwhile, fetch the live feed again first.

- [ ] **Step 3: Compare the other sites**

```bash
diff -r "$BASE/monologue" apps/the-open-inner-monologue/dist && diff -r "$BASE/now-what" apps/now-what/dist && echo same
```

Expected: `same`.

- [ ] **Step 4: Stop and show Nico** the screenshots and both results. Merging and pushing wait for his go-ahead.
- [ ] **Step 5: After the deploy, check the live addresses.** On both hosts, `/writing/what-is-hard.html` followed through redirects, `/feed.xml` and `/subscribe/confirmed/` return 200. `https://nbaglivo.dev/.well-known/webfinger?resource=acct:engineering@nbaglivo.dev` resolves. The `Notify warmhole` step prints `"new":0`, `"emails":0`.
- [ ] **Step 6: If a check fails,** revert the merge commit and, with Nico's go-ahead, push. Both Cloudflare projects still exist, so this restores today's sites.
