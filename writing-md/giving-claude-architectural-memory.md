---
title: "Giving Claude architectural memory"
subtitle: "The why, not just the what"
date: "Apr 13, 2026"
---

In the [previous post](context-is-a-choice.md) I described a system for feeding Claude curated context - tagged markdown files loaded via `--system-prompt-file`. That works well for personal context: how I write, what I'm applying for, what I care about in a given session. But there's another application I find even more useful: giving Claude deep, accurate knowledge of a specific codebase or service, without ever pointing it at source code.

The context source here is ADRs - Architecture Decision Records. I'll use [ctx](https://ctx.nbaglivo.dev) to load them throughout this post, but that's just convenience. Any method works. How you get the ADRs in front of Claude is up to you.

## What ADRs are and why they're the right unit

An ADR is a short document that captures a single architectural decision: what was decided, why, and what alternatives were considered. They're not documentation of how the system works today - they're documentation of why it works the way it does. That distinction matters a lot when you're using them as Claude's context. Source code tells Claude what is happening. ADRs tell Claude why. And when you're asking Claude to help you make a new decision, or implement something consistent with past ones, the why is almost always what it needs. "We use Neon instead of Supabase because of IPv4 connectivity issues on Vercel's serverless runtime" is the kind of sentence that changes the shape of every suggestion Claude makes about the database layer. You can't get that from reading the schema.

There's another dimension to this that matters in practice: ADRs can reflect decisions that haven't been fully implemented yet. Maybe you decided on an approach but only partially built it. Maybe you made a deliberate tradeoff - knowing something wasn't ideal - and documented it, but the code doesn't reflect the intent yet. Maybe life just got in the way. In those cases, the code is a misleading source of truth. It shows you where things are, not where they're going. An ADR that says "we decided to move away from X, migration is ongoing" is more useful to Claude than reading code that still has X in it. Claude won't suggest doubling down on something you've already decided to move away from. It won't treat a temporary workaround as a pattern worth following. The decision document is the intention; the code is just the current state of execution.

ADRs are also naturally scoped and self-contained. Each one covers exactly one decision. That makes them ideal as ctx-tagged files - you can compose a precise context set by pulling just the decisions relevant to the task at hand.

## The tagging structure

Each ADR lives as a markdown file with frontmatter:

```
---
tags: [cvmd, auth, database]
title: "ADR-0002: PostgreSQL on Neon"
---
```

I tag by service and by domain. cvmd is the service tag - it pulls everything about the system. Domain tags like auth, database, or deployment let me narrow further when I only need a slice. In practice I usually start broad:

```
npx @nbaglivo/ctx --tags cvmd --output .claude-context.md
claude --system-prompt-file .claude-context.md
```

That gives Claude the full architectural picture of the service before I type anything. If the session is tightly scoped - say, only touching auth - I'll filter further:

```
npx @nbaglivo/ctx --tags cvmd --tag auth --output .claude-context.md
```

## What Claude can do with this

I ran a session with only three ADRs loaded for cvmd.sh - nothing else, no source code, no schema, no running system - and asked detailed questions about the service. It answered accurately. Not approximately, not plausibly - accurately. It knew that schema migrations live under supabase/migrations/ even though Supabase is no longer the database host, because the ADR documented that legacy detail explicitly. It knew the exact shape of the auth migration: what was replaced, what the before/after looked like, and the key design choice that login and GitHub access are separate flows. That's not Claude being clever. That's Claude having good context. The practical implication is that you can have a conversation with Claude about a service as if you were pairing with someone who had read every decision document carefully. You can ask "what would break if we changed X" or "how does Y work" and get answers grounded in the actual reasoning behind the system, not generic suggestions.

## Authoring new ADRs through the same session

The other half of this - and where it gets genuinely useful - is using the same session to write new ADRs. When I'm working through a new decision, I'll often think it through with Claude first. Claude already has all the prior decisions loaded, so its suggestions are constrained by the system's actual history. It knows what database we use, why we chose it, what we migrated away from. When I ask "how should we handle X", the answer comes from that context.

Once I've landed on a decision with Claude´s assistance, I ask Claude to write the ADR. It already has the right format from the existing ones in context, and it already understands the decision we just made. The output is usually close to publishable. Then that new ADR gets tagged and committed. The next session is smarter than this one.

Once the ADR exists, it becomes a clear, approved actionable item for AI to build against. You've already made the decision - Claude's job is now implementation, not invention. There will always be implementation details that emerge during the build, but those are details, not direction. The architecture won't drift because the direction is written down and Claude is working from it.

The place to catch any drift is as early as possible. You can catch it during planning - before a single line is written - by asking Claude to walk through its approach against the ADR. Or you can catch it during review, but by then a considerable amount of tokens have already been spent going the wrong way, and you're making corrections instead of preventing them. The whole point of this process is to shift that left: agree on the decision first, document it, then build. The ADR is the checkpoint that happens before the build starts.

## The prompting pattern

A few things I've found that make this work better: Be explicit about what you want Claude to do with the context. "You have the architectural context for this service. I want to implement X - tell me what to build and flag anything that conflicts with existing decisions." That framing activates the context differently than just describing the task.

Ask Claude to surface conflicts. "Does this decision contradict anything in the existing ADRs?" is a genuinely useful question when Claude has all of them loaded. It will catch things you won't.

Use the session to think, then commit the output. The session is ephemeral. The ADR is permanent. The habit of ending a session by asking Claude to write the decision document means that nothing gets lost - the thinking becomes a record.

## Why pairing a tool like ctx and ADRs works

ctx is really just a way of choosing what gets loaded. ADRs are a way of making architectural knowledge portable and composable. Together they mean Claude can show up to a session with a specific, accurate mental model of your system - not the whole codebase, not a vague summary, but the decisions that shaped it. That's a different kind of AI assistance than generating boilerplate or explaining syntax. It's closer to having a collaborator who has read everything you've ever decided about the system and can reason from it.

## This wasn't planned

I didn't set out to write a series. The first post was just me documenting a system I'd built for myself. Then I realized the ADR use case was a different enough application that it deserved its own post. And now here we are.

What's becoming clear is that there's a coherent thread running through all of this: using structured, curated text to give Claude an accurate model of something - your writing style, your job search, your service's architecture. The tool is the same. The context sources are different.

Next, I want to explore what happens when you let that architecture breathe - when you take the decisions that have accumulated in your ADRs and use AI to help visualize the system that emerges from them. How do you see the whole when it's been built decision by decision? That's what the next post will get into.

And further down the line, I want to talk about human participation in this process - how this stops being a solo workflow and becomes a team one. Everything I've described so far is one person and one AI. But ADRs were always meant to be a team artifact, and there's an interesting question about how the context, the decisions, and the AI assistance scale when more people are involved. That's a later chapter.
