---
title: "Bootstrapping ADRs when you have none"
date: "Apr 19, 2026"
---

The previous previous post assumed you already have ADRs. If you're starting a greenfield, great — you can adopt them from day one and the workflow applies immediately. Or maybe you've been really diligent and your existing system is already well documented.

But most systems aren't like that. Most systems have history that was never written down. Decisions got made in Slack threads, in calls that weren't recorded, in someone's head that's no longer at the company. The code is what it is, and nobody fully remembers why.

If that's where you are, the workflow still applies. You just need one extra step: extracting the knowledge before you can organize it.

## You're not starting from zero

The temptation when you don't have ADRs is to think you have nothing. That's not true.

You have the code. You have a wiki or a Notion, probably half-maintained. You have tickets, PRs, old Slack conversations if you're willing to dig. And you have your own memory — which is underrated as a source, even if it's imperfect.

The knowledge exists. It's just scattered across different stores, in different shapes, with varying levels of reliability. The goal isn't to create knowledge, it's to surface it and give it a better form.

## Strategies for extraction

**From the codebase** Ask Claude to read a specific part of the system and infer the decisions behind it. Not "explain this code" — that gives you a description. Ask "what design decisions does this code reflect? What tradeoffs does it suggest were made?" You'll get a rough draft of the reasoning that shaped it. It won't always be right, but it's a starting point you can correct.

**From your wiki, Notion, etc** Dump the relevant pages into context and ask Claude to identify decision patterns — things that look like they were choices, not just descriptions. Pages that say "we use X" are interesting. Pages that say "we use X because Y" are gold. Even partially documented reasoning is worth pulling out.

**From your own head** This one is underused. Sit down with Claude and just explain the system out loud — how it works, what the tricky parts are, what you'd do differently. Treat it like onboarding a new engineer. At the end, ask Claude to write ADRs based on what you described. You'll be surprised how much comes out of a 30-minute conversation that you never thought to write down.

**From PRs and tickets** If your team has a habit of explaining decisions in PR descriptions or ticket comments, that's a surprisingly rich source. Grep for the why — merge commits, long PR discussions, tickets with acceptance criteria that hint at constraints.

None of these sources are perfect. The point is to triangulate: use multiple sources, let Claude synthesize, and then review and correct. The first output won't be accurate. That's fine.

## The first sessions will feel thin

This is worth saying clearly: the first few sessions after you start bootstrapping will feel less productive than you expect.

That's not the system failing. That's what it feels like to work with incomplete context. Claude will make suggestions that don't quite fit, miss constraints you know exist, or propose things you've already ruled out. It's frustrating.

Push through it. Every time Claude gets something wrong, that's information — there's a decision that isn't captured yet. Write it down. Add it to an ADR. The next session will be a little better. The one after that will be better still.

The feedback loop from the first post applies here too, just more visibly. When context is thin, the gaps are obvious. That's actually useful — it forces the captures you'd otherwise skip because "everyone knows that."

## A word on immutability

ADRs are normally immutable. The idea is that if you want to change a decision, you don't edit the old ADR — you write a new one that supersedes it. That creates a paper trail: you can see what was decided, when, and why it changed.

It's a good rule. For a forward-operating team, it matters.

But when you're backwards-constructing ADRs from an existing system, applying that rule strictly gets in the way. You'll write an ADR, then realize you got the reasoning slightly wrong, then feel like you need to create a superseding ADR for a decision that wasn't really changed — just better understood.

My suggestion: relax the rule until you have a stable set. Let yourself edit, revise, and correct while you're in bootstrap mode. Treat the ADRs as living documents until they settle. Once you feel like the captured decisions accurately reflect how the system actually works and why, that's when you start applying immutability going forward.

The spirit of the rule is to preserve decision history. You can't preserve history you never captured in the first place. Get it captured first, then go immutable.

## Where this leaves you

There's no clean starting point with a legacy system. You start messy, you iterate, and at some point you cross a threshold where the context is good enough to be genuinely useful.

Once you're there — once Claude has a working mental model of why the system is the way it is — the workflow from the previous posts applies in full. New decisions get made with that context loaded. New ADRs get written from those sessions. The model gets better over time.

The bootstrapping phase is just the cost of entry for systems that weren't built with this in mind from the start. It's worth paying.
