---
title: "Complexity doesn't spike. It drifts."
date: "Apr 22, 2026"
---

Keeping complexity low was always a goal worth fighting for. Every team I've been part of that took it seriously ended up in a better place. Every team that didn't eventually paid for it.

In the age of agentic development, this matters more than it ever did. The rate at which we can generate code has gone up dramatically. The rate at which complexity can accumulate has gone up with it.

## The signal most people miss

If your developers look at a task and genuinely don't know what it's going to take — not roughly, not approximately, but at all — that's a strong signal of a complex system.

Not "this is tricky." Not "I'll need to think about it." The more concerning version: there are too many unknown unknowns to even sketch the shape of the work.

The temptation in that situation is to say "I'll figure it out as I go." That's reasonable for learning. It's not reasonable for complexity management, because figuring it out as you go is exactly how you end up adding more of it. You make choices under uncertainty, at speed, without the context to see the tradeoffs. And the system gets a little worse with each one.

## What this means before you hand anything to an agent

A developer handing work to an AI without understanding what the change entails is not doing themselves a favor. They're setting themselves up to review code they can't properly evaluate.

Before delegating a task — to an agent or anyone else — the person responsible for that change should be able to:

- Name the parts of the system the change touches
- Articulate the main tradeoffs in the approach
- Identify the places where complexity could creep in

That doesn't mean having the full solution figured out. It means having enough orientation to make conscious choices when reviewing a plan, rather than just accepting the first thing that compiles and seems to work.

This step isn't optional. It's what makes the rest of the workflow useful.

## Agents amplify what's already there

An agent working on a complex system doesn't simplify it. By default, it makes it more complex — because it reads the patterns in the existing code and extends them. It doesn't question whether the pattern should exist. It just follows it.

If the system has accumulated bad abstractions, inconsistent naming, unclear boundaries, unclear responsibilities — the agent will replicate all of that and take it further. Faster than a human would. With more surface area.

This is the part that doesn't get talked about enough. The optimism around AI-assisted development assumes we're building on a solid foundation. A lot of systems aren't. And "move faster" applied to a shaky foundation is a liability, not a feature.

## Why it feels fine until it doesn't

Complexity is rarely caused by one catastrophic mistake. It's the sum of many small ones — each defensible on its own, none catastrophic in isolation.

A slightly unclear abstraction. A shortcut that seemed temporary. A boundary that wasn't quite right but close enough. A tradeoff that made sense at the time and nobody ever revisited. Each one is forgettable. Together, they're the reason a simple feature takes three weeks and nobody knows why.

The dangerous thing is how reasonable it looks, one decision at a time. "This is a small thing" is almost always true. "This will compound" is almost always also true — and much less visible.

Now imagine this with no human in the loop. Agents running end-to-end, generating code at scale, each output building on the previous one. Every small complexity choice amplified across dozens of cycles before anyone reviews the result. That's not a hypothetical. That's where things are heading.

## Zero tolerance has to be systematic

You can't rely on individual developers to catch this consistently. Not because they're careless, but because it's genuinely hard to notice in the moment, and there's always pressure to ship. Expecting people to consistently hold the line through goodwill alone isn't a strategy — it's wishful thinking.

What actually works is encoding the standard into the process. Guidelines for what "done" means that include complexity considerations. Skills and tools that make it easy to check whether a change is making things worse. Review steps that ask the right questions by default, not just when someone remembers to. The anchor needs to exist before the work starts, not get applied after the fact.

The goal isn't to create a bottleneck. The goal is to make zero tolerance automatic — so that the speed you're gaining with AI isn't being spent on debt you'll have to pay back at a much higher rate later.

Humans in the loop won't scale to match the volume of code we're now capable of generating. That's the right problem to solve for — not "how do we review more" but "how do we build systems that stay reviewable."

## There's no single fix

There's no one tool or practice that solves this. Sustainable agentic development is a stack of guardrails, not a single switch.

You'll need review processes — not for everything, but for the things that matter. You'll need humans in the loop at the right moments, not because you don't trust the agents, but because someone needs to know what's actually going on. You'll need observability so that when something drifts, you can see it. You'll need synthetic testing and regular testing, because at the speed code is being generated you can't catch regressions manually. All of it.

But these guardrails operate at different stages, and not all stages are equal. Some catch problems after they've already been built. Others prevent them from being built in the first place.

Anchored Agentic Development is one framework I've been developing that operates early — before a line of code is written. The idea is to capture architectural decisions as ADRs and make them available as context to every agent and developer before work starts. Before execution, a plan exists and gets checked against the architectural record. Agents build from direction you set, not from whatever they can infer from the existing codebase.

It doesn't eliminate the need for the other guardrails. But because it operates at the start of the loop — at the planning stage, before the build — it prevents drift that everything else would only catch after the fact. That's what makes it worth putting in place early: not that it's sufficient, but that it's upstream of so many other problems.

When the complexity eventually wins — and it will, in systems where nobody took this seriously — people will blame the AI. They'll say the tools failed to deliver on their promise. That the technology wasn't ready.

I don't think that's where the failure will be.

The AI will have done exactly what it was asked to do. It will have generated code, followed patterns, extended the system in the direction it was already going. The failure will be in how we used it — what we asked it to build on, what we skipped, what we assumed it would handle.

That's our responsibility. Not Anthropic's. Not OpenAI's. Ours.

It's also completely within our control to get right.
