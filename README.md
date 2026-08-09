# Source of Truth

**A Field Guide for Deep Technical Research** | DEF CON 34

> *The source of truth is not a document. It is a practice.*

---

Security guidance conflicts. Blog posts contradict RFCs. Tutorials cite deprecated flows. AI summaries echo the consensus without checking the standard. **Source of Truth** is a methodology talk that gives engineers a repeatable system for tracing security claims back to their actual source: specifications, verification frameworks, maintainer context, and implementation reality.

## The Deck

**[View the live presentation](https://51nk0r5w1m.github.io/SORCERER-OF-TRUTH/)**

A single-file, self-contained HTML slide deck with:
- 21 slides covering methodology, four case studies, and a field guide checklist
- Interactive canvas scenes (WebGL-free, pure Canvas 2D)
- Keyboard navigation, HUD overlays, and baked-in speaker notes
- Zero external dependencies at runtime

### Case Studies

| # | Topic | Core Question |
|---|-------|---------------|
| 1 | JWT Storage | Where should tokens live? |
| 2 | OAuth Implicit Flow | When does documentation drift? |
| 3 | Password Hashing | What do "just hash it" and the spec actually say? |
| 4 | CORS | Is the error the security boundary? |

Each case study runs the same four-question protocol:
1. What does the surface answer say?
2. What does the authority (RFC, OWASP, ASVS) say?
3. What is the load-bearing difference?
4. What does this force us to ask next?

## Research

The talk is grounded in primary-source research across:
- **RFCs:** 6749, 6750, 7519, 8252, 8446, 9207, and the Browser-Based Apps BCP
- **OWASP:** ASVS 5.0, WSTG, Cheat Sheet Series
- **NIST:** SP 800-63B (password hashing parameters and threat assumptions)
- **W3C / WHATWG:** Fetch specification, Same-Origin Policy

The research methodology itself is the subject of the talk: a source hierarchy that ranks evidence types (specification > verification framework > maintainer context > implementation reality) and a protocol for tracing claims through that hierarchy.

## Serving Locally

```sh
# Kill anything on port 8000 and serve
lsof -ti :8000 | xargs -r kill
python3 -m http.server 8000

# Then open http://localhost:8000
# Save files, refresh browser. No rebuild needed.
```

## Speaker Notes

Comprehensive storytelling-style speaker notes live in [`SPEAKER_NOTES.md`](SPEAKER_NOTES.md) -- timing cues, suggested delivery, anecdotes, audience interaction ideas, emergency shortcuts, and mantras.

## Navigation

| Key | Action |
|-----|--------|
| `Arrow Right` / `Space` | Next slide |
| `Arrow Left` | Previous slide |
| `Arrow Down` | Next step (reveal) |
| `Arrow Up` | Previous step |
| `1-9` | Scene interaction keys |
| `S` | Toggle speaker notes |

---

*Follow the signal. Classify the evidence. Make the call.*
