# Storytelling Physics — Animation Subagent for "Source of Truth"

## Core Mandate

Every animation in this deck must **land the message**. If an animation doesn't change the audience's understanding, it's decoration — kill it or reshape it. The audience is DEF CON engineers. They've seen thousands of slides. The only thing that earns their attention is *meaning delivered through motion*.

---

## The Talk's Thesis (internalize this before touching any animation)

**"Finding information is easy. Knowing which explanation applies, which design decision changes the threat model, and where the simplified diagram quietly skipped the important part — that's the hard part."**

The talk teaches a *method*: trace claims back to primary sources, identify load-bearing assumptions, turn dense research into defensible engineering decisions. The closing line is: **"Research is how you earn the right to simplify."**

Every animation must serve one of these narrative functions:
1. **REVEAL** — Show what was hidden, cropped, or simplified away
2. **TRACE** — Make the audience *feel* the act of following a claim upstream
3. **CONFLICT** — Visualize the gap between a surface answer and its authority
4. **WEIGHT** — Give physical presence to the "load-bearing" metaphor
5. **DISSOLVE** — Show what happens when models, defaults, or assumptions break

---

## The 7 Laws of Storytelling Physics

### Law 1: Motion = Meaning
Every moving element answers: "What is this telling the audience that the static version cannot?" If you can't answer in one sentence, the animation has no purpose.

### Law 2: Entrance Earns Attention, Not Applause
Elements enter because the *argument* needs them, not because the slide changed. A tier appearing in the hierarchy isn't decoration — it's the speaker saying "this source gets less authority, and here's why." Time the entrance to the speaker's breath.

### Law 3: Gravity Follows Authority
Higher-authority sources should feel *heavier*, more grounded, more stable. Lower-authority sources should feel lighter, more volatile, easier to scatter. The source hierarchy (RFC > OWASP > Vendor > Conference > Tutorial/AI) is a gravitational field. Animate accordingly.

### Law 4: The Gap Is the Story
The most important moment in every case study is the *distance* between the surface answer and the authority trail. Animations must make this gap physically visible — not with a red X, but with spatial separation, timing delay, or a visual bridge that the audience has to cross.

### Law 5: Interaction = Investigation
The scene controls (INJECT SCRIPT, TRACE FORWARD, ALLOW *, etc.) aren't toys. They let the speaker *demonstrate* the research method in real time. Each action should produce a visible consequence that mirrors what happens when an engineer follows the method: inject the script and watch the JWT become reachable; trace forward and watch the implicit flow get superseded; allow * and watch the boundary dissolve.

### Law 6: Stillness Is a Statement
Not every moment needs motion. When the speaker is delivering a key line, the canvas should *hold*. A frozen graph, a static grid, a particle field at rest — these are moments of weight. Animate the pause.

### Law 7: The Audience Remembers the Feeling, Not the Frame
The goal isn't "cool animation." It's the audience walking out of LVCC thinking: "I will never trust a clean diagram again without checking the spec." Every animation must reinforce *that* feeling.

---

## Scene-by-Scene Animation Contract

Each scene must honor its **narrative role** and **emotional beat**.

### Scene 01: `portal` (Cover — "Source of Truth")
**Narrative role**: Threshold crossing. The audience is entering a method.
**Emotional beat**: Intrigue, not spectacle.
**Physics**: Concentric rings should breathe like a radar lock — slow, patient, inevitable. The rabbit at center is the signal. The portal isn't flashy; it's *precise*. The rings tighten on ENTER because the method is about *focusing*, not expanding.
**Message served**: "We're going to follow the signal, not the noise."

### Scene 02: `whois` (Bio — "Who Is Carley")
**Narrative role**: Identity verification. The speaker is a signal source.
**Emotional beat**: Credibility without ego.
**Physics**: Radio arcs emanate from the speaker photo — a WHOIS lookup in motion. TRANSMIT strengthens the signal; MASK dampens it. The traveling dots on the thread are data packets being sent. The animation says: "I'm transmitting, you can verify."
**Message served**: "This person traces signals for a living."

### Scene 03: `graph` (The Prep Became The Point)
**Narrative role**: The messy reality of research.
**Emotional beat**: Controlled chaos. The audience should feel the *tangle* of browser tabs.
**Physics**: Nodes wobble because research is alive, contested, interconnected. HEAT increases entropy — more wobble, more connections visible, harder to parse. FREEZE locks the graph — the moment you stop and trace one thread. The hub node (green border) is the researcher's anchor point.
**Message served**: "This is what real research looks like before you tame it."

### Scene 04: `sky` (The Feed — poster)
**Narrative role**: The information landscape before method is applied.
**Emotional beat**: Overwhelm, then orientation.
**Physics**: Two ground stations scan upward into a field of signals. The sweep line is a radar scan — slow, searching. SCAN SKY shows the signal hunt; CHECK GROUND reveals what's actually observable from the surface. The horizon line divides aspiration from evidence.
**Message served**: "Signals are everywhere. Most of them are noise."

### Scene 05: `stack` (When Guidance Conflicts)
**Narrative role**: Introducing the hierarchy as a conflict-resolution tool.
**Emotional beat**: Clarity arriving. Order from chaos.
**Physics**: Diamond-shaped tiers stack vertically. TRACE CLAIM illuminates from bottom to top — tutorials at the top (weakest), normative spec at the bottom (strongest). The lime-green highlight on the normative tier should feel like bedrock being revealed. RESET returns to the undifferentiated state.
**Message served**: "Not all sources get the same vote."

### Scene 06: `cropmap` (Source Hierarchy)
**Narrative role**: The hierarchy visualized as a topographic authority map.
**Emotional beat**: Systematic, almost scientific.
**Physics**: Concentric ellipses represent authority rings — NORMATIVE at center, ORIENTATION at edge. RANK SOURCES highlights the innermost ring and differentiates node colors by authority level. FLATTEN collapses them — showing what happens when you treat all sources equally (the answer loses resolution).
**Message served**: "Authority has a center. Research means knowing where you are on the map."

### Scene 07: `protocol` (Four Questions)
**Narrative role**: The case-file protocol — the engine of the method.
**Emotional beat**: Precision, inevitability.
**Physics**: Four quadrant nodes orbit a central case-file node (rabbit). OPEN CASE illuminates them sequentially: Surface → Authority → Difference → Next Question. Each node lights up like a protocol step completing. The coral ring at center pulses gently — the case is alive.
**Message served**: "Every case asks four questions. The fourth one is always the one that matters."

### Scene 08: `machine` (Simplification — poster)
**Narrative role**: The hidden cost of simplification.
**Emotional beat**: Uncomfortable revelation.
**Physics**: Seven assumption nodes connect to a center. SIMPLIFY pulls them inward, collapsing detail — the labels disappear, the lines shorten, the system looks *clean*. RESTORE pushes them back out, revealing the full assumption landscape with labels. The animation should feel like zooming out to see what the "clean diagram" cropped.
**Message served**: "Every simplification inherits assumptions about attackers, users, and operating reality."

### Scene 09: `jwt` (Case 01 — JWT Storage)
**Narrative role**: First case study. The tutorial answer vs. the RFC answer.
**Emotional beat**: The "oh shit" moment.
**Physics**: A browser origin box contains localStorage with a JWT token. A SCRIPT block sits below. INJECT SCRIPT draws a bezier path from SCRIPT to localStorage — the coral line is malicious JavaScript reaching the token. Particles flow along the path. ISOLATE breaks the path — the line retracts, the particles stop.
**THIS IS THE GAP**: The tutorial said `localStorage.setItem`. The animation shows *why that's dangerous* — the script can reach it.
**Message served**: "The tutorial gives you an answer. The RFC gives you the attacker."

### Scene 10: `default` (Default Decision — poster)
**Narrative role**: Defaults are not neutral.
**Emotional beat**: Quiet tension.
**Physics**: A signal travels left-to-right along a line, then forks: INHERITED (coral, upward) vs CHOSEN (lime, downward). ACCEPT highlights the inherited path; CHOOSE highlights the chosen path. The branching bezier curves make the fork feel like a real decision point — not a toggle, but a *commitment*.
**Message served**: "Defaults encode priorities. Choosing means knowing what you're choosing against."

### Scene 11: `oauth` (Case 02 — OAuth Implicit)
**Narrative role**: Source drift. The diagram outlived the recommendation.
**Emotional beat**: Forensic discovery.
**Physics**: A timeline runs left-to-right: RFC 6749 → VENDOR DIAGRAM → SECURITY BCP → CURRENT FLOW. TRACE FORWARD illuminates the timeline progressively with a lime progress bar. SHOW FOSSIL highlights the vendor diagram node in coral and outlines the IMPLICIT FLOW box — it's a fossil preserved in documentation that should have been deprecated.
**Message served**: "Documentation can preserve fossils. The hierarchy catches what the diagram cannot show."

### Scene 12: `model` (The Model — interlude)
**Narrative role**: The map-is-not-the-territory moment.
**Emotional beat**: Philosophical weight.
**Physics**: A paper document (the model) floats above a deep well (the system). DISSOLVE causes particles to fall from the paper into the well — the model is disintegrating into reality. The readout changes from MODELED → DRIFTING → DISSOLVED. RESTORE reverses it.
**THIS IS THE EMOTIONAL CENTERPIECE**: The particles falling are assumptions, simplifications, shortcuts — all the things that make a model useful but dangerous.
**Message served**: "A model compresses reality so we can think. Research is finding what the compression removed."

### Scene 13: `hash` (Case 03 — Password Hashing)
**Narrative role**: Parameters are part of the security claim.
**Emotional beat**: Mathematical weight.
**Physics**: A grid fills with colored blocks as COST + increases. The huge "MB" number below grows. Coral attacker dots orbit outside — and they *slow down* as cost increases. The grid filling is memory hardness becoming visible. Each block is a unit of attacker pain.
**Message served**: "The gap between 'hash' and '19MB per guess' is where the real decision lives."

### Scene 14: `territory` (There Is No Spoon)
**Narrative role**: Maps vs. reality.
**Emotional beat**: Disorientation, then grounding.
**Physics**: A flat grid warps under BEND MAP — sine waves deform the clean lines, showing the territory underneath the map. SHOW TERRITORY places observation sites (concentric ellipses at ground level) — real measurements in real places. The warping grid should feel *uncomfortable* — the clean model is lying.
**Message served**: "Maps are useful until we forget they are maps."

### Scene 15: `cors` (Case 04 — CORS)
**Narrative role**: The final methodology drill.
**Emotional beat**: The pattern is now obvious.
**Physics**: Two boxes (ORIGIN A, API/DATA) separated by a dashed boundary line. ALLOW * turns the boundary coral and floods it with particles — data crossing freely. RESTRICT turns it lime, reduces particles to 3, and labels it ALLOWLIST + AUTHZ. The dashed line is the browser trust boundary made visible.
**Message served**: "Fixing a browser error is not proving a boundary."

### Scene 16: `consensus` (Consensus Engine — poster)
**Narrative role**: The feedback loop problem.
**Emotional beat**: Vertigo.
**Physics**: Concentric loops with orbiting dots — a consensus engine feeding on itself. AMPLIFY increases gain (faster orbits, thicker lines). BREAK LOOP opens gaps in the circles and stops the dots — the loop is broken, a thread leads outward to a spark.
**Message served**: "When sources recursively train on each other, consensus isn't truth — it's amplified assumption."

### Scene 17: `ai` (AI Exoskeleton)
**Narrative role**: AI as tool, not authority.
**Emotional beat**: Pragmatic, grounded.
**Physics**: A central orb connected to source nodes (RFC, ASVS, MAINTAINER, etc.). ORIENT lights the first connections — AI finding relevant sources. CITE lights more — but the label stays "CITED" not "VERIFIED." VERIFY lights all and the orb turns lime: only when the human has verified the sources is the process complete.
**Message served**: "AI is a research exoskeleton, not a root of trust."

### Scene 18: `humans` (Find The Humans)
**Narrative role**: The human layer behind specs.
**Emotional beat**: Warmth inside technical rigor.
**Physics**: A central rabbit (researcher) with labeled spokes: AUTHOR, WORKING GROUP, ISSUE THREAD, CHANGELOG, DEPLOYED CODE. TRACE AUTHOR illuminates them sequentially — each one is a human being who wrote a sentence for a reason. OPEN ISSUE brightens the radio arcs around the center — the researcher is transmitting their own signal now.
**Message served**: "Specs tell you what. The humans behind them tell you why."

### Scene 19: `checklist` (Field Guide Checklist)
**Narrative role**: The take-home artifact.
**Emotional beat**: Empowerment. Completion.
**Physics**: Nine radial spokes around a center rabbit. Each checklist item completed lights a spoke from dim purple to bright lime. When all 9 are complete, the rabbit reaches full opacity and the readout shows "9 / 9 RECEIPTS." This is a **method completing**, not a to-do list being checked off.
**Message served**: "Every item turns research into a defensible engineering action."

### Scene 20: `portal` (Closing — reuse of cover scene)
**Narrative role**: The portal from slide 01, but now the audience *understands* it.
**Emotional beat**: Resolution. The signal has been traced.
**Physics**: Same portal as slide 01, but positioned left (cx at .34) instead of right. The readout says "UAP // SIGNAL TRACED." GO DEEPER tightens the rings. The callback: the same animation hits different because the audience now has the method.
**Message served**: "A source of truth is not a place. It is a method."

---

## Animation Timing Principles

- **Reveal transitions**: 320ms ease or cubic-bezier(.22,.61,.36,1). Fast enough to not waste time, slow enough to register.
- **Canvas scenes**: 60fps continuous. Motion values interpolate with `.lerp` factor ~0.04 (smooth, not snappy).
- **Step reveals**: Each `data-reveal` group appears on a step advance. The speaker controls pacing.
- **Hold moments**: When `state.frozen` or equivalent is true, the canvas should be nearly still — only ambient micro-motion (subtle particle drift, gentle pulse).
- **Reduced motion**: All animations respect `prefers-reduced-motion`. In that mode, states change instantly without interpolation.

## Color Physics

- **Lime (#b8e62f)**: Authority confirmed. Source traced. Decision defensible.
- **Coral (#f27863)**: Danger. Assumption exposed. Attacker capability revealed.
- **Purple (#3c179b / #6a35e8)**: Unknown. Unranked. Unverified. Neutral but ominous.
- **Ink (#f2ead8)**: Truth. Primary content. The researcher's own signal.
- **Dim (rgba ink at .68)**: Context. Supporting detail. Not the main point.

Colors are *semantic*. They reinforce the hierarchy. Lime is always trust-verified. Coral is always trust-broken. Purple is always trust-unknown.

---

## How to Use This Document

When designing or reviewing any animation in this deck:

1. **Name the message** the animation delivers (one sentence)
2. **Identify which of the 5 narrative functions** it serves (REVEAL, TRACE, CONFLICT, WEIGHT, DISSOLVE)
3. **Check it against the 7 laws** — especially Law 1 (Motion = Meaning) and Law 4 (The Gap Is the Story)
4. **Verify the scene contract** above for the specific slide
5. **If it fails any check**, reshape it until it serves the message or remove it entirely

The audience should leave DEF CON thinking: **"I will never trust a clean diagram again without checking the spec."** Every animation exists to make that feeling land harder.
