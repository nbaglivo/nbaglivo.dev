---
title: "Anchored Agentic Development"
subtitle: "Against entropy"
date: "Apr 21, 2026"
---

Agents and developers are building from your codebase continuously — triggered by a Linear ticket, a Slack message, an incident, a developer opening their editor. Leave them to do their thing without direction and you get entropy: every agent making its own decisions, patterns diverging, the system fragmenting a little more with every build. It's not anyone's fault. It's just what happens when there's no shared context to build from.

Apply this process and you get the opposite — neg-entropy. The system becomes more coherent over time, not less. Every decision captured adds to the foundation that keeps the next build aligned.

AAD is a framework for making sure the right context exists and is available. The human's job is to architect: make decisions, capture them as ADRs, build up a record of direction over time — with AI as a thinking partner. The result is a body of context that any agent, any developer, any automated workflow can draw from at any moment. The architecture stays coherent not because someone is reviewing everything, but because the direction was there before the work started.

Set the anchor. Then let the work happen.

The idea behind this framework started taking shape in a post about using ADRs as context for Claude — [Giving Claude architectural memory](giving-claude-architectural-memory.html). That post is where the core insight first got written down. This framework is what grew from it.

## Part 1: The anchor

The anchor is what prevents entropy. Without it, agents build freely — each making their own decisions, each drifting slightly further from the intended architecture. The drift is quiet at first. Then it compounds.

The anchor is the ADR history: a record of architectural decisions that anything building from the system can orient around. Setting it is the human's job — not because AI can't write decisions, but because the anchor only holds if someone owns it. That ownership is what makes it a real constraint rather than a suggestion.

### The workflow

1. Make the decision — with AI as a thinking partner.
2. Validate the draft against prior ADRs — catch conflicts, gaps, and superseded decisions before anyone else sees it.
3. Push a PR — get it peer reviewed by your team.
4. Merge — the decision is made. It is now available to your developers and agents.
5. Optionally, if there's implementation work to do, start your agentic development — local or cloud.

### Making the decision

An ADR records a single architectural decision: the context that made it necessary, what was decided, and what changes as a result.

**Context** — why this decision needed to be made. What was missing or underdetermined. If this supersedes or extends a prior ADR, say so here explicitly.

**Decision** — what was decided, with the rationale close to the decision itself. Don't separate what from why.

**Consequences** — what changes now. What needs to be built. What constraints are introduced.

What an ADR is not:

- Not a ticket. ADRs record decisions, not work items.
- Not documentation of the current state of the system. If the code diverges from a decided ADR, the ADR is correct — the implementation is the problem.
- Not a living document once decided. If the decision changes, a new ADR supersedes it. The history stays intact.

#### The template

→ [github.com/nbaglivo/anchored-agentic-development/tree/main/templates](https://github.com/nbaglivo/anchored-agentic-development/tree/main/templates)

#### Where to store them

`docs/adrs/` in your repository. Named sequentially: `ADR-NNNN-short-description.md`.

Sequential naming gives you a rough timeline and makes cross-referencing unambiguous. "See ADR-0003" is a complete reference.

**Git is the infrastructure.** ADRs are committed to the repository. The immutability of a decided ADR is preserved through Git history: you can always see what was decided, when, and what changed.
Tags in the frontmatter let you slice context by domain:

```yaml
tags: [adr, auth, database]
```

The `adr` tag is what tooling uses to find ADRs. Domain tags let you load only the relevant slice for a given session.

#### Writing it

Start with the problem, not the solution. What gap or situation made this decision necessary? If you can't explain the context, the decision will look arbitrary, to a future reader and to an agent building from the system.

Fill in "What was ruled out" even if the answer felt obvious. "We considered X but ruled it out because Y" is information that prevents the same conversation from happening again.

Keep the rationale close. Put the why immediately after the what. The reader — human or AI — should never have to scroll to understand why something was decided.

Consequences are not optional. What needs to change? What's now true that wasn't before? A decision without consequences documented is half an ADR.

#### AI as a thinking partner

The decision is yours — AI helps you think it through and write it down.

Load your prior ADRs as context before the session. Describe the problem: the gap, the constraints, what you've considered. Use AI to pressure-test your reasoning before you commit. Once you've landed on the decision, ask it to write the ADR. With prior ADRs in context, it already has the format and the system's history. The output is usually close to final.

### Reviewing

Two checks happen before the ADR is decided.

**AI review against prior ADRs.** With prior ADRs loaded as context, ask AI to validate the draft:

- Is anything missing — rationale, consequences, alternatives that should be named?
- Does this supersede something? If it does, that has to be named explicitly in the Context section.
- Does this conflict with anything? Every conflict must be resolved in the ADR itself — not in a comment or a conversation.

**Peer review.** Push the draft as a PR. Use the review process you already have.

### Merging makes it available

When the PR merges, the decision is made. The ADR joins the history. The anchor is updated.

From this moment the context is live — available to every developer, every agent, every automated workflow that builds from the system. Not because anyone loaded it manually. Because it exists, in the repository, part of the record.

How you make that context reachable to agents at runtime is a tooling question — covered in the Tooling section.

## Part 2: The context in use

The context built in Part 1 doesn't sit idle. Work is happening continuously — a developer building locally, an agent picking up a Linear ticket, another responding to an incident, a PM triggering something from Slack. All of it is building against your system.

What matters is that when this work happens, the architectural context is available. Not in response to a specific ADR being written. Not only when a human manually loads it. Just available — for any work, at any moment, triggered by anything.

The "write an ADR then immediately implement it" scenario is one case, and it's a small one. The more important case is the ambient one: work is always happening from many directions, and the context is what keeps all of it coherent.

### Making the context accessible

How you make the context available depends on the kind of work happening.

For a manual session — a developer opening a Claude session to build something — load the ADR history before you start:

```bash
npx @nbaglivo/ctx --tags adr --output .claude-context.md
claude --system-prompt-file .claude-context.md
```

For agents operating at runtime — responding to events, picking up tickets, executing autonomously — the context needs to be queryable without anyone manually loading files. Tools that expose your ADR history to agents at runtime are crucial here: they allow any agent, at any moment, to access the architectural context before acting. How you provide that depends on your setup. What matters is that the context is reachable — not locked in a file someone has to remember to load.

### Plan, then build

Before any code is written, a plan should exist. That plan should be checked against the architectural context.

This doesn't have to be a human reviewing a plan. An agent can generate a plan. Another agent can review it against the ADRs. A human can review it. All of these are valid — and in an agentic workflow, they can all happen in sequence. What matters is that the check happens before execution, not after.

The question at the plan stage is always the same: does this align with the decisions that are already in place? The context is what makes that question answerable.

If the plan diverges from the ADRs, correct it here. A conversation costs less — in time and in tokens. Undoing code costs both.

### Your full toolkit still applies

The ADR context tells agents where the code lives architecturally — the decisions, the constraints, the reasoning. It doesn't replace the rest of your toolkit. Coding standards, skills, rules, MCPs — all of that still applies alongside it.

Your standards tell agents *how* to write code. The ADRs tell agents *what* they're building and *why*. Both need to be present. The ADRs are the part that's usually missing.

## Part 3: The loop over time

1. **Decide** — write and decide the ADR
2. **Context available** — to any work, any agent, any trigger
3. **Plan** — approach reviewed against decisions before execution, by a human or an agent
4. **Build** — against direction, not inference

Each ADR makes the next session smarter. Each build that stays on track is one less drift to clean up. The system compounds — and that compounding is neg-entropy in action. You're not just preventing disorder; you're actively accumulating structure. The architecture becomes more coherent over time, not despite continuous work happening, but through it.

The decisions are recorded and available. Every new decision is checked against prior ones at write time. Every implementation is checked against the record before build time. The work reinforces the foundation instead of eroding it.

**Context engineering matters more as the system grows.** A handful of ADRs fit comfortably in a context window and the process works cleanly. As the system grows and decisions accumulate, loading everything starts to hurt — more tokens, less signal, worse results. Left unmanaged, the context itself becomes entropic: too much noise, too little signal, and the coherence you built up in the ADR history stops translating into coherent output. The same force you're trying to counter in the codebase shows up in the context.

That's a context engineering problem, not a process problem. The framework still holds. The tooling around it needs to evolve. Domain tags help — load only the ADRs relevant to what you're building right now. But at a certain scale even that isn't enough: you may need semantic search over your ADR history, retrieval-based approaches that surface the most relevant decisions given the task, or purpose-built agents that do the selection for you. The right solution depends on the size and shape of your system.

Tools like ctx are a good starting point. They work well at smaller scale. What replaces or extends them at larger scale is an open question — one worth solving when you hit the ceiling, not before.

**You can automate as much of this as you want.** Conflict checking between a new ADR and prior ones is a well-defined task — you can build an agent for it, a CI check, whatever fits your setup. The plan review step can have guardrails. Parts of the ADR-writing process can be scripted.

Automate what makes sense. The thing that doesn't get automated is direction. You know what the direction is because you authored it. That's the point of the framework — not to keep humans in every loop, but to keep humans in the right loop. The one that happens before everything else.

The habit is the point. Direction before delegation, every time. The cost is low — one ADR per decision. The payoff is that AI always has something real to work from.

## Tooling

I'm actively building tools to make this process faster and more effective. These are what I have so far. As the process gets more adoption, better and different tools will emerge — from me and from others. If you build something that fits here, or have ideas worth discussing, reach out.

**ctx** — assembles tagged markdown files into a single context file. Pull all ADRs for a service or filter by domain. A good starting point for a smaller ADR history.

→ [ctx.nbaglivo.dev](https://ctx.nbaglivo.dev)

**claude-mem** — a good alternative to ctx when you want more automation in your local workflow, particularly when writing or reviewing ADRs. Less manual setup, more out of the way.

→ [github.com/thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)

**The adr skill** — a Claude Code skill that handles ADR creation: enforces structure, checks for conflicts against existing ADRs, generates the file. Use it from Claude Code with `/adr`.

→ [github.com/nbaglivo/anchored-agentic-development/tree/main/skills/adr](https://github.com/nbaglivo/anchored-agentic-development/tree/main/skills/adr)

**The review-adr skill** — validates a draft ADR against your existing history. Checks for missing rationale, conflicts, superseded decisions, and gaps before you push for peer review. Use it from Claude Code with `/review-adr`.

→ [github.com/nbaglivo/anchored-agentic-development/tree/main/skills/review-adr](https://github.com/nbaglivo/anchored-agentic-development/tree/main/skills/review-adr)

**Unfold** — automatically monitors ADR changes in GitHub and uses LLMs to derive a living architecture model from them. When an ADR is merged, Unfold updates the model and surfaces it as context for agents, engineers, and PMs alike. Agents plan with full architectural awareness — drift gets caught before a line is written. Engineers learn the system by querying it. PMs can ask "how many teams does this feature touch?" and get grounded answers for risk analysis and planning. Architecture stops being a document nobody reads and becomes context everyone can use.

→ Coming soon.

## Starting with no ADRs

Most systems have history that was never written down. You're not starting from zero — the knowledge exists in the code, in a half-maintained wiki, in your own memory. It just needs surfacing.

The bootstrapping process is covered in full [here](bootstrapping-adrs-when-you-have-none.html). The short version: use AI to extract decisions from the codebase, from documentation, and from your own head. Treat the first ADRs as drafts. Relax the immutability rule until they stabilize. Once the history is accurate, apply the full process going forward.

## A note on tooling and AI providers

This framework is described using Claude and Claude Code because that's what I use. The process works with any capable AI — the tools that load context may need to be adapted, but the loop is the same. Write the decision. Load it as context. Plan before you build.

Reach out at [hi@nbaglivo.dev](mailto:hi@nbaglivo.dev).
