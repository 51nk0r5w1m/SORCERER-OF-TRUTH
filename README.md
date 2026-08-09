```
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   S O U R C E   O F   T R U T H                              ║
  ║   ─────────────────────────────────                           ║
  ║   a field guide for deep technical research                   ║
  ║                                                               ║
  ║   DEF CON 34 // Las Vegas // 2025                             ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
```

> *"The model is not the system. The map is not the territory. The blog post is not the RFC."*

---

## Who Is Carley

```
  ┌──────────────────────────────────────────┐
  │  CARLEY FANT                              │
  │  Extraterrestrial Pipeline Scrubber       │
  │  UAP Platform Engineer                    │
  │                                           │
  │  DOMAIN     AppSec / IAM                  │
  │  STACK      Cloud / Identity              │
  │  PIPELINE   Provenance                    │
  │  EVIDENCE   RFC / NIST                    │
  │  STATUS     Active                        │
  └──────────────────────────────────────────┘
```

Secure cloud, identity, and software-delivery platforms by day. Anomalous signals investigated with the same discipline by night: follow the evidence, test the model, keep the receipts.

Previously presented at **GrrCon** -- where this whole rabbit hole started. That talk was supposed to be a clean technical deep-dive. Instead it turned into a two-month journey through mailing list archives, deprecated OAuth flows, and the discovery that half the security guidance on the internet is citing the other half in a closed loop. The GrrCon talk cracked the surface. This DEF CON talk is what was underneath.

The path here was weird:
- Building identity and access management systems where "just follow best practices" kept meaning different things depending on which best practice you opened
- Tracing pipeline provenance and realizing the supply chain trust problem is also a *research* trust problem
- Investigating anomalous signals (yes, the UAP kind) and noticing the methodology transfers perfectly -- unexplained signals are inputs to investigate, not conclusions to inherit
- Reading too many RFCs at 2am and finding that the blog posts got it wrong in load-bearing ways

## [Enter the Deck](https://51nk0r5w1m.github.io/SORCERER-OF-TRUTH/)

A single HTML file. No frameworks. No build step. No dependencies. Just 21 slides, interactive canvas scenes, and a methodology that works on anything the internet tells you is true.

```
   SLIDE MAP
   ─────────────────────────────────────────
   01  Source of Truth          ░░ cover
   02  Who Is Carley            ░░ origin
   03  Inception, But RFCs      ░░ rabbit hole
   04  The Feed                 ░░ the problem
   05  When Guidance Conflicts  ░░ thesis
   06  Source Hierarchy         ░░ the system
   07  Four Questions           ░░ the protocol
   08  Simplification           ░░ the trap
   ─────────────────────────────────────────
   09  JWT Storage              ░░ case 01
   10  Default Decision         ░░ interlude
   11  OAuth Implicit Flow      ░░ case 02
   12  The Model                ░░ breather
   13  Password Hashing         ░░ case 03
   14  There Is No Spoon        ░░ interlude
   15  CORS                     ░░ case 04
   ─────────────────────────────────────────
   16  Consensus Engine         ░░ the twist
   17  AI Exoskeleton           ░░ the warning
   18  Find The Humans          ░░ the heart
   19  Field Guide Checklist    ░░ the artifact
   20  Close                    ░░ landing
   21  The Circuit Remembers    ░░ memorial
```

## The Rabbit Hole

You ever fall down a rabbit hole at 2am tracing a security recommendation back to its source and end up six RFCs deep in a mailing list thread from 2011 where two cryptographers are politely eviscerating each other over a single sentence? And then you look up and realize the blog post that sent you there got it completely wrong?

This talk is about that.

**Source of Truth** is a methodology for navigating the crop circles of security guidance -- the strange patterns that form when blog posts cite blog posts that cite tweets that cite a misreading of a spec that was deprecated three years ago. Everyone points at the circle and says "look, consensus!" but nobody checks who made the first mark in the field.

Four case studies. Same four questions. Same pattern every time -- like crop circles appearing in different fields but always with the same geometry:

```
  ┌─────────────────────────┐     ┌─────────────────────────┐
  │  1. JWT STORAGE          │     │  2. OAUTH IMPLICIT       │
  │                          │     │                          │
  │  "Use httpOnly cookies"  │     │  "Use implicit flow"     │
  │  vs.                     │     │  vs.                     │
  │  "JavaScript-accessible  │     │  "That was deprecated    │
  │   storage" -- bigger     │     │   years ago but the      │
  │   category, different    │     │   diagrams refused       │
  │   question entirely      │     │   to die"                │
  └─────────────────────────┘     └─────────────────────────┘
  ┌─────────────────────────┐     ┌─────────────────────────┐
  │  3. PASSWORD HASHING     │     │  4. CORS                 │
  │                          │     │                          │
  │  "Just hash it"          │     │  "Add the CORS header"   │
  │  vs.                     │     │  vs.                     │
  │  "Hash it with WHAT      │     │  "The error IS the       │
  │   parameters? On WHAT    │     │   security boundary      │
  │   hardware? Against WHAT │     │   doing its job.         │
  │   threat model?"         │     │   You're removing        │
  │                          │     │   the lock."             │
  └─────────────────────────┘     └─────────────────────────┘
```

## The Protocol

```
  Q1  What does the surface answer say?
  Q2  What does the authority (RFC, OWASP, ASVS) say?
  Q3  What is the load-bearing difference?
  Q4  What does this force us to ask next?
```

Four questions. That's the whole methodology. The rest is just practice.

## Down the Research Stack

Primary sources traced during this talk's preparation:

```
  TIER 1 -- SPECIFICATIONS
  ├── RFC 6749    OAuth 2.0 Authorization Framework
  ├── RFC 6750    Bearer Token Usage
  ├── RFC 7519    JSON Web Token (JWT)
  ├── RFC 8252    OAuth 2.0 for Native Apps
  ├── RFC 8446    TLS 1.3
  ├── RFC 9207    OAuth 2.0 Authorization Server Issuer Identification
  ├── BCP 240     Browser-Based Apps
  └── Fetch Spec  Same-Origin Policy / CORS

  TIER 2 -- VERIFICATION FRAMEWORKS
  ├── OWASP ASVS 5.0
  ├── OWASP WSTG
  └── OWASP Cheat Sheet Series

  TIER 3 -- STANDARDS BODIES
  └── NIST SP 800-63B  (password hashing parameters)
```

## Talk History

| Conference | Year | Talk | Status |
|-----------|------|------|--------|
| **GrrCon** | 2024 | The initial deep-dive that cracked the surface | Delivered |
| **DEF CON 34** | 2025 | Source of Truth: the full methodology | This one |

The GrrCon talk was the prototype. It asked the question. DEF CON 34 is the answer -- a repeatable field guide for tracing any security claim back to something you can verify.

## Running Locally

```sh
# kill whatever's on 8000, serve the deck
lsof -ti :8000 | xargs -r kill
python3 -m http.server 8000

# open http://localhost:8000
# edit files. refresh browser. that's it.
```

## Speaker Notes

Over-prepared, storytelling-style notes for all 21 slides: [`SPEAKER_NOTES.md`](SPEAKER_NOTES.md)

Timing cues. Suggested delivery. Anecdotes. Audience interaction. Emergency shortcuts if you're running long. Emergency stretches if you're running short. The whole paranoid speaker safety net.

## Controls

```
  →  / Space     next slide
  ←              previous slide
  ↓              next reveal step
  ↑              previous step
  1-9            scene interaction
  S              toggle speaker notes
```

---

```
  follow the signal.
  classify the evidence.
  make the call.

  ◎ the source of truth is a practice, not a document.
```
