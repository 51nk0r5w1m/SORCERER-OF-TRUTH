# SOURCE OF TRUTH

**A Field Guide for Deep Technical Research** // DEF CON 34 // Las Vegas // 2026

> *"The model is not the system. The map is not the territory. The blog post is not the RFC."*

---

## Who Is Carley

**Carley Fant** // UAP Platform Engineer

| | |
|---|---|
| **Domain** | AppSec / IAM |
| **Stack** | Cloud / Identity |
| **Pipeline** | Provenance |
| **Evidence** | RFC / NIST |
| **Status** | Active |

Secure cloud, identity, and software-delivery platforms by day. Anomalous signals investigated with the same discipline by night: follow the evidence, test the model, keep the receipts.

Previously presented at **GrrCon** -- where this whole rabbit hole started. That talk was supposed to be a clean technical deep-dive. Instead it turned into a two-month journey through mailing list archives, deprecated OAuth flows, and the discovery that half the security guidance on the internet is citing the other half in a closed loop. The GrrCon talk cracked the surface. This DEF CON talk is what was underneath.

The path here was weird:
- Building identity and access management systems where "just follow best practices" kept meaning different things depending on which best practice you opened
- Tracing pipeline provenance and realizing the supply chain trust problem is also a *research* trust problem
- Investigating anomalous signals (yes, the UAP kind) and noticing the methodology transfers perfectly -- unexplained signals are inputs to investigate, not conclusions to inherit
- Reading too many RFCs at 2am and finding that the blog posts got it wrong in load-bearing ways

## [Enter the Deck](https://51nk0r5w1m.github.io/SORCERER-OF-TRUTH/)

A single HTML file. No frameworks. No build step. No dependencies. Just 21 slides, interactive canvas scenes, and a methodology that works on anything the internet tells you is true.

### Slide Map

| # | Title | Beat |
|---|-------|------|
| 01 | Source of Truth | cover |
| 02 | Who Is Carley | origin |
| 03 | Inception, But RFCs | rabbit hole |
| 04 | The Feed | the problem |
| 05 | When Guidance Conflicts | thesis |
| 06 | Source Hierarchy | the system |
| 07 | Four Questions | the protocol |
| 08 | Simplification | the trap |
| 09 | JWT Storage | case 01 |
| 10 | Default Decision | interlude |
| 11 | OAuth Implicit Flow | case 02 |
| 12 | The Model | breather |
| 13 | Password Hashing | case 03 |
| 14 | There Is No Spoon | interlude |
| 15 | CORS | case 04 |
| 16 | Consensus Engine | the twist |
| 17 | AI Exoskeleton | the warning |
| 18 | Find The Humans | the heart |
| 19 | Field Guide Checklist | the artifact |
| 20 | Close | landing |
| 21 | The Circuit Remembers | memorial |

## The Rabbit Hole

You ever fall down a rabbit hole at 2am tracing a security recommendation back to its source and end up six RFCs deep in a mailing list thread from 2011 where two cryptographers are politely eviscerating each other over a single sentence? And then you look up and realize the blog post that sent you there got it completely wrong?

This talk is about that.

**Source of Truth** is a methodology for navigating the crop circles of security guidance -- the strange patterns that form when blog posts cite blog posts that cite tweets that cite a misreading of a spec that was deprecated three years ago. Everyone points at the circle and says "look, consensus!" but nobody checks who made the first mark in the field.

Four case studies. Same four questions. Same pattern every time -- like crop circles appearing in different fields but always with the same geometry:

**Case 01 -- JWT Storage:** "Use httpOnly cookies" vs. "JavaScript-accessible storage" -- a bigger category, a different question entirely.

**Case 02 -- OAuth Implicit:** "Use implicit flow" vs. "That was deprecated years ago but the diagrams refused to die."

**Case 03 -- Password Hashing:** "Just hash it" vs. "Hash it with WHAT parameters? On WHAT hardware? Against WHAT threat model?"

**Case 04 -- CORS:** "Add the CORS header" vs. "The error IS the security boundary doing its job. You're removing the lock."

## The Protocol

Every case study runs through four questions:

1. What does the surface answer say?
2. What does the authority (RFC, OWASP, ASVS) say?
3. What is the load-bearing difference?
4. What does this force us to ask next?

Four questions. That's the whole methodology. The rest is just practice.

## Down the Research Stack

Primary sources traced during this talk's preparation:

**Tier 1 -- Specifications:** RFC 6749 (OAuth 2.0), RFC 6750 (Bearer Tokens), RFC 7519 (JWT), RFC 8252 (OAuth for Native Apps), RFC 8446 (TLS 1.3), RFC 9207 (Authorization Server Issuer ID), BCP 240 (Browser-Based Apps), Fetch Spec (Same-Origin Policy / CORS)

**Tier 2 -- Verification Frameworks:** OWASP ASVS 5.0, OWASP WSTG, OWASP Cheat Sheet Series

**Tier 3 -- Standards Bodies:** NIST SP 800-63B (password hashing parameters)

## Talk History

| Conference | Year | Talk | Status |
|-----------|------|------|--------|
| **GrrCon** | 2024 | The initial deep-dive that cracked the surface | Delivered |
| **DEF CON 34** | 2026 | Source of Truth: the full methodology | Delivered |

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

The hosted deck and [`SPEAKER_NOTES.md`](SPEAKER_NOTES.md) include viewer-facing notes for all 21 slides. They are written as follow-up research context: standards references, implementation implications, and the assumptions behind each security decision.

## Controls

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `↓` | Next reveal step |
| `↑` | Previous step |
| `1-9` | Scene interaction |
| `N` | Toggle speaker notes |

---

*Follow the signal. Classify the evidence. Make the call.*

*The source of truth is a practice, not a document.*
