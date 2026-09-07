---
title: "Context is a choice"
subtitle: "Why curating Claude's context matters more than expanding it"
date: "Apr 1, 2026"
---

I keep a repo of markdown files that I use as context for Claude. Notes about how I write, project details, decisions I've made and why, things I want Claude to know about me so I don't have to re-explain them every session. It works well. Until it doesn't. The problem showed up when I started adding job-hunting material - cover letter drafts, notes about specific companies, salary expectations, the whole thing. Suddenly that information was leaking into unrelated sessions. I'd be thinking through a technical essay and Claude would have all that hiring context loaded for no reason. It felt noisy. And a little weird. What I wanted was simple: one repo, all my notes, but a way to tell Claude which context to use for a given session. Job hunting context when I'm writing applications. Essay-thinking context when I'm drafting technical pieces. Writing preferences always.

## How Claude Code loads context

Claude Code looks for a `CLAUDE.md` file at the root of your repo and loads it automatically. You can also pass a `--system-prompt-file` flag at invocation time, which lets you supply an arbitrary file as the system prompt for that session. That second option is the lever I wanted. It means I can generate a context file on the fly, pass it in, and Claude gets exactly what I decided - nothing more.

## The system

Each markdown file in my contexts/ folder has a small frontmatter block:

```
---
context: job-hunting
title: Active Applications
---
```

Some files are tagged global - writing preferences, general notes about how I think. Those always get included. Everything else is opt-in by tag. A small TypeScript script, ctx, reads those files, filters by the requested tag, and writes a single .claude-context.md file:

```
ctx job-hunting      # global + job-hunting files
ctx essay-thinking   # global + essay-thinking files
ctx                  # global only
```

Then I run Claude with that file as the system prompt:

```
claude --system-prompt-file .claude-context.md
```

I have a shell alias that chains both steps so it's just `ctx job-hunting` and Claude opens with the right context loaded. The generated file is gitignored. It's ephemeral by design - the source markdown files are the truth, the generated file is just today's lens into them.

## The virtuous cycle

But here's the thing that makes this system actually grow: when I finish a writing session and realize Claude was missing something - context that would've made the conversation better - I ask Claude to rewrite my context files to include it. That gap becomes a patch. Over time, my context repo gets richer and more useful without me having to manually maintain it. The system learns from what it was missing. It's a small feedback loop, but it compounds. Each session that reveals a gap also enriches the next one.

## The tradeoff worth knowing

Everything in a system prompt gets counted as tokens on every message in the session. That's different from how CLAUDE.md works, where Claude can be more selective. So if your context files grow large, you'll feel it in cost and (marginally) in speed. The script prints a rough token estimate when it runs, which is a good habit to build. My current contexts are small enough that it doesn't matter. But it's the kind of thing that quietly gets expensive if you stop paying attention.

## The tool that makes this frictionless

To be clear: the system doesn't depend on any particular tool. You could do this manually - write a merged markdown file by hand, paste the right pieces together, pass it to Claude. The concept works regardless. What a tool buys you is removing the friction between "I want job-hunting context" and Claude actually having it. I built a small CLI for exactly this: ctx. You install it once, tag your markdown files with YAML frontmatter, and then it's:

```
npx @nbaglivo/ctx --tag job-hunting --output .claude-context.md
```

It scans your notes directory, matches everything tagged job-hunting, merges them into a single file, and tells you how much it wrote. Then you pass that file to Claude as the system prompt. That's the whole thing. The reason I bothered packaging it is that the manual version has just enough friction to make you skip it. And skipping it means Claude gets the wrong context, or too much context, or you spend the first five minutes of a session re-explaining things you've already written down. The tool makes the right behavior the easy behavior.

## Why this feels right

There's something clarifying about making context explicit and intentional. Before this, my context repo was growing into a single blob of everything-about-me. Now it has structure that reflects how I actually think about different modes of work. Tagging a file job-hunting isn't just a filter instruction - it's an acknowledgment that this information has a scope. It's relevant here, not everywhere. That's just good information hygiene, and it's nice when the tooling reflects it. The whole thing is maybe 80 lines of TypeScript and a naming convention. Most good systems are.
