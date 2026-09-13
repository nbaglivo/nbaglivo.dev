---
title: "Anchored Agentic Development, Part 2"
subtitle: "The payoff"
date: "Apr 21, 2026"
---

[Part 1](anchored-agentic-development.html) covers the mechanism: set the anchor with ADRs, keep the context available, check plans against it before anyone builds. This part is about what that gets you when you actually run it — the loop it forms, and why it compounds instead of just holding steady.

## The loop over time

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
