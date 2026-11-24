# nbaglivo.dev as a work profile

Status: awaiting Nico's approval

## Intent

nbaglivo.dev becomes the page for people interested in Nico's engineering work,
because they might hire him or want to talk about a topic. It merges the current
index page with engineering.nbaglivo.dev. Personal interests moved to
nico.gentedespierta.at and are not part of this.

## Goals

- A hiring reader sees concrete evidence of the work without opening the CV.
- Someone with a topic finds the writing and an obvious way to write to Nico.
- One app to maintain.

## Non-goals

- Redesigning. Fonts, colours and dotted links stay.
- Changing post content, The Open Inner Monologue, or now-what.
- Changing the spread-the-word service or its config.

## Anti-goals

- Re-emailing or re-posting the 16 existing posts to subscribers and followers.
- Breaking or looping any existing post, feed or subscribe URL.

## Approaches

1. **One app, published to both addresses.** Picked. Old links work without
   redirects and nothing changes in Cloudflare or on the server. Cost:
   engineering.nbaglivo.dev shows the same profile, marked non-canonical.
2. **One app, engineering redirects.** Cleaner addresses, but visitors holding
   the old `nbaglivo.dev/writing/*` 301 in cache can loop, and the service's
   feed and subscribe URLs would need changing.
3. **Merge the index only.** Least risk, but keeps two apps and a post list
   maintained apart from the posts.

## The page (decided)

English, in this order: name and "Software engineer, Barcelona"; GitHub,
Bluesky, LinkedIn and CV links; intro with the email address; selected work;
writing by year; follow box. The sovereignty paragraph, the canilla, the
Inner Monologue link and the Spanish footer go. Copy as first approved in chat (on
2026-11-24 Nico replaced both paragraphs, email included, with "building products
for 15+ years,"):

> I've been building products for 15+ years, mostly distributed systems, and led
> teams for four of them. Now I build with coding agents and engineer how they
> work: the context, guidelines and verification around them.
>
> If you're hiring, or want to talk about any of this, write to me at
> hi@nbaglivo.dev.

Selected work (removed from the page for now at Nico's request, 2026-11-24; kept
here as the approved copy):

- **Guardrails and verification for coding agents.** Factorial, 2026. Helping
  engineers move upstream to decisions while agents implement and verify,
  without piling up debt.
- **A platform team for a fragmented order domain.** Fashion Cloud, 2021–2024.
  Designed the shared services and hired the team, while splitting the monolith
  without a rewrite.
- **Stock and price sync at ~10M records a day.** Fashion Cloud, 2024–2025.
  Async ingestion pipeline, as Tech Lead.
- **The Rebel Phone Project.** Side project. A phone I'm in charge of. Links to
  the post "My own phone".

## The merge (decided)

- `apps/nbaglivo` absorbs the posts, their test, the post image and the index
  and `.prose` styles from `apps/engineering`, which is then deleted.
  `canilla.svg` and unused styles go too.
- `apps/nbaglivo/package.json` takes engineering's `subscribe` settings
  unchanged (`siteId`, `handle`, `blogName`), its `test` script and
  `gray-matter`. Site URL stays `https://nbaglivo.dev`. The feed keeps
  engineering's description.
- `_redirects` loses `/writing/*` and `/feed.xml`, and keeps the webfinger line.
- CI keeps both Cloudflare projects. One job tests and builds `nbaglivo`, deploys
  `nbaglivo-dev`, then `engineering-nbaglivo`, then notifies spread-the-word with
  engineering's token, so no post is announced before its page is live.
- Post pages keep their layout; "← Back" lands on the profile.

## Feed and addresses (decided)

- spread-the-word identifies a post by its `guid`. Feed `guid` values stay
  `https://engineering.nbaglivo.dev/writing/<slug>.html`, for existing and
  future posts, through an opt-in site setting. `link` uses nbaglivo.dev.
- The index and post pages carry a canonical link to nbaglivo.dev, without
  `.html` on posts because Cloudflare redirects to that form. Opt-in as well.
- Output of the other two sites must not change.

## Claude's calls, to check

- The feed's new `link` values, and the new base for relative links in post
  bodies, make spread-the-word send followers one "edited" update per existing
  post, once. No emails: those are only queued for new posts. Keeping `link` on
  engineering would avoid the edits.
- The CV has Factorial in the past tense, so the page states no current job.
- The follow box shows the nbaglivo.dev feed address to new subscribers; the old
  feed address keeps working.
- The two deploys run one after the other, so the addresses can differ briefly.
- Production spread-the-word config was not read. The design assumes its
  engineering entry uses engineering.nbaglivo.dev for feed and subscribe pages;
  both keep working.

## Verification

- Tests cover the guid and canonical settings, on and off.
- Existing tests, html-validate and Lighthouse (performance ≥ 0.9) pass.
- Before deploying: compare every `guid` in the built feed with the live
  engineering feed. They must be the same 16.
- Build of the other two sites is byte-identical before and after.
- After deploying: a post, `/feed.xml`, `/subscribe/confirmed/` and webfinger
  respond on the addresses they respond on today, and the sync reports 0 new.

## Left to the builder

Names of the new settings, styling of the work list within the current look, and
how the index and engineering styles are combined.
