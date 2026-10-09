---
title: "AI anxiety is a systems problem, not a people problem"
subtitle: "The role that turns it into organizational capability"
date: "Apr 10, 2026"
pageTitle: "AI anxiety is a systems problem"
---

A colleague told me recently he was experiencing what he called AI job anxiety.

He's trying to use AI. He's experimenting with different things. But he also has a job to do, with real deliverables and real expectations. And right now, AI is actually slowing him down — because he's still in the learning curve, still figuring out what works, and that takes time he doesn't really have.

On top of that, the company is pushing for AI adoption. Paying for tokens, encouraging usage, signaling that it matters. So there's pressure from that direction too. And when he looks around, he sees colleagues trying new tools, sharing discoveries, and experimenting with things he hasn't even heard of. This makes him feel like he should be doing the same. But he doesn't have the bandwidth. And honestly, he's not particularly excited about AI as a topic — it's not his thing. It doesn't light him up the way it does for some people.

And then there's the world. Job postings that list AI fluency as a requirement for roles that had nothing to do with AI a year ago. Products wrapping everything in AI features. Social media where if you're not actively experimenting with the latest model or tool, you're already behind. The message is constant and hard to ignore: get on board or become irrelevant, a dinosaur... we know what happened to the dinosaurs.

So you have someone who feels behind, who's losing time while trying to save it, who's pushed from every direction to experiment but has no space to do it, and who carries none of the intrinsic motivation that would make any of this feel worthwhile. That's the anxiety. It makes sense.

And to be clear — this person is capable. He's not checked out, not avoiding it, not failing to try. It's just that AI is a genuinely new field that moves extremely fast. Things that were true six months ago aren't true anymore, you know: "MCPs are great. MCPs are dead. MCPs are great again". New tools, new models, new patterns, competing opinions. Keeping up with all of that is itself a job. Doing it while also doing your actual job is a lot to ask of anyone.

The anxiety isn't a character flaw. It's a reasonable response to an unreasonable amount of change.

Now multiply that across a team.

Everyone is going through some version of the same thing — at different speeds, with different levels of enthusiasm, in different directions. Someone finds a useful technique and mentions it in a Slack thread. A few people see it. Most don't. Nothing gets written down in any durable way. The next person discovers the same thing two weeks later and the cycle repeats.

The organization is paying the learning cost over and over again — once per person — and capturing almost none of it. The knowledge exists, scattered across individuals and conversations and half-remembered experiments. But it doesn't compound. It just evaporates.

That's not a people problem. It's a systems problem. And it's solvable.

What my colleague actually needs isn't more time to experiment. It's someone who has already done the experimenting for him.

Someone who has made it their job to stay on top of the landscape — not because they have to squeeze it in between other responsibilities, but because that is the responsibility. Someone who filters the noise, forms opinions, figures out what's worth adopting and what can wait, and then brings that back to the team in a usable form. Not a newsletter. Not a talk. Something actionable — a pattern, a system, a tool, a guideline.

With that person in place, the dynamic changes completely. The capable engineer who was drowning in anxiety doesn't need to figure it all out himself anymore. He can trust that someone is handling that layer. He stays focused on delivering. He picks up the relevant pieces when they're handed to him, already digested. His productivity goes up. His anxiety goes down. And the organization captures the learning once, not twelve times.

That's the role I've been thinking about. I don't have a clean name for it yet — but I know what it does.

## Staying ahead so the team doesn't have to

The first direction is about working practice. How does the team use AI well, day to day?

This sounds simple but it isn't. Using AI effectively isn't just a matter of having access to a model. It's knowing how to give it the right context. Knowing when to trust the output and when to push back. Knowing which tools are worth the switching cost and which ones aren't ready yet. That knowledge takes time to develop — time most people don't have.

Someone in this role develops it deliberately. They experiment, they form opinions, they stay current not as a hobby but as the job. And crucially, when they find something that works, they don't just use it themselves. They turn it into something the whole team can use. A shared system. A guideline. A small tool. Something that makes the right behavior the easy behavior, for everyone.

That last part matters. Insight that stays in one person's head doesn't scale. The output of this work should be transferable — something that outlasts any single session or conversation.

## Teaching AI as a building block

The second direction is different. It's less about how engineers work and more about what they build.

Product engineers need enough understanding of AI to use it in features and products. That means knowing how to connect to a model, how to structure a prompt for reliability, how to think about testing something that's probabilistic. When to reach for AI as part of a solution and when it's the wrong tool entirely. What the real trade-offs are, not the marketing version.

Someone in this role develops guidelines, runs sessions, and sometimes sits directly inside a project as the AI expert — not to own the implementation, but to make sure the team is building on solid ground. The goal isn't to become the person who does all the AI work. It's to make everyone else capable of doing it well.

## What this looks like in practice

The ctx series I've been writing is a small but good concrete example of both pillars at work. ctx is a small CLI tool for managing context in Claude sessions — the idea being that instead of Claude receiving everything you've ever written down, you curate exactly what's relevant to the session at hand, using tagged markdown files that you compose on the fly.

It started with a real problem: Claude was getting the wrong context, or too much of it. The knowledge existed — in markdown files, in ADRs, in notes — but there was no good system for deciding what to surface when.

Working through that problem produced two things. A system — tagged markdown files, a generation step, a way of thinking about context as something intentional and composable. And a tool — a small CLI that makes the system frictionless enough to actually use. Something any engineer on the team can pick up without having to reconstruct the thinking behind it.

That's the shape of this work. Someone thought carefully about how to get more out of AI, built something that encodes that thinking, and made it available to everyone. The team gets the benefit without each person having to rediscover it independently.

I still don't have a perfect name for this.

Most organizations hiring for AI right now are hiring to build AI into their products — engineers who can work with models, build pipelines, ship AI-powered features. That's legitimate and necessary. But it's a different problem. The internal capability question — how does the whole team get better at using AI — often goes completely unaddressed.

Sometimes someone champions it informally and something useful emerges. But that's fragile. It depends on the right person happening to be there, having the space, and caring enough to do it on top of everything else. That's not a strategy. It's luck. And it produces exactly the kind of scattered, non-compounding knowledge that got us to the Slack thread problem in the first place.

This should be something organizations make happen deliberately, through a role that owns it — not something they hope will organically emerge.

The closest analogy I keep coming back to is platform engineering. The mindset is the same: don't make every team solve the same problem independently. Build the internal capability that makes everyone faster, more reliable, and less likely to reinvent the wheel.

So maybe that's what it ends up being called. AI Platform Engineer. It's not perfect. But it points in the right direction.

The case for this role isn't only about efficiency, though that case is real. It's also about the people inside the organization. The anxiety my colleague described is widespread. Nobody should feel like a dinosaur for not having kept up with a field that moves this fast while also doing a full-time job. That's not a reasonable standard to hold people to.

The role exists to make the situation more humane — to absorb a burden that's currently distributed across everyone, and concentrate it somewhere it can actually be handled well. That's better for the organization. But it's also just better for the people in it.

There's a talent angle here too. Engineers who are excellent at what they do — and who care about staying sharp — are thinking about this. They want to grow. They want to work somewhere that takes the craft seriously, including what AI means for it. A company that has figured out this function is signaling something: we're not leaving you to drown in the noise alone — we're investing in making you better. That's genuinely attractive. Not just for retention, but for the kind of people you want to hire in the first place. The best engineers have options. They'll choose the environment where they can do their best work — and where staying relevant doesn't feel like a second job.
