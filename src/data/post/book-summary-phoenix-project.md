---
publishDate: 2023-06-30T00:00:00Z
title: The Phoenix Project Book Summary
excerpt: The book makes the case that any company not making their technology and IT practices one of their core competencies is taking an ill-advised existential risk.
image: https://images.unsplash.com/photo-1546984575-757f4f7c13cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
tags:
  - book
  - development
  - devops
  - it
  - agile
  - business
  - management
  - leadership
metadata:
  canonical: https://evanharmon.com/book-summary-phoenix-project
---
Authors: Gene Kim, Kevin Behr, and George Spafford

Amazon: <https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262592>
![rw-book-cover](https://images-na.ssl-images-amazon.com/images/I/51zDZ1s4hCL._SL200_.jpg)
## The Gist
- Presented in fictionalized novel form (but surprisingly well-done), the book makes the case that any company not making their technology and IT practices one of their core competencies is taking an ill-advised existential risk.
- The book advocates for specific improvements and principles a company can make in the areas of [DevOps](https://en.wikipedia.org/wiki/DevOps), IT, [Agile](https://en.wikipedia.org/wiki/Agile), technology, people, processes, culture, and business value alignment, generalized in a quasi Eastern/martial arts/guru style via "The Three Ways."
- The Three Ways suggests that business value can be maximized by taking a holistic and [systems-based](https://en.wikipedia.org/wiki/Systems_thinking) perspective in order to better understand how exactly value is delivered to customers and how it can be efficiently and continually refined to stay competitive and keep your customers happy.
## Takeaways
- I was surprised how well the narrative form worked. The authors used it well and with purpose. Most of the narrative contained numerous anecdotes that many IT workers will be very familiar with, but they used that embedded specificity to give the often overlooked context that many of these principles rely on – e.g. the centrality of people, pragamitc realities that arise from putting an idea in practice, and demonstrating various false assumptions and common myths.
- All companies now are essentially tech companies.
- DevOps is neat. Let's do that.
## The Three Ways
Gene Kim explains The First Way:
> The First Way emphasizes the performance of the entire system, as opposed to the performance of a specific silo of work or department — this as can be as large a division (e.g., Development or IT Operations) or as small as an individual contributor (e.g., a developer, system administrator).
>
> The focus is on all business value streams that are enabled by IT. In other words, it begins when requirements are identified (e.g., by the business or IT), are built in Development, and then transitioned into IT Operations, where the value is then delivered to the customer as a form of a service.
>
> The outcomes of putting the First Way into practice include never passing a known defect to downstream work centers, never allowing local optimization to create global degradation, always seeking to increase flow, and always seeking to achieve profound understanding of the system (as per Deming).
[The Three Ways: The Principles Underpinning DevOps — Gene Kim](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)

This advocates for things like optimizing for quality [change management](https://en.wikipedia.org/wiki/Change_management) (safe, reliable, quick changes), [CI/CD](https://en.wikipedia.org/wiki/CI/CD) (on-demand environments and automatic testing) limiting [work in progress](https://en.wikipedia.org/wiki/Work_in_process), [Kanban](https://en.wikipedia.org/wiki/Kanban) boards, etc.

Gene Kim explains The Second Way:
> The Second Way is about creating the right to left feedback loops. The goal of almost any process improvement initiative is to shorten and amplify feedback loops so necessary corrections can be continually made.
>
> The outcomes of the Second Way include understanding and responding to all customers, internal and external, shortening and amplifying all feedback loops, and embedding knowledge where we need it.
[The Three Ways: The Principles Underpinning DevOps — Gene Kim](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)

Gene Kim explains The Third Way:
> The Third Way is about creating a culture that fosters two things: continual experimentation, taking risks and learning from failure; and understanding that repetition and practice is the prerequisite to mastery.
>
> We need both of these equally. Experimentation and taking risks are what ensures that we keep pushing to improve, even if it means going deeper into the danger zone than we’ve ever gone. And we need mastery of the skills that can help us retreat out of the danger zone when we’ve gone too far.
>
> The outcomes of the Third Way include allocating time for the improvement of daily work, creating rituals that reward the team for taking risks, and introducing faults into the system to increase resilience.
[The Three Ways: The Principles Underpinning DevOps — Gene Kim](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/)

The Second and Third Way can help justify things like [process improvement](https://www.forbes.com/advisor/business/what-is-process-improvement/), focusing on understanding actual bottlenecks, avoiding the [premature optimization anti-pattern](https://thiagoricieri.medium.com/anti-patterns-by-example-premature-optimization-f46056dd1e39), the cultural value required to reward risk-taking, spending the time needed for seemingly indirectly valuable things like experimentation, learning, and practice, and making the company-wide changes that allow for risks and experimentation to not be detrimental to the company via, e.g., [chaos engineering](https://en.wikipedia.org/wiki/Chaos_engineering).
## The 4 Types of IT Work
Part of understanding a business holistically and as a system, we need to understand the 4 types of IT work:
- Business projects - generate revenue or strategic value for the company
- Internal projects - help internal customers in the organization to become more efficient and productive
- Scheduled changes - work required to stabilize and improve the original output from the 2 categories above
- Unplanned work (or firefighting) - disrupts all 3 types of planned work above
## The Theory of Constraints
Originally introduced by [Eliyahu M. Goldratt](https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt "Eliyahu M. Goldratt") in his 1984 book titled [The Goal](https://en.wikipedia.org/wiki/The_Goal_(novel) "The Goal (novel)"), it advocates for a management philosophy focused on understanding and maximinig operational throughput with a method to help identity and alleviate contraints:
> 1. _Identify_ the system's constraint(s).
> 2. Decide how to _exploit_ the system's constraint(s).
> 3. _Subordinate_ everything else to the above decision.
> 4. _Elevate_ the system's constraint(s).
> 5. _Warning!_ If in the previous steps a [constraint has been broken](https://en.wikipedia.org/wiki/Theory_of_constraints?cmdf=Theory+of+Constraints%3A#Breaking_a_constraint), go back to step 1, but do not allow [inertia](https://en.wikipedia.org/wiki/Inertia "Inertia") to cause a system's constraint.
[Theory of constraints - Wikipedia](https://en.wikipedia.org/wiki/theory_of_constraints?cmdf=theory+of+constraints%3a)

The most important take-away is that this requires systems-thinking due to the necessity to know what the actual singular current bottleneck is, since eliminating any local bottleneck doesn't improve actual throughput due to the global bottleneck and can often slow things down even more due to potentially overwhelming downstream areas unable to deal with increasing throughput.
## Related
- [Systems Thinking](https://en.wikipedia.org/wiki/Systems_thinking)
- [CI/CD](https://en.wikipedia.org/wiki/CI/CD)
- [Agile](https://en.wikipedia.org/wiki/Agile)
- [DevOps](https://en.wikipedia.org/wiki/DevOps)
- [Premature Optimization](https://thiagoricieri.medium.com/anti-patterns-by-example-premature-optimization-f46056dd1e39)
- [Process Improvement](https://www.forbes.com/advisor/business/what-is-process-improvement/)
- [Chaos Engineering](https://en.wikipedia.org/wiki/Chaos_engineering)
- [The Unicorn Project](https://www.amazon.com/Unicorn-Project-Developers-Disruption-Thriving-ebook/dp/B07QT9QR41)
- [The DevOps Handbook](https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1950508404)
