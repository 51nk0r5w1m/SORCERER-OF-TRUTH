# Source of Truth — Speaker Notes

DEF CON 34 · Sun 2026-08-09 · 12:30 · LVCC West 3
Carley Fant · UAP Platform Engineer

Toggle notes in deck: press **N**

---

## Slide 01 — Source of Truth (Cover)

- Day 0 framing: this is not a talk about one bug class; it is about how engineers decide what to trust.
- Set the promise: a repeatable field guide for chasing claims into standards, verification frameworks, maintainer context, and implementation reality.

## Slide 02 — Who Is Carley (Bio)

- Anchor identity with the early portrait: the talk is technical, but the method is personal and practiced.
- This slide should establish credibility without turning into a resume.

## Slide 03 — Inception, But RFCs

- The talk is born from preparing a more technical talk and noticing the research failure mode behind the examples.
- The UAP platform-engineering lens matters here: unexplained signals are inputs to investigate, not conclusions to inherit.
- Name the core tension early: polished summaries are useful, but they are not authority.

## Slide 04 — The Feed (Poster)

- Let the baked-in caption do the work. Do not repeat it aloud verbatim; explain that feeds flatten authority, context, and time.
- Move from internet feed to research hierarchy.

## Slide 05 — When Guidance Conflicts

- This is the main operating rule for the rest of the talk.
- Emphasize that a hierarchy is not snobbery; it is conflict resolution.

## Slide 06 — Source Hierarchy

- Explain the hierarchy before any case study so examples do not hijack the talk.
- The hierarchy decides how to arbitrate, not what to ignore.

## Slide 07 — Four Questions

- These questions keep the security details in service of methodology.
- The fourth question is the handoff from reading to engineering decision-making.

## Slide 08 — Simplification (Poster)

- Let the image caption land. The point is that every simplification inherits assumptions about attackers, users, and operating reality.
- Transition into JWT storage as the first drill.

## Slide 09 — Case 01: JWT Storage

- Avoid teaching XSS mechanics. Use the storage conflict to teach claim tracing.
- The phrase "JavaScript-accessible storage" is the kind of awkward sentence that does real security work.

## Slide 10 — Default Decision (Poster)

- Do not duplicate the baked-in line. Explain that defaults are not neutral; they encode priorities.
- Use this to move from JWT storage into OAuth diagrams and source drift.

## Slide 11 — Case 02: OAuth Implicit

- Keep this focused on source drift: diagrams persist because docs are products too.
- The point is not vendor-shaming; it is learning to check whether a recommendation has moved.

## Slide 12 — The Model (Poster)

- Let the baked-in caption carry the transition.
- The next case is password hashing, where the model is often compressed into a single verb: hash.

## Slide 13 — Case 03: Password Hashing

- Do not turn this into an Argon2 lecture. Show that standards include parameters and threat assumptions.
- This is where defensibility requires numbers, not vibes.

## Slide 14 — There Is No Spoon

- Use the Matrix reference lightly: it reinforces model versus system without derailing the talk.
- This sets up CORS, where the browser error becomes mistaken for the trust boundary.

## Slide 15 — Case 04: CORS

- Use this as the final methodology drill, not as a CORS primer.
- The repeated pattern is now visible: surface answer, authority, omitted assumption, next question.

## Slide 16 — Consensus Engine (Poster)

- Let the baked-in caption stand. Explain the risk of sources recursively training on each other.
- Bridge to the next slide explicitly: "That loop we just broke — AI lives inside it. Every model trained on the web inherits this recursion."
- Transition into AI as an exoskeleton, not a root of trust.

## Slide 17 — AI Exoskeleton

- This slide is deliberately pragmatic: AI is useful, but only when the source boundary is explicit.
- The RFC 7519 miss proves the method should correct the speaker too.

## Slide 18 — Find The Humans

- The circuit-board image is a deliberate human fingerprint inside technical infrastructure.
- Use the UAP Platform Engineer identity as a quiet callback: anomalous signals become useful only after a human traces provenance and context.
- This is where research becomes more than citation; it becomes context.

## Slide 19 — Field Guide Checklist

- This is the take-home artifact. Every item turns research into a defensible engineering action.
- Let the audience feel that the case studies were drills for this checklist.

## Slide 20 — Close

- Close on method, not a list of security prescriptions.
- Bring back UAP Platform Engineer once, as the identity behind the method: follow the signal, classify the evidence, then make the call.
- The audience should leave with a repeatable way to arbitrate conflicting guidance.

## Slide 21 — The Circuit Remembers

- End on the circuit board image and the Bob Moog quote. Let the image and the words do the work.
