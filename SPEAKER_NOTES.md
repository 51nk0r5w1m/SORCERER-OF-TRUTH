# Speaker Notes

These are public-facing follow-up notes for the DEF CON 34 deck. They are not a transcript. They summarize the research context, source hierarchy, and engineering assumptions behind each slide.

## 01. Source of Truth

- Source evaluation is an engineering practice: when guidance conflicts, trace provenance before turning a recommendation into architecture.
- A useful security answer names its authority, scope, threat model, and assumptions.
- Core reference families for this talk: IETF RFCs and BCPs, NIST SP 800-63B, OWASP Cheat Sheets, MDN browser documentation, and maintainer documentation.

## 02. Who Is Carley

- The speaker perspective is platform engineering: security guidance must survive implementation constraints, browser behavior, legacy systems, and operations.
- The method is repeatable: classify the claim, find the primary authority, identify the load-bearing assumption, and document the decision.

## 03. Inception, But RFCs

- The narrow starting question was token storage; the larger issue was conflicting source authority.
- Different sources may be correct only under different assumptions.
- The output should be a documented decision path, not a universal answer.

## 04. The Feed

- Feeds flatten authority. RFCs, vendor blogs, Q&A, and AI summaries appear with similar visual weight.
- Recency and popularity are weak proxies for correctness.
- Use feeds for discovery, not final authority.

## 05. When Guidance Conflicts

- Rank by authority before preference.
- Lower-tier sources still matter when they expose implementation context, edge cases, migration pain, or the trail to a better source.
- Record why plausible but weaker sources were not used.

## 06. Source Hierarchy

- Practical hierarchy: current standards and BCPs; official implementation and maintainer docs; project security guidance; high-quality research; community explanations.
- For web and auth topics, primary sources often include IETF, WHATWG/W3C, browser docs, NIST, and OWASP.
- The hierarchy is a conflict-resolution tool, not a status game.

## 07. Four Questions

1. What does the surface answer say?
2. What is the primary authority?
3. What load-bearing assumption changes the answer?
4. What decision or follow-up question does that force?

Good output should be auditable by another engineer later.

## 08. Simplification

- Simplification is necessary, but it drops context.
- Common dropped context: CSRF, XSS, token lifetime, OAuth client type, password-hashing cost, and credentialed CORS behavior.
- Use simple rules as entry points, then recover the assumptions before implementation.

## 09. JWT Storage

- JWT storage depends on token type, lifetime, audience, browser threat model, XSS exposure, CSRF controls, and architecture.
- OWASP HTML5 and Session Management guidance warn against storing session identifiers, JWTs, refresh tokens, or credentials in Web Storage because origin JavaScript can read them.
- RFC 8725 is relevant to JWT validation: issuer and audience validation, algorithm restrictions, and distrust of unvalidated received claims.

## 10. Default Decision

- Defaults encode threat models.
- Document why a default applies: token lifetime, cookie attributes, SameSite behavior, CSRF strategy, XSS mitigation, rotation, revocation, and observability.
- Name the condition that would cause the decision to be revisited.

## 11. OAuth Implicit Flow

- OAuth guidance changed over time. RFC 6749 defined the Implicit Grant in 2012; later security guidance moved away from it.
- RFC 9700, published in January 2025, is OAuth 2.0 Security Best Current Practice and updates earlier OAuth guidance.
- For browser-based and public clients, Authorization Code with PKCE replaced the old implicit-flow default. RFC 7636 is the PKCE reference.

## 12. The Model

- A model is useful only while its assumptions match the system.
- OAuth flow choice, browser SameSite behavior, password hashing cost, and CORS behavior all depend on context and time.
- Version mental models by year, platform, attacker, and deployment shape.

## 13. Password Hashing

- Password hashing guidance must include parameters, not only algorithm names.
- NIST SP 800-63B requires salted password storage resistant to offline attacks using suitable one-way key derivation functions; memory-hard functions are recommended where appropriate.
- OWASP Password Storage guidance commonly recommends Argon2id for new systems, with parameters benchmarked against the production environment.

## 14. There Is No Spoon

- The model is not the system.
- JWT storage is not only a storage API question. OAuth is not only a flow diagram. Password hashing is not only an algorithm. CORS is not only a header.
- Translate the model back into concrete browser, server, network, identity-provider, and attacker behavior.

## 15. CORS

- CORS is a browser-enforced response-sharing protocol, not an authentication system.
- Credentialed CORS requests cannot use wildcard `Access-Control-Allow-Origin`; servers must return a specific origin and should set `Vary: Origin` when dynamic.
- For private APIs, decide which origins need browser-readable access, whether credentials are allowed, which methods and headers are needed, and how preflight is cached.

## 16. Consensus Engine

- Repetition can look like validation when sources copy each other.
- Break loops by finding independent primary or near-primary sources: standards text, maintainer docs, advisories, changelogs, issue threads, and implementation behavior.
- Distinguish independent confirmation from repeated citation.

## 17. AI Exoskeleton

- AI tools are useful for orientation, search expansion, summarization, and comparison tables.
- They are not roots of trust.
- Generated answers should become hypotheses verified against primary sources and local system constraints.

## 18. Find The Humans

- Standards and docs are written by people under constraints.
- Mailing lists, issues, pull requests, errata, and changelogs often explain why a recommendation exists.
- Strange wording in a standard often marks an important boundary condition.

## 19. Field Guide Checklist

- Name the decision.
- Map the system boundary.
- Classify and rank sources.
- Extract load-bearing claims.
- Validate against implementation.
- Compare options.
- Explain tradeoffs.
- Keep receipts.

## 20. Close

- A source of truth is a method, not one canonical website.
- Keep a traceable chain from decision to source to assumption.
- That chain is what makes a recommendation defensible under review.

## 21. The Circuit Remembers

- Technical systems carry human intent and memory.
- Research is not only locating documents; it is understanding the people and constraints behind them.
- Build systems with enough care that future maintainers can understand what you meant.

