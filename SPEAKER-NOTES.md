# Source of Truth — Speaker Notes

DEF CON 34 · Sun 2026-08-09 · 12:30 · LVCC West 3
Carley Fant · UAP Platform Engineer

Toggle notes in deck: press **N**

---

## Slide 01 — Source of Truth (Cover)

This is not a vulnerability talk. This is about the moment you Google something, get a clean answer, and ship it — and three months later your pentest report says you made the wrong call.

"Trace the signal. Classify the evidence. Keep the receipts." — that's the method. By the end you'll have a repeatable protocol for turning conflicting security guidance into defensible engineering decisions.

Real example to anchor it: I was building an OAuth integration for a platform and the first three Google results said "use implicit flow." Clean diagrams, vendor docs, looked legit. The fourth result was a draft BCP that said implicit flow is deprecated. Three polished sources were wrong. One ugly IETF draft was right. That moment is why this talk exists.

---

## Slide 02 — Who Is Carley (Bio)

Keep this under 30 seconds. You're not reading a resume.

"I build secure cloud and identity platforms. AppSec, IAM, software delivery pipelines. The 'UAP Platform Engineer' thing is real — I treat anomalous signals the same way whether they're in a SIEM or in a spec: follow the evidence, test the model, keep the receipts."

If someone asks later: background is hands-on cloud security, AWS/Azure identity federation, CI/CD pipeline hardening, OAuth/OIDC implementations. The talk comes from doing the work, not just reading about it.

---

## Slide 03 — Inception, But RFCs

"I was prepping a different talk — a deep dive on token storage vulnerabilities. And I kept hitting the same wall: every source I found contradicted the last one. The real talk was hiding underneath the technical talk."

Concrete story: Searched "JWT best practices" and got:
- A Medium article saying localStorage is fine
- An OWASP cheat sheet saying never use localStorage
- A vendor tutorial using localStorage in their official SDK example
- Stack Overflow answers from 2019 citing specs from 2015

The search result was fast. The diagram was clean. But the citation trail changed the question entirely. The question stopped being "where do I put the token?" and became "why do these sources disagree, and who gets to be right?"

This is the UAP lens: an unexplained signal is an input to investigate, not a conclusion to inherit.

---

## Slide 04 — The Feed (Poster)

Don't repeat the caption. Just let it land, then say:

"This is what research looks like for most engineers. A feed. Everything arrives at the same size, same font, same authority level. A tweet from a CISO, a blog post from a vendor, an RFC — they all look the same in your search results. The feed flattens authority, context, and time."

Real example: In 2024, a viral tweet said "CORS is broken by design" and got 12K retweets. The actual CORS spec authors had a blog post with 200 views explaining exactly why the design choice was made. The feed made the hot take louder than the spec authors.

---

## Slide 05 — When Guidance Conflicts

"When sources disagree, sort the room. That's the operating rule for the rest of this talk."

Real example: You're setting up AWS SSO for your org. AWS docs say use AWS IAM Identity Center (the managed service). A conference talk from a respected practitioner says build your own IdP federation with Okta because you need fine-grained ABAC. A tutorial says just use IAM users with MFA. Three legitimate sources, three different answers.

The hierarchy is not about ignoring sources. It's conflict resolution. When the vendor docs, the conference talk, and the tutorial disagree, you need a way to break the tie. That's what we're building here.

This applies everywhere — not just security. Should you use AWS Landing Zone Accelerator or build your own? AWS Control Tower or custom Organizations setup? The vendor slide deck says use their managed service. The conference talk says the managed service doesn't handle your edge case. The hierarchy tells you how to arbitrate.

---

## Slide 06 — Source Hierarchy

Walk through each tier with a real example:

**Tier 1 — Normative standards (RFCs, BCPs):** RFC 6749 defines OAuth 2.0. When someone says "use implicit flow," you go here first. The Security BCP (draft-ietf-oauth-security-topics) says don't. RFC wins.

**Tier 2 — Verification frameworks (OWASP ASVS, WSTG):** OWASP ASVS V3.5 says "Verify that the application uses a server-side session or token-based authentication mechanism." That's testable. You can write a check for it. This tier turns consensus into requirements you can put in a Jira ticket.

**Tier 3 — Vendor and maintainer docs:** AWS docs, Auth0 quickstarts, Azure AD guides. These are valuable but optimized for adoption, not for your specific threat model. Auth0's quickstart puts tokens in localStorage because it reduces support tickets. That's a product decision, not a security decision.

**Tier 4 — Conference research:** This is where you hear about attacks before standards catch up. DEF CON talks, Black Hat presentations, academic papers. "We broke OAuth implicit in production" — that's Tier 4 giving you signal that Tier 1 hasn't formalized yet.

**Tier 5 — Tutorials and AI summaries:** Stack Overflow, Medium, ChatGPT output. Orientation only. These are on-ramps, not destinations. You start here but you don't stop here.

The hierarchy decides how to arbitrate, not what to ignore. You still read Tier 5 — you just don't cite it in your architecture decision record.

---

## Slide 07 — Four Questions

These four questions are the protocol. Every case study we're about to do follows this pattern.

**1. What does the surface answer say?**
"Use localStorage." "Add Access-Control-Allow-Origin: *." "Hash the password." These are the Google-result answers. They're not wrong — they're incomplete.

**2. What do OWASP, RFC, ASVS, or the relevant authority say?**
Go up the hierarchy. Find the normative source. Example: OWASP says use HttpOnly cookies for bearer tokens. RFC 6265bis defines cookie security attributes. Now you have authority.

**3. What is the load-bearing difference?**
This is the hard one. What specific assumption changed between the surface answer and the authority? For JWT storage: the load-bearing difference is whether JavaScript can access the token. That single capability change — script reachability — is what separates "works" from "secure."

**4. What does this force us to ask next?**
This is the handoff from reading to engineering. If HttpOnly cookies are the answer, now you need to ask: how does my SPA get the token without JavaScript access? That leads you to BFF patterns, token-mediating backends, and server-side token handling. The fourth question opens the next investigation.

---

## Slide 08 — Simplification (Poster)

Let the image land. Then:

"Every simplification inherits assumptions. When someone says 'just hash the password,' they've compressed away the choice of algorithm, the cost parameters, the salt strategy, and the entire attacker economics model. That compression is useful — but it's not neutral."

Real example: "Just use AWS Control Tower." That sentence compresses away: which guardrails, which regions, which OU structure, which customizations, whether the built-in identity provider meets your compliance requirements, whether the default SCPs match your threat model. The simplification is useful for getting started. It's dangerous for making decisions.

Transition: "Let's drill this. First case: JWT storage."

---

## Slide 09 — Case 01: JWT Storage

Don't teach XSS. This audience knows XSS. Use the storage conflict to teach the method.

"Surface answer: put the JWT in localStorage so your SPA can read it. That's what the tutorial says. That's what the vendor quickstart shows. It works."

"Source trail: OAuth Security BCP says bearer tokens in browser apps should not be accessible to JavaScript. OWASP ASVS V3.5 says session tokens must use HttpOnly cookie flags. OWASP HTML5 Security Cheat Sheet says don't store sensitive data in localStorage."

"Load-bearing difference: JavaScript-accessible storage. That's the phrase that does the security work. It's awkward to say. It's not catchy. But it precisely names the capability that changes the threat model. If script can reach the token, XSS becomes token theft. If script can't reach the token, XSS is still bad but the blast radius is different."

"Next question: if I can't use localStorage, how does my SPA authenticate? This pushes you toward the Backend-for-Frontend pattern (BFF), where a server-side component holds the token and proxies authenticated requests. That's a real architectural decision — not a storage location."

Real war story if time allows: "I've reviewed three production apps that stored JWTs in localStorage because the Auth0 quickstart showed it that way. Auth0 even has a blog post explaining why they do it — reduced support tickets. Product decision, not security decision."

---

## Slide 10 — Default Decision (Poster)

Don't repeat the caption. Say:

"Defaults are not neutral. They encode priorities. When a framework defaults to permissive CORS, that's a decision about developer experience over security. When AWS defaults Control Tower to us-east-1, that's a decision about getting started fast over data residency."

"Every default you accept is a decision you didn't make. The question is whether that default's priorities match your threat model."

Transition into OAuth: "Speaking of defaults that outlive their context — let's look at what happens when a vendor diagram becomes a fossil."

---

## Slide 11 — Case 02: OAuth Implicit

"Surface answer: use implicit flow. Here's a beautiful diagram showing how it works. Authorization server, redirect, access token in the fragment. Clean, professional, vendor-stamped."

"The problem: that diagram is a fossil. OAuth 2.0 Security BCP (draft-ietf-oauth-security-topics) explicitly says: 'The implicit grant MUST NOT be used.' That's not a suggestion. That's normative language."

"But the diagram persists. Why? Because documentation is a product too. Vendor docs have SEO, editorial calendars, approval workflows. Updating a diagram requires a designer, a reviewer, and a product manager to agree it's worth the sprint points. So the old diagram stays live while the spec moves on."

Real examples:
- "I found implicit flow diagrams in production vendor documentation in 2025 — four years after the BCP said stop."
- "Microsoft's Azure AD docs had implicit flow as the recommended browser flow until 2023. Auth0 deprecated it in their SDKs but the old docs pages still ranked #1 on Google."
- "This is the same pattern as AWS architecture diagrams showing three-tier with NAT gateways when the actual recommendation moved to VPC endpoints and PrivateLink."

"Hidden assumption: 'documented' does not mean 'recommended.' A page that's live and indexed can outlive the recommendation that created it."

"Decision test: which current flow matches your client's threat model? For browser SPAs in 2026, that's Authorization Code with PKCE. No exceptions. The BCP is clear."

---

## Slide 12 — The Model (Poster)

Let the caption carry it: "The model is not the system."

"When we say 'hash the password,' we're working with a model — a compressed version of a much more complex system. The model says: input goes in, hash comes out, attacker can't reverse it. The system says: which algorithm, what parameters, how much memory, how much time, what's the attacker's GPU budget."

"Models are useful. They're how we think. But every model edits out details that the system keeps running."

Transition: "Let's look at what happens when the model compresses password hashing into a single verb."

---

## Slide 13 — Case 03: Password Hashing

"Surface answer: hash the password. Maybe salt it. SHA-256 should work, right?"

"Source trail: OWASP Password Storage Cheat Sheet says use Argon2id with specific parameters. Not just 'use Argon2' — specific parameters: minimum 19MB memory, minimum 2 iterations, 1 degree of parallelism. These numbers aren't arbitrary. They're calibrated against attacker economics."

"Load-bearing difference: the parameter table IS the security claim. 'Use bcrypt' is not a security decision. 'Use bcrypt with cost factor 12, which takes ~250ms on our production hardware and ~$30K per billion guesses on commodity GPUs' — that's a security decision."

Real numbers to cite:
- MD5: billions of hashes per second on a GPU. Cost to crack: pennies.
- bcrypt cost 10: ~100 hashes/second on a GPU. Better, but tunable.
- Argon2id (19MB, 2 iterations): memory-hard means you can't parallelize on GPUs the same way. The 19MB requirement means each hash attempt needs 19MB of RAM. A GPU with 24GB VRAM can only run ~1,200 parallel attempts instead of millions.
- "The gap between 'hash' and '19MB per guess' is where the real decision lives."

Real war story: "I audited a platform that used SHA-256 with a salt for password storage. Technically 'hashed and salted.' But the entire password database was crackable for about $200 on AWS GPU instances. They thought they'd checked the box. The box was the wrong shape."

If you're building this today: Argon2id. OWASP's minimum parameters. Benchmark on your production hardware to find the highest cost your login latency can tolerate. That's defensibility with numbers, not vibes.

---

## Slide 14 — There Is No Spoon

"The map is not the territory. Every abstraction bends your perception. A CORS error in the browser console is a map — it tells you something is blocked. But the territory is the actual HTTP request-response pair, the server's access control logic, and the browser's enforcement policy. They're not the same thing."

"Research is how we find the residuals — the places where the map quietly edits reality."

Use the Matrix reference lightly: "Like the spoon in the Matrix — it's not the spoon that bends, it's your understanding of the system. Same with browser security: the error message is not the security boundary."

This sets up CORS: "Let's look at a case where the browser error becomes mistaken for the trust boundary."

---

## Slide 15 — Case 04: CORS

"Surface answer: you're getting a CORS error. Add Access-Control-Allow-Origin: * to your server response. Error goes away. Ship it."

"Source trail: OWASP WSTG (Web Security Testing Guide) has an entire section on testing CORS. The key insight: CORS is a browser-side relaxation of the Same-Origin Policy. It tells the browser whether to let JavaScript read a cross-origin response. It is NOT server-side authorization."

"Load-bearing difference: CORS is not a security boundary. It's a browser policy. The server still sends the response — the browser just decides whether JavaScript gets to read it. If you add `Access-Control-Allow-Origin: *` to an endpoint that returns user data, any website in the world can read that data via JavaScript. The browser doesn't block the request. It blocks JavaScript from reading the response. Those are different things."

Real examples:
- "I've seen APIs that returned PII with `Access-Control-Allow-Origin: *` because the dev was 'fixing CORS errors.' The data was accessible from any origin. curl doesn't care about CORS — only browsers enforce it."
- "Classic pattern in AWS: API Gateway returns CORS headers by default because the console wizard adds them. Developer never thinks about whether that endpoint should be readable from any origin."
- "Another one: internal microservices that set `Allow-Origin: *` because 'it's internal.' Then someone puts it behind a public load balancer during a migration and forgets the CORS config is wide open."

"Decision test: what data crosses origins, and who is allowed to read it? If the answer is 'anyone,' fine. If the answer is 'only our frontend,' then you need specific origin whitelisting, credential handling, and preflight validation."

"The pattern is now visible across all four cases: surface answer, authority, omitted assumption, next question."

---

## Slide 16 — Consensus Engine (Poster)

Let the caption land, then:

"The consensus engine is the scariest pattern in modern information. Blog cites tutorial. Tutorial cites blog. AI trains on both. AI generates a new tutorial that cites neither but inherits both. New blog cites the AI output. The loop closes."

"None of them checked the RFC. They're all training on each other."

Real example: "Search 'is localStorage safe for JWTs' and count how many results cite each other versus how many cite the actual OAuth Security BCP. I did this in 2025: 8 of the top 10 results cited other blog posts. Two cited the OWASP cheat sheet. Zero cited the BCP directly."

Bridge explicitly: "That loop we just broke in four case studies — AI lives inside it. Every model trained on the web inherits this recursion. So how do we use AI without becoming part of the loop?"

---

## Slide 17 — AI Exoskeleton

"AI is an exoskeleton, not a source of truth. Use it for what it's good at, and keep the source boundary explicit."

**Good uses — let it fetch:**
- "Give me an orientation on OAuth 2.0 flows" — great for getting your bearings
- "Compare PBKDF2, bcrypt, scrypt, and Argon2 in a table" — great for structured comparison
- "What questions should I be asking about CORS?" — great for generating investigation prompts
- "Clean up this architecture decision record outline" — great for editing

**Dangerous uses — don't let it decide:**
- "What's the recommended way to store JWTs?" — it will give you a confident, sourced-sounding answer that may be wrong
- "Cite the RFC that covers token storage" — it may hallucinate. Real example: I asked Claude for the RFC covering JWT storage best practices. It cited RFC 7519. RFC 7519 defines JWT structure — it says literally nothing about storage. The citation looked perfect. The source was wrong.
- "What does the current OWASP guidance say about password hashing?" — it may give you 2022 guidance when the 2024 update changed the parameters

"The RFC 7519 miss is important because it proves the method corrects the speaker too. I'm standing up here telling you to check sources, and my own AI tool got a source wrong. The method catches that."

"Use AI like a research assistant: let it fetch, organize, and draft. But you verify. You trace. You decide."

---

## Slide 18 — Find The Humans

"Specs tell you what. Humans tell you why."

"Every RFC has authors. Every OWASP project has maintainers. Every security decision was argued about by actual people in actual working groups. Finding those people — or at least their arguments — is where research becomes context."

Concrete how-tos:
- "OAuth Security BCP: the authors are listed. Torsten Lodderstedt, John Bradley, etc. They write blog posts. They present at conferences. They respond on mailing lists. The IETF mailing list archives show every argument about every sentence."
- "OWASP ASVS: it's on GitHub. The issues and PRs show why specific requirements changed. When ASVS V4.0 changed the password hashing guidance, you can read the discussion that led to the change."
- "AWS service changes: the 'What's New' blog is surface. The re:Invent talks by the service team explain the reasoning. The GitHub issues on CDK/CloudFormation repos show what customers were actually hitting."

"Read what changed across drafts. Look for the sentence everyone argued about. That argument is context you can't get from the final published version."

Real example: "The OAuth Security BCP went through multiple drafts. In one draft, they debated whether to say 'SHOULD NOT' or 'MUST NOT' for implicit flow. That single word change — the difference between a recommendation and a prohibition — was argued over for months. If you only read the final version, you miss that context. But it's the context that tells you how seriously to take the guidance."

---

## Slide 19 — Field Guide Checklist

"This is the take-home. Print it. Tape it to your monitor. Use it in your next architecture review."

Walk through each item with one-line examples:

1. **Name the decision** — "We need to choose a token storage mechanism for our SPA." Not "research JWT stuff."
2. **Map the system boundaries** — Browser, API server, auth server, CDN. Where does the token live, where does it travel?
3. **Classify the sources** — "This Auth0 tutorial is Tier 3. This OWASP cheat sheet is Tier 2. This BCP is Tier 1."
4. **Rank the authority** — When sources conflict, Tier 1 wins. Period.
5. **Extract load-bearing claims** — "JavaScript-accessible storage changes attacker capability." That's the sentence that matters.
6. **Validate against implementation** — Does our framework actually support HttpOnly cookies with our SPA architecture? Theory meets production.
7. **Compare paths** — localStorage is faster to implement. BFF pattern is more secure. Document both. Show the tradeoff.
8. **Explain the tradeoff** — "We chose BFF because our threat model includes XSS as a realistic attack vector and bearer token theft is the highest-impact outcome."
9. **Keep receipts** — Link the RFC. Link the OWASP section. Link the vendor advisory. When the auditor asks, you have the trail.

"Every case study we did today was a drill for this checklist. JWT storage, OAuth implicit, password hashing, CORS — same pattern, same questions, same protocol."

---

## Slide 20 — Close

"Clear is not the same as correct. Documented is not the same as recommended. A source of truth is not a place — it's a method."

"You don't need to memorize four case studies. You need to remember four questions: What does the surface answer say? What does the authority say? What's the load-bearing difference? What does this force us to ask next?"

"That's the method. It works for OAuth. It works for CORS. It works for whether to use AWS Control Tower or build your own landing zone. It works for anything where sources disagree and you need to make a defensible call."

"UAP Platform Engineer — signal traced, decision defensible. Thank you."

If there's time for Q&A: you're prepared to go deep on any of the four case studies, the source hierarchy, or practical AI usage for security research.

---

## Slide 21 — The Circuit Remembers

Say nothing or say very little. Let the image and the Moog quote do the work.

"May the music passing through this device somehow help to bring just a little more peace to this troubled world."

Hold for 3-5 seconds. Then: "Thank you, DEF CON."
