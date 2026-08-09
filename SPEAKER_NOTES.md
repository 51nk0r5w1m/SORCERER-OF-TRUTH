# SOURCE OF TRUTH — Comprehensive Speaker Notes
## DEFCON 34 // 30-Minute Slot
### Carley's Over-Prepared Field Guide

> These notes are YOUR safety net. You don't have to say all of this.
> Pick what feels right in the moment. The goal is: never run out of things to say.

---

## SLIDE 01 — "Source of Truth" (Title/Cover)
**[~60-90 seconds] [ENERGY: calm, confident, let the room settle]**

- Don't rush this. People are still sitting down, checking phones, figuring out if they're in the right room. Let the title breathe.
- **Opening line option A:** "So... raise your hand if you've ever Googled a security question and gotten three completely different answers from three equally confident blog posts." [PAUSE — let hands go up] "Yeah. This talk is about that moment. That moment where you're staring at your screen going, 'who do I actually believe?'"
- **Opening line option B:** "I want to start with a confession. I was preparing a completely different talk — a nice, neat technical deep-dive — and I kept running into the same problem. The sources I was citing... disagreed with each other. And not in small ways. In load-bearing, 'this changes the architecture' ways."
- **Opening line option C (shorter):** "This is not a talk about one vulnerability. It's about the vulnerability underneath all the other vulnerabilities: trusting the wrong source."
- [BEAT] Let that land. Don't immediately click to the next slide.
- **What NOT to do:** Don't read the title aloud. Don't say "welcome to my talk." Don't apologize for anything. You belong here.
- **Framing:** This talk gives the audience a repeatable method — a field guide — for chasing security claims back to their actual source: RFCs, standards, verification frameworks, maintainer context, implementation reality.
- **Vibe check:** You're not here to tell people they're doing security wrong. You're here because you kept catching *yourself* doing it wrong, and you built a system to stop.
- Think of this like a pilot's checklist. Pilots don't use checklists because they're bad at flying. They use them because the stakes are too high to rely on memory and vibes.

---

## SLIDE 02 — "Who Is Carley"
**[~60-90 seconds] [ENERGY: warm, human, slightly self-deprecating]**

- **Suggested opener:** "Quick intro so you know who's yelling at you for the next 28 minutes."
- Keep this FAST. Nobody came to DEFCON to hear your resume. Hit the highlights, make it human, move on.
- **The UAP angle:** "I do something called UAP Platform Engineering. And before you ask — yes, that UAP. The government kind. My day job is building systems that take unexplained signals and turn them into structured, investigable data. Turns out that skill set transfers *perfectly* to security research, because in both domains, the first thing you have to learn is: the signal is not the conclusion."
- [LOOK AT AUDIENCE] "I don't investigate aliens. I investigate why someone *thinks* they saw one. That distinction matters."
- **Anecdote option:** "A friend once asked me, 'So you're like Mulder?' And I said, 'No, I'm the person who checks whether Mulder's blurry photo is actually a weather balloon before he files it as an X-File.'" [let them laugh]
- **Credibility without bragging:** Mention one or two concrete things (roles, projects, communities) but frame them as context, not accomplishment. "I've been in security engineering for X years, mostly building the infrastructure that other people break."
- **Transition:** "So that's me. Let's talk about how this talk happened, because it was kind of an accident."

---

## SLIDE 03 — "Inception, But RFCs"
**[~90 seconds] [ENERGY: storytelling, conspiratorial, like sharing a secret]**

- **This is the origin story. Lean into it.**
- **Suggested delivery:** "I was prepping a totally different talk. A nice technical one about [JWT/OAuth/whatever the original topic was]. And I kept pulling on threads. I'd find a recommendation, trace it to its source, and the source would say something... different. Not wrong exactly. But different enough to matter."
- "It was like that scene in Inception where they go one level deeper and the rules change. Except instead of dreams, it was RFCs. And instead of Leonardo DiCaprio, it was me at 2am with too much coffee going 'wait, does RFC 6749 actually say that?'"
- [PAUSE] "Spoiler: it usually doesn't say what the blog post says it says."
- **The UAP lens:** "In my UAP work, we have a saying: an unexplained signal is an input to investigate, not a conclusion to inherit. That's exactly what was happening with security guidance. People were inheriting conclusions instead of investigating signals."
- **The core tension:** "Here's the thing about polished summaries — blog posts, StackOverflow answers, even official-looking documentation. They're useful. I'm not going to stand up here and tell you to never read a blog post. But useful is not the same as authoritative. A good summary can make you faster. But it can't make you *right*."
- **What NOT to do:** Don't get into specific technical details yet. This is about the *meta-problem*. Save the case studies.
- **Transition:** "So I scrapped the original talk and built this one instead. And it starts with a question: what does your information diet actually look like?"

---

## SLIDE 04 — "The Feed"
**[~60-90 seconds] [ENERGY: slightly ominous, observational]**

- **Important:** There's a caption baked into the slide. DON'T read it verbatim. Riff on it.
- **Suggested delivery:** "Look at this. This is your feed. My feed. Everyone's feed. Twitter, Hacker News, Reddit, LinkedIn — it all looks the same. A security hot take from someone with 50K followers sits right next to an RFC author's correction, and they get the same visual weight. Same font. Same box. Same scroll velocity."
- "The feed is an authority-flattening machine. It takes a peer-reviewed paper and a shower thought and puts them in the same container. And your brain — my brain — we process them at the same speed."
- **Relatable moment:** "How many of you have retweeted a security take and then found out a week later it was... not quite right?" [PAUSE] "I have. More than once. Because the feed doesn't have a trust hierarchy. It has an engagement hierarchy. And those are not the same thing."
- **Anecdote option:** "I once saw a tweet about JWT security that got 2,000 retweets. The RFC author quote-tweeted it with a correction. The correction got 47 retweets. That's the feed working as designed."
- **What NOT to do:** Don't shame anyone for using social media for security info. That's most of us. The problem isn't the feed — it's treating the feed as a source of truth instead of a starting point for investigation.
- **Transition:** "So if the feed can't tell us what to trust... what can? We need a hierarchy."

---

## SLIDE 05 — "When Guidance Conflicts"
**[~90 seconds] [ENERGY: direct, assertive, this is the thesis]**

- **This is the main operating rule for the entire rest of the talk. Make it land.**
- **Suggested delivery:** "Here's the situation that happens every single week in every security team I've ever been on. You're implementing something. You check the docs. You check OWASP. You check a blog post from a well-known security person. And they disagree. Not subtly. Fundamentally."
- "One says use localStorage. Another says never use localStorage. One says the implicit flow is fine. Another says it's been deprecated for years. What do you do?"
- [LOOK AT AUDIENCE] "Most people do one of two things. They either go with whoever sounds most confident — which, let's be honest, is a terrible heuristic — or they go with whatever their current codebase already does, which is just precedent, not authority."
- **The hierarchy pitch:** "What we need is a conflict resolution system. Not a ranking of who's smartest. A hierarchy of *evidence types*. When source A says X and source B says Y, which source type wins? That's not snobbery. That's engineering."
- **Analogy:** "Think about it like courts. A Supreme Court ruling overrides an appeals court ruling, which overrides a district court ruling. Not because the Supreme Court judges are smarter — sometimes they're not — but because the system needs a way to resolve conflicts. We need the same thing for security guidance."
- **Transition:** "So let me show you what that hierarchy looks like."

---

## SLIDE 06 — "Source Hierarchy"
**[~90-120 seconds] [ENERGY: methodical, building, teacher-mode]**

- **Explain the hierarchy BEFORE any case study.** If you jump to examples first, the examples will hijack the talk and the hierarchy will feel like an afterthought.
- **Walk through each tier.** Something like:
  - **Tier 1 — Specifications and Standards:** "RFCs, W3C specs, NIST publications. These are the constitutional law of security. They're not always right, and they're not always current, but they are the *canonical* source. When you trace a claim, this is where the trail should end."
  - **Tier 2 — Verification Frameworks:** "OWASP ASVS, CIS Benchmarks, BSIMM. These are curated, peer-reviewed, versioned. They translate specs into actionable checklists. They're excellent — but they're interpretations of Tier 1, not replacements for it."
  - **Tier 3 — Maintainer Context:** "GitHub issues, changelogs, commit messages, mailing list discussions. This is where you find out *why* a decision was made. The spec says what; the maintainer says why and under what constraints."
  - **Tier 4 — Implementation Reality:** "Your actual codebase. Your actual threat model. Your actual users. Because sometimes the spec says one thing and your system can't do it, and you need to make a defensible tradeoff."
  - **Below all tiers — Blog posts, tweets, AI summaries:** "These are starting points, not endpoints. They point you toward the hierarchy. They don't replace it."
- **Key phrase:** "The hierarchy decides how to arbitrate, not what to ignore. I'm not telling you to stop reading blog posts. I'm telling you to stop *stopping* at blog posts."
- **Transition:** "Now that you have the hierarchy, you need a process. Four questions that turn a security claim into a traced, defensible decision."

---

## SLIDE 07 — "Four Questions"
**[~120 seconds] [ENERGY: structured, rhythmic, each question is a beat]**

- **These four questions are the engine of the whole talk. Every case study that follows is just these four questions applied to a specific topic.**
- **Reveal them one at a time if the slide supports it. Pause between each.**
- **Question 1: "What does the surface answer say?"**
  - "This is the Google result. The StackOverflow accepted answer. The first thing you find. Don't skip it — document it. You need to know what the *conventional wisdom* is before you can test it."
  - [PAUSE]
- **Question 2: "What do OWASP, RFC, ASVS, or the relevant authority say?"**
  - "Now you go up the hierarchy. What does the actual standard say? Not what someone says the standard says. The standard itself. Open the RFC. Read the section. I know it's boring. Do it anyway."
  - [PAUSE]
- **Question 3: "What is the load-bearing difference?"**
  - "This is where it gets interesting. Usually the surface answer and the authority agree on *most* things. But there's a gap. A difference. And that difference is almost always the thing that matters for security. It's the assumption that got dropped in translation."
  - [PAUSE]
- **Question 4: "What does this force us to ask next?"**
  - "This is the handoff from reading to engineering. Once you find the gap, you have to decide: does this gap matter for *my* system? My threat model? My users? This is where research becomes a decision."
- [BEAT] "Four questions. That's it. The rest of this talk is just running these four questions on real security topics. Ready?"
- **Transition:** "But first — one more framing slide. Because every simplification you've ever read made a choice."

---

## SLIDE 08 — "Simplification"
**[~60 seconds] [ENERGY: philosophical, contemplative, slight warning tone]**

- **Let the image/caption on the slide breathe. Don't talk over it immediately.**
- [PAUSE — 3-4 seconds of silence while they read]
- **Suggested delivery:** "Every simplification inherits assumptions. About who the attacker is. About who the user is. About what 'operating reality' means. When someone says 'just use httpOnly cookies' — that's a simplification. It assumes your threat model is XSS, your architecture supports cookies, your API is same-origin, and your deployment can handle CSRF tokens. That's a LOT of assumptions in five words."
- **Analogy:** "It's like saying 'just eat healthy.' Technically true. Completely useless without context. Healthy for whom? With what budget? What allergies? What access to groceries?"
- "The simplification isn't wrong. It's incomplete. And incomplete advice that sounds complete is more dangerous than no advice at all, because it stops you from asking the next question."
- **Transition:** "Alright. Let's drill. First case study: JWT storage. The internet's favorite argument."

---

## SLIDE 09 — "Case 01: JWT Storage"
**[~120-150 seconds] [ENERGY: engaged, slightly amused, 'you've all seen this fight']**

- **Suggested opener:** "Ah, JWT storage. The Vim-vs-Emacs of web security. Where should you put the token? localStorage? Cookies? sessionStorage? A sticky note on your monitor?" [let them laugh]
- "If you Google this, you will get — I'm not exaggerating — completely contradictory advice from equally reputable sources. 'Never use localStorage, it's vulnerable to XSS.' 'Cookies are vulnerable to CSRF, use localStorage.' 'Use httpOnly cookies.' 'httpOnly cookies don't protect against...' and on and on."
- **Run the four questions:**
  - **Q1 Surface answer:** "The surface answer is usually 'don't use localStorage because XSS.' Simple. Clean. Feels right."
  - **Q2 Authority:** "But what does the actual threat model say? OWASP ASVS has specific requirements about token storage. The key phrase — and this is the kind of awkward sentence that does real security work — is 'JavaScript-accessible storage.' Not localStorage specifically. *JavaScript-accessible storage.* That's a bigger category."
  - **Q3 Load-bearing difference:** "The difference is: the surface answer made it about localStorage vs cookies. The authority makes it about whether JavaScript can reach the token *at all*. That's a fundamentally different question. It changes what solutions are valid."
  - **Q4 Next question:** "So now you have to ask: in *my* architecture, what storage mechanisms are JavaScript-accessible? And what's my actual XSS exposure? And suddenly you're doing real security engineering instead of cargo-culting a blog post."
- **What NOT to do:** Don't teach XSS mechanics. The audience knows XSS. The point is the methodology, not the vulnerability.
- **Anecdote option:** "I reviewed a codebase once where they moved tokens from localStorage to httpOnly cookies — great, right? — but they also had a `/api/token` endpoint that returned the token in the response body. So JavaScript could still access it. They'd followed the surface answer perfectly and gained zero security."
- **Transition:** "One more thing about this case before we move on..."

---

## SLIDE 10 — "Default Decision"
**[~60-90 seconds] [ENERGY: pointed, making you think]**

- **Don't repeat the baked-in line on the slide. Expand on it.**
- **Suggested delivery:** "Every default is a decision. When a framework defaults to localStorage, that's not neutral. Someone chose that. When a library defaults to httpOnly cookies, someone chose that too. And they chose it based on *their* threat model, *their* user base, *their* deployment architecture."
- "The problem is: defaults feel like absence of choice. They feel like the 'normal' thing. But they're not normal — they're someone else's priorities baked into your system."
- **Relatable moment:** "How many of you have inherited a codebase and thought 'why is it done this way?' and the answer was 'that's just the default'? [PAUSE] And then you traced it back and found out the default was set in 2016 for a completely different threat landscape?"
- "Defaults are not neutral. They're *frozen decisions*. And frozen decisions don't age well in security."
- **Transition:** "Speaking of decisions that haven't aged well... let's talk about OAuth. Specifically, a diagram that refused to die."

---

## SLIDE 11 — "Case 02: OAuth Implicit Flow"
**[~120-150 seconds] [ENERGY: investigative, 'follow me down this rabbit hole']**

- **This slide is about SOURCE DRIFT — not about OAuth itself.**
- **Suggested delivery:** "The OAuth implicit flow. If you've built a single-page app in the last decade, you've probably seen this. It was *the* recommended flow for browser-based apps. Tutorials everywhere. Diagrams in official docs. Conference talks. Blog posts. The works."
- "One problem: it was deprecated. The OAuth working group published the Browser-Based Apps BCP — that's 'Best Current Practice' — and it explicitly says: don't use the implicit flow. Use authorization code with PKCE instead."
- "But here's the thing that fascinated me: *years* after the deprecation, the old diagrams were still showing up. In vendor documentation. In tutorials. In official-looking guides. Why?"
- **The insight:** "Because documentation is a product. It's authored, published, cached, indexed, linked to, bookmarked. It has *inertia*. A deprecation notice in an RFC doesn't reach into every tutorial that cited the old advice and update it. The old advice just... persists. Like a ghost."
- **Run the four questions briefly:**
  - Q1: "Surface answer says use implicit flow."
  - Q2: "The BCP says don't."
  - Q3: "The load-bearing difference is that the surface answer is from 2012 and the authority is from 2021."
  - Q4: "Now you have to ask: is *my* documentation current? Are *my* examples current?"
- **What NOT to do:** Don't vendor-shame. The point isn't that [company X] had bad docs. The point is that *all* docs drift, and you need to check whether a recommendation has moved.
- **Anecdote option:** "I found a major cloud provider's OAuth tutorial still recommending implicit flow in [year]. Not because they're incompetent — because docs are a product and products have update cycles. The spec moved faster than the tutorial."
- **Transition:** "Let's step back for a second before the next case..."

---

## SLIDE 12 — "The Model"
**[~45-60 seconds] [ENERGY: brief pause, let them breathe, philosophical]**

- **This is a breather slide. A palate cleanser between case studies.**
- Let the baked-in caption do most of the work. Just add a sentence or two.
- **Suggested delivery:** "We're halfway through. Notice what we've been doing: we're not learning new vulnerabilities. We're learning to see the gap between what we're told and what the source actually says. The model — any model, any abstraction — compresses reality. And compression is lossy."
- "The next case is password hashing. And in password hashing, the model gets compressed into a single verb: 'hash.' As if that's all there is to it."
- [BEAT]
- **Transition:** "Let's see what 'just hash it' actually means when you open the spec."

---

## SLIDE 13 — "Case 03: Password Hashing"
**[~120-150 seconds] [ENERGY: precise, almost deadpan, 'the details matter']**

- **Suggested opener:** "Password hashing. The thing everyone thinks they know how to do. 'Just use bcrypt.' 'No, use Argon2.' 'What about scrypt?' 'Just hash it.'" [PAUSE] "That word 'just' is doing a LOT of heavy lifting."
- **Run the four questions:**
  - **Q1 Surface answer:** "'Use bcrypt' or 'use Argon2id.' Simple. One function call. Done."
  - **Q2 Authority:** "OWASP has specific guidance. NIST has SP 800-63B. And here's what they actually say: it's not just *which* algorithm — it's *what parameters*. Argon2id with what memory cost? What iteration count? What parallelism? bcrypt with what work factor? These aren't optional details. They're the security."
  - **Q3 Load-bearing difference:** "The surface answer says 'hash it.' The authority says 'hash it with these specific parameters calibrated to your threat model and your hardware.' That gap between 'hash' and 'hash with parameters' is the difference between a defensible decision and a vibe."
  - **Q4 Next question:** "Now you have to ask: what are *my* parameters? What hardware am I running? What's my latency budget? How does this interact with my rate limiting?"
- **Key phrase:** "Defensibility requires numbers, not vibes. If someone asks 'why did you choose those parameters?' and your answer is 'a blog post said so,' that's not defensible. If your answer is 'NIST SP 800-63B recommends X, calibrated to our hardware at Y ms per hash,' that's defensible."
- **Anecdote option:** "I audited a system that used Argon2id — the right algorithm! — with the minimum possible memory parameter. It was technically Argon2id. It was functionally about as secure as MD5 with salt. The algorithm was right. The parameters were a participation trophy."
- **What NOT to do:** Don't turn this into an Argon2 lecture. The audience doesn't need to learn Argon2. They need to learn that 'which algorithm' is the wrong question. 'Which algorithm with what parameters against what threat model' is the right question.
- **Transition:** "One more case study. And for this one, I need to borrow from the Matrix."

---

## SLIDE 14 — "There Is No Spoon"
**[~45-60 seconds] [ENERGY: playful, cinematic, the room should smile]**

- **Use the Matrix reference LIGHTLY. Don't overdo it.**
- **Suggested delivery:** "'There is no spoon.' The kid in the Matrix says it to Neo, and it's one of the best lines in the movie because it reframes the entire problem. Neo is trying to bend the spoon. The kid says: don't try to bend the spoon. Instead, realize the truth — there is no spoon. Then you'll see it's not the spoon that bends, it's only yourself."
- "We're about to look at CORS. And CORS is the 'spoon' of web security. Everyone tries to understand the *CORS error*. But the CORS error is not the security boundary. The CORS error is a *symptom* of the security boundary. The actual boundary is the Same-Origin Policy. And once you realize that, the error stops being confusing."
- [BEAT] "There is no CORS error. There is only the Same-Origin Policy, bending around your requests."
- **What NOT to do:** Don't spend too long on the Matrix. It's a metaphor. Get in, land it, get out.
- **Transition:** "Alright, last case study. CORS."

---

## SLIDE 15 — "Case 04: CORS"
**[~120-150 seconds] [ENERGY: the final drill, bring it all together]**

- **Suggested opener:** "CORS. Cross-Origin Resource Sharing. The thing that makes every junior developer's first week a nightmare. That red error in the console. 'Access to fetch has been blocked by CORS policy.' And what does everyone do? They Google it, find a StackOverflow answer that says 'add Access-Control-Allow-Origin: *', and the error goes away. Problem solved." [PAUSE] "Problem absolutely not solved."
- **Run the four questions:**
  - **Q1 Surface answer:** "'Set the CORS header to allow your origin.' Or worse: 'set it to * and move on.'"
  - **Q2 Authority:** "The Fetch specification and the Same-Origin Policy define what CORS actually is. CORS doesn't *add* security. It *relaxes* security. The default is: cross-origin requests are blocked. CORS is the mechanism that says 'okay, this specific origin is allowed through.' It's a door, not a wall."
  - **Q3 Load-bearing difference:** "The surface answer treats the CORS error as the problem. The authority treats the Same-Origin Policy as the security boundary. The CORS error is just the SOP doing its job. When you 'fix' CORS by adding a wildcard, you're not fixing anything — you're removing the lock."
  - **Q4 Next question:** "Now you have to ask: which origins actually *need* access? What credentials are involved? Is my preflight configuration correct? Am I exposing headers I shouldn't be?"
- **The pattern is visible now:** "Surface answer, authority, omitted assumption, next question. It's the same every time. JWT storage, OAuth, password hashing, CORS — the methodology works the same way because the *failure mode* is the same: compressing a nuanced standard into a simple answer and losing the load-bearing part."
- **Anecdote option:** "The best CORS misconfiguration I ever saw was a server that reflected the Origin header back in Access-Control-Allow-Origin. Any origin was allowed. It was the programmatic equivalent of 'sure, come on in, I trust everyone.' It passed all the automated scans because technically the header was present. Technically correct, the best kind of wrong."
- **Transition:** "Four case studies. Same four questions. Same pattern. Now let me show you where this gets... recursive."

---

## SLIDE 16 — "Consensus Engine"
**[~90-120 seconds] [ENERGY: ominous, revelatory, 'here's the twist']**

- **Let the baked-in caption stand for a moment. Then build on it.**
- **Suggested delivery:** "Here's something that should terrify you. Sources train on each other. Blog Post A cites Blog Post B. Blog Post B was based on a StackOverflow answer. The StackOverflow answer was based on a tweet. The tweet was based on a misreading of an RFC. And now all four sources agree with each other. Consensus!"
- [PAUSE] "Except the consensus is wrong. It's a closed loop. It looks authoritative because multiple sources say the same thing. But they're all echoing the same original mistake."
- **The word for this:** "In journalism, this is called 'circular reporting.' The CIA has a term for it too: 'self-licking ice cream cone.' In our world, I call it a consensus engine. It manufactures agreement without manufacturing truth."
- **Make it real:** "Remember the OAuth implicit flow? For years, every tutorial said 'use implicit flow' because every *other* tutorial said 'use implicit flow.' The tutorials weren't lying. They were consensing. They were all pointing at each other instead of pointing at the spec."
- **The bridge to AI:** [SLOW DOWN] "That loop we just identified — that recursive citation loop — AI lives inside it. Every language model trained on the web inherits this recursion. When ChatGPT tells you to use the implicit flow, it's not because it read the RFC. It's because ten thousand blog posts said so, and ten thousand blog posts trained the model."
- **Transition:** "Which brings us to the elephant in the room..."

---

## SLIDE 17 — "AI Exoskeleton"
**[~90-120 seconds] [ENERGY: pragmatic, not anti-AI, nuanced]**

- **This is NOT an anti-AI slide. Be deliberate about this.**
- **Suggested delivery:** "I am not going to stand up here and tell you not to use AI. I use AI. I used AI while preparing this talk. AI is incredibly useful. It's fast. It's tireless. It's good at surfacing things you wouldn't have searched for."
- "But AI is an exoskeleton, not a skeleton. It amplifies your research. It doesn't replace it. The moment you treat an AI answer as a primary source, you've made the same mistake we've been talking about for the last 20 minutes — you've taken a summary and treated it as authority."
- **Be vulnerable:** "Full transparency: while preparing this talk, I asked an AI about RFC 7519 — the JWT spec — and it got a detail wrong. Not a huge thing. But wrong enough that if I'd cited it without checking, I'd have been up here telling you something incorrect. The method I'm teaching you — check the source — should correct the speaker too. Including me."
- **Practical framing:** "Here's how I use AI in security research: I use it to generate the *questions*, not the *answers*. 'What are the key sections of RFC 6749 I should read for OAuth authorization code flow?' Great question for AI. 'Is the implicit flow secure?' Terrible question for AI, because the answer depends on the source, and AI doesn't distinguish sources."
- **The rule:** "AI is useful when the source boundary is explicit. When you know what's AI-generated and what's RFC-authored, AI is a superpower. When that boundary blurs, AI is a consensus engine wearing a lab coat."
- **What NOT to do:** Don't be preachy about AI. Half the room uses Copilot daily. Meet them where they are.
- **Transition:** "So if AI can't be the root of trust, and blog posts can't be the root of trust, and even documentation drifts... what can? Well... humans. Specific, traceable humans."

---

## SLIDE 18 — "Find The Humans"
**[~90-120 seconds] [ENERGY: warm, grounding, the emotional heart of the talk]**

- **This is the emotional center. Slow down.**
- **Suggested delivery:** [SLOW DOWN] "Behind every RFC, there's a person. Behind every commit, there's a person. Behind every OWASP guideline, there's a working group of people who argued about the wording. Security doesn't come from documents. Documents come from humans. The documents are just how humans talk to the future."
- "When I trace a JWT recommendation back to RFC 7519, I don't stop at the spec. I look at who authored it. I look at their other work. I look at the mailing list discussions where they debated the design. Because *that's* where you find the assumptions. The spec is the conclusion. The discussion is the reasoning."
- **The UAP callback:** "This is exactly what I do in UAP work. An unexplained signal — a radar return, a sensor anomaly — is just data. It becomes information only when a human traces its provenance, establishes context, and makes a judgment call. Research is the same. A citation is just data. Context makes it information."
- **The circuit board image:** If there's a circuit-board image on this slide, reference it: "Look at this circuit board. Every trace on it was designed by a person. Every routing decision, every component placement — there's a human decision behind it. Technical infrastructure has human fingerprints everywhere. Our job is to find them."
- **Practical advice:** "When you're tracing a security claim: find the human. Who wrote this recommendation? What was their context? What constraints were they working under? That's not stalking — that's due diligence. That's how you turn a citation into an understanding."
- **Transition:** "Okay. Let me give you something concrete to take home."

---

## SLIDE 19 — "Field Guide Checklist"
**[~90-120 seconds] [ENERGY: practical, actionable, 'write this down']**

- **This is the take-home artifact. Make it feel like a gift.**
- **Suggested delivery:** "This is the checklist. This is what I actually use. Every item on it turns research into a defensible engineering action. If you take nothing else from this talk, take this."
- **Walk through each item on the checklist briefly.** Don't read them verbatim — summarize and add color:
  - "Check the date. How old is this guidance? Has the spec been superseded?"
  - "Check the source tier. Is this a blog post citing another blog post, or did someone actually open the RFC?"
  - "Find the assumption. What threat model is this advice based on? Does it match yours?"
  - "Run the four questions. Surface answer. Authority. Gap. Next question."
  - "Make it defensible. Can you explain *why* you made this choice to an auditor? To a peer reviewer? To future-you at 2am during an incident?"
- **Let the audience feel the callback:** "Everything we did in the case studies — JWT, OAuth, password hashing, CORS — was a drill for this checklist. Now you've done it four times. You've seen the pattern. The checklist just makes it repeatable."
- **Humor option:** "I know what you're thinking: 'Carley, I don't have time to trace every security decision back to an RFC.' And you're right. You don't. That's why you have the checklist. It tells you *when* to trace and *how deep* to go. Not everything needs the full treatment. But the things that do? You'll know."
- **Transition:** "One more slide and we're done."

---

## SLIDE 20 — "Close"
**[~60-90 seconds] [ENERGY: strong, grounded, leave them with the method]**

- **Close on METHOD, not prescriptions.**
- **Suggested delivery:** "I didn't come here to tell you which hash algorithm to use. Or where to store your JWTs. Or how to configure CORS. Those answers change. They depend on your system, your threat model, your constraints."
- "I came here to give you a method. A way to take any security claim — from a blog, from a conference talk, from an AI, from me — and trace it back to something you can verify. Something defensible. Something real."
- **The UAP callback — one last time:** "Follow the signal. Classify the evidence. Make the call. That's what UAP Platform Engineers do with unexplained phenomena, and that's what security engineers should do with unexplained guidance."
- [LOOK AT AUDIENCE] "You are the root of trust. Not the blog post. Not the AI. Not the influencer with the blue checkmark. You, doing the work of tracing claims to their source."
- [PAUSE]
- "The source of truth is not a document. It's a practice."
- [BEAT]
- **What NOT to do:** Don't add new information. Don't introduce new examples. Don't say "one more thing." This is the landing. Stick it.
- **If there's time for Q&A:** "I'll be around after for questions. Find me. I love this stuff."

---

## SLIDE 21 — "The Circuit Remembers" (Memorial/End)
**[~15-30 seconds] [ENERGY: quiet, reverent, let the room sit with it]**

- **Do not over-talk this slide.**
- If there's a Bob Moog quote on the slide, let it display. Let the room read it. Let the silence do the work.
- If you need to say anything: "Thank you." That's it.
- [LONG PAUSE — 5-8 seconds of silence]
- If the audience claps, let them. If they don't, that's fine too. The talk is done.
- **If you want to add one tiny thing:** "In memory of the people who built the circuits we all depend on. The ones who wrote the specs. The ones who filed the bugs. The ones who stayed up late arguing about the wording. The circuit remembers."
- Then: "Thank you. I'm Carley. Come find me."

---

## GENERAL TIMING NOTES

| Section | Slides | Target Time |
|---------|--------|-------------|
| Intro & Framing | 01-04 | ~4-5 min |
| Methodology | 05-08 | ~5-6 min |
| Case Studies | 09-15 | ~12-14 min |
| Meta & Closing | 16-21 | ~6-8 min |
| **Total** | | **~27-30 min** |

## EMERGENCY SHORTCUTS (if running long)
- Slide 08 (Simplification): Skip the analogy, just say "every simplification inherits assumptions" and move on
- Slide 12 (The Model): Can be done in 15 seconds flat
- Slide 14 (There Is No Spoon): Skip the Matrix explanation if the room already gets it
- Any case study: You can compress Q3+Q4 into one sentence if needed

## EMERGENCY STRETCHES (if running short)
- Ask for a show of hands on slide 04 or 05
- Tell a longer version of any anecdote
- On slide 19, walk through each checklist item with a real example
- Open the floor for one question before the close

## MANTRAS
- The signal is not the conclusion.
- Useful is not authoritative.
- Defaults are frozen decisions.
- Defensibility requires numbers, not vibes.
- The source of truth is a practice, not a document.
- Follow the signal. Classify the evidence. Make the call.
