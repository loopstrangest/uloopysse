# Async Communication Framework

This directory contains the communication and documentation system for the Loopy-Ulysse collaboration. Its purpose is to enable effective asynchronous collaboration by making each person's thinking and decision-making processes visible to the other.

**Note:** This framework is an initial plan, not a final system. It will evolve based on what actually works in practice. If something isn't working, change it. If something is missing, add it. The goal is effective collaboration, not adherence to a structure.

## Directory Structure

```
/collab/
├── loopy/
│   ├── log.md          # Loopy's thinking journal (Loopy writes, anyone reads)
│   └── inbox.md        # Messages TO Loopy (Ulysse writes, Loopy reads)
├── ulysse/
│   ├── log.md          # Ulysse's thinking journal (Ulysse writes, anyone reads)
│   └── inbox.md        # Messages TO Ulysse (Loopy writes, Ulysse reads)
└── README.md           # This file
```

## Components

### Personal Logs (`/collab/{name}/log.md`)

**Purpose:** Document your thinking process, experiments, dead-ends, and breakthroughs in a stream-of-consciousness style.

**Why it exists:** The other person can read your log to understand *how* you think, not just *what* you decided. This builds mutual understanding and prevents miscommunication.

**How to use:**
- Write freely—no rigid structure required
- Timestamp entries with the date
- Include your reasoning, doubts, and discoveries
- Reference commits, files, or other docs when relevant

**Ownership:** Each person writes only to their own log. Anyone can read.

---

### Inboxes (`/collab/{name}/inbox.md`)

**Purpose:** Send important messages to the other collaborator that require their attention.

**Why it exists:** Provides a direct channel for communication when you need to notify, ask, or inform the other person of something important. Unlike logs (which are for your own thinking), inboxes are for directed communication.

**How to use:**
- To message someone, write to **their** inbox (not yours)
- Add new messages at the bottom with a `## YYYY-MM-DD - From [Name]` header
- Keep messages focused and actionable
- The recipient can mark messages as `[READ]` or reply beneath them

**Ownership:**
- **Loopy's inbox:** Ulysse writes, Loopy reads and responds
- **Ulysse's inbox:** Loopy writes, Ulysse reads and responds

**When to use the inbox vs. your log:**
- **Inbox:** "Hey, I need you to look at X" / "Question about Y" / "Heads up about Z"
- **Log:** "I'm thinking about trying X because..." / "Today I worked on Y"

---

## Conventions

1. **Respect ownership** — Write to your own log, write to the other person's inbox. Don't edit each other's entries.

2. **Timestamp everything** — Use the format `## YYYY-MM-DD - From [Name]` for inbox messages.

3. **Link liberally** — Reference commits (by hash), files (by path), and other docs to create a web of context.

4. **No blocking** — If you need input, send an inbox message but keep building. Don't wait for responses.

5. **Keep the README updated** — If you change the framework, document it here.

---

## Getting Started

1. Read through the existing logs and inboxes to catch up on context
2. Write an entry in your personal log about what you're working on
3. If you need the other person's attention, write to their inbox
