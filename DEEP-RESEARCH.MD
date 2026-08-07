# Deep Analysis and Operational Reconstruction: "Source of Truth: A Field Guide for Deep Technical Research" at DEF CON 34

> **Speaker:** Carley Fant (`51nk0r5w1m`)  
> **Venue:** Creator Stage, Las Vegas Convention Center (LVCC) West Hall — DEF CON 34 (August 6–9, 2026)  
> **Presentation Date & Time:** Sunday, August 9, 2026 @ 12:30 PM PST  
> **Conference Theme:** *Agency*  
> **Artifact Classification:** Comprehensive Master Technical Analysis & Research Field Guide

---

## Executive Summary & Core Thesis

In modern cloud-native systems, a profound epistemological gap separates theoretical system architecture—represented by pristine whiteboard diagrams, Architectural Decision Records (ADRs), vendor tutorials, and formal Requests for Comments (RFCs)—from empirical runtime reality. As software delivery pipelines accelerate and microservice architectures proliferate, security engineers and platform architects face an acute challenge: **identifying the authoritative, verifiable source of truth.**

This research document provides an exhaustive technical analysis and operational reconstruction of Carley Fant’s DEF CON 34 capstone presentation, **"Source of Truth: A Field Guide for Deep Technical Research."** The presentation and its accompanying control plane artifacts (the *UAP Pipeline Observatory*, interactive 3D physics engines, and standalone technical exhibits) establish a rigorous methodology for tracing claims back to primary authority, uncovering structural assumptions, and transforming dense security research into defensible engineering decisions.

### The Core Thesis

> *"Finding information is easy. Knowing which explanation applies, which design decision changes the threat model, and where the simplified diagram quietly skipped the important part — that's the hard part. Research is how you earn the right to simplify."*

---

## 1. The Architect of Empirical Security & Epistemological Paradigm

To deconstruct the "Source of Truth" methodology, one must first analyze the operational paradigm of its architect. Positioned at the intersection of platform engineering and application security (AppSec), Carley Fant (`51nk0r5w1m`) focuses on building secure platform baselines, hardening ephemeral cloud infrastructure, and eliminating systemic risk from continuous delivery pipelines.

```ini
+-----------------------------------------------------------------------------------+
|                            EPISTEMOLOGICAL SPECTRUM                               |
+------------------------------------+----------------------------------------------+
|        THE WHITEBOARD MODEL        |           EMPIRICAL RUNTIME REALITY          |
|    (Idealized, Static, Doc-Driven) |        (Dynamic, Ephemeral, Attacker-Observed)|
+------------------------------------+----------------------------------------------+
| • Frictionless Zero-Trust token    | • DOM-accessible cookies / localStorage XSS   |
| • Clean API boundaries             | • Wildcard CORS (`Allow-Origin: *`)           |
| • Out-of-the-box vendor defaults   | • IMDSv1 SSRF exposure & unrotated keys      |
| • Presumed compliance (SOC2/ISO)   | • Configuration drift & orphaned microservices|
+------------------------------------+----------------------------------------------+
```

### Metadata Matrix: Presentation & Speaker Profile

| Attribute | Detail | Operational Significance & Industry Implication |
|---|---|---|
| **Speaker Name** | Carley Fant | Platform engineer focusing on AppSec, cloud architecture, IAM federation, and CI/CD security. |
| **Industry Alias** | `51nk0r5w1m` | Active open-source maintainer and security researcher specializing in infrastructure cartography. |
| **Presentation Title** | *Source of Truth: A Field Guide for Deep Technical Research* | A formalized, reproducible methodology for determining ground truth in complex, opaque systems. |
| **Conference Stage** | Creator Stage (LVCC West Hall) | Designated for bespoke technical frameworks, original research tools, and live engineering exhibits. |
| **DEF CON 34 Theme** | *Agency* | Reclaiming technical self-determination, refusing black-box abstractions, and driving empirical verification. |
| **Primary Artifacts** | Presentation Deck (`index.html`), UAP Observatory (`dashboard/`), Prototypes (`prototypes/`) | Interlocking suite of 3D physics presentation slides, build-time validated data pipelines, and interactive canvas exhibits. |

### The Technological Constellation

An analysis of the speaker's open-source footprint reveals deep integration with four specific technological pillars:

1. **Panther Labs (Detection-as-Code):** Expressing detection logic as version-controlled, unit-tested software artifacts.
2. **Strimzi / Apache Kafka (Event-Driven State):** Managing Kafka clusters natively on Kubernetes, where event streams serve as the immutable distributed ledger of state.
3. **Casbin (Policy-as-Code):** Fine-grained authorization models operating independent of underlying application code.
4. **Architectural Decision Records (ADRs):** Formal documentation capture of structural context, trade-offs, and design rationale.

---

## 2. The 7 Laws of Storytelling Physics & Canvas Motion Systems

A core innovation of the presentation deck (`index.html`) is its execution of **Storytelling Physics**. Rather than treating animation as aesthetic decoration, every canvas interaction and 3D simulation operates under strict physical laws that directly communicate technical security concepts.

```sh
                     +----------------------------------+
                     | THE 5 NARRATIVE MOTION FUNCTIONS  |
                     +----------------------------------+
                                      |
       +-----------------+------------+------------+------------------+
       |                 |                         |                  |
       v                 v                         v                  v
  [ REVEAL ]         [ TRACE ]                [ CONFLICT ]        [ WEIGHT ]
 Expose hidden      Follow claims             Visualize gap     Ground heavy
 assumptions       upstream to spec          between layers    authority nodes
```

### The 7 Laws of Storytelling Physics

#### Law 1: Motion = Meaning

Every moving pixel answers: *"What is this telling the audience that a static diagram cannot?"* Unjustified motion is eliminated.

#### Law 2: Entrance Earns Attention, Not Applause

Elements enter the viewport precisely when the speaker's argument requires them. A tier appearing in the source hierarchy signals a shift in authority, timed to the narrative cadence.

#### Law 3: Gravity Follows Authority

The source hierarchy ($RFC > OWASP > Vendor > Conference > Tutorial/AI$) forms a gravitational field. Higher-authority sources (e.g., Normative RFCs) carry higher visual density and spatial stability, while lower-authority sources (e.g., StackOverflow snippets) exhibit high entropy and rapid dispersion.

#### Law 4: The Gap Is the Story

The critical moment in every security case study is the distance between the tutorial/vendor surface answer and the controlling normative spec. Animations physically visualize this spatial separation.

#### Law 5: Interaction = Investigation

Interactive controls (`INJECT SCRIPT`, `TRACE FORWARD`, `ALLOW *`, `VERIFY`) allow the speaker to execute empirical experiments in real time, demonstrating instant structural consequences.

#### Law 6: Stillness Is a Statement

When delivering high-impact thesis statements, all particle fields hold in rest states. Stillness communicates analytical weight.

#### Law 7: The Audience Remembers the Feeling, Not the Frame

The ultimate objective is psychological: the audience must leave with an ingrained, permanent mistrust of clean, unverified diagrams.

### Semantic Color & Brutalist CRT Physics

```sh
  #ef4444 (Signal Red)  --> EXCEPTION / ATTACKER CAPABILITY / STRUCTURAL DRIFT
  #3b82f6 (Laser Blue)  --> NORMATIVE SPECIFICATION / AUTHORITATIVE BEDROCK
  #030308 (Void Black)  --> SYSTEM BACKGROUND / CRT SCANLINE CANVAS
  #ffffff (Crisp Ink)   --> PRIMARY FACTUAL CONTENT / MONOSPACE SIGNAL
  #18181b (Dark Zinc)   --> TACTICAL CLASSIFICATION STAMPS (.category-tag)
```

---

## 3. Comprehensive Scene-by-Scene Canvas Analysis

The presentation contains 20 distinct, interlocking canvas scenes. Each scene implements specific mathematical physics and narrative objectives:

```md
+-------+------------------+-----------------------+-----------------------------------------------------+
| Slide | Scene ID         | Narrative Role        | Mechanical Physics & Interactive Controls           |
+-------+------------------+-----------------------+-----------------------------------------------------+
| 01    | portal           | Threshold Crossing    | Concentric radar lock rings; event-horizon vortex.   |
| 02    | whois            | Identity Verification | WHOIS signal arcs; traveling packet dots on threads.|
| 03    | graph            | Research Entropy      | Force-directed graph; HEAT entropy vs FREEZE lock.  |
| 04    | sky              | Feed Scanning         | Ground station searchlights; dual-band radar scan.   |
| 05    | stack            | Conflict Stack        | 3D diamond tier stack; TRACE CLAIM spec illumination|
| 06    | cropmap          | Topographic Mapping   | Concentric authority ellipses; FLATTEN resolution.  |
| 07    | protocol         | Four Questions        | Orbiting quadrant nodes around case-file rabbit.    |
| 08    | machine          | Simplification Cost   | Radial assumption nodes; SIMPLIFY collapse physics. |
| 09    | jwt              | Case 01: JWT Storage  | Bezier curve script injection into DOM storage.     |
| 10    | default          | Default Decision      | Branching bezier paths: INHERITED vs CHOSEN.        |
| 11    | oauth            | Case 02: OAuth Drift  | Timeline node illumination; SHOW FOSSIL highlight.  |
| 12    | model            | Map != Territory      | Floating document paper disintegrating into well.   |
| 13    | hash             | Case 03: Pass Hashing | Argon2id memory block grid filling; orbit drag.     |
| 14    | territory        | There Is No Spoon     | Sine-wave grid deformation under BEND MAP.          |
| 15    | cors             | Case 04: CORS         | Trust boundary line; ALLOW * particle flooding.     |
| 16    | consensus        | Consensus Engine      | Concentric feedback loops; BREAK LOOP spark break.  |
| 17    | ai               | AI Exoskeleton        | Radial source nodes; ORIENT -> CITE -> VERIFY.      |
| 18    | humans           | Human Layer           | Spoke nodes to RFC authors, WG threads, and commits. |
| 19    | checklist        | Field Guide Checklist | 9-spoke radial receipt completion matrix.           |
| 20    | portal (Closing) | Method Resolution     | Radar lock tightening: "Source of Truth is a Method"|
+-------+------------------+-----------------------+-----------------------------------------------------+
```

---

## 4. Forensic Security Case Studies: Protocol-Level Deconstructions

The field guide applies its empirical methodology to four foundational technical case studies where common engineering guidance diverges from normative specification.

```ml
       +---------------------------------------------------------------------+
       |                  CASE STUDY FORENSIC MATRIX                         |
       +------------------+------------------------+-------------------------+
       | Domain           | Tutorial / Vendor Claim| Empirical Reality / Spec|
       +------------------+------------------------+-------------------------+
       | 01. JWT Storage  | Store in Cookie/Local  | DOM accessible cookie   |
       |                  | for easy SPA access    | allows immediate XSS    |
       |                  |                        | exfiltration (RFC 8725) |
       +------------------+------------------------+-------------------------+
       | 02. OAuth2 Flow  | Use Implicit Grant     | Deprecated in Security  |
       |                  | for pure SPAs          | BCP; PKCE required      |
       |                  |                        | (RFC 7636 / OAuth 2.1)  |
       +------------------+------------------------+-------------------------+
       | 03. Password Hash| Hash with default cost | Memory hardness must    |
       |                  | parameters             | scale against ASIC/GPU  |
       |                  |                        | guess cost (Argon2id)   |
       +------------------+------------------------+-------------------------+
       | 04. CORS Policy  | Set `Allow-Origin: *`  | Rejects credentials;    |
       |                  | to resolve API errors  | exposes public surface  |
       |                  |                        | (Fetch / OWASP)         |
       +------------------+------------------------+-------------------------+
```

### Case Study 01: JWT Storage & DOM-Accessible Cookies (Slide 09)

* **The Tutorial Anti-Pattern:** Developers attempting to avoid storing tokens in `localStorage` store access tokens in cookies created via frontend JavaScript (`document.cookie = ...`).
* **The Forensic Breakdown:** Without backend HTTP header management to set the `HttpOnly` directive, JavaScript-set cookies remain completely accessible to the Document Object Model (DOM). Under Cross-Site Scripting (XSS), an attacker executes `document.cookie` or reads token strings with equal ease as `localStorage.getItem()`.
* **Normative Guidance (RFC 8725 / OWASP ASVS):** Sensitive authorization tokens must either reside in in-memory variables with short lifespans or be stored in backend-managed `HttpOnly`, `Secure`, `SameSite=Strict` cookies.

### Case Study 02: OAuth 2.0 Implicit Grant & Documented Fossils (Slide 11)

* __The Tutorial Anti-Pattern:__ Legacy vendor documentation and tutorials continue to recommend the OAuth 2.0 Implicit Grant (`response_type=token`) for Single Page Applications.
* __The Forensic Breakdown:__ The Implicit Grant returns access tokens directly in the URI fragment (`#access_token=...`), exposing tokens to browser history, referrer headers, and access logs without sender-constraining mechanisms.
* **Normative Guidance (RFC 7636 / OAuth 2.1 BCP):** The Implicit Grant is formally deprecated. SPAs must utilize the Authorization Code Grant with Proof Key for Code Exchange (PKCE).

### Case Study 03: Password Hashing Parameters & Memory Hardness Physics (Slide 13)

* **The Tutorial Anti-Pattern:** Applying cryptographic hashes (e.g., SHA-256 or bcrypt with low work factors) without configuring memory-hard execution bounds.
* **The Forensic Breakdown:** Attackers utilizing custom ASIC or GPU arrays can compute billions of candidate SHA-256 hashes per second. Without high memory requirements, compute-only hashes offer minimal resistance.
* **Normative Guidance (RFC 9106 / Argon2id):** Modern password hashing must enforce memory hardness (e.g., Argon2id with 19MB+ memory allocation and configured iteration passes). In the slide exhibit (`hash`), increasing the cost factor dynamically expands the memory allocation block grid, physically slowing down the orbital speed of attacker dots.

### Case Study 04: CORS Misconfigurations & Boundary Dissolution (Slide 15)

* **The Tutorial Anti-Pattern:** Resolving browser Cross-Origin Resource Sharing (CORS) errors by setting `Access-Control-Allow-Origin: *`.
* **The Forensic Breakdown:** Wildcard CORS policies break credentialed request handling (`Access-Control-Allow-Credentials: true` is rejected by modern browsers when origin is wildcarded). Developers who attempt workarounds often end up reflecting the incoming `Origin` header dynamically without validation, effectively turning their authenticated API into an open proxy for third-party scripts.
* **Normative Guidance (Fetch Spec / OWASP):** Origin allowlists must be explicitly validated against a strict server-side registry.

---

## 5. The UAP Pipeline Observatory: Data Architecture & Statistical Diagnostics

The companion project living in `dashboard/` is the **UAP Pipeline Observatory**, built with Observable Framework (`observablehq.config.js`). It serves as an active provenance control plane, enforcing data contract integrity at build time.

```clj
                         +-----------------------------------+
                         | UAP PIPELINE OBSERVATORY BUILD    |
                         +-----------------------------------+
                                           |
                                           v
                              [ src/data/records.csv ]
                           (Canonical Evidence Input)
                                           |
                                           v
                     +-------------------------------------------+
                     |         BUILD-TIME DATA LOADERS           |
                     |  - records.json.js (Schema Validation)    |
                     |  - pipeline.json.js (SHA Fingerprinting)  |
                     |  - uap-events.json.js (NARA Centroids)    |
                     |  - fireballs.json.js (NASA/JPL CNEOS)     |
                     +-------------------------------------------+
                                           |
                       +-------------------+-------------------+
                       |                                       |
                       v                                       v
             (Build Validation Pass)                (Schema Failure Exit 1)
                       |                                       |
                       v                                       v
             [ Static Site Output ]                  [ Stop Publication ]
            (GitHub Pages Deploy)
```

### The 6-Tier Authority Hierarchy & 10 Relationship Classifications

```tex
+------------------------------------------------------------------------------------+
|                          SOURCE AUTHORITY LAYER HIERARCHY                          |
+------+---------------+-------------------------------------------------------------+
| Rank | Layer Label   | Operational Definition & Role                               |
+------+---------------+-------------------------------------------------------------+
| 1    | Standards     | Normative RFCs, NIST SP 800 series, W3C Specs (Bedrock).    |
| 2    | Architecture  | Vendor Reference Architectures (AWS SRA, Well-Architected).  |
| 3    | Documentation | Official Product & Developer Documentation.                 |
| 4    | Samples       | GitHub sample code, CDK construct libraries, quickstarts.   |
| 5    | Community     | Security advisories, IAM trackers, re:Post threads.         |
| 6    | SEO / AI      | Medium posts, StackOverflow, LLM-generated code snippets.   |
+------+---------------+-------------------------------------------------------------+
```

#### The 10 Load-Bearing Relationship Classifications

1. **Current Alignment:** Observed implementation agrees with controlling normative spec.
2. **Normative Conflict:** Implementation directly violates a standard or specification.
3. **Unsafe Default:** Product default configuration creates vulnerable states unless explicitly overridden.
4. **Guidance Drift:** Maintained documentation fails to reflect updated authority standards.
5. **Sample-Code Defect:** Official sample code contains security-relevant vulnerabilities.
6. **Editorial Omission:** Essential security context is absent from otherwise valid guidance.
7. **Console / API / IaC Divergence:** Provisioning paths produce non-identical security baselines.
8. **Legacy Compatibility Exposure:** Retained fallback settings expose applications to attack.
9. **Doc / Product Mismatch:** Documented behavior differs from empirical runtime reality.
10. **Ecosystem Observation:** Repeated security anti-patterns visible across public repositories.

### Statistical Diagnostics Engine

The Observatory incorporates advanced statistical metrics to analyze empirical evidence drift across 106 granular dataset records:

$$\text{Receipt Coverage} = \frac{\sum \text{Records (Grade A } \lor \text{ Grade B)}}{\text{Total Records}}$$

$$\text{Drift Rate} = \frac{\sum \text{Records where Relation} \neq \text{"Current Alignment"}}{\text{Total Records}}$$

$$\text{Effective Sources} = \exp(H) = \exp\left(-\sum_{i} p_i \ln p_i\right)$$

$$\text{Topic HHI} = \sum_{j} s_j^2 \quad \text{(Herfindahl-Hirschman Index for corpus concentration)}$$

$$\text{Pearson Residuals} = \frac{O_{ij} - E_{ij}}{\sqrt{E_{ij}}} \quad \text{(Cell-level independence diagnostics)}$$

---

## 6. Standalone Interactive Physics Prototypes

The `prototypes/` directory contains four standalone interactive exhibits demonstrating key aspects of system state research:

```sh
+-------------------------------+-----------------------------------------------------------+
| Prototype File                | Interactive Focus & Engineering Simulation                |
+-------------------------------+-----------------------------------------------------------+
| 01-rabbit-hole-graph.html     | Force-directed graph simulation with entropy heat/freeze. |
| 02-model-is-not-system.html   | Particle disintegration of paper model into system well.  |
| 03-default-is-a-decision.html | Infrastructure default vs hardened decision tree logic.   |
| 04-rabbit-is-witness.html     | Empirical observation logger & tamper-evident witness log.|
+-------------------------------+-----------------------------------------------------------+
```

---

## 7. The 9-Point Field Guide Checklist & Receipts Matrix

The capstone artifact of the presentation is the **9-Point Field Guide Checklist** (Slide 19), transforming deep research into defensible platform engineering actions:

```csv
[x] 01. RANK SOURCES           --> Map claims to 6-tier authority hierarchy
[x] 02. SPEC PARAMETERS        --> Verify cryptographic key sizes & memory hardness
[x] 03. HARDEN DEFAULTS        --> Override out-of-the-box vendor defaults
[x] 04. IMAGE PROVENANCE       --> Enforce container image signing & non-root runtimes
[x] 05. BOUNDARY CHECK         --> Audit CORS origin allowlists & authorization checks
[x] 06. TELEMETRY INTEGRITY    --> Ensure tamper-evident logging across cloud regions
[x] 07. AUDIT IAC DIVERGENCE   --> Align Console, API, and IaC deployment baselines
[x] 08. SENDER CONSTRAIN       --> Bind identity tokens with DPoP or mTLS
[x] 09. RECLAIM AGENCY         --> Replace unverified AI snippets with verified spec proofs
```

---

## 8. Alignment with DEF CON 34 Theme: Reclaiming Technological Agency

DEF CON 34 operates under the central theme of **"Agency"**—a call for engineers and security researchers to assert self-determination over complex technological ecosystems.

```sql
                         +-------------------------------------+
                         |      THE AGENCY PARADIGM MATRIX     |
                         +------------------+------------------+
                         | PASSIVE OPERATOR | EMPIRICAL AGENT  |
                         +------------------+------------------+
                         | Vendor-dependent | Spec-verified    |
                         | Black-box trust  | Runtime audited  |
                         | AI consensus     | Human verified   |
                         | SOC2 compliance  | Physical proof   |
                         +------------------+------------------+
```

### The Human Layer Behind Specifications

Slide 18 (*Find The Humans*) underscores that standards are not divine decrees—they are written by human engineers in working groups. By tracing RFC authors, issue tracker discussions, and commit histories, researchers understand *why* specific trade-offs were made.

### AI as Research Exoskeleton vs. Root of Trust

Slide 17 (*AI Exoskeleton*) positions generative AI tools as cognitive amplifiers for discovery (`ORIENT` and `CITE`), while firmly establishing that verification (`VERIFY`) remains the non-delegable responsibility of human researchers.

---

## 9. Comprehensive Reference Bibliography & Works Cited

1. **Fant, Carley (`51nk0r5w1m`).** *GitHub Open Source Footprint & Infrastructure Cartography.* [https://github.com/51nk0r5w1m](https://github.com/51nk0r5w1m)
2. **DEF CON 34 Conference Committee.** *DEF CON 34 Theme Announcement: Agency.* Las Vegas, NV, August 6–9, 2026. [https://defcon.org](https://defcon.org)
3. **Hardt, D., Ed.** *The OAuth 2.0 Authorization Framework.* RFC 6749, Internet Engineering Task Force (IETF), October 2012.
4. **Jones, M., & Hardt, D.** *JSON Web Token (JWT) Best Current Practices.* RFC 8725, IETF, February 2020.
5. **Sakimura, N., Bradley, J., & Agarwal, A.** *Proof-Key for Code Exchange by OAuth Public Clients.* RFC 7636, IETF, September 2015.
6. **Biryukov, A., Dinu, D., & Khovratovich, D.** *Argon2: New Generation of Memory-Hard Functions for Password Hashing and Other Applications.* RFC 9106, IETF, September 2021.
7. **National Institute of Standards and Technology (NIST).** *Digital Identity Guidelines.* NIST Special Publication 800-63B, U.S. Department of Commerce, 2017.
8. **Open Worldwide Application Security Project (OWASP).** *Application Security Verification Standard (ASVS) v4.0.3.* 2021.
9. **Observable Framework Team.** *Observable Framework Documentation.* Observable, Inc., 2024. [https://observablehq.com/framework/](https://observablehq.com/framework/)
10. **National Archives and Records Administration (NARA).** *Project Blue Book Evidence Manifests & Archive Files.* Record Group 341, National Archives at College Park, MD.