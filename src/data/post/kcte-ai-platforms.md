---
publishDate: 2025-05-02T00:00:00Z
title: KC Tech Enthusiasts - AI Platforms
excerpt: At the KC Tech Enthusiasts Meetup, I presented an overview of AI platforms and the latest AI app architectures such as MCP, A2A, and agentic workflows
image: ~/assets/images/ai-image.png
tags:
  - ai
  - tech
  - presentation
  - meetup
  - kc
  - kcte
  - development
metadata:
  canonical: https://evanharmon.com/kcte-ai-platforms.md
---

## KC Tech Enthusiasts
- Evan Harmon, Jesse Saunders, & Cayden Sommer
- KC Tech Book Club
---
## Outline
- What's AI?
- Terms & Concepts
- Platforms & Tools
- Future, hype, skepticism
- Demo
- Questions, discussion, deeper dives, future topics or books?
---
## What is AI?
---
## Terms & Concepts
---

### Narrow AI (Weak AI)
Systems designed to perform specific tasks within a limited context. All current AI applications fall under this category, including virtual assistants, self-driving cars, and recommendation systems. These systems excel at their assigned tasks but cannot operate beyond their programming.

---
### Artificial General Intelligence (AGI)
Theoretical AI with human-level intelligence across a broad range of tasks. AGI would be capable of understanding, learning, and applying knowledge across different domains, just as humans do. While still hypothetical, AGI remains an active area of research.

---
### Artificial Superintelligence (ASI)
A speculative form of AI that would surpass human intelligence in all aspects, including scientific creativity, general wisdom, and social skills. ASI represents the most advanced theoretical form of AI and raises significant questions about control and regulation

---
### Related Terms
---
- **Algorithm:** A set of rules that a machine follows to learn how to perform a task.
- **Machine Learning:** A subset of AI where systems learn from data without being explicitly programmed for specific tasks.
- **Neural Networks:** Computing systems inspired by the human brain’s biological neural networks, designed to recognize patterns.

---
- **Deep Learning:** A subset of machine learning involving neural networks with many layers.
- **Generative AI:** AI that creates seemingly new content-such as text, images, and audio-based on training data.
- **Transformer Architecture:** A programming approach introduced in 2017 that turbocharged generative AI capabilities.

---
- **LLM:** neural networks pre-trained with large amounts of data broken into tokens in order to "understand" and generate natural language

---
- **Context Window:** The amount of text/tokens that an LLM can consider at any time - its "working memory"
- **RAG (Retrieval Augmented Generation):** Technique that allows an LLM to incorporate data that it was not trained on originally. For example, to add new information or reference private user data. Usually done with numerical embeddings in a vector database.

---
- **Agent:** a system or program capable of autonomously performing tasks, making decisions, and interacting with environments or tools on behalf of a user or another system
- **MCP:** protocol that enables AI agents to discover, connect to, and interact with external tools and data sources
- **A2A:** standard that defines how autonomous AI agents can discover each other, communicate, exchange information, and coordinate actions

---
## Platforms & Tools

---
### How Do You Want To Use AI?
- **General Users:** AI apps with related app-like/product functionality to increase usability and ease of adding to context, prompts, memory, private data/RAG, etc.
- **Power Users:** Plugins and extensions to existing apps or OS's with existing use cases such as helping to research something or rewrite an email

---
- **Self-hosted/Private/Local:** People who want to self-host locally and not trust their data to the cloud
- **Automation Platforms that also do AI:** Workflows that need general automation and infrastructure in addition to AI
- **Developers Using AI to Code:** Not necessarily making an AI app, but using AI to help with a copilot, etc.
- **Developers Making an AI App:** Developers incorporating AI APIs, LLMs, agents, etc. that want to create an AI app

---
### General User Tools
- **AI Chat Apps:** ChatGPT, Anthropic Claude, Perplexity, Google Gemini, Apple ~~Intelligence~~
- **Apps and OS's with AI Integrated Inside:** Apple, Microsoft, Writing apps, Notion, Calendars, email apps, etc.

---
### Power User Tools
- **AI App Environments:** Google NotebookLM and AgentSpace
- **Prompt Engineering, User Data, Dedicated Workspaces:** E.g. Perplexity and Claude app features
- **Application and OS Extensions:** RayCast, Grammarly

---
### Self-hosted/Private/Local Tools
- **Runtime:** ollama
- **Models:** Hugging Face, LM Studio
- **UI:** Open WebUI
- **App framework:** AnythingLLM

---

### Automation Platforms That Also Do AI
- **Automation:** n8n, Trigger.dev, Kestra, Apache Airflow, Make, Retool, Superblocks, Zapier

---
### Developing With AI
- **Copilots:** GitHub Copilot, Cursor, SuperMaven
- **IDEs and developer environments:** Firebase Studio, Vercel v0

---
### Developing an AI App
- **Cloud APIs:** OpenAI, Anthropic, Google
- **Low Code/No Code:** Rivet, Vellum, OpenAI
- **Cloud Hosting Platforms:** Squid AI
- **Custom training/fine-tuning models:** Hugging Face, Open Router
- **Architectures, Protocols, and Frameworks:** RAG, MCP, A2A, agents, function calling, LangChain, LangGraph

---
## AI Hype vs Skepticism
---
### LLMs Plateauing
- In political persuasion tasks, models with 70B parameters showed only 4% greater effectiveness than 7B counterparts, with returns diminishing beyond 13B parameters
- Incremental improvements in recent models across the industry, despite massive investment and computation thrown at training

---
### Diminishing Returns From Training Data
- Internet's finite text corpus-estimated at ~10^13 tokens-is nearing full utilization
- Current models have utilized over 90%

---
### Stanford Alpaca Paper
- Demonstrated surprising feasibility to transfer the trained intelligence from the model itself, leveling the playing field for first movers like OpenAI
- DeepSeek appears to have done just that.

---
### High Level Reasoning Remains Elusive
- FAR AI demonstrated multiple weaknesses in expert Go-playing AI models that exploited lack of reasoning by using tricks that human reasoning could understand but able to be inferred from Go training data.

---

### Energy, Cost, & Economy Barriers
- Current generation of AI hype is fueled by massive big tech hype, capital expenditure, and incredible cloud compute infrastructure and only partially do to specific innovation in AI.

---

### Still Exciting Possibilities
- Path forward is agentic, middleware, platforms, and automation that can effectively utilize important data
  - RAG, privacy, encryption, differential privacy techniques, local data
- Model interoperability, open standards, protocols, open ecosystems and developer-friendly platforms
  - MCP
  - A2A
- Better use of edge and on device compute to mitigate cost, energy, and increasingly comparable to cloud LLMs

---

### Heterogenous Runtime Environments
- **Device:** 7-13B models
- **Edge:** 13-100B models local servers
- **Cloud:** 100B + with APIs

---
### Varying Tolerance for Speed of Response
- **Chat:** 1-10 seconds
- **Research:** 1-5 minutes
- **Complex Autonomous Agents:** 30+ minutes

---

### Optimization
- Cost
- Energy
- Performance
- Mitigating non-determinative complexity inherent to AI, especially complicated agentic middleware platforms
- Requires innovation in testing, monitoring, DevOps, security, etc.

---
## Demo
- Raycast
- Rivet
- n8n
- Perplexity
