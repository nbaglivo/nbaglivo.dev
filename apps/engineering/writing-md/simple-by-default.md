---
title: "Principle: Simple by default"
date: "Oct 18, 2026"
---

Every architectural decision is a trade-off. The problem isn't that we make them — it's that we often make them before we need to, or without being clear about what we're actually optimizing for.

I want to use a concrete example to work through this. Not to arrive at a definitive answer, but to show how thinking about trade-offs changes the way you evaluate options.

---

# The Price Service

The service answers one question: *how much does a customer pay for a given article?*

The resolution logic has two levels:

1. Check if the customer has a price list explicitly assigned to them. If yes, look up the article price there. Done.
2. If not, find the country price list for the customer's country and look up the price there.

Step one is simple. There's a table that maps customers to price lists. You query it, you get a result or you don't.

Step two is where it gets interesting — because to resolve the country price list, you first need to know what country the customer belongs to. That's the decision this post is actually about.

---

## The specific problem: how do you get the customer's country?

The customer's country isn't stored in the pricing domain. It lives in the organization service — the service responsible for customer data. So when the price service needs to resolve a country-based price, it needs to get that piece of information from somewhere.

Three options.

---

### Option 1: Look it up on the fly

Every time a request comes in and no direct price list is found, call the organization service to get the customer's country. Use that country to find the country price list. Return the price.

This is the most straightforward thing you can do. There's no data to maintain, no sync process to operate, no copy to go stale. The price service just asks the organization service what it needs, when it needs it.

**The cost:** a synchronous dependency at request time. If the organization service is slow, price resolution is slow. If it's down, price resolution fails. You've coupled the availability of the price service to the availability of another service — and that's a real operational risk, not a theoretical one.

For some systems, this trade-off is fine. The organization service is reliable, latency is acceptable, and the simplicity is worth it. For others, this coupling is exactly the kind of fragility that causes incidents.

**Reach for this when:** the organization service is stable and fast, the coupling cost is acceptable, and you don't yet have evidence that it's causing problems.

---

### Option 2: Keep a local copy

Instead of calling the organization service at request time, the price service maintains its own copy of the data it needs: a table that maps customers to their country.

Now the lookup stays inside the price service. No external call during price resolution.

But you've introduced a new problem: keeping that copy in sync. Two approaches:

**Event-driven:** the organization service publishes events when customer data changes. The price service listens and updates its copy. This is reactive and relatively fast — changes propagate as they happen.

**Polling:** the price service periodically calls the organization service API to pull down updates. More predictable operationally, but you're always working with slightly older data, and the frequency is a constant judgment call.

In practice, using both isn't unreasonable. Polling as a safety net catches anything that slipped through the event stream; events provide the low-latency updates.

**The cost:** eventual consistency. There's always a window between when customer data changes in the organization service and when the price service reflects it. For most pricing use cases this is acceptable — a customer's country doesn't change daily. But you need to be honest about it. Also: you're now running sync infrastructure, which is more to build, more to operate, and more to debug when something drifts. Backpressure can overflow your queues and events could be discarded.

**Reach for this when:** you need to decouple the price service's availability from the organization service, or when the on-the-fly call adds unacceptable latency. This is the option that invests in resilience. It earns that investment when the coupling in Option 1 has become a real problem.

---

### Option 3: Make the country a parameter

Change the API. Instead of `customer_id + article`, the API accepts `customer_id + article + country`. The caller is responsible for providing the country.

The price service doesn't need to know anything about where the customer lives. It receives that information directly and uses it to resolve the price.

**The cost:** you've pushed the problem to the client. Whether that's acceptable depends entirely on the context. If the caller already has the customer's country — because they're building a checkout flow or reading it from their own session data — this costs them nothing. If they don't have it and would have to call the organization service themselves, you've just moved the problem one step upstream without making it cheaper. When you have multiple clients this means many clients solving the same problem; it might be a lost opportunity for your platform to solve a pain-point.

This also changes the API contract. Clients that were passing just a customer ID now need to pass country too. That's a migration cost, and it's a permanent shift in what callers are expected to know.

**Reach for this when:** the calling context reliably has the country available and passing it in is natural. When the data is already there, this option is genuinely the simplest — the price service stays small and focused, with no external dependencies and no data to sync. When the data isn't there, it doesn't solve the problem; it just relocates it.

---

### Options aren't fixed choices

These options aren't three separate roads where you pick one at the start and live with it. They're points on a progression, and you can move between them as you learn more about the system.

Option 1 is a reasonable starting point — not because it's always where you'll end up, but because it keeps the system honest about what it actually needs. And critically, if it turns out that latency is a problem, you don't have to jump to Option 2. Depending on the circumstance, you could get away with simply adding a cache in front of the organization service call and get most of the benefit without maintaining a persistent copy.

Whether that cache is worth adding depends on how the API is actually used.

If it's common for the same customer to appear in multiple requests in a short window — a batch pricing run, a session where a user is browsing many articles — then the customer's country will be looked up repeatedly, and caching it yields a high hit rate. The cache earns its place immediately.

If requests are spread thin across many different customers, the hit rate will be low. You're adding a cache that mostly misses. The complexity isn't paying for itself.

This is why understanding the access pattern matters as much as understanding the data model. Not as speculation up front — "we might have many requests for the same customer" — but as an observable property of the real system once it's running. You can instrument the on-the-fly calls, look at the distribution, and then decide. The evidence is there; you just have to look at it before reaching for the solution.

The path might look like: start with Option 1, observe, add a cache if the pattern justifies it, and only reach for the full local copy approach in Option 2 if the coupling itself — not just the latency — is the problem. Each step is grounded in something real.

---

### Document the trade-offs, not just the decision

Choosing an option is only part of the work. The other part is writing down what you accepted when you made that choice.

This matters more than it sounds.

When you pick Option 1 — calling the organization service on the fly — you're accepting a coupling. The price service's availability becomes dependent on the organization service's availability. That might be completely fine today. The organization service is reliable, the latency is acceptable, and the simplicity is worth it. But the coupling is there whether you document it or not.

If you don't write it down, what happens is this: time passes, the team changes, the context shifts. One day the organization service goes down — or gets slow, or gets extracted into a different team's ownership — and suddenly prices are unavailable. People are surprised. They trace it back, and they find a dependency nobody fully remembered was there. The incident is real, but the confusion is what hurts. It could have been anticipated.

If you do write it down — "we call the organization service at request time; price availability is coupled to its availability" — then when that situation arises, it's not a surprise. It's a known trade-off that you can now re-evaluate with new information. Maybe the coupling was acceptable at the start but isn't anymore. Maybe the organization service has become less reliable and now Option 2 is worth the investment. You can have that conversation clearly because the original decision is visible.

This is also what makes it possible to revisit decisions without second-guessing them. You're not asking "why did whoever built this make such a bad choice?" You're asking "does the trade-off we knowingly made still make sense given what we know now?" That's a healthier and more productive question.

The same principle applies to every option. Option 2 introduces eventual consistency — document it. Option 3 shifts responsibility to the caller — document that too. Not as an admission of failure, but as an honest record of the bet you made and the conditions under which it makes sense.

The goal isn't to justify the decision after the fact. It's to make the decision legible to whoever has to work with it next — including yourself, six months from now, when the context has faded.

---

### How to decide

The question isn't "which option is best." It's "what are you actually optimizing for?"

If you're optimizing for correctness and simplicity: Option 1 is hard to beat as a starting point.

If you're optimizing for resilience — decoupling the price service from the organization service's availability: Option 2 is where you eventually land.

If the calling context already has the country and you want the smallest possible price service: Option 3 is genuinely the right choice.

The mistake worth avoiding is reaching for Option 2 by default because it feels more robust, without asking whether that robustness is something you actually need right now. The sync infrastructure is real work to build and real work to operate. It earns its place when it solves a real problem — not before.

Start simple. Pay attention to what the system tells you. Document what you accepted along the way. And when the trade-offs shift — because they will — you'll have something real to reason from.
