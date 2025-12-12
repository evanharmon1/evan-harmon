---
publishDate: 2025-12-12T00:00:00Z
title: KC Tech Enthusiasts - Agentic AI Design Patterns with Claude Code
excerpt: At the KC Tech Enthusiasts Meetup, I presented some recently emerging design patterns for developing agentic AI systems based on research from Anthropic
image: ~/assets/images/claudeCode.jpg
tags:
  - ai
  - tech
  - presentation
  - meetup
  - kc
  - kcte
  - development
  - agentic-ai
  - claude
  - anthropic
  - design-pattern
  - claude-code
metadata:
  canonical: https://evanharmon.com/kcte-claude-code-agentic-ai-design-patterns.md
---

## Intro
- KC Tech Book Club
---
- KC Tech Enthusiasts
  - Cayden Sommer
  - Jesse Saunders
  - Evan Harmon
---
- Intros
  - Name
  - Background
  - What you'd like to get out of today?
---
## Today
- Quick Talk
  - AI
  - Agentic AI
  - Claude Code
---
- Quick Demo of Claude Code
- Share strategies, learn from others, Q&A, dive deeper
- ...?
- Profit
---
## AI
- LLM plateau
---
- Agentic AI
---
- Similar problems
  - Hallucinations
  - High level reasoning and understanding falls short
  - Adding compute and huge context windows don't fix it
  - Frequently need to start over with fresh context
---
- Back to traditional engineering
---
- Designing complete systems
---
- Agentic AI
---
- Managing memory
---
- Efficiently and automatically tracking progress
- Feedback loops with clearly defined success/failures
  - E.g. only allowed to change when it passes a unit test
---
## Design Pattern for Agentic AI
- A way to use agents in a repeatable way that requires designing and setting up harnesses that reliably manage the memory use of your AI
---
- State
  - Context/facts
---
- What counts as success/fail
- How to approach problems
- How to track progress
---
- (Sounds similar to software architecture patterns)
- Context Engineering
---
## Claude Code
- Anthropic Research
  - Honing in on this design pattern
---
- Initializer agent and coding agent
  - Initializer agent sets the stage with the user prompt and how it sets the memory on other agents so that every other run with coding agents has dynamic context
- Why Claude Code has tooling that makes it easier to use this pattern
---
- .claude folder
- claude.md
- agent.md
---
- rules.md
- tools
- mcp
---
## Demo
- how I've been using it
---
- what's working well
  - mowing bidder
  - mcp
  - Claude project instructions
---
- not working well
  - zoho
---
## Sources
- <https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents>
