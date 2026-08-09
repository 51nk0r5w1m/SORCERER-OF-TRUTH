import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "build", "embedded-assets");
mkdirSync(outDir, { recursive: true });

const assetSources = {
  heroRabbit: "dashboard/src/assets/uap-pipeline-observatory.svg",
  simplification: "IMAGES/ChatGPT Image Aug 5, 2026, 03_24_34 AM.png",
  defaultDecision: "IMAGES/ChatGPT Image Aug 5, 2026, 03_32_36 AM (1).png",
  feedWorld: "IMAGES/ChatGPT Image Aug 5, 2026, 03_32_36 AM (4).png",
  consensusLoop: "IMAGES/ChatGPT Image Aug 5, 2026, 03_32_36 AM (3).png",
  patternProof: "IMAGES/ChatGPT Image Aug 5, 2026, 03_32_36 AM (2).png",
  hierarchy: "IMAGES/ChatGPT Image Aug 5, 2026, 03_23_20 AM (2).png",
  modelSystem: "IMAGES/ChatGPT Image Aug 5, 2026, 03_22_01 AM.png",
  maze: "IMAGES/ChatGPT Image Aug 5, 2026, 03_24_07 AM (1).png",
  chain: "IMAGES/ChatGPT Image Aug 5, 2026, 03_24_08 AM (3).png",
  bookRabbit: "IMAGES/exec-0144c569-6e09-4df8-a049-6ab13404fed4.png",
  uapPatch: "IMAGES/uap-patch.svg",
  rocket: "IMAGES/image2.jpeg",
  matrixSpoon: "IMAGES/image1.jpeg",
  circuit: "IMAGES/image0.png",
  palestineCircuit: "IMAGES/ChatGPT Image Aug 5, 2026, 10_21_17 AM.png",
  palestineLive: "IMAGES/palestine-live-count-background.png",
};

function optimizedAsset(name, source) {
  const input = path.join(root, source);
  
  if (source.endsWith(".svg")) {
    return inlineFile(input, "image/svg+xml");
  }

  const output = path.join(outDir, `${name}.jpg`);
  const isPoster = !["rocket", "matrixSpoon", "circuit"].includes(name);
  const args = isPoster
      ? [input, "-resize", "1400x1400>", "-strip", "-quality", "76", output]
      : name === "circuit"
      ? [input, "-crop", "1206x1050+0+145", "-resize", "1100x1100>", "-strip", "-quality", "72", output]
      : [input, "-resize", "1200x1200>", "-strip", "-quality", "74", output];

  try {
    execFileSync("convert", args, { stdio: "ignore" });
  } catch {
    return inlineFile(input, source.endsWith(".png") ? "image/png" : "image/jpeg");
  }

  return inlineFile(output, "image/jpeg");
}

function inlineFile(file, mime) {
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

const assets = Object.fromEntries(
  Object.entries(assetSources).map(([name, source]) => [name, optimizedAsset(name, source)]),
);

const slides = [
  {
    id: "slide-01",
    title: "Source of Truth",
    type: "cover",
    art: "heroRabbit",
    kicker: "DEF CON 34 // Engineering Research Field Guide",
    h1: "Source of Truth",
    body: "Pipeline eats lore. I got them RFCs in me.",
    meta: "Carley Fant // UAP Platform Engineer // 51nk0r5w1m",
    notes: [
      "Day 0 framing: this is not a talk about one bug class; it is about how engineers decide what to trust.",
      "Set the promise: a repeatable field guide for chasing claims into standards, verification frameworks, maintainer context, and implementation reality.",
    ],
  },
  {
    id: "slide-02",
    title: "Who Is Carley",
    type: "bio",
    art: "rocket",
    kicker: "Whois // UAP Platform Engineer",
    h1: "Carley Fant",
    role: "UAP Platform Engineer // Truth Teller's Field Notes",
    body: "I build secure cloud, identity, and software-delivery platforms—and investigate anomalous signals with the same discipline: follow the evidence, test the model, keep the receipts.",
    notes: [
      "Anchor identity with the early portrait: the talk is technical, but the method is personal and practiced.",
      "This slide should establish credibility without turning into a resume.",
    ],
  },
  {
    id: "slide-03",
    title: "Inception, But RFCs",
    type: "split",
    art: "patternProof",
    kicker: "01 // The setup",
    h1: "Inception, but RFCs.",
    body: "A technical talk started as a vulnerability deep dive. The better question was hiding underneath: why did the easy answer feel so complete?",
    bullets: ["The search result was fast.", "The diagram was clean.", "The citation trail changed the question."],
    notes: [
      "The talk is born from preparing a more technical talk and noticing the research failure mode behind the examples.",
      "The UAP platform-engineering lens matters here: unexplained signals are inputs to investigate, not conclusions to inherit.",
      "Name the core tension early: polished summaries are useful, but they are not authority.",
    ],
  },
  {
    id: "slide-04",
    title: "The Feed",
    type: "poster",
    art: "feedWorld",
    notes: [
      "Let the baked-in caption do the work. Do not repeat it aloud verbatim; explain that feeds flatten authority, context, and time.",
      "Move from internet feed to research hierarchy.",
    ],
  },
  {
    id: "slide-05",
    title: "When Guidance Conflicts",
    type: "framework",
    art: "hierarchy",
    kicker: "02 // Conflict rule",
    h1: "When sources disagree, sort the room.",
    body: "A clean answer can still crop out the research question. The source trail is how we find what got left out.",
    pairs: [
      ["surface answer", "source of truth"],
      ["clear diagram", "threat model"],
      ["tutorial fix", "defensible decision"],
    ],
    notes: [
      "This is the main operating rule for the rest of the talk.",
      "Emphasize that a hierarchy is not snobbery; it is conflict resolution.",
    ],
  },
  {
    id: "slide-06",
    title: "Source Hierarchy",
    type: "hierarchy",
    art: "hierarchy",
    kicker: "03 // Epistemology",
    h1: "Some receipts weigh more.",
    tiers: [
      ["01", "Normative standards", "RFCs, BCPs, standards-track drafts. Ultimate protocol authority and threat-model baseline."],
      ["02", "Verification frameworks", "OWASP ASVS, WSTG, cheat sheets. Turns consensus into testable requirements."],
      ["03", "Vendor and maintainer docs", "Specific implementation guidance. Valuable, but often optimized for adoption."],
      ["04", "Conference research", "Emerging attacks, edge cases, and practitioner context before standards catch up."],
      ["05", "Tutorials and AI summaries", "Orientation only. Useful entry points, not roots of trust."],
    ],
    notes: [
      "Explain the hierarchy before any case study so examples do not hijack the talk.",
      "The hierarchy decides how to arbitrate, not what to ignore.",
    ],
  },
  {
    id: "slide-07",
    title: "Four Questions",
    type: "questions",
    art: "modelSystem",
    kicker: "04 // Case-file protocol",
    h1: "Ask four small questions.",
    questions: [
      "What does the surface answer say?",
      "What do OWASP, RFC, ASVS, or the relevant authority say?",
      "What is the load-bearing difference?",
      "What does this force us to ask next?",
    ],
    notes: [
      "These questions keep the security details in service of methodology.",
      "The fourth question is the handoff from reading to engineering decision-making.",
    ],
  },
  {
    id: "slide-08",
    title: "Simplification",
    type: "poster",
    art: "simplification",
    notes: [
      "Let the image caption land. The point is that every simplification inherits assumptions about attackers, users, and operating reality.",
      "Transition into JWT storage as the first drill.",
    ],
  },
  {
    id: "slide-09",
    title: "Case 01 JWT Storage",
    type: "case",
    art: "maze",
    kicker: "Case 01 // JWT storage",
    h1: "Can script touch it?",
    body: "The question is not whether the token is shaped correctly. It is who can reach bearer material after JavaScript is already running in the origin.",
    rows: [
      ["Starting point", "Store the bearer token where browser JavaScript can read it"],
      ["Source trail", "OAuth browser-app BCP + OWASP HTML5/ASVS storage guidance"],
      ["Hidden assumption", "JavaScript-accessible storage changes attacker capability"],
      ["Decision test", "Can this architecture keep bearer material away from script?"],
    ],
    takeaway: "A valid token in the wrong reachability zone is still an exposed credential.",
    notes: [
      "Avoid teaching XSS mechanics. Use the storage conflict to teach claim tracing.",
      "The phrase JavaScript-accessible storage is the kind of awkward sentence that does real security work.",
    ],
  },
  {
    id: "slide-10",
    title: "Default Decision",
    type: "poster",
    art: "defaultDecision",
    notes: [
      "Do not duplicate the baked-in line. Explain that defaults are not neutral; they encode priorities.",
      "Use this to move from JWT storage into OAuth diagrams and source drift.",
    ],
  },
  {
    id: "slide-11",
    title: "Case 02 OAuth Implicit",
    type: "case",
    art: "chain",
    kicker: "Case 02 // OAuth implicit",
    h1: "The diagram is a fossil.",
    body: "A professional vendor diagram can outlive the recommendation it came from. The research move is to trace the diagram back to the spec and then forward to the BCP that superseded it.",
    rows: [
      ["Starting point", "A clean implicit-flow diagram in official docs"],
      ["Source trail", "OAuth 2.0 Security BCP deprecates implicit for browser clients"],
      ["Hidden assumption", "Documented does not mean recommended"],
      ["Decision test", "Which current flow matches the client threat model?"],
    ],
    takeaway: "Documentation can preserve fossils. The hierarchy catches what the diagram cannot show.",
    notes: [
      "Keep this focused on source drift: diagrams persist because docs are products too.",
      "The point is not vendor-shaming; it is learning to check whether a recommendation has moved.",
    ],
  },
  {
    id: "slide-12",
    title: "The Model",
    type: "poster",
    art: "modelSystem",
    notes: [
      "Let the baked-in caption carry the transition.",
      "The next case is password hashing, where the model is often compressed into a single verb: hash.",
    ],
  },
  {
    id: "slide-13",
    title: "Case 03 Password Hashing",
    type: "case",
    art: "hierarchy",
    kicker: "Case 03 // Password hashing",
    h1: "Hashing is not one verb.",
    body: "The surface answer says use SHA-256, or maybe bcrypt. The source trail asks for parameters, costs, attacker economics, and the reason memory-hard functions exist.",
    rows: [
      ["Starting point", "Use a hash. Maybe salt it."],
      ["Source trail", "OWASP Password Storage Cheat Sheet + Argon2id guidance"],
      ["Hidden assumption", "The parameter table is part of the security claim"],
      ["Decision test", "What cost can production tolerate and attackers hate?"],
    ],
    takeaway: "The gap between hash and 19MB per guess is where the real decision lives.",
    notes: [
      "Do not turn this into an Argon2 lecture. Show that standards include parameters and threat assumptions.",
      "This is where defensibility requires numbers, not vibes.",
    ],
  },
  {
    id: "slide-14",
    title: "There Is No Spoon",
    type: "reference",
    art: "matrixSpoon",
    kicker: "Interlude // representation failure",
    h1: "The map is not the world.",
    body: "Every abstraction bends perception. Research is how we find the residuals, the edge conditions, and the places where the map quietly edits reality.",
    notes: [
      "Use the Matrix reference lightly: it reinforces model versus system without derailing the talk.",
      "This sets up CORS, where the browser error becomes mistaken for the trust boundary.",
    ],
  },
  {
    id: "slide-15",
    title: "Case 04 CORS",
    type: "case",
    art: "patternProof",
    kicker: "Case 04 // CORS",
    h1: "Working is not safe.",
    body: "The quick fix is a permissive CORS header. The research move is to ask whether the response contains sensitive information and whether CORS is being mistaken for authorization.",
    rows: [
      ["Starting point", "Open the origin policy until the browser error disappears"],
      ["Source trail", "OWASP WSTG cross-origin resource sharing tests"],
      ["Hidden assumption", "CORS is a browser trust boundary, not authorization"],
      ["Decision test", "What data crosses origins, and who is allowed to read it?"],
    ],
    takeaway: "Fixing a browser error is not proving a boundary.",
    notes: [
      "Use this as the final methodology drill, not as a CORS primer.",
      "The repeated pattern is now visible: surface answer, authority, omitted assumption, next question.",
    ],
  },
  {
    id: "slide-16",
    title: "Consensus Engine",
    type: "poster",
    art: "consensusLoop",
    notes: [
      "Let the baked-in caption stand. Explain the risk of sources recursively training on each other.",
      "Bridge to the next slide explicitly: 'That loop we just broke — AI lives inside it. Every model trained on the web inherits this recursion.'",
      "Transition into AI as an exoskeleton, not a root of trust.",
    ],
  },
  {
    id: "slide-17",
    title: "AI Exoskeleton",
    type: "ai",
    art: "bookRabbit",
    kicker: "05 // Tooling",
    h1: "Let it fetch, not decide.",
    use: ["Orientation", "Controlled-source summaries", "Comparison matrices", "Question generation", "Outline cleanup"],
    avoid: ["Citations", "Final authority", "Current security guidance", "Normative interpretation", "Replacing the deep read"],
    quote: "A concrete failure: ask for normative JWT storage guidance and the model may cite RFC 7519, which defines JWT structure but says nothing about storage.",
    notes: [
      "This slide is deliberately pragmatic: AI is useful, but only when the source boundary is explicit.",
      "The RFC 7519 miss proves the method should correct the speaker too.",
    ],
  },
  {
    id: "slide-18",
    title: "Find The Humans",
    type: "split",
    art: "circuit",
    kicker: "06 // Maintainer context",
    h1: "Find the person behind it.",
    body: "Specs tell you what. Working groups, issue threads, changelogs, and conference talks often explain why the sentence had to be written that way.",
    bullets: ["Identify authors and working groups.", "Read what changed across drafts.", "Look for the sentence everyone argued about."],
    notes: [
      "The circuit-board image is a deliberate human fingerprint inside technical infrastructure.",
      "Use the UAP Platform Engineer identity as a quiet callback: anomalous signals become useful only after a human traces provenance and context.",
      "This is where research becomes more than citation; it becomes context.",
    ],
  },
  {
    id: "slide-19",
    title: "Field Guide Checklist",
    type: "checklist",
    art: "maze",
    kicker: "07 // Output",
    h1: "Leave with a decision.",
    body: "A bibliography is not enough. Good research produces a decision an architect can defend under scrutiny.",
    items: ["Name the decision", "Map the system boundaries", "Classify the sources", "Rank the authority", "Extract load-bearing claims", "Validate against implementation", "Compare paths", "Explain the tradeoff", "Keep receipts"],
    notes: [
      "This is the take-home artifact. Every item turns research into a defensible engineering action.",
      "Let the audience feel that the case studies were drills for this checklist.",
    ],
  },
  {
    id: "slide-20",
    title: "Close",
    type: "closing",
    art: "heroRabbit",
    kicker: "08 // Closing claim",
    h1: "Earn the simple version.",
    body: "Clear is not the same as correct. Documented is not the same as recommended. A source of truth is not a place. It is a method.",
    callback: "UAP Platform Engineer // signal traced // decision defensible",
    notes: [
      "Close on method, not a list of security prescriptions.",
      "Bring back UAP Platform Engineer once, as the identity behind the method: follow the signal, classify the evidence, then make the call.",
      "The audience should leave with a repeatable way to arbitrate conflicting guidance.",
    ],
  },
  {
    id: "slide-21",
    title: "The Circuit Remembers",
    type: "memorial",
    art: "circuit",
    kicker: "The circuit remembers every interruption",
    h1: "",
    body: "May the music passing through this device somehow help to bring just a little more peace to this troubled world.",
    notes: [
      "End on the circuit board image and the Bob Moog quote. Let the image and the words do the work.",
    ],
  },
];

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
}[char]));

function head(slide) {
  return `<div class="slide-head"><span class="kicker">${esc(slide.kicker || slide.title)}</span><span class="slide-no">${slide.id.replace("slide-", "")}</span></div>`;
}

function image(slide, className = "art-img") {
  return `<img class="${className}" src="${assets[slide.art]}" alt="">`;
}

function speakerNotes(slide) {
  return `<aside class="speaker-notes"><ul>${slide.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul></aside>`;
}

function slideHtml(slide) {
  if (slide.id === "slide-12") {
    return `<div class="frame model-stage"><div class="slide-head"><span class="kicker">Interlude // representation failure</span><span class="slide-no">12</span></div><div class="model-title"><h2>The model is <em>not</em><br>the system.</h2><p>// diagrams collapse · systems keep running</p></div><div class="model-readout"><span>PARTICLES <b data-particles>4,800</b></span><span>STATE <b data-state>MODELED</b></span><span>DRIFT <b data-drift>0.00</b></span></div></div>`;
  }

  if (slide.type === "cover") {
    return `<div class="frame cover-frame"><div class="cover-copy">${head(slide)}<h1>${esc(slide.h1)}</h1><p class="subtitle">${esc(slide.body)}</p><p class="meta">${esc(slide.meta)}</p></div><figure class="cover-art">${image(slide)}</figure></div>`;
  }

  if (slide.type === "poster") {
    return `<div class="poster-frame">${image(slide, "poster-img")}</div>`;
  }

  if (slide.type === "bio") {
    return `<div class="frame bio-layout" data-theme-tableau="alien-crew-beam-desk-fragments"><figure class="bio-patch"><img src="${assets.uapPatch}" alt="UAP Platform Engineering patch" /></figure><figure class="bio-photo">${image(slide)}</figure><div class="bio-text">${head(slide)}<h2>${esc(slide.h1)}</h2><p class="bio-role">${esc(slide.role)}</p><p>${esc(slide.body)}</p><div class="bio-readout"><div class="readout-row"><span class="readout-key">| DOMAIN</span><span class="readout-val">APPSEC / IAM |</span></div><div class="readout-row"><span class="readout-key">| STACK</span><span class="readout-val">CLOUD / IDENTITY |</span></div><div class="readout-row"><span class="readout-key">| PIPELINE</span><span class="readout-val">PROVENANCE |</span></div><div class="readout-row"><span class="readout-key">| EVIDENCE</span><span class="readout-val">RFC / NIST |</span></div><div class="readout-row"><span class="readout-key">| STATUS</span><span class="readout-val accent">ACTIVE |</span></div></div></div></div>`;
  }

  if (slide.type === "split") {
    return `<div class="frame split-layout"><div class="copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p data-reveal="1">${esc(slide.body)}</p><ul>${slide.bullets.map((item, index) => `<li data-reveal="${index + 1}">${esc(item)}</li>`).join("")}</ul></div><figure class="side-art" data-reveal="1">${image(slide)}</figure></div>`;
  }

  if (slide.type === "framework") {
    return `<div class="frame framework-layout"><div class="copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p data-reveal="1">${esc(slide.body)}</p></div><div class="conflict-stack">${slide.pairs.map(([left, right], index) => `<div data-reveal="${index + 1}"><span>${esc(left)}</span><b>vs</b><strong>${esc(right)}</strong></div>`).join("")}</div><figure class="ghost-art">${image(slide)}</figure></div>`;
  }

  if (slide.type === "hierarchy") {
    return `<div class="frame hierarchy-layout">${head(slide)}<h2>${esc(slide.h1)}</h2><div class="tier-grid">${slide.tiers.map(([no, title, body], index) => `<article class="tier" data-reveal="${index + 1}"><b>${esc(no)}</b><div><h3>${esc(title)}</h3><p>${esc(body)}</p></div></article>`).join("")}</div></div>`;
  }

  if (slide.type === "questions") {
    return `<div class="frame questions-layout"><div>${head(slide)}<h2>${esc(slide.h1)}</h2></div><div class="question-grid">${slide.questions.map((question, index) => `<article data-reveal="${index + 1}"><b>${index + 1}</b><p>${esc(question)}</p></article>`).join("")}</div><figure class="ghost-art right">${image(slide)}</figure></div>`;
  }

  if (slide.type === "case") {
    return `<div class="frame case-layout"><div class="case-copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p data-reveal="1">${esc(slide.body)}</p><div class="case-table">${slide.rows.map(([label, value], index) => `<div data-reveal="${index + 1}"><b>${esc(label)}</b><span>${esc(value)}</span></div>`).join("")}</div><p class="takeaway" data-reveal="${slide.rows.length}">${esc(slide.takeaway)}</p></div><figure class="case-art">${image(slide)}</figure></div>`;
  }

  if (slide.type === "reference") {
    return `<div class="frame reference-layout"><figure class="reference-art">${image(slide)}</figure><div class="copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p>${esc(slide.body)}</p></div></div>`;
  }

  if (slide.type === "ai") {
    return `<div class="frame ai-layout"><div class="copy">${head(slide)}<h2>${esc(slide.h1)}</h2><div class="ai-grid"><article data-reveal="1"><h3>Use it for</h3><ul>${slide.use.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article><article data-reveal="2"><h3>Do not use it for</h3><ul>${slide.avoid.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article></div><p class="quote-box" data-reveal="3">${esc(slide.quote)}</p></div><figure class="side-art">${image(slide)}</figure></div>`;
  }

  if (slide.type === "checklist") {
    return `<div class="frame checklist-layout"><div class="copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p>${esc(slide.body)}</p></div><div class="checklist" id="checklist">${slide.items.map((item, index) => `<button class="check" type="button" data-check="${index + 1}"><span class="box"></span><span>${esc(item)}</span></button>`).join("")}</div></div>`;
  }

  if (slide.type === "closing") {
    const counters = `<div class="closing-counters" data-counters data-reveal="1">
      <div class="counter"><b class="num">04</b><span>case files traced</span></div>
      <div class="counter"><b class="num">05</b><span>source tiers ranked</span></div>
      <div class="counter"><b class="num">09</b><span>decision receipts</span></div>
      <div class="counter"><b class="num">01</b><span>method to keep</span></div>
    </div>`;
    const ticket = `<aside class="ticket-stub" aria-label="Ticket stub" data-reveal="2">
      <div class="ticket-side"><span class="ticket-label">Admit</span><b class="ticket-big">01</b><span class="ticket-sub">DEF CON 34</span></div>
      <div class="ticket-perf" aria-hidden="true"></div>
      <div class="ticket-body">
        <div class="ticket-row"><span>Event</span><b>Source of Truth</b></div>
        <div class="ticket-row"><span>Speaker</span><b>Carley Fant · <em>UAP Platform Engineer</em></b></div>
        <div class="ticket-row"><span>Where</span><b>LVCC · L1 · West 3</b></div>
        <div class="ticket-row"><span>When</span><b>Sun 2026-08-09 · 12:30</b></div>
        <div class="ticket-row"><span>Method</span><b>Receipts &gt; Vibes</b></div>
        <div class="ticket-serial">SRC-2026-08-09-01 · <em>SIGNAL TRACED</em></div>
      </div>
    </aside>`;
    return `<div class="frame closing-layout"><figure class="closing-art">${image(slide)}</figure><div class="closing-copy">${head(slide)}<h2>${esc(slide.h1)}</h2><p>${esc(slide.body)}</p>${counters}${ticket}<p class="closing-callback" data-reveal="2">${esc(slide.callback)}</p></div></div>`;
  }

  if (slide.type === "memorial") {
    return `<div class="memorial-layout">
      <figure class="memorial-art">${image(slide)}</figure>
      <div class="memorial-scrim" aria-hidden="true"></div>
      <div class="memorial-copy">
        ${head(slide)}
        <div class="memorial-count" aria-label="Reported deaths increased from 71,660 on 26 January 2026 to more than 73,300 by 1 August 2026" data-count-from="71660" data-count-to="73300">
          <span class="count-live">71,660</span>
        </div>
        <div class="memorial-dates"><span class="date-range">26 January 2026 -> 1 August 2026 source check</span></div>
        <p class="memorial-label">Palestinians reported killed in Gaza since 7 October 2023</p>
        <blockquote data-reveal="1">${esc(slide.body)}</blockquote>
        <p class="memorial-source" data-reveal="1">Start: WAFA / Gaza Health Ministry, 26 Jan 2026 // current: AP, 1 Aug 2026, citing Gaza Health Ministry // reported toll remains incomplete</p>
      </div>
    </div>`;
  }

  throw new Error(`Unknown slide type: ${slide.type}`);
}

const optionsMarkup = slides.map((slide) => {
  const label = `${slide.id.replace("slide-", "").padStart(2, "0")} // ${slide.title}`;
  return `<option value="${slide.id}">${esc(label)}</option>`;
}).join("");

const railMarkup = slides.map((slide, index) => {
  return `<a href="#${slide.id}" aria-label="${esc(index + 1)} // ${esc(slide.title)}"></a>`;
}).join("");

const sceneConfig = {
  "slide-01": { scene: "portal", readout: "UAP PLATFORM ENGINEER // THRESHOLD", actions: [["ENTER", "enter"]] },
  "slide-02": { scene: "whois", readout: "UAP PLATFORM ENGINEER // IDENTIFIED", actions: [["TRANSMIT", "transmit"], ["MASK", "mask"]] },
  "slide-03": { scene: "graph", actions: [["HEAT", "heat"], ["FREEZE", "freeze"], ["RESHUFFLE", "reshuffle"]] },
  "slide-04": { scene: "sky", readout: "RAW FEED // UNCHECKED", actions: [["SCAN SKY", "scan"], ["CHECK GROUND", "ground"]] },
  "slide-05": { scene: "stack", actions: [["TRACE CLAIM", "trace"], ["RESET", "reset"]] },
  "slide-06": { scene: "cropmap", readout: "SOURCE MAP // UNRANKED", actions: [["RANK SOURCES", "rank"], ["FLATTEN", "flatten"]] },
  "slide-07": { scene: "protocol", actions: [["OPEN CASE", "open"], ["RESET", "reset"]] },
  "slide-08": { scene: "machine", readout: "ASSUMPTIONS // 07", actions: [["SIMPLIFY", "simplify"], ["RESTORE", "restore"]] },
  "slide-09": { scene: "jwt", actions: [["INJECT SCRIPT", "inject"], ["ISOLATE", "isolate"]] },
  "slide-10": { scene: "default", readout: "DEFAULT // LOADED", actions: [["ACCEPT", "accept"], ["CHOOSE", "choose"]] },
  "slide-11": { scene: "oauth", actions: [["TRACE FORWARD", "trace"], ["SHOW FOSSIL", "fossil"]] },
  "slide-12": { scene: "model", actions: [["DISSOLVE", "dissolve"], ["RESTORE", "restore"]] },
  "slide-13": { scene: "hash", actions: [["COST +", "cost"], ["RESET", "reset"]] },
  "slide-14": { scene: "territory", readout: "MAP / TERRITORY", actions: [["BEND MAP", "bend"], ["SHOW TERRITORY", "territory"]] },
  "slide-15": { scene: "cors", actions: [["OPEN", "open"], ["RESTRICT", "restrict"]] },
  "slide-16": { scene: "consensus", readout: "LOOP GAIN // 1.00", actions: [["AMPLIFY", "amplify"], ["BREAK LOOP", "break"]] },
  "slide-17": { scene: "ai", actions: [["ORIENT", "orient"], ["CITE", "cite"], ["VERIFY", "verify"]] },
  "slide-18": { scene: "humans", readout: "UAP // HUMAN CONTEXT OFFLINE", actions: [["TRACE AUTHOR", "trace"], ["OPEN ISSUE", "issue"]] },
  "slide-19": { scene: "checklist", actions: [["RUN METHOD", "run"], ["CLEAR", "reset"]] },
  "slide-20": { scene: "portal", readout: "UAP // SIGNAL TRACED", actions: [["GO DEEPER", "enter"]] },
};

const slideStepCounts = {
  "slide-01": 1, "slide-02": 2, "slide-03": 3, "slide-04": 2,
  "slide-05": 3, "slide-06": 5, "slide-07": 4, "slide-08": 2,
  "slide-09": 4, "slide-10": 2, "slide-11": 4, "slide-12": 3,
  "slide-13": 4, "slide-14": 2, "slide-15": 4, "slide-16": 3,
  "slide-17": 3, "slide-18": 3, "slide-19": 9, "slide-20": 2,
  "slide-21": 1,
};

function sceneLayer(slide) {
  const config = sceneConfig[slide.id];
  if (!config) return "";
  const controls = config.actions.map(([label, action], index) => (
    `<button type="button" data-action="${action}" data-key="${index + 1}">${label}</button>`
  )).join("");
  return `<canvas class="scene-canvas" data-scene="${config.scene}" aria-hidden="true"></canvas><div class="scene-hud"><span>LIVE SYSTEM</span><b data-readout>${esc(config.readout || "READY")}</b></div><div class="scene-controls">${controls}</div>`;
}

const slideMarkup = slides.map((slide, index) => {
  const scene = sceneConfig[slide.id]?.scene || "static";
  return `<section class="slide slide-${slide.type} ${scene !== "static" ? "slide-live" : ""}" id="${slide.id}" data-title="${esc(slide.title)}" data-scene="${scene}" data-slide="${index + 1}" data-step="0" data-max-step="${slideStepCounts[slide.id] ?? 1}">${sceneLayer(slide)}${slideHtml(slide)}${speakerNotes(slide)}</section>`;
}).join("\n");

const speakerNotesMarkup = slides.map((slide, index) => {
  const no = String(index + 1).padStart(2, "0");
  return `<section class="note-slide" id="${slide.id}"><p class="note-kicker">${no} // ${esc(slide.title)}</p><h2>${esc(slide.title)}</h2><ul>${slide.notes.map((note) => `<li>${esc(note)}</li>`).join("")}</ul></section>`;
}).join("\n");

const css = String.raw`
@font-face{font-family:"Space Mono";font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,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) format("woff2")}
@font-face{font-family:"Space Mono";font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,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) format("woff2")}
@font-face{font-family:"Space Mono";font-style:normal;font-weight:700;font-display:swap;src:url(data:font/woff2;base64,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) format("woff2")}
@font-face{font-family:"Space Mono";font-style:italic;font-weight:700;font-display:swap;src:url(data:font/woff2;base64,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) format("woff2")}

:root {
  --bg: #030308;
  --ink: #ffffff;
  --ink-dim: #a1a1aa;
  --muted: #52525b;
  --panel: rgba(8, 7, 20, .94);
  --panel2: rgba(10, 10, 18, .90);
  --line: #27272a;
  --line-strong: #3f3f46;
  --purple: #2563eb;
  --purple-hot: #3b82f6;
  --lime: #60a5fa;
  --coral: #ef4444;
  --signal: #f87171;
  --field: #3f3f46;
  --blood: #991b1b;
  --cream: #ffffff;
  --ufo-cyan: #3b82f6;
  --ufo-violet: #2563eb;
  --ufo-magenta: #ef4444;
  --display: "Space Mono", Consolas, monospace;
  --mono: "Space Mono", Consolas, monospace;
  --sans: "Space Mono", Consolas, monospace;
  --chrome: 86px;
}
* { box-sizing: border-box; }
html { color-scheme: dark; scroll-behavior: auto; }
body {
  margin: 0;
  overflow-x: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 700;
  letter-spacing: 0;
}
p, li, figcaption, blockquote, button, select, option {
  font-weight: 700;
}

body::after {
  content: "";
  display: none;
}
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 998;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%);
  pointer-events: none;
}

::selection {
  background: #ef4444 !important;
  color: #030308 !important;
}

h1:hover, h2:hover, a:hover {
  text-shadow: none !important;
}


a { color: inherit; }
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: .75rem;
  height: 30px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
  background: rgba(5, 5, 7, .96);
}
.progress-track {
  position: relative;
  flex: 1;
  height: 8px;
  overflow: hidden;
  border: 1px solid rgba(242,234,216,.22);
  border-radius: 0;
  background: rgba(0,0,0,.58);
}
.progress-fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 0;
  background: var(--ink);
  transition: width .12s linear;
}
.progress-marker {
  position: absolute;
  top: 50%;
  left: 0;
  width: 14px;
  height: 12px;
  transform: translate(-50%, -50%);
  border: 1px solid var(--ink);
  border-radius: 0;
  background: var(--ink);
  box-shadow: none;
  transition: left .12s linear;
}
.progress-marker::before {
  position: absolute;
  left: 1px;
  top: -8px;
  width: 4px;
  height: 10px;
  content: "";
  border: 1px solid var(--ink);
  border-radius: 0;
  background: #050507;
  box-shadow: 5px 1px 0 -1px #050507, 5px 1px 0 0 var(--ink);
  transform: rotate(-9deg);
}
.progress-marker::after {
  position: absolute;
  right: 2px;
  top: 3px;
  width: 3px;
  height: 3px;
  content: "";
  border-radius: 0;
  background: var(--coral);
}
.topbar {
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  z-index: 35;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 28rem) auto;
  gap: .7rem;
  align-items: center;
  min-height: 56px;
  padding: .58rem clamp(1rem, 2.2vw, 1.8rem);
  border-bottom: 1px solid var(--line);
  background: rgba(5, 5, 7, .88);
  backdrop-filter: none;
}
.brand {
  min-width: 0;
  font: 900 clamp(.68rem, 1vw, .78rem)/1.25 var(--mono);
  text-transform: uppercase;
}
.brand span {
  display: block;
  overflow: hidden;
  color: var(--muted);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.jump,
.toggle {
  min-height: 2.25rem;
  border: 1px solid var(--line-strong);
  border-radius: 0;
  background: rgba(16, 16, 22, .92);
  color: var(--ink);
  font: 800 .72rem var(--mono);
  text-transform: uppercase;
}
.jump { width: 100%; padding: .56rem .7rem; outline: none; }
.toggle { cursor: pointer; padding: .56rem .72rem; }
.toggle[aria-pressed="true"] {
  border-color: var(--lime);
  background: rgba(143, 165, 143, .12);
  color: var(--lime);
}
.rail {
  position: fixed;
  top: 50%;
  left: clamp(.55rem, 1.2vw, 1rem);
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: .35rem;
  transform: translateY(-50%);
}
.rail a {
  display: block;
  width: .56rem;
  height: .56rem;
  border: 1px solid rgba(242,234,216,.28);
  border-radius: 0;
  background: rgba(5,5,7,.76);
  text-decoration: none;
}
.rail a.active {
  border-color: var(--ink);
  background: var(--ink);
  box-shadow: none;
}
.rabbit-status {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 34;
  max-width: min(24rem, calc(100vw - 2rem));
  padding: .72rem .82rem;
  border: 1px solid var(--line);
  border-radius: 0;
  background: rgba(5,5,7,.82);
  color: var(--ink-dim);
  font: 700 .72rem/1.45 var(--mono);
  transform: translateY(140%);
  transition: transform .1s steps(3);
}
body.rabbit-mode .rabbit-status { transform: translateY(0); }
.slide {
  position: relative;
  display: grid;
  min-height: 100vh;
  padding: calc(var(--chrome) + 10px) clamp(1rem, 4vw, 4rem) 24px;
  isolation: isolate;
  scroll-snap-align: start;
}
.slide::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: "";
  background:
    linear-gradient(118deg, transparent 0 73%, rgba(118,87,214,.075) 73% 73.5%, transparent 73.5%),
    linear-gradient(62deg, transparent 0 88%, rgba(242,120,99,.065) 88% 88.4%, transparent 88.4%);
  opacity: 0.4;
}
.frame {
  position: relative;
  align-self: center;
  width: min(1500px, calc(100vw - clamp(2rem, 8vw, 8rem)));
  max-height: calc(100vh - var(--chrome) - 44px);
  margin: 0 auto;
  overflow: hidden;
}
.slide-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(.75rem, 1.8vh, 1.2rem);
  color: var(--coral);
  font: 900 clamp(.6rem, 1.1vw, .75rem)/1.2 var(--mono);
  text-transform: uppercase;
}
.slide-no { color: rgba(242,234,216,.46); font-size: clamp(1rem, 2vw, 1.45rem); }
h1, h2, h3, p { margin: 0; }
h1 {
  max-width: 11ch;
  font-family: var(--display);
  font-size: clamp(3.8rem, 9.8vw, 8.4rem);
  font-weight: 950;
  line-height: .88;
  text-transform: uppercase;
  letter-spacing: -.045em;
  overflow-wrap: anywhere;
}
h2 {
  max-width: 15ch;
  font-family: var(--display);
  font-size: clamp(2.35rem, 5.6vw, 4.95rem);
  font-weight: 950;
  line-height: .94;
  text-transform: uppercase;
  letter-spacing: -.035em;
  overflow-wrap: anywhere;
}
p, li {
  color: var(--ink-dim);
  font-size: clamp(.98rem, 1.25vw, 1.18rem);
  line-height: 1.46;
  overflow-wrap: break-word;
}
ul { margin: 1rem 0 0; padding-left: 1.2rem; }
img { display: block; max-width: 100%; }
.cover-frame {
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(18rem, .88fr);
  gap: clamp(1rem, 4vw, 4rem);
  align-items: center;
}
.cover-art img,
.closing-art img {
  width: 100%;
  max-height: calc(100vh - var(--chrome) - 58px);
  object-fit: contain;
}
.subtitle {
  max-width: 38rem;
  margin-top: 1.2rem;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  color: var(--ink);
}
.meta {
  margin-top: 2rem;
  color: var(--lime);
  font: 900 clamp(.78rem, 1.2vw, .95rem)/1.35 var(--mono);
  text-transform: uppercase;
}
.poster-frame {
  display: grid;
  align-items: center;
  justify-items: center;
  width: 100%;
  max-height: calc(100vh - var(--chrome) - 24px);
  margin: 0 auto;
}
.poster-img {
  width: min(88vh, 92vw);
  height: min(88vh, 92vw);
  max-height: calc(100vh - var(--chrome) - 26px);
  object-fit: contain;
}
.bio-layout,
.split-layout,
.case-layout,
.ai-layout,
.reference-layout,
.closing-layout {
  display: grid;
  grid-template-columns: minmax(0, .88fr) minmax(18rem, .72fr);
  gap: clamp(1rem, 4vw, 3.2rem);
  align-items: center;
}
.bio-layout {
  grid-template-columns: minmax(8rem, .28fr) minmax(18rem, .92fr) minmax(16rem, .68fr);
  gap: clamp(1rem, 2.5vw, 2.5rem);
  isolation: isolate;
}
.bio-patch {
  margin: 0;
  align-self: center;
  z-index: 4;
}
.bio-patch img {
  width: 100%;
  max-width: 220px;
  height: auto;
  opacity: .88;
  filter: none;
}
.bio-photo img,
.side-art img,
.case-art img,
.reference-art img {
  width: 100%;
  max-height: calc(100vh - var(--chrome) - 58px);
  object-fit: contain;
}
.bio-photo img {
  height: min(74vh, 760px);
  border: 0;
  background: #000;
  box-shadow: none;
  filter: saturate(1.08) contrast(1.04) brightness(.98);
}
.bio-text {
  position: relative;
  z-index: 4;
  min-width: 0;
  max-height: none;
  overflow: visible;
  padding: clamp(.75rem, 1.4vw, 1.1rem) 0 clamp(.75rem, 1.4vw, 1.1rem) clamp(1.1rem, 2vw, 1.8rem);
  border-left: 2px solid rgba(57,255,20,.6);
  background: transparent;
}
.bio-text::before {
  position: absolute;
  top: -4px;
  left: -8px;
  content: "┌";
  color: var(--ink-dim);
  font: 400 1.1rem/1 "Space Mono", monospace;
  pointer-events: none;
}
.bio-text::after {
  position: absolute;
  bottom: -4px;
  right: -8px;
  content: "┘";
  color: var(--ink-dim);
  font: 400 1.1rem/1 "Space Mono", monospace;
  pointer-events: none;
}
.bio-text h2 {
  max-width: 11ch;
  font-family: var(--display);
  font-size: clamp(3.2rem, 5.2vw, 5.4rem);
  line-height: .93;
  text-transform: none;
  text-shadow: none;
}
.bio-text .bio-role {
  margin-top: .9rem;
  color: #39ff14;
  font: 700 clamp(.92rem, 1.18vw, 1.08rem)/1.35 var(--sans);
  text-transform: uppercase;
  letter-spacing: .08em;
  text-shadow: none;
}
.bio-text p:not(.bio-role) { text-shadow: none; }
.bio-text p,
.copy p,
.case-copy > p,
.closing-copy p {
  max-width: 42rem;
  margin-top: 1rem;
}
.bio-readout {
  display: grid;
  gap: .35rem;
  margin-top: 1.5rem;
  max-width: 42rem;
}
.readout-row {
  display: flex;
  justify-content: space-between;
  font: 400 clamp(.72rem, .85vw, .82rem)/1.5 "Space Mono", monospace;
}
.readout-key { color: var(--ink-dim); }
.readout-val { color: var(--ink); text-align: right; }
.readout-val.accent { color: #39ff14; }
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: 1.2rem;
}
.tag-row span {
  border: 0;
  border-bottom: 1px solid rgba(139,132,105,.55);
  border-radius: 0;
  padding: .15rem 0;
  background: transparent;
  color: rgba(229,226,216,.76);
  font: 950 .72rem var(--mono);
  text-transform: uppercase;
  box-shadow: none;
}
.tag-row span:nth-child(even) {
  background: transparent;
  color: rgba(139,132,105,.92);
  border-color: rgba(127,159,114,.50);
}
.split-layout .copy,
.ai-layout .copy,
.reference-layout .copy,
.case-copy,
.closing-copy {
  min-width: 0;
  max-height: calc(100vh - 128px);
  overflow-y: auto;
}
.split-layout li { margin: .5rem 0; }
.framework-layout {
  display: grid;
  grid-template-columns: minmax(0, .78fr) minmax(18rem, .72fr);
  gap: clamp(1rem, 3vw, 2.4rem);
  align-items: center;
}
.framework-layout .copy { z-index: 2; }
.conflict-stack {
  position: relative;
  z-index: 2;
  display: grid;
  gap: .8rem;
}
.conflict-stack div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: .7rem;
  align-items: center;
  min-height: 3.3rem;
  border: 1px solid var(--line);
  border-radius: 0;
  padding: .8rem;
  background: rgba(10,10,15,.82);
  font: 800 .75rem/1.25 var(--mono);
  text-transform: uppercase;
}
.conflict-stack b { color: var(--coral); }
.conflict-stack strong { color: var(--lime); }
.ghost-art {
  position: absolute;
  right: -5%;
  bottom: -14%;
  z-index: 1;
  width: min(42vw, 30rem);
  opacity: .18;
  filter: saturate(.9);
}
.ghost-art.right { right: -2%; bottom: -10%; }
.hierarchy-layout h2,
.questions-layout h2,
.checklist-layout h2 { max-width: 15ch; }
.tier-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: .7rem;
}
.tier {
  min-height: 18rem;
  border: 1px solid var(--line);
  border-radius: 0;
  padding: .9rem;
  background: linear-gradient(180deg, rgba(242,234,216,.08), rgba(10,10,15,.74));
}
.tier b {
  display: block;
  color: var(--lime);
  font: 900 1.5rem var(--mono);
}
.tier h3 {
  margin-top: 1rem;
  color: var(--ink);
  font-size: clamp(1rem, 1.35vw, 1.22rem);
  line-height: 1.05;
  text-transform: uppercase;
}
.tier p {
  margin-top: .7rem;
  font-size: clamp(.78rem, 1vw, .92rem);
}
.questions-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 1rem;
}
.question-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .8rem;
}
.question-grid article {
  min-height: 15rem;
  border: 1px solid var(--line);
  border-radius: 0;
  padding: 1rem;
  background: rgba(10,10,15,.78);
}
.question-grid b {
  color: var(--coral);
  font: 900 2.6rem var(--mono);
}
.question-grid p { margin-top: .8rem; color: var(--ink); }
.case-layout { grid-template-columns: minmax(0, .96fr) minmax(18rem, .58fr); }
.case-copy h2 {
  max-width: 12ch;
  font-size: clamp(2.25rem, 5.2vw, 4.8rem);
}
.ai-layout h2 {
  max-width: 14ch;
  font-size: clamp(2.25rem, 5.1vw, 4.7rem);
}
.case-copy > p { font-size: clamp(.88rem, 1.18vw, 1.06rem); }
.case-table {
  display: grid;
  gap: .42rem;
  margin-top: .78rem;
}
.case-table div {
  display: grid;
  grid-template-columns: minmax(8rem, .42fr) minmax(0, 1fr);
  gap: .8rem;
  border-top: 1px solid var(--line);
  border-radius: 0;
  padding: .55rem .62rem;
  background: rgba(10,10,15,.62);
}
.case-table b {
  color: var(--lime);
  font: 800 .72rem/1.3 var(--mono);
  text-transform: none;
}
.case-table span {
  color: var(--ink);
  font: 700 clamp(.72rem, .95vw, .86rem)/1.3 var(--mono);
}
.takeaway,
.quote-box {
  margin-top: .72rem;
  border-left: 4px solid var(--coral);
  padding: .68rem .82rem;
  background: rgba(242, 120, 99, .08);
  color: var(--ink);
  font-size: clamp(.86rem, 1.05vw, .98rem);
  font-weight: 800;
}
.reference-layout { grid-template-columns: minmax(18rem, .55fr) minmax(0, .9fr); }
.ai-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: .8rem;
  margin-top: 1rem;
}
.ai-grid article {
  border: 1px solid var(--line);
  border-radius: 0;
  padding: .95rem;
  background: rgba(10,10,15,.82);
}
.ai-grid h3 {
  color: var(--lime);
  font: 900 .82rem var(--mono);
  text-transform: uppercase;
}
.ai-grid li { margin: .28rem 0; font-size: clamp(.78rem, .92vw, .9rem); }
.checklist-layout {
  display: grid;
  grid-template-columns: minmax(0, .55fr) minmax(20rem, .8fr);
  gap: 1.4rem;
  align-items: center;
}
.checklist {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .58rem;
}
.check {
  display: flex;
  align-items: center;
  gap: .65rem;
  min-height: 4.05rem;
  border: 1px solid var(--line);
  border-radius: 0;
  padding: .72rem;
  background: rgba(10,10,15,.82);
  color: var(--ink);
  cursor: pointer;
  font: 850 .78rem/1.2 var(--mono);
  text-align: left;
  text-transform: uppercase;
}
.box {
  width: 1.05rem;
  height: 1.05rem;
  flex: 0 0 auto;
  border: 1px solid var(--line-strong);
  border-radius: 0;
}
.check.done {
  border-color: rgba(159,183,154,.65);
  color: var(--lime);
  background: rgba(159,183,154,.09);
}
.check.done .box { background: var(--lime); box-shadow: inset 0 0 0 3px #050507; }
.closing-layout {
  grid-template-columns: minmax(17rem, .54fr) minmax(0, .9fr);
}
.closing-copy h2 { max-width: 14ch; }
.speaker-notes,
.speaker-notes-panel[hidden] { display: none; }
.speaker-notes-panel {
  position: fixed;
  left: 50%;
  bottom: 1rem;
  z-index: 50;
  width: min(58rem, calc(100vw - 2rem));
  max-height: 34vh;
  overflow: auto;
  transform: translateX(-50%);
  border: 1px solid rgba(159,183,154,.45);
  border-radius: 0;
  padding: 1rem 1.1rem;
  background: rgba(5,5,7,.96);
  box-shadow: 0 22px 70px rgba(0,0,0,.6);
}
.speaker-notes-panel b {
  display: block;
  color: var(--lime);
  font: 900 .76rem var(--mono);
  text-transform: uppercase;
}
.speaker-notes-panel li { margin: .35rem 0; font-size: .95rem; }

/* Prototype stage system: live technical exhibits, restrained chrome, persistent depth. */
:root { --chrome: 66px; }
body {
  background: #050507;
  overscroll-behavior: none;
}
.progress {
  top: 47px;
  height: 18px;
  padding: 0;
  border: 0;
  background: rgba(242,234,216,.08);
}
.progress-track { position: relative; width: 100%; height: 18px; overflow: visible; border: 0; border-radius: 0; background: #050507; }
.progress-maze { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
.maze-bed,
.progress-fill { fill: none; vector-effect: non-scaling-stroke; stroke-linecap: square; stroke-linejoin: miter; }
.maze-bed { stroke: rgba(242,234,216,.13); stroke-width: 1; }
.progress-fill {
  display: block;
  width: auto;
  height: auto;
  border-radius: 0;
  background: none;
  stroke: var(--ink);
  stroke-width: 1.6;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  filter: none;
  transition: stroke-dashoffset .16s linear;
}
.progress-marker {
  width: 20px; height: 16px; border: 1px solid var(--ink);
  box-shadow: none;
  transform-origin: 50% 50%;
  transition: left .18s linear, top .18s linear,
              transform .55s linear, opacity .55s linear;
}
.progress-marker::before { left: 2px; top: -11px; width: 5px; height: 13px; box-shadow: 7px 1px 0 -1px #050507, 7px 1px 0 0 var(--ink); }
.progress-marker::after { right: 3px; top: 4px; width: 3px; height: 3px; }
/* Void hole at right end of progress track */
.progress-void {
  position: absolute;
  right: -2px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, #000 30%, rgba(106,53,232,.6) 55%, rgba(106,53,232,.15) 80%, transparent 100%);
  box-shadow: none;
  pointer-events: none;
  z-index: 3;
}
.progress-void::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(106,53,232,.3);
  animation: void-pulse 2.4s steps(8) infinite;
}
@keyframes void-pulse {
  0%, 100% { transform: scale(1); opacity: .5; }
  50% { transform: scale(1.4); opacity: 0; }
}
/* At the void: rabbit spirals down into the black hole. */
.progress-marker.at-void {
  transform: translate(-50%, -20%) rotate(220deg) scale(.45);
  opacity: .55;
  filter: none;
}
/* Reduced motion: no dive rotation. */
@media (prefers-reduced-motion: reduce) {
  .progress-marker, .progress-marker.at-void { transition: none; transform: translate(-50%, -50%); }
  .progress-void::before { animation: none; }
}
.topbar {
  top: 0;
  min-height: 47px;
  grid-template-columns: minmax(0,1fr) minmax(12rem,24rem) auto;
  padding: 0 30px;
  border-bottom: 1px solid rgba(242,234,216,.09);
  background: rgba(5,5,7,.84);
  backdrop-filter: none;
}
.brand { color: var(--lime); letter-spacing: .16em; }
.brand span { display: inline; margin-left: .8rem; color: rgba(242,234,216,.42); letter-spacing: .12em; }
.jump, .toggle {
  min-height: 28px;
  border-radius: 0;
  background: rgba(5,5,7,.62);
  font-size: .61rem;
  letter-spacing: .14em;
}
.toggle { color: var(--lime); }
.rail { left: 14px; gap: .3rem; }
.rail a { width: 5px; height: 5px; border-radius: 0; border: 0; background: rgba(242,234,216,.22); }
.rail a.active { width: 13px; background: var(--ink); box-shadow: none; }
.rabbit-status {
  right: 24px;
  bottom: 18px;
  border-radius: 0;
  background: rgba(5,5,7,.88);
  letter-spacing: .08em;
}
.slide {
  min-height: 100vh;
  padding: 66px 30px 0;
  overflow: hidden;
  background: #050507;
}
.slide::before {
  z-index: 0;
  background:
    radial-gradient(circle at 75% 42%, rgba(106,53,232,.12), transparent 34%),
    linear-gradient(90deg, transparent 0 51%, rgba(159,183,154,.035) 51% 51.08%, transparent 51.08%);
  opacity: 1;
}
.slide::after {
  position: absolute;
  inset: 0;
  z-index: 5;
  content: "";
  pointer-events: none;
  background: none;
  mix-blend-mode: normal;
}
.frame, .poster-frame { z-index: 2; width: min(1640px, calc(100vw - 84px)); max-height: calc(100vh - 64px); }
.slide-live .frame,
.slide-live .poster-frame {
  width: min(1780px, calc(100vw - 56px));
}
.slide-live .frame { pointer-events: none; }
.scene-canvas {
  position: absolute;
  inset: 66px 0 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: calc(100% - 66px);
  cursor: crosshair;
  touch-action: none;
}
.scene-hud {
  position: absolute;
  bottom: 22px;
  right: 30px;
  z-index: 8;
  display: flex;
  gap: .55rem;
  align-items: center;
  border: 1px solid rgba(242,234,216,.16);
  padding: .46rem .62rem;
  background: rgba(5,5,7,.78);
  color: rgba(242,234,216,.46);
  font: 800 .56rem/1 var(--mono);
  letter-spacing: .2em;
  text-transform: uppercase;
  pointer-events: none;
}
.scene-hud b { color: var(--ink); text-shadow: none; }
.scene-controls {
  position: absolute;
  top: 70px;
  right: 30px;
  z-index: 9;
  display: flex;
  gap: 8px;
}
.scene-controls button {
  min-width: 6.8rem;
  min-height: 2.7rem;
  border: 1px solid rgba(242,234,216,.18);
  border-radius: 0;
  padding: .55rem .8rem;
  background: rgba(5,5,7,.72);
  color: rgba(242,234,216,.5);
  cursor: pointer;
  font: 800 .67rem/1 var(--mono);
  letter-spacing: .18em;
  text-transform: uppercase;
  transition: border-color .1s linear, color .1s linear, background .1s linear, transform .1s linear;
}
.scene-controls button:hover,
.scene-controls button.active {
  border-color: var(--ink);
  background: rgba(242,234,216,.08);
  color: var(--ink);
  transform: translateY(-1px);
}
#slide-01.is-diving .scene-controls button {
  border-color: rgba(5,5,7,.95);
  background: #000;
  color: rgba(242,234,216,.72);
  box-shadow: inset 0 0 0 1px rgba(242,234,216,.08), 0 0 30px rgba(0,0,0,.9);
}
#slide-01::before {
  position: absolute;
  left: 50%;
  top: 58%;
  z-index: 7;
  width: 20vmin;
  height: 20vmin;
  content: "";
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  border: 3px solid var(--purple-hot);
  background: #000;
  box-shadow: none;
  transform: translate(-50%, -50%) scale(.12) rotate(0deg);
}
#slide-01.is-diving::before {
  animation: title-event-horizon 2.2s steps(12) forwards;
}
@keyframes title-event-horizon {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.10) rotate(0deg); }
  34% { opacity: .72; transform: translate(-50%, -50%) scale(1.3) rotate(140deg); }
  64% { opacity: .62; transform: translate(-50%, -50%) scale(2.25) rotate(300deg); }
  100% { opacity: .18; transform: translate(-50%, -50%) scale(3.4) rotate(480deg); }
}
[data-reveal] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms linear, transform 200ms linear, border-color 200ms linear;
}
.deck-ready [data-reveal]:not(.is-visible) {
  opacity: 0;
  transform: translateY(18px);
}
.deck-ready .tier[data-reveal]:not(.is-visible),
.deck-ready .question-grid [data-reveal]:not(.is-visible),
.deck-ready .case-table [data-reveal]:not(.is-visible) {
  transform: translateY(24px) scale(.985);
}
.slide.is-resolved .scene-hud {
  border-color: rgba(242,234,216,.42);
  box-shadow: none;
}
.slide-live .checklist,
.slide-live .check { pointer-events: auto; }
.slide-head { margin-bottom: .7rem; font-size: .66rem; letter-spacing: .12em; }
.slide-no { font: 800 .7rem var(--mono); letter-spacing: .16em; }
h1 { font-size: clamp(3.9rem, 8.8vw, 7.7rem); }
h2 { font-size: clamp(2.55rem, 5.15vw, 4.8rem); }
p, li { font-size: clamp(.92rem, 1.2vw, 1.12rem); }
.poster-frame { max-height: calc(100vh - 66px); }
.poster-img {
  width: min(calc(100vh - 68px), 100vw);
  height: min(calc(100vh - 68px), 100vw);
  max-height: calc(100vh - 68px);
  filter: saturate(.96) contrast(1.04);
  transition: transform .4s linear;
}
.slide-poster:hover .poster-img { transform: scale(1.012); }
.cover-frame { min-height: calc(100vh - 84px); }
.cover-art { filter: none; }
.cover-art img { max-height: 78vh; }
.cover-copy { position: relative; z-index: 3; }
.cover-copy h1 { text-shadow: none; }
.cover-copy .subtitle { max-width: 30rem; }
#slide-01 .cover-art {
  position: relative;
  transform-style: preserve-3d;
}
#slide-01 .cover-art::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 12%;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 3px solid var(--purple-hot);
  background: #000;
  box-shadow: none;
  opacity: 0;
  transform: translate(-50%, 50%) scale(.35);
  pointer-events: none;
}
#slide-01 .scene-controls {
  top: auto;
  right: clamp(1.2rem, 3vw, 3rem);
  bottom: clamp(4.2rem, 8vh, 6rem);
}
#slide-01 .scene-controls::before {
  display: none;
}
#slide-01 .scene-controls button {
  position: relative;
  min-width: 4.8rem;
  border-color: rgba(139,132,105,.52);
  background: rgba(2,2,2,.70);
  color: rgba(229,226,216,.76);
  box-shadow: none;
}
#slide-01 .scene-controls button::after {
  display: none;
}
#slide-01.is-diving .cover-art::after {
  animation: cover-void-open 1.85s steps(8) forwards;
}
#slide-01.is-diving .cover-art img {
  transform-origin: 50% 58%;
  animation: cover-rabbit-vortex 2.1s steps(10) forwards;
}
#slide-01.is-diving .cover-copy::after {
  position: fixed;
  left: 50%;
  top: 51%;
  z-index: 8;
  content: "TRUTH-TELLERS FIELD NOTES";
  width: min(88vw, 980px);
  transform: translate(-50%, -50%);
  color: rgba(242,234,216,.92);
  font: 900 clamp(1.05rem, 2.2vw, 2rem)/1.2 var(--mono);
  letter-spacing: .28em;
  text-align: center;
  text-shadow: none;
  opacity: 0;
  pointer-events: none;
  animation: field-note-blackout 2.2s linear forwards;
}
@keyframes cover-void-open {
  0% { opacity: 0; transform: translate(-50%, 50%) scale(.3) rotate(0deg); }
  28% { opacity: .96; transform: translate(-50%, 50%) scale(1.35) rotate(120deg); }
  100% { opacity: 1; transform: translate(-50%, 50%) scale(2.2) rotate(320deg); }
}
@keyframes field-note-blackout {
  0%, 38% { opacity: 0; }
  54%, 72% { opacity: .86; }
  100% { opacity: 0; }
}
@keyframes cover-rabbit-vortex {
  0% { opacity: 1; filter: saturate(1) contrast(1) drop-shadow(0 0 0 transparent); transform: translate3d(0,0,0) rotate(0deg) scale(1); }
  18% { filter: saturate(1.08) contrast(1.06); transform: translate3d(-5vw,-3vh,0) rotate(-18deg) scale(1.03); }
  42% { opacity: .96; transform: translate3d(4vw,5vh,0) rotate(260deg) scale(.82); }
  68% { opacity: .72; filter: saturate(1.2) contrast(1.18); transform: translate3d(-2vw,13vh,0) rotate(680deg) scale(.45); }
  100% { opacity: 0; filter: saturate(2) contrast(1.35); transform: translate3d(0,21vh,0) rotate(1160deg) scale(.04); }
}
#slide-02::before {
  background: #050507;
}
#slide-02::after {
  display: none;
}
#slide-02 .frame {
  z-index: 4;
  width: min(1820px, calc(100vw - 52px));
  max-height: calc(100vh - 92px);
  overflow: visible;
}
#slide-02 .scene-canvas {
  z-index: 5;
  opacity: 1;
  mix-blend-mode: normal;
  clip-path: inset(0 30% 0 0);
}
#slide-02 .bio-photo {
  position: relative;
  z-index: 2;
}
#slide-02 .bio-text {
  position: relative;
  z-index: 4;
}
#slide-02 .scene-controls {
  top: auto;
  right: auto;
  bottom: 24px;
  left: 48px;
}
#slide-02 .scene-hud {
  display: none;
}
#slide-04::before {
  background: #050507;
}
#slide-04::after {
  display: none;
}
#slide-04.slide-live .poster-frame {
  position: relative;
  z-index: 2;
  width: min(1800px, calc(100vw - 52px));
  justify-items: start;
  padding-left: clamp(42px, 7vw, 132px);
}
#slide-04.slide-live .poster-img {
  width: min(70vh, 52vw);
  height: min(70vh, 52vw);
  max-height: calc(100vh - 148px);
  opacity: 1;
  filter: saturate(.94) contrast(1.08);
}
#slide-04.slide-live .scene-canvas {
  z-index: 3;
  clip-path: inset(0 0 0 55%);
}
#slide-04.slide-live .scene-controls {
  top: 88px;
  right: 48px;
}
#slide-04.slide-live .scene-hud {
  right: 48px;
  bottom: 28px;
}
#slide-04.slide-live .scene-controls button {
  background: #000;
  border-color: rgba(242,234,216,.28);
}

/* Live slide compositions. */
#slide-03 .split-layout,
#slide-12 .model-stage {
  min-height: calc(100vh - 70px);
  display: block;
  overflow: visible;
}
#slide-03 .copy {
  position: relative;
  left: auto;
  bottom: auto;
  z-index: 3;
  width: min(900px, 76vw);
  max-height: calc(100vh - var(--chrome) - 86px);
  margin: clamp(1rem, 3vh, 2.2rem) 0 0 clamp(.35rem, 2vw, 2rem);
  padding: clamp(1rem, 2.3vw, 1.7rem);
  border: 1px solid rgba(242,234,216,.20);
  border-radius: 0;
  background:
    linear-gradient(135deg, rgba(5,5,7,.94), rgba(5,5,7,.72)),
    radial-gradient(circle at 92% 12%, rgba(159,183,154,.10), transparent 32%);
  box-shadow: 0 0 0 1px rgba(159,183,154,.07), 0 22px 70px rgba(0,0,0,.48);
  overflow: hidden;
  text-shadow: 0 10px 35px #050507;
}
#slide-03 .copy::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(159,183,154,.12);
  pointer-events: none;
}
#slide-03 .copy h2 {
  max-width: 11ch;
  font-size: clamp(3.2rem, 7.4vw, 6.2rem);
  line-height: .86;
}
#slide-03 .copy p {
  max-width: 46rem;
  margin-top: clamp(.8rem, 2vh, 1.35rem);
  color: rgba(242,234,216,.78);
}
#slide-03 .copy ul {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .7rem;
  max-width: none;
  margin-top: clamp(1rem, 2.5vh, 1.6rem);
  padding: 0;
  list-style: none;
}
#slide-03 .copy li {
  min-height: 3.6rem;
  padding: .72rem .78rem;
  border: 1px solid rgba(159,183,154,.18);
  background: rgba(159,183,154,.045);
  color: var(--lime);
  font: 800 .78rem/1.3 var(--mono);
  text-transform: uppercase;
}
#slide-03 .side-art { display: none; }
#slide-14 .reference-layout {
  grid-template-columns: minmax(20rem,.72fr) minmax(0,.80fr);
  align-items: center;
  gap: clamp(1.8rem,4vw,5rem);
}
#slide-14 .reference-art {
  position: relative;
  z-index: 3;
  transform-origin: 54% 58%;
  animation: spoon-meme-loosen 8s linear infinite alternate;
  padding: clamp(1.8rem,3.8vw,4.8rem);
}
#slide-14 .reference-art::after {
  position: absolute;
  inset: 16%;
  content: "";
  border: 1px solid rgba(159,183,154,.24);
  border-radius: 50%;
  pointer-events: none;
  opacity: .55;
  transform: rotate(-14deg) scale(1.12,.54);
  box-shadow: none;
}
#slide-14 .reference-art img {
  opacity: 1;
  mix-blend-mode: normal;
  filter: saturate(1.08) contrast(1.14) brightness(1.04);
}
#slide-14 .copy {
  position: relative;
  z-index: 6;
  max-width: 660px;
  padding: clamp(.4rem,1.2vw,1rem) 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  text-shadow: 0 10px 30px #050507;
}
#slide-14 .copy h2 { max-width: 15ch; font-size: clamp(2.3rem,4.65vw,4.35rem); }
#slide-14 .copy p { color: rgba(242,234,216,.82); }
#slide-14.slide-live .scene-canvas {
  z-index: 5;
  opacity: .76;
  mix-blend-mode: normal;
  clip-path: inset(0 0 0 42%);
}
@keyframes spoon-meme-loosen {
  0% { transform: translate3d(-8px, 6px, 0) rotate(-1.6deg) scale(.985); }
  46% { transform: translate3d(6px, -8px, 0) rotate(1.8deg) scale(1.01); }
  100% { transform: translate3d(-2px, 4px, 0) rotate(-.4deg) scale(.995); }
}
#slide-05 .framework-layout { min-height: calc(100vh - 78px); grid-template-columns: minmax(0,.82fr) minmax(20rem,.58fr); }
#slide-05 .framework-layout .copy { align-self: end; padding-bottom: 28px; text-shadow: 0 8px 28px #050507; }
#slide-05 .conflict-stack { align-self: end; margin-bottom: 30px; }
#slide-05 .ghost-art { display: none; }
#slide-07 .questions-layout { min-height: calc(100vh - 78px); align-content: end; padding-bottom: 28px; }
#slide-07 .questions-layout > div:first-child { position: relative; z-index: 4; width: 44%; text-shadow: 0 8px 28px #050507; }
#slide-07 .question-grid { position: relative; z-index: 4; width: 72%; margin-left: auto; grid-template-columns: repeat(4,minmax(0,1fr)); }
#slide-07 .question-grid article {
  min-height: 9.5rem;
  background: linear-gradient(180deg, rgba(5,5,7,.96), rgba(5,5,7,.90));
  border-color: rgba(242,234,216,.28);
  box-shadow: 0 18px 48px rgba(0,0,0,.52);
  backdrop-filter: none;
}
#slide-07 .question-grid b { font-size: 1.55rem; }
#slide-07 .question-grid p { font: 860 clamp(.70rem,.78vw,.80rem)/1.34 var(--sans); }
#slide-07 .ghost-art { display: none; }
#slide-06 .hierarchy-layout h2 { position: relative; z-index: 4; text-shadow: 0 12px 34px #050507; }
#slide-06 .tier-grid { position: relative; z-index: 4; }
#slide-06 .tier {
  background: linear-gradient(180deg, rgba(5,5,7,.95), rgba(5,5,7,.88));
  border-color: rgba(242,234,216,.26);
  box-shadow: 0 18px 48px rgba(0,0,0,.44);
  backdrop-filter: none;
}
.slide-live.slide-case .case-layout {
  min-height: calc(100vh - 76px);
  grid-template-columns: minmax(0,.92fr) minmax(23rem,.72fr);
  align-items: end;
  padding-bottom: 30px;
}
.slide-live.slide-case .case-copy {
  position: relative;
  z-index: 3;
  max-width: min(820px, 54vw);
  max-height: calc(100vh - 112px);
  overflow-y: auto;
  padding: 12px 20px 12px 0;
  background: linear-gradient(90deg, rgba(5,5,7,.97), rgba(5,5,7,.84) 78%, transparent);
}
.slide-live.slide-case .case-copy h2 { font-size: clamp(2.15rem,4.05vw,3.75rem); }
.slide-live.slide-case .case-copy > p { max-width: 50rem; margin-top: .7rem; color: rgba(242,234,216,.78); }
.slide-live.slide-case .case-art { display: none; }
.slide-live .case-table { gap: .32rem; margin-top: .58rem; }
.slide-live .case-table div { border-radius: 0; padding: .45rem .56rem; background: rgba(5,5,7,.56); backdrop-filter: none; }
.slide-live .case-table b { font-size: clamp(.68rem,.78vw,.76rem); }
.slide-live .case-table span { font-size: clamp(.70rem,.82vw,.80rem); line-height: 1.25; }
.slide-live.slide-case .scene-canvas {
  clip-path: inset(0 0 0 44%);
}
.slide-live.slide-case .scene-hud {
  inset: auto 30px 12px auto !important;
  max-width: calc(50vw - 48px);
}
.slide-live.slide-case .takeaway,
.slide-live .quote-box {
  margin-bottom: 0;
  max-width: calc(100% - 20px);
}
.model-stage .slide-head { display: none; }
.model-title {
  position: absolute;
  left: 0;
  bottom: 24px;
  z-index: 3;
  text-shadow: 0 10px 32px #050507;
}
.model-title h2 { max-width: 13ch; font-size: clamp(4rem,7.2vw,7rem); }
.model-title h2 em { color: var(--coral); font-style: normal; }
.model-title p { margin-top: 1rem; color: rgba(242,234,216,.42); font: 750 .72rem var(--mono); letter-spacing: .22em; text-transform: uppercase; }
.model-readout {
  position: absolute;
  right: 0;
  bottom: 28px;
  display: grid;
  gap: .45rem;
  color: rgba(242,234,216,.46);
  font: 750 .68rem var(--mono);
  letter-spacing: .18em;
  text-align: right;
  text-transform: uppercase;
}
.model-readout b { color: var(--ink); text-shadow: none; }
#slide-17 .ai-layout { min-height: calc(100vh - 76px); grid-template-columns: minmax(0,.92fr) minmax(22rem,.65fr); align-items: end; padding-bottom: 28px; }
#slide-17 .copy { max-height: calc(100vh - 140px); overflow-y: auto; padding: 18px 20px 18px 0; background: linear-gradient(90deg,rgba(5,5,7,.95),rgba(5,5,7,.7),transparent); }
#slide-17 .side-art { display: none; }
#slide-18 .split-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 34px; }
#slide-18 .copy { position: relative; z-index: 3; max-height: calc(100vh - 140px); overflow-y: auto; padding: 18px 20px 18px 0; background: linear-gradient(90deg,rgba(5,5,7,.94),rgba(5,5,7,.7),transparent); text-shadow: 0 8px 28px #050507; }
#slide-18 .side-art { display: none; }
#slide-19 .checklist-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 30px; }
#slide-20 .closing-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 34px; }
#slide-20 .closing-copy { max-height: calc(100vh - 140px); overflow-y: auto; }
#slide-20 .closing-art { opacity: .86; filter: none; }
#slide-20 .closing-copy { position: relative; z-index: 3; text-shadow: 0 10px 34px #050507; }
/* Closing counters — coral numbers, cream labels, animate on activation */
.closing-counters {
  display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 20px;
  margin: 20px 0 22px; padding: 16px 20px;
  border-top: 1px solid rgba(242,234,216,.14);
  border-bottom: 1px solid rgba(242,234,216,.14);
}
.closing-counters .counter { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.closing-counters .num {
  font: 800 clamp(1.9rem, 3.2vw, 3.4rem)/1 var(--sans);
  color: var(--coral);
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
}
.closing-counters .counter span {
  font: 700 .6rem/1 var(--mono);
  letter-spacing: .22em; text-transform: uppercase;
  color: rgba(242,234,216,.55);
}
.memorial-layout {
  position: absolute;
  inset: 66px 0 0;
  z-index: 2;
  overflow: hidden;
  background: #050507;
}
.memorial-art,
.memorial-scrim {
  position: absolute;
  inset: 0;
  margin: 0;
}
.memorial-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: .98;
  filter: contrast(1.28) saturate(1.16) brightness(.78);
}
.memorial-layout::before {
  position: absolute;
  inset: -8%;
  z-index: 1;
  content: "";
  pointer-events: none;
  background:
    repeating-linear-gradient(0deg, transparent 0 28px, rgba(159,183,154,.09) 28px 29px, transparent 29px 58px),
    repeating-linear-gradient(90deg, transparent 0 44px, rgba(242,234,216,.06) 44px 45px, transparent 45px 90px);
  opacity: .20;
  transform: rotate(-2deg) scale(1.08);
  animation: circuit-drift 9s linear infinite alternate;
}
.memorial-layout::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: "";
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 47%, rgba(5,5,7,.06) 0 34%, rgba(5,5,7,.20) 55%, rgba(5,5,7,.82) 100%),
    linear-gradient(180deg, rgba(5,5,7,.72), transparent 24%, transparent 64%, rgba(5,5,7,.86));
  mix-blend-mode: normal;
}
@keyframes circuit-drift {
  from { transform: rotate(-2deg) translate3d(-10px, -5px, 0) scale(1.08); }
  to { transform: rotate(1.5deg) translate3d(12px, 8px, 0) scale(1.12); }
}
.memorial-scrim {
  background:
    radial-gradient(ellipse at 50% 58%, transparent 0 30%, rgba(5,5,7,.18) 56%, rgba(5,5,7,.64) 100%);
  z-index: 1;
  mix-blend-mode: normal;
}
.memorial-copy {
  position: relative;
  z-index: 3;
  width: min(72rem, 82vw);
  margin: clamp(.8rem, 2.2vh, 2rem) auto 0;
  text-align: center;
  text-shadow: 0 10px 34px #050507;
}
.memorial-copy::before {
  position: absolute;
  left: 50%;
  top: 58%;
  z-index: -1;
  content: "";
  width: min(62rem, 88vw);
  height: min(24rem, 34vh);
  transform: translate(-50%, -50%) rotate(-1.5deg);
  background:
    linear-gradient(90deg, transparent 0 10%, rgba(155,0,18,.30) 10% 11%, transparent 11% 19%, rgba(155,0,18,.18) 19% 20%, transparent 20%),
    linear-gradient(180deg, transparent 0 68%, rgba(155,0,18,.24) 68% 70%, transparent 70%),
    rgba(2,2,2,.46);
  clip-path: none;
  opacity: .36;
  filter: none;
  pointer-events: none;
}
.memorial-copy .slide-head { justify-content: center; gap: 1rem; }
.memorial-count {
  position: relative;
  display: grid;
  place-items: center;
  width: min(58rem, 86vw);
  height: clamp(7rem, 12vw, 12rem);
  margin: .25rem auto 0;
  border: 2px solid rgba(155,0,18,.72);
  border-left-width: 12px;
  background: rgba(5,5,7,.90);
  color: #9b0012;
  font: 950 clamp(5.8rem, 11vw, 11.5rem)/.92 var(--sans);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
  box-shadow: 0 24px 90px rgba(0,0,0,.76), inset 0 0 0 1px rgba(242,234,216,.08);
}
.memorial-count span {
  display: block;
  transition: opacity 200ms linear, transform 200ms linear, filter 200ms linear;
  text-shadow: 0 8px 24px #000;
}
.memorial-count .count-live { font-variant-numeric: tabular-nums; }
.memorial-count::after {
  display: none;
}
.memorial-count.is-complete::after {
  display: none;
}
.memorial-dates {
  position: relative;
  min-height: 1.2rem;
  margin-top: .9rem;
  color: rgba(155,0,18,.92);
  font: 800 .66rem/1.2 var(--mono);
  letter-spacing: .22em;
  text-transform: uppercase;
}
.memorial-dates .date-range { display: block; }
.memorial-label {
  margin: 1rem auto 0;
  color: var(--ink);
  font: 800 clamp(.78rem, 1vw, 1rem)/1.35 var(--mono);
  letter-spacing: .12em;
  text-transform: uppercase;
}
.memorial-dedication {
  max-width: min(68rem, 92vw);
  margin: .8rem auto 0;
  border-left: 0;
  padding: 0;
  background: transparent;
  color: rgba(242,234,216,.86);
  font: 850 clamp(.88rem, 1.05vw, 1.06rem)/1.35 var(--mono);
  letter-spacing: .04em;
  text-transform: uppercase;
  text-align: left;
  white-space: normal;
  box-shadow: none;
}
.memorial-copy blockquote {
  position: relative;
  max-width: min(68rem, 92vw);
  margin: clamp(1.1rem, 2.4vh, 1.9rem) auto 0;
  padding: clamp(1rem, 2vw, 1.45rem) clamp(1.15rem, 2.3vw, 2rem);
  border: 1px solid rgba(229,226,216,.22);
  border-left: 8px solid rgba(155,0,18,.92);
  outline: 0;
  background: rgba(2,2,2,.88);
  box-shadow: 0 20px 72px rgba(0,0,0,.72);
  color: rgba(245,242,232,.98);
  font: 950 clamp(1.32rem, 1.85vw, 2.18rem)/1.34 var(--sans);
  letter-spacing: 0;
  text-transform: none;
  opacity: 1;
  text-shadow: none;
}
.memorial-source {
  max-width: 52rem;
  margin: clamp(.8rem, 1.7vh, 1.3rem) auto 0;
  color: rgba(242,234,216,.68);
  font: 700 clamp(.62rem, .8vw, .78rem)/1.45 var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}
/* Ticket stub — jagged perforation, cream on ink, DEF CON admit-one */
.ticket-stub {
  display: grid; grid-template-columns: auto 6px 1fr;
  margin: 4px 0 18px; max-width: 640px;
  border: 1px solid rgba(242,234,216,.28);
  background: rgba(5,5,7,.72);
  color: var(--ink);
  font-family: var(--mono);
  overflow: hidden;
}
.ticket-side {
  padding: 14px 16px; text-align: center;
  border-right: 1px dashed rgba(242,234,216,.24);
  background: rgba(242,234,216,.05);
  display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px;
  min-width: 92px;
}
.ticket-label { font-size: .58rem; letter-spacing: .28em; text-transform: uppercase; color: rgba(242,234,216,.55); }
.ticket-big { font: 800 2rem/1 var(--sans); color: var(--coral); font-variant-numeric: tabular-nums; }
.ticket-sub { font-size: .55rem; letter-spacing: .28em; text-transform: uppercase; color: rgba(242,234,216,.75); }
.ticket-perf {
  background:
    radial-gradient(circle at 3px 6px, #050507 3px, transparent 3.5px) 0 0/6px 12px repeat-y;
}
.ticket-body { padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
.ticket-row { display: grid; grid-template-columns: 84px 1fr; gap: 12px; font-size: .68rem; letter-spacing: .1em; }
.ticket-row span { text-transform: uppercase; letter-spacing: .22em; color: rgba(242,234,216,.5); font-size: .58rem; align-self: center; }
.ticket-row b { color: var(--ink); font-weight: 600; }
.ticket-row em { font-style: normal; color: var(--coral); }
.ticket-serial { margin-top: 6px; padding-top: 8px; border-top: 1px dashed rgba(242,234,216,.16); font-size: .55rem; letter-spacing: .22em; text-transform: uppercase; color: rgba(242,234,216,.4); }
.ticket-serial em { font-style: normal; color: var(--coral); }
@media (max-width: 900px) {
  .closing-counters { grid-template-columns: repeat(2, 1fr); }
  .ticket-stub { grid-template-columns: 1fr; }
  .ticket-perf { display: none; }
}
.closing-callback {
  margin-top: 1rem;
  color: var(--ink);
  font: 900 clamp(.66rem,.9vw,.8rem)/1.3 var(--mono);
  letter-spacing: .16em;
  text-transform: uppercase;
}
@media (max-height: 820px) and (min-width: 861px) {
  #slide-20 .closing-layout { padding-bottom: 14px; }
  #slide-20 .closing-copy h2 { font-size: clamp(2.55rem, 4.5vw, 3.9rem); line-height: .94; }
  #slide-20 .closing-copy > p { margin-top: .55rem; font-size: .86rem; line-height: 1.35; }
  #slide-20 .closing-art img { max-height: 52vh; }
  .closing-counters { gap: 10px; margin: 10px 0; padding: 8px 10px; }
  .closing-counters .num { font-size: 2rem; }
  .closing-counters .counter span { font-size: .5rem; }
  .ticket-stub { margin: 0 0 8px; }
  .ticket-side { min-width: 78px; padding: 8px 10px; }
  .ticket-big { font-size: 1.6rem; }
  .ticket-body { gap: 2px; padding: 7px 10px; }
  .ticket-row { grid-template-columns: 68px 1fr; gap: 8px; font-size: .56rem; }
  .ticket-row span { font-size: .48rem; }
  .ticket-serial { margin-top: 3px; padding-top: 4px; font-size: .46rem; }
  #slide-20 .closing-callback { margin-top: .4rem; font-size: .58rem; }
}
.slide-live.slide-poster .poster-img { position: relative; z-index: 2; }
.slide-live.slide-poster .poster-frame { pointer-events: none; }
#slide-08.slide-live.slide-poster .poster-img {
  opacity: 1;
  mix-blend-mode: normal;
  filter: saturate(1.18) contrast(1.10) brightness(1.04);
}
#slide-08.slide-live .scene-canvas {
  z-index: 4;
}
#slide-08.slide-live.slide-poster .poster-frame {
  z-index: 2;
}
#slide-10.slide-live .scene-canvas {
  z-index: 7;
  opacity: 1;
  mix-blend-mode: normal;
}
#slide-10.slide-live.slide-poster .poster-frame {
  z-index: 2;
}
#slide-10.slide-live.slide-poster .poster-img {
  opacity: 1;
  mix-blend-mode: normal;
  filter: saturate(1.22) contrast(1.18) brightness(1.08);
}
#slide-16.slide-live .scene-canvas {
  z-index: 4;
  mix-blend-mode: normal;
}
#slide-16.slide-live .poster-img { opacity: 1; filter: saturate(1.1) contrast(1.08) brightness(1.02); }

@media (max-width: 860px) {
  :root { --chrome: 92px; }
  .topbar { grid-template-columns: 1fr; }
  .jump, .toggle { display: none; }
  .rail { display: none; }
  .slide { padding: calc(var(--chrome) + 10px) 1rem 20px; }
  .frame { width: 100%; }
  .cover-frame,
  .bio-layout,
  .split-layout,
  .framework-layout,
  .case-layout,
  .ai-layout,
  .reference-layout,
  .closing-layout,
  .checklist-layout {
    grid-template-columns: 1fr;
  }
  h1 { font-size: clamp(3.4rem, 18vw, 5.8rem); }
  h2 { font-size: clamp(2.2rem, 11vw, 4rem); }
  .tier-grid,
  .question-grid,
  .checklist,
  .ai-grid { grid-template-columns: 1fr; }
  .tier, .question-grid article { min-height: auto; }
  .side-art,
  .case-art,
  .reference-art { display: none; }
  .poster-img { width: min(80vh, 96vw); height: min(80vh, 96vw); }
  .memorial-copy { width: calc(100vw - 2rem); margin-top: 2rem; }
  .memorial-count { height: 6rem; font-size: clamp(4.6rem, 18vw, 7rem); }
  .memorial-dedication { white-space: normal; font-size: .82rem; }
  .memorial-copy blockquote { margin-top: 1.2rem; font-size: 1.08rem; line-height: 1.32; }
  .memorial-copy::before { height: 16rem; opacity: .28; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: .001ms !important;
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
  }
  .poster-img { transform: none !important; }
}
body.export-mode *,
body.export-mode *::before,
body.export-mode *::after {
  transition: none !important;
  animation: none !important;
}
body.export-mode [data-reveal] { opacity: 1 !important; transform: none !important; }
@media print {
  .progress, .topbar, .rail, .rabbit-status, .speaker-notes-panel { display: none !important; }
  .slide { min-height: 100vh; padding: 24px; break-after: page; }
  .frame, .poster-frame { max-height: none; }
}
`;

const js = String.raw`
const slides = [...document.querySelectorAll(".slide")];
const jump = document.querySelector("#jump");
const rail = [...document.querySelectorAll("#rail a")];
const progressBar = document.querySelector("#progressBar");
const progressMarker = document.querySelector("#progressMarker");
const rabbitToggle = document.querySelector("#rabbitToggle");
const rabbitText = document.querySelector("#rabbitText");
const notesPanel = document.createElement("aside");
notesPanel.className = "speaker-notes-panel";
notesPanel.hidden = true;
notesPanel.setAttribute("aria-live", "polite");
document.body.append(notesPanel);

const rabbitNotes = [
  "Source hierarchy is a conflict-resolution tool.",
  "Trace claims until the authority changes or the assumptions surface.",
  "A diagram can be accurate and still stale.",
  "The weird sentence is usually doing work.",
  "A defensible decision has receipts and tradeoffs.",
];
let currentIndex = 0;
let notesVisible = false;
let wheelLocked = false;
let touchStartY = 0;
const exportMode = new URLSearchParams(location.search).has("export");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const semanticStateClasses = [
  "is-diving", "is-transmitting", "is-masked", "is-heated", "is-frozen", "is-reshuffled",
  "is-scanning", "is-grounded", "is-ranked", "is-simplified", "is-injected", "is-isolated",
  "is-accepted", "is-chosen", "is-fossil", "is-dissolved", "is-bending", "is-territory",
  "is-open", "is-restricted", "is-amplified", "is-broken", "is-oriented", "is-cited",
  "is-verified", "is-tracing", "is-issue-open"
];

function deriveSemanticState(slide, step, maxStep) {
  const scene = slide.dataset.scene;
  const ratio = maxStep ? step / maxStep : 1;
  const toggle = (name, condition) => slide.classList.toggle(name, Boolean(condition));
  if (scene === "whois" && step > 0) slide.classList.remove("is-masked");
  toggle("is-diving", scene === "portal" && step > 0);
  toggle("is-transmitting", scene === "whois" && step > 0 && !slide.classList.contains("is-masked"));
  toggle("is-heated", scene === "graph" && step >= 1);
  toggle("is-reshuffled", scene === "graph" && step >= 2);
  toggle("is-frozen", scene === "graph" && step === maxStep);
  toggle("is-scanning", scene === "sky" && step >= 1);
  toggle("is-grounded", scene === "sky" && step === maxStep);
  toggle("is-ranked", scene === "cropmap" && step > 0);
  toggle("is-simplified", scene === "machine" && step > 0);
  toggle("is-injected", scene === "jwt" && step > 0 && step < maxStep);
  toggle("is-isolated", scene === "jwt" && step === maxStep);
  toggle("is-accepted", scene === "default" && step === 1);
  toggle("is-chosen", scene === "default" && step === maxStep);
  toggle("is-fossil", scene === "oauth" && step === maxStep);
  toggle("is-dissolved", scene === "model" && step > 0);
  toggle("is-bending", scene === "territory" && step >= 1);
  toggle("is-territory", scene === "territory" && step === maxStep);
  toggle("is-open", scene === "cors" && step > 0 && step < maxStep);
  toggle("is-restricted", scene === "cors" && step === maxStep);
  toggle("is-amplified", scene === "consensus" && step > 0 && step < maxStep);
  toggle("is-broken", scene === "consensus" && step === maxStep);
  toggle("is-oriented", scene === "ai" && ratio >= 1 / 3);
  toggle("is-cited", scene === "ai" && ratio >= 2 / 3);
  toggle("is-verified", scene === "ai" && step === maxStep);
  toggle("is-tracing", scene === "humans" && step > 0);
  toggle("is-issue-open", scene === "humans" && step === maxStep);
}

function setSlideStep(slide, nextStep, { instant = false } = {}) {
  if (!slide) return 0;
  const maxStep = Number(slide.dataset.maxStep || 0);
  const step = Math.max(0, Math.min(maxStep, Number(nextStep) || 0));
  slide.dataset.step = String(step);
  for (let index = 0; index <= maxStep; index++) slide.classList.toggle("step-" + index, index === step);
  slide.classList.toggle("is-resolved", step === maxStep);
  slide.querySelectorAll("[data-reveal]").forEach((node) => {
    node.classList.toggle("is-visible", Number(node.dataset.reveal) <= step);
  });
  slide.querySelectorAll("[data-check]").forEach((node) => {
    node.classList.toggle("done", Number(node.dataset.check) <= step);
  });
  deriveSemanticState(slide, step, maxStep);
  window.onDeckStateChange?.(slide, { instant: instant || exportMode || reducedMotion });
  return step;
}

function resetSlide(slide = slides[currentIndex]) {
  semanticStateClasses.forEach((name) => slide.classList.remove(name));
  setSlideStep(slide, 0, { instant: true });
}

function setCurrent(index, push = true) {
  currentIndex = Math.max(0, Math.min(slides.length - 1, index));
  const slide = slides[currentIndex];
  slides.forEach((node, slideIndex) => node.classList.toggle("is-current", slideIndex === currentIndex));
  window.scrollTo({ top: slide.offsetTop, behavior: "auto" });
  if (push) history.replaceState(null, "", "#" + slide.id);
  updateChrome();
  window.onDeckSlideChange?.(slide, { instant: exportMode || reducedMotion });
}

function updateChrome() {
  const slide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;
  const isFirst = currentIndex === 0;
  const pct = slides.length === 1 ? 100 : (currentIndex / (slides.length - 1)) * 100;
  const pathLength = progressBar.getTotalLength();
  progressBar.style.strokeDasharray = pathLength;
  progressBar.style.strokeDashoffset = pathLength * (1 - pct / 100);
  const pathPoint = progressBar.getPointAtLength(pathLength * pct / 100);
  const markerLeft = pathPoint.x / 10;
  // Bunny must never clip off either edge. Marker is 20px wide with ear cluster ~7px to the right + glow;
  // inset by 22px on both sides so the whole silhouette stays on-screen.
  const inset = isLast ? 40 : 22;
  progressMarker.style.left = "clamp(" + inset + "px, " + markerLeft + "%, calc(100% - " + inset + "px))";
  progressMarker.style.top = (pathPoint.y / 20 * 100) + "%";
  // "Toward the void" — descend on the final slide, hold at the last position beforehand.
  progressMarker.classList.toggle("at-void", isLast);
  progressMarker.classList.toggle("at-start", isFirst);
  rail.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
  jump.value = slide.id;
  rabbitText.textContent = rabbitNotes[currentIndex % rabbitNotes.length];
  const title = slide.dataset.title || slide.id;
  const no = slide.querySelector(".slide-no")?.textContent?.trim() || String(currentIndex + 1).padStart(2, "0");
  const notes = [...slide.querySelectorAll(".speaker-notes li")].map((node) => node.textContent.trim());
  notesPanel.innerHTML = "<b>Speaker notes // " + no + " // " + title + "</b><ul>" + notes.map((note) => "<li>" + note + "</li>").join("") + "</ul>";
  notesPanel.hidden = !notesVisible;
}

function advance() {
  const slide = slides[currentIndex];
  const step = Number(slide.dataset.step || 0);
  const maxStep = Number(slide.dataset.maxStep || 0);
  if (step < maxStep) setSlideStep(slide, step + 1);
  else setCurrent(currentIndex + 1);
}

function reverse() {
  const slide = slides[currentIndex];
  const step = Number(slide.dataset.step || 0);
  if (step > 0) setSlideStep(slide, step - 1);
  else setCurrent(currentIndex - 1);
}

function isControl(target) {
  return target instanceof Element && target.closest("button, select, input, textarea, a");
}

jump.addEventListener("change", () => {
  const index = slides.findIndex((slide) => slide.id === jump.value);
  if (index >= 0) setCurrent(index);
});
rail.forEach((dot, index) => dot.addEventListener("click", (event) => {
  event.preventDefault();
  setCurrent(index);
}));
rabbitToggle.addEventListener("click", () => {
  const active = document.body.classList.toggle("rabbit-mode");
  rabbitToggle.setAttribute("aria-pressed", String(active));
});
document.querySelectorAll(".check").forEach((button) => {
  button.addEventListener("click", () => {
    const slide = button.closest(".slide");
    const checkStep = Number(button.dataset.check);
    const currentStep = Number(slide.dataset.step);
    setSlideStep(slide, currentStep === checkStep ? checkStep - 1 : checkStep);
  });
});
window.addEventListener("keydown", (event) => {
  if (isControl(event.target) && event.code === "Space") return;
  if (["ArrowDown", "PageDown", "Space", "ArrowRight"].includes(event.code)) {
    event.preventDefault();
    advance();
  } else if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.code)) {
    event.preventDefault();
    reverse();
  } else if (event.key.toLowerCase() === "n") {
    notesVisible = !notesVisible;
    updateChrome();
  } else if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    resetSlide();
  } else if (!isControl(event.target) && !event.metaKey && !event.ctrlKey && !event.altKey && /^Digit[0-9]$/.test(event.code)) {
    event.preventDefault();
    const digit = Number(event.code.replace("Digit", ""));
    const base = digit === 0 ? 10 : digit;
    const targetIndex = base - 1 + (event.shiftKey ? 10 : 0);
    setCurrent(targetIndex);
  }
});
window.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (wheelLocked) return;
  wheelLocked = true;
  event.deltaY > 0 ? advance() : reverse();
  setTimeout(() => { wheelLocked = false; }, 850);
}, { passive: false });
const deck = document.querySelector("#deck");
deck.addEventListener("click", (event) => {
  if (isControl(event.target) || window.__deckDragged) {
    window.__deckDragged = false;
    return;
  }
  advance();
});
deck.addEventListener("touchstart", (event) => {
  event.preventDefault();
  touchStartY = event.changedTouches[0]?.clientY || 0;
}, { passive: false });
deck.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
deck.addEventListener("touchend", (event) => {
  event.preventDefault();
  const endY = event.changedTouches[0]?.clientY || touchStartY;
  if (Math.abs(touchStartY - endY) > 48) touchStartY > endY ? advance() : reverse();
}, { passive: false });
window.addEventListener("resize", () => setCurrent(currentIndex, false));
window.addEventListener("load", () => {
  if (exportMode) document.body.classList.add("export-mode");
  slides.forEach((slide) => setSlideStep(slide, exportMode ? Number(slide.dataset.maxStep) : Number(slide.dataset.step), { instant: true }));
  document.body.classList.add("deck-ready");
  const initial = slides.findIndex((slide) => "#" + slide.id === location.hash);
  setCurrent(initial >= 0 ? initial : 0, initial >= 0);
});
window.deckState = { advance, reverse, resetSlide, setCurrent, setSlideStep };
updateChrome();
`;

const sceneJs = String.raw`
const sceneCanvases = [...document.querySelectorAll(".scene-canvas")];
const sceneState = new Map();
const SC = {
  bg: "#020202", ink: "#f0ede4", dim: "rgba(240,237,228,.42)",
  line: "rgba(240,237,228,.16)", purple: "#34206f", hot: "#7657d6",
  lime: "#f27863", coral: "#e0503f", cream: "#f0ede4",
  signal: "#f27863", field: "#766f62", blood: "#9b0012",
  ufoBeam: "#39ff14", ufoViolet: "#7657d6", ufoOrange: "#39ff14"
};

function hexAlpha(hex, alpha) {
  const value = Number.parseInt(hex.slice(1), 16);
  return "rgba(" + (value >> 16) + "," + ((value >> 8) & 255) + "," + (value & 255) + "," + alpha + ")";
}

function seeded(index) {
  const x = Math.sin(index * 9283.17 + 17.31) * 43758.5453;
  return x - Math.floor(x);
}

function startMotion(state,key,target,instant=false){
  const now=performance.now();
  const current=Number.isFinite(state[key])?state[key]:target;
  state[key+"From"]=instant?target:current;
  state[key+"To"]=target;
  state[key+"Started"]=now;
  state[key]=instant?target:current;
  state.motionUntil=instant?0:now+520;
}

function motionValue(state,key,time){
  const from=state[key+"From"],to=state[key+"To"],started=state[key+"Started"];
  if(!Number.isFinite(from)||!Number.isFinite(to)||!Number.isFinite(started))return state[key]||0;
  const linear=Math.max(0,Math.min(1,(time-started)/360));
  const eased=1-Math.pow(1-linear,3);
  state[key]=from+(to-from)*eased;
  return state[key];
}

function initialSceneState(canvas) {
  const kind = canvas.dataset.scene;
  const slideNumber = Number(canvas.closest(".slide")?.id.replace("slide-", "")) || 1;
  const state = { kind, pointer: { x: .5, y: .5 }, action: "ready", phase: 0, target: 0, progress: 0, strangeness: (slideNumber - 1) / Math.max(1, slides.length - 1) };
  if (kind === "graph") {
    state.heat = .2;
    state.frozen = false;
    state.nodes = Array.from({ length: 22 }, (_, index) => {
      const angle = index * 2.399;
      const ring = index === 0 ? 0 : .16 + (index % 5) * .07;
      return {
        x: .67 + Math.cos(angle) * ring,
        y: .43 + Math.sin(angle) * ring * .8,
        tx: .67 + Math.cos(angle) * ring,
        ty: .43 + Math.sin(angle) * ring * .8,
        type: index === 0 ? "hub" : (index % 6 === 0 ? "contested" : index % 3 === 0 ? "derived" : "primary"),
        label: ["SOURCE OF TRUTH","RFC 8446","ASVS 5.0","BCP 240","MAINTAINER NOTE","DRAFT -11","ISSUE 418","CVE RECORD","DEPLOYED CODE","ERRATA","WSTG","CHANGELOG"][index % 12]
      };
    });
  }
  if (kind === "model") {
    state.model = 0;
    state.target = 0;
    state.particles = Array.from({ length: 900 }, (_, index) => ({
      rx: seeded(index * 4) - .5,
      ry: seeded(index * 4 + 1) - .5,
      spin: seeded(index * 4 + 2) * Math.PI * 8,
      lag: seeded(index * 4 + 3) * .42
    }));
  }
  if (kind === "whois") {
    state.signal = 0; state.masked = false;
    state.orbs = Array.from({ length: 12 }, (_, i) => ({
      x: .15 + seeded(i * 7) * .7,
      y: .35 + seeded(i * 7 + 1) * .5,
      homeX: .15 + seeded(i * 7) * .7,
      homeY: .35 + seeded(i * 7 + 1) * .5,
      r: 3 + seeded(i * 7 + 2) * 5,
      angle: seeded(i * 7 + 3) * Math.PI * 2,
      speed: .3 + seeded(i * 7 + 4) * .7,
      absorbed: 0
    }));
  }
  if (kind === "sky") { state.scan = 0; state.grounded = false; }
  if (kind === "stack") state.level = 0;
  if (kind === "cropmap") state.ranked = false;
  if (kind === "protocol") state.open = 0;
  if (kind === "machine") { state.detail = 1; state.target = 1; }
  if (kind === "jwt") { state.injected = false; state.isolated = false; }
  if (kind === "default") state.chosen = false;
  if (kind === "oauth") state.trace = 0;
  if (kind === "hash") state.cost = 1;
  if (kind === "territory") {
    state.bend = 0; state.territory = false;
    // Matrix rain columns
    state.rainCols = Array.from({ length: 32 }, (_, i) => ({
      x: i / 32,
      y: seeded(i * 19) * -1,
      speed: .015 + seeded(i * 19 + 1) * .025,
      chars: Array.from({ length: 18 }, (_, j) => String.fromCharCode(
        seeded(i * 19 + j + 2) > .5
          ? 0x30A0 + Math.floor(seeded(i * 19 + j + 3) * 96)  // Katakana
          : 48 + Math.floor(seeded(i * 19 + j + 4) * 10)       // Digits
      )),
      bright: seeded(i * 19 + 5)
    }));
  }
  if (kind === "cors") { state.open = false; state.restricted = false; }
  if (kind === "consensus") { state.gain = 1; state.broken = false; }
  if (kind === "ai") state.stage = 0;
  if (kind === "humans") { state.trace = 0; state.issue = false; }
  if (kind === "checklist") state.run = 0;
  if (kind === "portal") state.depth = 0;
  return state;
}

for (const canvas of sceneCanvases) sceneState.set(canvas, initialSceneState(canvas));
window.__sceneState = sceneState;

const sceneSizeCache = new WeakMap();
let sceneSizeVersion = 0;
window.addEventListener("resize", () => { sceneSizeVersion += 1; });

function resizeScene(canvas, ctx) {
  let cached = sceneSizeCache.get(canvas);
  if (!cached || cached.version !== sceneSizeVersion) {
    const rect = canvas.getBoundingClientRect();
    cached = {
      version: sceneSizeVersion,
      width: Math.max(1, Math.round(rect.width)),
      height: Math.max(1, Math.round(rect.height)),
    };
    sceneSizeCache.set(canvas, cached);
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const { width, height } = cached;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function clearScene(ctx, width, height, state) {
  ctx.clearRect(0, 0, width, height);
  if(state.kind === "protocol") return;
  const starCount = Math.floor(4 + state.strangeness * 18);
  for (let i = 0; i < starCount; i++) {
    const x = seeded(i * 11 + 3) * width;
    const y = seeded(i * 17 + 9) * height * .78;
    const radius = i % 11 === 0 ? 1.8 : .7;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,234,216," + (.10 + state.strangeness * .22) + ")";
    ctx.fill();
  }
  if (state.strangeness > .38) {
    const signalY = height * (.13 + state.strangeness * .08);
    ctx.beginPath();
    let firstSignalPoint = true;
    for (let x = width * .48; x < width * .96; x += 9) {
      const y = signalY + Math.sin(x * .035) * (3 + state.strangeness * 5) + Math.sin(x * .011) * 4;
      firstSignalPoint ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      firstSignalPoint = false;
    }
    ctx.strokeStyle = "rgba(242,234,216,.14)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function thread(ctx, x1, y1, x2, y2, bend) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x1 + (x2-x1)*.33, y1+bend, x1+(x2-x1)*.66, y2-bend, x2, y2);
  ctx.strokeStyle = SC.lime;
  ctx.globalAlpha = .78;
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function signalCable(ctx, x1, y1, x2, y2, color=SC.lime, alpha=.72) {
  const midX = x1 + (x2 - x1) * .45;
  const midY = y1 + (y2 - y1) * .18;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 1.8;
  ctx.setLineDash([18, 8, 4, 8]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(midX, y1);
  ctx.lineTo(midX, midY);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  [ [x1,y1], [midX,y1], [midX,midY], [x2,y2] ].forEach(([x,y])=>{
    ctx.beginPath();ctx.rect(x-3,y-3,6,6);ctx.fillStyle=color;ctx.fill();
  });
  ctx.restore();
}

function stageFont(ctx, weight, px, family="monospace") {
  const size = Math.max(12, px);
  const numericWeight = Number.parseInt(weight, 10);
  const heavyWeight = Number.isFinite(numericWeight) ? Math.max(600, numericWeight) : weight;
  const resolvedFamily = family === "mono"
    ? '"SFMono-Regular", "Cascadia Mono", Consolas, monospace'
    : family === "sans"
      ? '"Avenir Next", "Helvetica Neue", Arial, sans-serif'
      : family;
  ctx.font = heavyWeight + " " + size + "px " + resolvedFamily;
  return size;
}

function spark(ctx, x, y, color, size) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath(); ctx.moveTo(-size, 0); ctx.lineTo(size, 0); ctx.stroke();
  }
  ctx.restore();
}

function flameTongue(ctx, x, y, height, width, phase, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 + Math.sin(phase * 2.1) * .08, 1 + Math.cos(phase * 1.7) * .06);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-width * 1.02, -height * .20, -width * .70, -height * .62, Math.sin(phase) * width * .20, -height * 1.08);
  ctx.bezierCurveTo(width * .78, -height * .64, width * 1.02, -height * .18, 0, 0);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, -height);
  grad.addColorStop(0, hexAlpha(SC.bg, .42 * alpha));
  grad.addColorStop(.22, hexAlpha(SC.blood, .72 * alpha));
  grad.addColorStop(.54, hexAlpha(SC.coral, .96 * alpha));
  grad.addColorStop(.82, hexAlpha(SC.coral, .82 * alpha));
  grad.addColorStop(1, hexAlpha(SC.cream, .22 * alpha));
  ctx.fillStyle = grad;
  ctx.shadowColor = hexAlpha(SC.coral, .92 * alpha);
  ctx.shadowBlur = 30 * alpha;
  ctx.fill();
  ctx.strokeStyle = hexAlpha(SC.bg, .40 * alpha);
  ctx.lineWidth = Math.max(1, width * .06);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -height * .08);
  ctx.bezierCurveTo(-width * .38, -height * .28, -width * .20, -height * .62, Math.sin(phase * 1.4) * width * .12, -height * .84);
  ctx.bezierCurveTo(width * .34, -height * .52, width * .30, -height * .20, 0, -height * .08);
  ctx.closePath();
  ctx.fillStyle = hexAlpha(SC.cream, .58 * alpha);
  ctx.fill();

  ctx.fillStyle = hexAlpha(SC.signal, .54 * alpha);
  for(let i=0;i<7;i++){
    const px=(seeded(i*13+phase)-.5)*width*1.35;
    const py=-height*(.18+seeded(i*17+phase)*.62);
    const s=2+seeded(i*19+phase)*5;
    ctx.fillRect(px,py,s,s);
  }
  ctx.restore();
}

function rabbit(ctx, x, y, scale, alpha) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.globalAlpha = alpha;
  ctx.fillStyle = SC.ink;
  ctx.beginPath(); ctx.ellipse(0, 8, 23, 20, -.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-11, -22, 8, 29, -.36, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = SC.hot;
  ctx.beginPath(); ctx.ellipse(7, -23, 7, 27, .28, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = SC.coral; ctx.beginPath(); ctx.arc(10, 4, 3.4, 0, Math.PI*2); ctx.fill();
  ctx.restore(); ctx.globalAlpha = 1;
}

function drawPortal(ctx, width, height, state, time) {
  const close = document.querySelector("#slide-20")?.classList.contains("is-current");
  const cx = width * (close ? .34 : .7) + (state.pointer.x-.5)*18;
  const cy = height * .47 + (state.pointer.y-.5)*12;
  const depth = motionValue(state,"depth",time);
  const diveClock = state.depthTo > 0 ? Math.max(0, Math.min(1, (time - (state.depthStarted || time)) / 2200)) : depth;
  const portalPhase = Math.max(depth, diveClock);

  // Phase breakdown: 0-0.3 = ambient, 0.3-0.7 = pull, 0.7-1.0 = breach
  const pull = Math.max(0, Math.min(1, (portalPhase-.1)/.5));
  const breach = Math.max(0, Math.min(1, (portalPhase-.58)/.42));

  // Screen shake during breach
  if (breach > .5) {
    const shakeDecay = Math.max(0, 1 - (breach - .5) * 3);
    const shakeX = Math.sin(time * .07) * 4 * shakeDecay * breach;
    const shakeY = Math.cos(time * .09) * 3 * shakeDecay * breach;
    ctx.save();
    ctx.translate(shakeX, shakeY);
  }

  // Nebula patches — soft depth before anything activates
  for (let i = 0; i < 4; i++) {
    const nx = cx + (seeded(i * 37 + 3) - .5) * 400;
    const ny = cy + (seeded(i * 37 + 7) - .5) * 280;
    const nr = 60 + seeded(i * 37 + 11) * 80;
    const nebGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
    const nebAlpha = .03 + Math.sin(time * .0008 + i * 2.1) * .015;
    nebGrad.addColorStop(0, "rgba(106,53,232," + (nebAlpha + .02) + ")");
    nebGrad.addColorStop(.5, "rgba(106,53,232," + nebAlpha + ")");
    nebGrad.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(nx, ny, nr, 0, Math.PI * 2);
    ctx.fillStyle = nebGrad; ctx.fill();
  }

  // Starfield — 60 stars, 8 bright pulsers
  for (let i = 0; i < 60; i++) {
    const angle = seeded(i*11) * Math.PI * 2;
    const baseDist = 140 + seeded(i*11+1) * 360;
    const dist = baseDist * (1 - pull * .7);
    const twinkle = Math.sin(time * .003 + i * 1.7) * .5 + .5;
    const bright = i < 8;
    const brightPulse = bright ? Math.sin(time * .004 + i * 1.1) * .5 + .5 : 0;
    const sx = cx + Math.cos(angle) * dist;
    const sy = cy + Math.sin(angle) * dist * .7;
    if (pull > .1) {
      const ex = cx + Math.cos(angle) * dist * .85;
      const ey = cy + Math.sin(angle) * dist * .7 * .85;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey);
      ctx.strokeStyle = "rgba(242,234,216," + (pull * .15 + twinkle * .08) + ")";
      ctx.lineWidth = .8 + pull;
      ctx.stroke();
    }
    const starR = bright ? 1.2 + brightPulse * 1.8 : .6 + twinkle * .8;
    const starAlpha = bright ? .15 + brightPulse * .35 : .06 + twinkle * .12 + pull * .15;
    ctx.beginPath(); ctx.arc(sx, sy, starR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,234,216," + starAlpha + ")";
    ctx.fill();
    if (bright && brightPulse > .3) {
      ctx.globalAlpha = brightPulse * .25;
      ctx.beginPath(); ctx.moveTo(sx - starR * 3, sy); ctx.lineTo(sx + starR * 3, sy);
      ctx.strokeStyle = "rgba(242,234,216,.4)"; ctx.lineWidth = .5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx, sy - starR * 3); ctx.lineTo(sx, sy + starR * 3);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Accretion disk — slowly rotating ellipse ring, visible even at ambient
  const diskAngle = time * .0003;
  const diskAlpha = .06 + pull * .18;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(diskAngle);
  for (let ring = 0; ring < 3; ring++) {
    const rr = 90 + ring * 28 - pull * ring * 12;
    ctx.beginPath();
    ctx.ellipse(0, 0, rr * 1.4, rr * .35, 0, 0, Math.PI * 2);
    ctx.strokeStyle = ring % 2 === 0
      ? "rgba(159,183,154," + (diskAlpha * .7) + ")"
      : "rgba(106,53,232," + (diskAlpha * .9) + ")";
    ctx.lineWidth = 1 + pull * .8;
    ctx.stroke();
  }
  ctx.restore();

  // Outer gravitational distortion rings
  for (let i = 8; i >= 0; i--) {
    const ringPull = pull * (1 - i / 12);
    const pulse = Math.sin(time * .0014 + i * .7) * (4 + pull * 12);
    const radius = Math.max(8, 50 + i * 34 + pulse - pull * i * 22);
    const squeeze = 1.3 + pull * .3 - breach * .2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(pull * i * .04 + time * .0001 * (i % 2 ? 1 : -1));

    ctx.beginPath();
    ctx.ellipse(0, pull * i * 2.5, radius * squeeze, radius, 0, 0, Math.PI * 2);

    if (i % 3 === 0) {
      ctx.strokeStyle = "rgba(159,183,154," + (.35 + pull * .45) + ")";
      ctx.lineWidth = 1.8 + pull * 2.2;
      if (breach > .2) {
        ctx.shadowColor = "rgba(159,183,154," + (breach * .5) + ")";
        ctx.shadowBlur = 12 + breach * 20;
      }
    } else {
      ctx.strokeStyle = "rgba(106,53,232," + (.22 + pull * .35) + ")";
      ctx.lineWidth = 1 + pull * .8;
      if (breach > .3) {
        ctx.shadowColor = "rgba(106,53,232," + (breach * .35) + ")";
        ctx.shadowBlur = 8 + breach * 14;
      }
    }
    ctx.stroke();
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Game-dev vortex field: angular momentum made visible.
  if (!close || pull > .1) {
    for (let arm = 0; arm < 5; arm++) {
      ctx.beginPath();
      for (let j = 0; j < 88; j++) {
        const t = j / 87;
        const a = time * .0012 + arm * Math.PI * 2 / 5 + t * Math.PI * (4.5 + pull * 3.5);
        const r = (260 - t * 228) * (1 - breach * .20);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * .62;
        j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = arm % 2
        ? "rgba(106,53,232," + (.08 + pull * .18) + ")"
        : "rgba(159,183,154," + (.06 + pull * .20) + ")";
      ctx.lineWidth = 1.2 + pull * 2.2;
      ctx.stroke();
    }
    const reagents = ["SALT", "SULFUR", "MERCURY", "SOURCE"];
    reagents.forEach((label,i)=>{
      const a = time * .001 + i * Math.PI * .5;
      const r = 210 - pull * 120 + Math.sin(time*.002+i)*14;
      ctx.fillStyle = "rgba(242,234,216," + (.10 + pull * .24) + ")";
      ctx.font = "900 8px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, cx + Math.cos(a)*r, cy + Math.sin(a)*r*.58);
    });
  }

  // Central void — black hole that opens on breach
  if (breach > 0) {
    const voidR = 18 + breach * 48;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, voidR);
    grad.addColorStop(0, "rgba(0,0,0," + (.6 + breach * .4) + ")");
    grad.addColorStop(.5, "rgba(5,5,7," + (.4 + breach * .3) + ")");
    grad.addColorStop(.8, "rgba(106,53,232," + (breach * .18) + ")");
    grad.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(cx, cy, voidR, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Event horizon ring
    ctx.beginPath(); ctx.arc(cx, cy, voidR * .8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(159,183,154," + (breach * .6) + ")";
    ctx.lineWidth = 1.5 + breach * 1.5;
    ctx.shadowColor = "rgba(159,183,154," + (breach * .7) + ")";
    ctx.shadowBlur = 20 + breach * 30;
    ctx.stroke();
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  }

  // Shockwave ring — expanding circle on high breach
  if (breach > .8) {
    const waveProgress = (breach - .8) / .2;
    const waveR = 30 + waveProgress * 280;
    const waveAlpha = Math.max(0, .6 - waveProgress * .7);
    ctx.beginPath(); ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(159,183,154," + waveAlpha + ")";
    ctx.lineWidth = 3 - waveProgress * 2;
    ctx.shadowColor = "rgba(159,183,154," + (waveAlpha * .6) + ")";
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  }

  // Flash frame — brief white overlay at breach peak
  if (breach > .9) {
    const flashAlpha = Math.max(0, (breach - .9) / .1 * .35);
    ctx.fillStyle = "rgba(255,255,255," + flashAlpha + ")";
    ctx.fillRect(0, 0, width, height);
  }

  // Energy filaments being sucked inward
  if (pull > .15) {
    for (let i = 0; i < 8; i++) {
      const angle = time * .0006 + i * Math.PI / 4;
      const outerR = 220 - pull * 80;
      const innerR = 20 + breach * 30;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR * .65);
      const cp1x = cx + Math.cos(angle + .3) * outerR * .5;
      const cp1y = cy + Math.sin(angle + .3) * outerR * .35;
      ctx.quadraticCurveTo(cp1x, cp1y, cx + Math.cos(angle + .1) * innerR, cy + Math.sin(angle + .1) * innerR * .6);
      ctx.strokeStyle = i % 2 === 0
        ? "rgba(159,183,154," + (pull * .25) + ")"
        : "rgba(106,53,232," + (pull * .35) + ")";
      ctx.lineWidth = .8 + pull * 1.2;
      ctx.stroke();
    }
  }

  // Lime threads — connections to off-screen
  const threadAlpha = 1 - breach * .6;
  if (threadAlpha > .1) {
    ctx.globalAlpha = threadAlpha;
    signalCable(ctx, -20, height * .54, cx - 52, cy + 12, SC.lime, .55);
    signalCable(ctx, cx + 54, cy + 10, width + 20, height * .48, SC.ink, .44);
    ctx.globalAlpha = 1;
  }

  // Rabbit hook: gentle float at ambient, huge spiral on dive, then vanish.
  const spinPhase = Math.min(1, portalPhase * 1.8);
  const vanish = Math.max(0, Math.min(1, (diveClock - .66) / .30));
  const spinRadius = (close ? 86 : 155) * (1 - vanish * .92);
  const ambientBob = portalPhase < .05 ? Math.sin(time * .002) * 8 : 0;
  const ambientSway = portalPhase < .05 ? Math.sin(time * .0015) * 6 : 0;
  const spinAngle = -Math.PI / 2 + diveClock * Math.PI * 6.2 + time * .0012;
  const rabbitX = cx + Math.cos(spinAngle) * spinRadius * spinPhase + ambientSway;
  const rabbitY = cy + Math.sin(spinAngle) * spinRadius * .58 * spinPhase + vanish * 42 + ambientBob;
  const rabbitScale = (close ? .72 : 1.18) * (1 - vanish * .74);
  const rabbitAlpha = Math.max(0, .98 - vanish * 1.18);
  const rabbitRot = portalPhase < .05
    ? Math.sin(time * .001) * .12
    : spinAngle + Math.PI / 2 + diveClock * Math.PI * 3;
  if (rabbitAlpha > .03) {
    for(let ghost=4;ghost>0;ghost--){
      const lag=ghost*.085;
      const ga=spinAngle-lag*Math.PI*5;
      const gr=spinRadius*(1+ghost*.08)*spinPhase;
      const gx=cx+Math.cos(ga)*gr+ambientSway;
      const gy=cy+Math.sin(ga)*gr*.58+vanish*42+ambientBob;
      ctx.save();
      ctx.translate(gx,gy);
      ctx.rotate(portalPhase < .05 ? rabbitRot : ga+Math.PI/2);
      rabbit(ctx,0,0,Math.max(.12,rabbitScale*(1-ghost*.10)),rabbitAlpha*(.09+ghost*.045));
      ctx.restore();
    }
    ctx.save();
    ctx.translate(rabbitX, rabbitY);
    ctx.rotate(rabbitRot);
    rabbit(ctx, 0, 0, Math.max(.15, rabbitScale), Math.max(.03, rabbitAlpha));
    ctx.restore();
    if (portalPhase > .08) signalCable(ctx, rabbitX - 18, rabbitY + 16, cx, cy, SC.lime, .62);
  }
  if (diveClock > .84) spark(ctx, cx, cy, SC.lime, 12 + breach * 16);

  // Sparks at the end
  if (breach < .5) spark(ctx, width * .94, height * .48, SC.ink, 15 - breach * 20);

  // Particles ejected from portal on full breach — 24 with spiral trails
  if (breach > .6) {
    for (let i = 0; i < 24; i++) {
      const baseAngle = seeded(i * 17 + 5) * Math.PI * 2;
      const spiralOffset = time * .002 * (i % 2 ? 1 : -1);
      const angle = baseAngle + spiralOffset;
      const dist = 30 + ((time * .06 + seeded(i * 17) * 400) % 300) * breach;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist * .6;
      const trailAngle = angle - spiralOffset * .5;
      const trailDist = dist * .7;
      const tx = cx + Math.cos(trailAngle) * trailDist;
      const ty = cy + Math.sin(trailAngle) * trailDist * .6;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py);
      ctx.strokeStyle = i % 3 === 0 ? "rgba(159,183,154," + (breach * .25) + ")"
        : "rgba(242,234,216," + (breach * .15) + ")";
      ctx.lineWidth = .8; ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, 1.5 + seeded(i * 17 + 2) * 2, 0, Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? "rgba(159,183,154," + (breach * .5) + ")"
        : "rgba(242,234,216," + (breach * .3) + ")";
      ctx.fill();
    }
  }

  // Close screen shake save
  if (breach > .5) ctx.restore();
}

function drawWhois(ctx, width, height, state, time) {
  const signal = motionValue(state, "signal", time);
  const tableauPalette = {
    structure: SC.ufoViolet,
    beam: SC.ufoBeam,
    information: SC.cream,
    accent: SC.ufoOrange,
    alert: SC.blood,
  };
  const zoneRight = width * .58;
  const cx = zoneRight * .27;
  const cy = height * .19;
  const quiet = state.masked ? .30 : 1;
  const motion = state.masked ? .16 : .48 + signal * 1.35;
  const liftStrength = state.masked ? .04 : .16 + signal * .70;
  const bob = Math.sin(time * .0022 * motion) * (2 + signal * 6);
  const violet = tableauPalette.structure;
  const cyan = tableauPalette.beam;
  const cream = tableauPalette.information;
  const magenta = tableauPalette.accent;
  const hotRed = tableauPalette.alert;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, zoneRight, height);
  ctx.clip();
  ctx.globalAlpha = quiet;

  for (let i = 0; i < 26; i++) {
    const x = seeded(i * 17) * zoneRight;
    const y = seeded(i * 31) * height * .86;
    const twinkle = Math.sin(time * .0015 * motion + i) * .5 + .5;
    ctx.fillStyle = i % 8 === 0
      ? hexAlpha(magenta, .22 + twinkle * .18)
      : hexAlpha(cream, .12 + twinkle * .20);
    ctx.beginPath();
    ctx.arc(x, y, i % 5 === 0 ? 2 : 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const beamTop = cy + height * .055;
  const beamFloor = height * .96;
  const beamPulse = .12 + signal * .20;
  ctx.fillStyle = hexAlpha(cyan, beamPulse);
  ctx.beginPath();
  ctx.moveTo(cx - zoneRight * .07, beamTop);
  ctx.lineTo(cx - zoneRight * .18, beamFloor);
  ctx.lineTo(cx + zoneRight * .17, beamFloor);
  ctx.lineTo(cx + zoneRight * .07, beamTop);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = hexAlpha(cyan, .46 + signal * .34);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - zoneRight * .07, beamTop);
  ctx.lineTo(cx - zoneRight * .18, beamFloor);
  ctx.moveTo(cx + zoneRight * .07, beamTop);
  ctx.lineTo(cx + zoneRight * .17, beamFloor);
  ctx.stroke();

  for (let ray = -2; ray <= 2; ray++) {
    const rayX = cx + ray * zoneRight * .043 + Math.sin(time * .002 * motion + ray) * (1 + signal * 3);
    ctx.fillStyle = ray % 2
      ? hexAlpha(cream, .10 + signal * .11)
      : hexAlpha(cyan, .14 + signal * .18);
    ctx.fillRect(rayX - 1.5, beamTop + height * .02, 3, height * .66);
  }

  ctx.save();
  ctx.translate(0, bob);
  ctx.fillStyle = hexAlpha(violet, .96);
  ctx.beginPath();
  ctx.moveTo(cx - zoneRight * .16, cy);
  ctx.quadraticCurveTo(cx, cy - height * .055, cx + zoneRight * .16, cy);
  ctx.quadraticCurveTo(cx + zoneRight * .10, cy + height * .065, cx, cy + height * .070);
  ctx.quadraticCurveTo(cx - zoneRight * .10, cy + height * .065, cx - zoneRight * .16, cy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = hexAlpha(cream, .82);
  ctx.lineWidth = 2.4;
  ctx.stroke();

  ctx.fillStyle = "rgba(5,5,10,.94)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + height * .036, zoneRight * .105, height * .027, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy - height * .018, zoneRight * .079, height * .063, 0, Math.PI, 0);
  ctx.fillStyle = hexAlpha(cyan, .24);
  ctx.fill();
  ctx.strokeStyle = hexAlpha(cyan, .82);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const crew = [
    { x: cx - zoneRight * .026, y: cy - height * .022, wave: -1 },
    { x: cx + zoneRight * .030, y: cy - height * .018, wave: 1 },
  ];
  crew.forEach((alien, index) => {
    const crewBob = Math.sin(time * .003 * motion + index * 1.7) * (1 + signal * 2);
    ctx.save();
    ctx.translate(alien.x, alien.y + crewBob);
    ctx.fillStyle = index ? hexAlpha(cream, .96) : hexAlpha(cyan, .88);
    ctx.beginPath();
    ctx.ellipse(0, -9, 12, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#08070d";
    ctx.beginPath(); ctx.ellipse(-4, -11, 3.1, 5.2, -.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, -11, 3.1, 5.2, .3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = hexAlpha(magenta, .88);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-6, 7); ctx.lineTo(-9, 21);
    ctx.moveTo(6, 7); ctx.lineTo(9, 21);
    const wave = Math.sin(time * .006 * motion + index) * (.18 + signal * .38);
    ctx.moveTo(alien.wave * 7, 8);
    ctx.lineTo(alien.wave * (17 + signal * 4), -1 + wave * 14);
    ctx.stroke();
    ctx.restore();
  });

  for (let lamp = -3; lamp <= 3; lamp++) {
    const blink = Math.sin(time * .004 * motion + lamp * 1.4) * .5 + .5;
    ctx.fillStyle = lamp % 3 === 0
      ? hexAlpha(hotRed, .58 + blink * .28)
      : lamp % 2
      ? hexAlpha(magenta, .68 + blink * .22)
      : hexAlpha(cyan, .62 + blink * .24);
    ctx.beginPath();
    ctx.arc(cx + lamp * zoneRight * .035, cy + height * .034, 4.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const fragments = [
    { kind: "laptop", x: .17, y: .82, size: 1.02, phase: .2 },
    { kind: "keyboard", x: .29, y: .91, size: .90, phase: 1.1 },
    { kind: "mouse", x: .09, y: .68, size: .86, phase: 2.0 },
    { kind: "mug", x: .31, y: .70, size: .82, phase: 2.8 },
    { kind: "sticky-note", x: .12, y: .91, size: .74, phase: 3.5 },
    { kind: "monitor-piece", x: .25, y: .58, size: .82, phase: 4.3 },
  ];
  fragments.forEach((item, index) => {
    const baseX = zoneRight * item.x;
    const baseY = height * item.y;
    const lift = liftStrength * (1 - index * .055);
    const targetY = cy + height * (.12 + index * .025);
    const swirl = Math.sin(time * .0035 * motion + item.phase) * zoneRight * (.006 + signal * .018);
    const x = baseX + (cx - baseX) * lift * .46 + swirl;
    const y = baseY + (targetY - baseY) * lift + Math.cos(time * .003 * motion + item.phase) * (2 + signal * 8);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * .0028 * motion + item.phase) * (.05 + signal * .20));
    ctx.scale(item.size, item.size);
    ctx.strokeStyle = hexAlpha(cream, .92);
    ctx.fillStyle = "rgba(5,5,10,.88)";
    ctx.lineWidth = 2;
    if (item.kind === "laptop") {
      ctx.beginPath();
      ctx.moveTo(-34, -8); ctx.lineTo(28, -20); ctx.lineTo(34, 18); ctx.lineTo(-26, 23); ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexAlpha(cyan, .30);
      ctx.fillRect(-25, -3, 47, 17);
      ctx.strokeStyle = hexAlpha(magenta, .82);
      ctx.beginPath(); ctx.moveTo(-27, 23); ctx.lineTo(-41, 31); ctx.lineTo(29, 27); ctx.lineTo(34, 18); ctx.stroke();
    } else if (item.kind === "keyboard") {
      ctx.fillStyle = hexAlpha(cream, .86);
      for (let row = 0; row < 3; row++) {
        for (let key = 0; key < 7; key++) {
          const scatter = signal * ((key + row) % 4) * 1.8;
          ctx.fillRect(-27 + key * 9 + scatter, -10 + row * 9 - scatter, 6, 5);
        }
      }
    } else if (item.kind === "mouse") {
      ctx.beginPath();
      ctx.ellipse(0, 0, 15, 21, -.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = hexAlpha(cyan, .84);
      ctx.beginPath();
      ctx.moveTo(5, -18);
      ctx.bezierCurveTo(22, -36 - signal * 8, 35, -16, 46, -30 - signal * 10);
      ctx.stroke();
    } else if (item.kind === "mug") {
      ctx.fillStyle = hexAlpha(hotRed, .78);
      ctx.fillRect(-14, -16, 28, 31);
      ctx.strokeStyle = hexAlpha(cream, .88);
      ctx.strokeRect(-14, -16, 28, 31);
      ctx.beginPath();
      ctx.arc(17, -1, 10, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.strokeStyle = hexAlpha(cyan, .52);
      for (let steam = -1; steam <= 1; steam += 2) {
        ctx.beginPath();
        ctx.moveTo(steam * 5, -20);
        ctx.quadraticCurveTo(steam * 10, -29 - signal * 6, steam * 3, -36 - signal * 8);
        ctx.stroke();
      }
    } else if (item.kind === "sticky-note") {
      ctx.fillStyle = hexAlpha(cream, .94);
      ctx.fillRect(-16, -16, 32, 32);
      ctx.fillStyle = hexAlpha(magenta, .72);
      ctx.fillRect(7, 7, 9, 9);
    } else if (item.kind === "monitor-piece") {
      ctx.beginPath();
      ctx.moveTo(-28, -18); ctx.lineTo(27, -11); ctx.lineTo(20, 20); ctx.lineTo(-23, 13); ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexAlpha(cyan, .34);
      ctx.fillRect(-19, -9, 34, 15);
      ctx.strokeStyle = hexAlpha(magenta, .82);
      ctx.beginPath(); ctx.moveTo(-2, 15); ctx.lineTo(-6, 28); ctx.lineTo(12, 31); ctx.stroke();
    }
    ctx.restore();

    const trail = 14 + signal * 38;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + trail);
    ctx.quadraticCurveTo(x + Math.sin(item.phase) * 18, y + trail * .45, x, y + 18);
    ctx.strokeStyle = hexAlpha(index % 2 ? magenta : cyan, .24 + signal * .34);
    ctx.lineWidth = 1.5 + signal;
    ctx.stroke();
  });

  for (let pixel = 0; pixel < 18; pixel++) {
    const px = cx + (seeded(pixel * 9) - .5) * zoneRight * .22;
    const cycle = (time * .018 * motion + pixel * 37) % (height * .58);
    const py = beamFloor - cycle;
    if (py < beamTop) continue;
    ctx.fillStyle = pixel % 5 === 0
      ? hexAlpha(magenta, .48 + signal * .28)
      : hexAlpha(cream, .34 + signal * .30);
    const size = 2 + (pixel % 3);
    ctx.fillRect(px, py, size, size);
  }

  ctx.restore();
}

function drawSky(ctx, width, height, state, time) {
  const scan = motionValue(state, "scan", time);
  const left = width * .59;
  const right = width * .965;
  const top = height * .17;
  const bottom = height * .82;
  const regionW = right - left;
  const pad = Math.max(16, width * .01);
  const checks = [
    ["SOURCE", "ORIGIN KNOWN"],
    ["DATE", "SNAPSHOT FIXED"],
    ["CONTEXT", "SCOPE RESTORED"],
    ["DECISION", "TRADEOFF RECORDED"]
  ];

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, regionW, bottom - top);
  ctx.clip();

  ctx.fillStyle = SC.ink;
  stageFont(ctx, "900", 13, "mono");
  ctx.textAlign = "left";
  ctx.fillText("RAW FEED", left + pad, top + 17);
  ctx.textAlign = "right";
  ctx.fillStyle = state.grounded ? SC.lime : "rgba(229,226,216,.42)";
  ctx.fillText("DEFENSIBLE EVIDENCE", right - pad, top + 17);

  const rawX = left + pad;
  const rawY = top + 34;
  const rawW = regionW - pad * 2;
  const rawH = Math.min(height * .105, 112);
  ctx.fillStyle = "rgba(12,11,10,.96)";
  ctx.fillRect(rawX, rawY, rawW, rawH);
  ctx.strokeStyle = "rgba(229,226,216,.24)";
  ctx.strokeRect(rawX + .5, rawY + .5, rawW - 1, rawH - 1);

  const fragments = ["UNSOURCED", "REPOST", "DATE?", "CLIPPED", "THREAD / 48", "V3?"];
  ctx.save();
  ctx.beginPath();
  ctx.rect(rawX + 1, rawY + 1, rawW - 2, rawH - 2);
  ctx.clip();
  fragments.forEach((fragment, index) => {
    const laneY = rawY + 18 + (index % 3) * (rawH - 28) / 2;
    const phase = (seeded(index * 17) + time * (.000018 + index * .000002)) % 1;
    const x = rawX - 72 + phase * (rawW + 144);
    const fragmentW = 38 + seeded(index * 29) * 62;
    ctx.fillStyle = index % 3 === 0 ? hexAlpha(SC.blood, .62) : "rgba(229,226,216,.32)";
    ctx.fillRect(x, laneY - 7, fragmentW, 14);
    ctx.fillStyle = "rgba(229,226,216,.70)";
    stageFont(ctx, "850", 10, "mono");
    ctx.textAlign = "left";
    ctx.fillText(fragment, x + 5, laneY + 4);
  });
  ctx.restore();

  const receiptH = Math.min(height * .12, 126);
  const receiptY = bottom - receiptH;
  const checkStart = rawY + rawH + Math.max(42, height * .035);
  const checkEnd = receiptY - Math.max(38, height * .03);
  const checkGap = Math.max(9, height * .009);
  const checkH = (checkEnd - checkStart - checkGap * 3) / 4;
  const checkX = left + pad * 1.5;
  const checkW = regionW - pad * 3;
  const flowX = left + regionW / 2;

  function downArrow(y1, y2, alpha) {
    if (y2 <= y1) return;
    ctx.strokeStyle = hexAlpha(state.grounded ? SC.lime : SC.field, alpha);
    ctx.fillStyle = hexAlpha(state.grounded ? SC.lime : SC.field, alpha);
    ctx.lineWidth = state.grounded ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(flowX, y1);
    ctx.lineTo(flowX, y2 - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(flowX - 4, y2 - 9);
    ctx.lineTo(flowX + 4, y2 - 9);
    ctx.lineTo(flowX, y2 - 3);
    ctx.closePath();
    ctx.fill();
  }

  downArrow(rawY + rawH, checkStart, .28 + scan * .42);

  checks.forEach((check, index) => {
    const reveal = Math.max(0, Math.min(1, scan * 1.5 - index * .12));
    const y = checkStart + index * (checkH + checkGap);
    ctx.fillStyle = state.grounded
      ? hexAlpha(SC.lime, .13)
      : "rgba(12,11,10," + (.72 + reveal * .24) + ")";
    ctx.fillRect(checkX, y, checkW, checkH);
    ctx.strokeStyle = state.grounded
      ? hexAlpha(SC.lime, .74)
      : "rgba(229,226,216," + (.16 + reveal * .30) + ")";
    ctx.lineWidth = state.grounded ? 2 : 1;
    ctx.strokeRect(checkX + .5, y + .5, checkW - 1, checkH - 1);

    const markerSize = Math.min(22, checkH * .46);
    const markerX = checkX + 14;
    const markerY = y + (checkH - markerSize) / 2;
    ctx.fillStyle = state.grounded
      ? SC.lime
      : "rgba(229,226,216," + (.10 + reveal * .18) + ")";
    ctx.fillRect(markerX, markerY, markerSize, markerSize);
    if (reveal > .45) {
      ctx.strokeStyle = state.grounded ? SC.bg : SC.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(markerX + 5, markerY + markerSize * .53);
      ctx.lineTo(markerX + markerSize * .43, markerY + markerSize - 5);
      ctx.lineTo(markerX + markerSize - 4, markerY + 4);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(229,226,216," + (.34 + reveal * .66) + ")";
    stageFont(ctx, "900", 13, "mono");
    ctx.textAlign = "left";
    ctx.fillText(check[0], markerX + markerSize + 14, y + checkH / 2 + 5);
    ctx.fillStyle = state.grounded
      ? SC.lime
      : "rgba(229,226,216," + (.08 + reveal * .50) + ")";
    stageFont(ctx, "850", 10, "mono");
    ctx.textAlign = "right";
    ctx.fillText(reveal > .35 ? check[1] : "CHECK " + String(index + 1).padStart(2, "0"), checkX + checkW - 14, y + checkH / 2 + 4);

    const nextY = index === checks.length - 1
      ? receiptY
      : y + checkH + checkGap;
    downArrow(y + checkH, nextY, .20 + reveal * .42);
  });

  ctx.fillStyle = state.grounded ? SC.lime : "rgba(229,226,216,.52)";
  stageFont(ctx, "900", 12, "mono");
  ctx.textAlign = "left";
  ctx.fillText("RECEIPT CHAIN", rawX, receiptY - 12);
  ctx.textAlign = "right";
  ctx.fillText(state.grounded ? "LOCKED" : scan > .5 ? "READY" : "PENDING", rawX + rawW, receiptY - 12);

  ctx.fillStyle = state.grounded ? hexAlpha(SC.lime, .18) : "rgba(12,11,10,.96)";
  ctx.fillRect(rawX, receiptY, rawW, receiptH);
  ctx.strokeStyle = state.grounded ? SC.lime : "rgba(229,226,216,.24)";
  ctx.lineWidth = state.grounded ? 2 : 1;
  ctx.strokeRect(rawX + .5, receiptY + .5, rawW - 1, receiptH - 1);

  const chainPad = 24;
  const chainY = receiptY + receiptH * .42;
  const chainW = rawW - chainPad * 2;
  checks.forEach((check, index) => {
    const x = rawX + chainPad + index * chainW / 3;
    if (index < checks.length - 1) {
      ctx.strokeStyle = state.grounded ? SC.lime : "rgba(229,226,216,.22)";
      ctx.lineWidth = state.grounded ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(x + 9, chainY);
      ctx.lineTo(rawX + chainPad + (index + 1) * chainW / 3 - 9, chainY);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, chainY, 8, 0, Math.PI * 2);
    ctx.fillStyle = state.grounded ? SC.lime : "rgba(229,226,216,.16)";
    ctx.fill();
    ctx.strokeStyle = state.grounded ? SC.lime : "rgba(229,226,216,.38)";
    ctx.stroke();
    ctx.fillStyle = state.grounded ? SC.ink : "rgba(229,226,216,.58)";
    stageFont(ctx, "900", 10, "mono");
    ctx.textAlign = index === 0 ? "left" : index === checks.length - 1 ? "right" : "center";
    ctx.fillText(check[0], x, chainY - 15);
  });

  ctx.fillStyle = state.grounded ? SC.ink : "rgba(229,226,216,.34)";
  stageFont(ctx, "900", 13, "mono");
  ctx.textAlign = "center";
  ctx.fillText(state.grounded ? "DEFENSIBLE EVIDENCE" : "RAW NOISE IS NOT EVIDENCE", flowX, receiptY + receiptH - 17);
  ctx.restore();
}

function drawCropMap(ctx, width, height, state, time) {
  const cx=width*.74,cy=height*.43;
  const ranked=state.ranked;
  const tiers=[
    ["RFC / BCP",1.00,SC.lime],["ASVS / WSTG",.82,SC.ink],["MAINTAINER",.60,SC.hot],
    ["RESEARCH",.42,SC.purple],["AI / TUTORIAL",.18,SC.coral]
  ];

  ctx.save();ctx.translate(cx,cy);ctx.scale(1,.52);
  for(let i=0;i<tiers.length;i++){
    const radius=54+i*34;
    ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);
    ctx.strokeStyle=ranked?"rgba(242,234,216,"+(.10+i*.035)+")":"rgba(106,53,232,.24)";
    ctx.lineWidth=ranked?1+i*.35:1;ctx.stroke();
  }
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8+Math.sin(time*.0005+i)*.03;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*42,Math.sin(a)*42);ctx.lineTo(Math.cos(a)*236,Math.sin(a)*236);
    ctx.strokeStyle="rgba(242,234,216,.045)";ctx.stroke();
  }
  ctx.restore();

  tiers.forEach((tier,index)=>{
    const orbit=ranked?64+index*42:76+seeded(index*9)*120;
    const angle=ranked?(-Math.PI/2+index*.56):(time*.00025*(index%2?1:-1)+index*1.21);
    const x=ranked?cx-width*.16+index*width*.075:cx+Math.cos(angle)*orbit;
    const y=ranked?cy-height*.15+index*height*.075:cy+Math.sin(angle)*orbit*.52;
    const weight=tier[1];
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);
    ctx.strokeStyle=ranked?"rgba(159,183,154,"+(.10+weight*.24)+")":"rgba(242,234,216,.09)";
    ctx.lineWidth=ranked?.8+weight*2:.7;ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,ranked?7+weight*8:7,0,Math.PI*2);
    ctx.fillStyle=tier[2];ctx.globalAlpha=ranked?.42+weight*.42:.34;ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=ranked&&index===0?SC.lime:"rgba(242,234,216,.25)";ctx.stroke();
    ctx.fillStyle=ranked?SC.ink:"rgba(242,234,216,.56)";stageFont(ctx,"900",12);ctx.textAlign="center";
    ctx.fillText(tier[0],x,y+23);
    if(ranked){
      ctx.fillStyle="rgba(159,183,154,.50)";ctx.fillRect(x-18,y+31,36*weight,4);
    }
  });

  const hudX=width*.56,hudY=height*.18,hudW=width*.35,hudH=40;
  ctx.fillStyle="rgba(5,5,7,.62)";ctx.fillRect(hudX,hudY,hudW,hudH);
  ctx.strokeStyle=ranked?"rgba(159,183,154,.50)":"rgba(242,120,99,.35)";
  ctx.strokeRect(hudX,hudY,hudW,hudH);
  ctx.fillStyle=ranked?SC.lime:SC.coral;stageFont(ctx,"900",14);ctx.textAlign="center";
  ctx.fillText(ranked?"TRUST VECTOR: WEIGHTED BY AUTHORITY":"FLAT MAP: EVERY SOURCE GETS SAME VOTE",hudX+hudW/2,hudY+16);
  ctx.fillStyle="rgba(242,234,216,.56)";stageFont(ctx,"800",12);
  ctx.fillText(ranked?"normative > verification > maintainer > research > orientation":"beautiful, useless, dangerous",hudX+hudW/2,hudY+31);
  ctx.textAlign="left";
}

function drawMachine(ctx, width, height, state, time) {
  const detail=motionValue(state,"detail",time);
  const cx=width*.73,cy=height*.43;
  const collapsed=1-detail;
  const mandalaX=width*.27,mandalaY=height*.48,mandalaR=Math.min(width,height)*.22;
  const assumptions=[
    ["attacker model",-.26,-.24,SC.coral],["user agent",-.08,-.34,SC.ink],["origin",.18,-.27,SC.lime],
    ["storage",.31,-.06,SC.hot],["clock",.21,.22,SC.ink],["deployment",-.12,.31,SC.purple],["humans",-.34,.05,SC.coral]
  ];

  // Assumption mandala: an ornate compression map, different from the deck's graphs and circuits.
  ctx.save();
  ctx.translate(mandalaX,mandalaY);
  ctx.rotate(time*.00008);
  for(let ring=0;ring<7;ring++){
    const r=mandalaR*(.24+ring*.105);
    ctx.beginPath();
    for(let i=0;i<=192;i++){
      const a=i/192*Math.PI*2;
      const petal=Math.sin(a*(5+ring%3)+time*.0005)*mandalaR*(.012+ring*.002)*detail;
      const rr=r+petal-collapsed*ring*3;
      const x=Math.cos(a)*rr,y=Math.sin(a)*rr;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle=ring%2?"rgba(159,183,154,"+(.10+detail*.13)+")":"rgba(242,234,216,"+(.055+detail*.075)+")";
    ctx.lineWidth=ring===6?1.6:1;
    ctx.stroke();
  }
  for(let spoke=0;spoke<24;spoke++){
    const a=spoke*Math.PI*2/24+Math.sin(time*.0003)*.06;
    const inner=mandalaR*(.16+collapsed*.10),outer=mandalaR*(.92-collapsed*.20);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);
    ctx.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);
    ctx.strokeStyle=spoke%4===0?"rgba(242,120,99,.22)":"rgba(159,183,154,.14)";
    ctx.lineWidth=spoke%4===0?1.3:.8;
    ctx.stroke();
  }
  for(let node=0;node<12;node++){
    const a=node*Math.PI*2/12-time*.00022;
    const r=mandalaR*(.54+.14*Math.sin(node));
    ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,3+detail*3,0,Math.PI*2);
    ctx.fillStyle=node%3===0?SC.coral:node%3===1?SC.lime:"rgba(242,234,216,.72)";
    ctx.globalAlpha=.38+detail*.34;
    ctx.fill();
  }
  ctx.globalAlpha=1;
  ctx.fillStyle="rgba(5,5,7,.62)";
  ctx.beginPath();ctx.arc(0,0,mandalaR*.20,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(159,183,154,.44)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle="rgba(242,234,216,.74)";stageFont(ctx,"900",13);ctx.textAlign="center";
  ctx.fillText("ASSUMPTION",0,-4);
  ctx.fillText("MAP",0,12);
  ctx.restore();

  // Clean diagram mask on top, buried implementation machinery below.
  ctx.save();ctx.translate(cx,cy);
  ctx.rotate(Math.sin(time*.0007)*.015);
  for(let i=0;i<5;i++){
    const r=70+i*24-collapsed*i*7;
    ctx.beginPath();ctx.roundRect?.(-r*1.25,-r*.55,r*2.5,r*1.1,8);
    if(!ctx.roundRect){ctx.rect(-r*1.25,-r*.55,r*2.5,r*1.1);}
    ctx.strokeStyle="rgba(242,234,216,"+(.05+i*.018+detail*.04)+")";ctx.lineWidth=1;ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle="rgba(5,5,7,.88)";ctx.fillRect(cx-148,cy-78,296,158);
  ctx.strokeStyle=collapsed>.5?"rgba(242,120,99,.92)":"rgba(242,234,216,.62)";ctx.lineWidth=3;ctx.strokeRect(cx-148,cy-78,296,158);
  ctx.fillStyle=collapsed>.5?"rgba(242,120,99,.22)":"rgba(159,183,154,.14)";
  ctx.fillRect(cx-122,cy-56,244,28);
  ctx.fillStyle=collapsed>.5?SC.coral:SC.lime;stageFont(ctx,"900",15);ctx.textAlign="center";
  ctx.fillText(collapsed>.5?"SIMPLIFICATION ENGINE":"SYSTEM MODEL / ASSUMPTIONS",cx,cy-37);

  assumptions.forEach((item,index)=>{
    const rawX=cx+item[1]*width,rawY=cy+item[2]*height;
    const slotX=cx-95+(index%4)*63,slotY=cy+6+Math.floor(index/4)*38;
    const x=rawX*detail+slotX*collapsed;
    const y=rawY*detail+slotY*collapsed;
    const active=detail>.32;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(cx+(slotX-cx)*.58,cy+(slotY-cy)*.48);
    ctx.strokeStyle=active?"rgba(159,183,154,.30)":"rgba(242,120,99,.18)";ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,active?7+index%3:4,0,Math.PI*2);
    ctx.fillStyle=item[3];ctx.globalAlpha=active?.64:.28;ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle=active?"rgba(242,234,216,.82)":"rgba(242,120,99,.52)";
    stageFont(ctx,"800",12);ctx.textAlign="center";
    if(active)ctx.fillText(item[0],x,y+22);
  });

  const hidden=["XSS already running?","browser storage reachable?","default chosen by whom?"];
  hidden.forEach((label,i)=>{
    const y=cy+75+i*15;
    ctx.fillStyle="rgba(242,120,99,"+(.22+collapsed*.58)+")";stageFont(ctx,"800",12);ctx.textAlign="center";
    ctx.fillText(label,cx,y);
  });
  ctx.fillStyle=collapsed>.5?SC.coral:SC.dim;stageFont(ctx,"900",16);
  ctx.fillText(collapsed>.5?"THE MODEL IS STARVING THE SYSTEM":"SEVEN ASSUMPTIONS STILL VISIBLE",cx,cy+145);
  spark(ctx,cx+118,cy-58,collapsed>.5?SC.coral:SC.lime,10);
  ctx.textAlign="left";
}

function drawDefault(ctx, width, height, state, time) {
  const cx = width * .61, cy = height * .44;
  const chosen = state.chosen;

  // Gravity well — concentric warped rings pulling downward
  const wellY = cy + 80;
  const shardLabels=["COOKIE","HEADER","TOKEN","CACHE","SDK","DOC","FLAG","PATH"];
  for(let i=0;i<shardLabels.length;i++){
    const seed=seeded(i*97);
    const a=time*.0005+i*Math.PI*2/shardLabels.length;
    const farX=cx+Math.cos(a)*(180+seed*80);
    const farY=wellY+Math.sin(a)*(92+seed*54);
    const pull=chosen?0:Math.max(.18,.78-seed*.22);
    const x=farX*(1-pull)+cx*pull+Math.sin(time*.003+i)*10;
    const y=farY*(1-pull)+wellY*pull+Math.cos(time*.002+i)*7;
    const out=chosen?1:0;
    const dx=Math.cos(a)*(78+seed*120)*out;
    const dy=Math.sin(a)*(40+seed*80)*out;
    ctx.save();
    ctx.translate(x+dx,y+dy);
    ctx.rotate(a+Math.sin(time*.003+i)*.16);
    ctx.fillStyle=chosen?"rgba(5,5,7,.68)":"rgba(242,120,99,.20)";
    ctx.strokeStyle=chosen?"rgba(159,183,154,.86)":"rgba(242,120,99,.62)";
    ctx.lineWidth=2.1;
    ctx.fillRect(-34,-13,68,26);
    ctx.strokeRect(-34,-13,68,26);
    ctx.fillStyle=chosen?SC.lime:SC.coral;
    stageFont(ctx,"900",12);
    ctx.textAlign="center";
    ctx.fillText(shardLabels[i],0,4);
    ctx.restore();
    if(!chosen){
      ctx.beginPath();ctx.moveTo(farX,farY);ctx.lineTo(cx,wellY);
      ctx.strokeStyle="rgba(242,120,99,.14)";ctx.lineWidth=1.2;ctx.stroke();
    }
  }
  const rings = 10;
  for (let i = rings; i >= 0; i--) {
    const baseR = 34 + i * 30;
    const warp = chosen ? Math.sin(time * .002 + i) * 4 : i * 6;
    ctx.save();
    ctx.translate(cx, wellY + (chosen ? -warp * 2 : warp));
    ctx.scale(1, chosen ? .8 : .35 + i * .03);
    ctx.beginPath(); ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    if (chosen) {
      // Broken free — rings scatter outward, turn lime
      ctx.strokeStyle = "rgba(159,183,154," + (.18 + (rings - i) * .06) + ")";
      ctx.lineWidth = 2.4;
    } else {
      // Gravity pull — compressed, coral tint deepens toward center
      const depth = 1 - i / rings;
      ctx.strokeStyle = i < 3
        ? "rgba(242,120,99," + (.22 + depth * .34) + ")"
        : "rgba(242,234,216," + (.10 + depth * .11) + ")";
      ctx.lineWidth = 1.8 + depth*1.2;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Center mass — the "default" pulling everything in
  if (!chosen) {
    const pulseR = 22 + Math.sin(time * .003) * 4;
    const grad = ctx.createRadialGradient(cx, wellY, 0, cx, wellY, pulseR * 2.5);
    grad.addColorStop(0, "rgba(242,120,99,.48)");
    grad.addColorStop(.4, "rgba(242,120,99,.18)");
    grad.addColorStop(1, "transparent");
    ctx.beginPath(); ctx.arc(cx, wellY, pulseR * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, wellY, pulseR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,120,99,.76)"; ctx.fill();
    ctx.fillStyle = SC.bg; stageFont(ctx,"900",12); ctx.textAlign = "center";
    ctx.fillText("DEFAULT", cx, wellY + 3);
    const inheritPulse = Math.sin(time * .004) * .5 + .5;
    ctx.fillStyle = "rgba(242,234,216," + (.30 + inheritPulse * .24) + ")";
    stageFont(ctx,"900",15);
    ctx.fillText("ACCEPT = INHERIT", cx, wellY + 42);
  }

  // Labels
  ctx.textAlign = "center";
  if (chosen) {
    // "CHOSEN" — bold lime at top with glow
    ctx.fillStyle = "rgba(5,5,7,.78)";
    ctx.fillRect(cx-118,height*.16-26,236,58);
    ctx.strokeStyle = "rgba(159,183,154,.42)";
    ctx.strokeRect(cx-118,height*.16-26,236,58);
    ctx.shadowColor = "rgba(159,183,154,.5)"; ctx.shadowBlur = 18;
    ctx.fillStyle = SC.lime; stageFont(ctx,"900",18);
    ctx.fillText("CHOSEN", cx, height * .16);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(242,234,216,.62)"; stageFont(ctx,"800",13);
    ctx.fillText("DEFAULT OVERRIDDEN", cx, height * .20);
    // Green shockwave ring
    const shockR = 60 + Math.sin(time * .0015) * 100 + 100;
    ctx.beginPath(); ctx.arc(cx, wellY - 40, shockR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(159,183,154," + Math.max(.02, .2 - shockR * .0006) + ")";
    ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const a = i * Math.PI * 2 / 9 + time * .001;
      const d = 28 + ((time * .03 + i * 19) % 70);
      ctx.fillStyle = "rgba(242,120,99," + Math.max(.02, .22 - d * .002) + ")";
      stageFont(ctx,"900",11);
      ctx.fillText(i % 2 ? "INHERIT" : "ACCEPT", cx + Math.cos(a) * d, wellY + 42 + Math.sin(a) * d * .42);
    }
  } else {
    ctx.fillStyle = SC.coral; stageFont(ctx,"900",18);
    ctx.fillText("INHERITED", cx, height * .16);
    ctx.fillStyle = "rgba(242,234,216,.62)"; stageFont(ctx,"800",13);
    ctx.fillText("PULL TOWARD DEFAULT", cx, height * .20);
  }
  ctx.textAlign = "left";
}

function drawTerritory(ctx, width, height, state, time) {
  const bend=motionValue(state,"bend",time);
  const reveal=state.territory?1:0;
  const rightX=width*.54;
  const rightW=width*.40;
  const centerX=width*.73;
  const centerY=height*.47;
  const capitals=[
    {x:.61,y:.30,label:"SOURCE",kind:"capital"},
    {x:.70,y:.55,label:"EDGE",kind:"city"},
    {x:.79,y:.27,label:"MODEL",kind:"capital"},
    {x:.87,y:.61,label:"REAL",kind:"capital"},
    {x:.91,y:.42,label:"WITNESS",kind:"city"},
    {x:.64,y:.44,label:"CACHE",kind:"city"},
    {x:.82,y:.48,label:"DRIFT",kind:"city"}
  ];

  ctx.save();
  ctx.globalCompositeOperation="screen";

  // A dashboard atlas: the map is precise-looking, but its borders are still choices.
  const mapX=width*.535,mapY=height*.145,mapW=width*.41,mapH=height*.60;
  ctx.fillStyle="rgba(5,5,7,.54)";
  ctx.fillRect(mapX,mapY,mapW,mapH);
  ctx.strokeStyle="rgba(159,183,154,.24)";
  ctx.lineWidth=1.2;
  ctx.strokeRect(mapX,mapY,mapW,mapH);
  ctx.fillStyle="rgba(159,183,154,.72)";
  stageFont(ctx,"900",12,"mono");
  ctx.textAlign="left";
  ctx.fillText("MODEL ATLAS // RESIDUAL LAYER",mapX+16,mapY+22);
  ctx.fillStyle="rgba(242,234,216,.42)";
  stageFont(ctx,"800",10,"mono");
  ctx.textAlign="right";
  ctx.fillText("projection: local truth",mapX+mapW-16,mapY+22);
  for(let gx=1;gx<9;gx++){
    const x=mapX+gx*mapW/9;
    ctx.beginPath();ctx.moveTo(x,mapY+38);ctx.lineTo(x,mapY+mapH-18);
    ctx.strokeStyle="rgba(159,183,154,.055)";ctx.lineWidth=1;ctx.stroke();
  }
  for(let gy=1;gy<7;gy++){
    const y=mapY+38+gy*(mapH-56)/7;
    ctx.beginPath();ctx.moveTo(mapX+12,y);ctx.lineTo(mapX+mapW-12,y);
    ctx.strokeStyle="rgba(159,183,154,.055)";ctx.lineWidth=1;ctx.stroke();
  }

  const regions=[
    [[.55,.28],[.64,.22],[.73,.31],[.69,.43],[.58,.42]],
    [[.70,.36],[.84,.25],[.93,.36],[.88,.50],[.77,.49]],
    [[.60,.49],[.73,.48],[.77,.66],[.65,.70],[.56,.61]],
    [[.78,.53],[.93,.51],[.90,.68],[.80,.72],[.74,.63]]
  ];
  regions.forEach((region,index)=>{
    ctx.beginPath();
    region.forEach((p,i)=>{
      const x=p[0]*width+Math.sin(time*.00035+i+index)*5*bend;
      const y=p[1]*height+Math.cos(time*.00033+i*.6+index)*4*bend;
      i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle=index%2?"rgba(159,183,154,.055)":"rgba(242,234,216,.035)";
    ctx.fill();
    ctx.strokeStyle=index%2?"rgba(159,183,154,.18)":"rgba(242,234,216,.13)";
    ctx.lineWidth=1.1;
    ctx.stroke();
  });

  const routes=[[0,5],[5,1],[1,6],[6,3],[2,6],[4,3],[0,2],[5,4]];
  routes.forEach((route,index)=>{
    const a=capitals[route[0]],b=capitals[route[1]];
    const ax=a.x*width,ay=a.y*height,bx=b.x*width,by=b.y*height;
    ctx.beginPath();
    ctx.moveTo(ax,ay);
    ctx.bezierCurveTo((ax+bx)/2,ay-36+index*5,(ax+bx)/2,by+26-index*4,bx,by);
    ctx.strokeStyle=index%3===0?"rgba(242,120,99,.26)":"rgba(159,183,154,.20)";
    ctx.lineWidth=index%3===0?1.8:1.2;
    ctx.setLineDash(index%2?[5,7]:[]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.beginPath();
  capitals.forEach((city,index)=>{
    const x=city.x*width+Math.sin(time*.0008+index)*5*bend;
    const y=city.y*height+Math.cos(time*.0007+index)*5*bend;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate((index%2?-.18:.16)+Math.sin(time*.001+index)*.04);
    ctx.shadowColor=city.kind==="capital"?"rgba(242,120,99,.42)":"rgba(159,183,154,.30)";
    ctx.shadowBlur=city.kind==="capital"?16+bend*12:9+bend*8;
    ctx.fillStyle=city.kind==="capital"?"rgba(242,120,99,.82)":"rgba(242,234,216,.72)";
    ctx.strokeStyle="rgba(5,5,7,.72)";
    ctx.lineWidth=1.2;
    ctx.beginPath();
    const markW=city.kind==="capital"?38:22,markH=city.kind==="capital"?14:10;
    ctx.roundRect?.(-markW/2,-markH/2,markW,markH,markH/2);
    if(!ctx.roundRect)ctx.rect(-markW/2,-markH/2,markW,markH);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,-markH*.43);
    ctx.lineTo(0,markH*.43);
    ctx.strokeStyle="rgba(5,5,7,.48)";
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle=city.kind==="capital"?"rgba(242,234,216,.72)":"rgba(242,234,216,.50)";
    stageFont(ctx,"850",10,"mono");
    ctx.textAlign="center";
    ctx.fillText(city.label,x,y+22);
  });

  // Negative space around the spoon: the construct bends around the thing it cannot explain.
  ctx.save();
  ctx.translate(width*.495,height*.47);
  ctx.scale(1.28,.54);
  for(let ring=0;ring<7;ring++){
    const r=82+ring*18+Math.sin(time*.001+ring)*4*bend;
    ctx.beginPath();
    ctx.arc(0,0,r,Math.PI*.12,Math.PI*1.88);
    ctx.strokeStyle=ring%2?"rgba(159,183,154,.13)":"rgba(242,234,216,.07)";
    ctx.lineWidth=ring===3?1.6:1;
    ctx.stroke();
  }
  ctx.restore();

  const anchors=[
    {mx:.56,my:.28,rx:.63,ry:.36,label:"assumption"},
    {mx:.59,my:.63,rx:.69,ry:.57,label:"boundary"},
    {mx:.69,my:.30,rx:.77,ry:.25,label:"threat"},
    {mx:.79,my:.68,rx:.86,ry:.61,label:"runtime"},
    {mx:.88,my:.39,rx:.91,ry:.50,label:"witness"}
  ];
  anchors.forEach((point,index)=>{
    const mx=point.mx*width,my=point.my*height;
    const rx=point.rx*width,ry=point.ry*height;
    const px=mx*(1-bend)+rx*bend,py=my*(1-bend)+ry*bend;
    ctx.save();
    ctx.globalAlpha=.55+bend*.35;
    ctx.beginPath();
    ctx.moveTo(mx,my);
    ctx.bezierCurveTo(mx+28,my-20,px-34,py+18,px,py);
    ctx.strokeStyle=index%2?"rgba(159,183,154,.38)":"rgba(242,234,216,.24)";
    ctx.lineWidth=1.1+bend*.9;
    ctx.setLineDash([3,9]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(mx,my,3.2,0,Math.PI*2);
    ctx.fillStyle="rgba(242,234,216,.34)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px,py,5+bend*3+reveal*2,0,Math.PI*2);
    ctx.fillStyle=index%2?SC.lime:SC.cream;
    ctx.shadowColor=index%2?"rgba(159,183,154,.34)":"rgba(242,234,216,.24)";
    ctx.shadowBlur=10+bend*10;
    ctx.fill();
    if(bend>.32){
      ctx.shadowBlur=0;
      ctx.fillStyle="rgba(242,234,216,.62)";
      stageFont(ctx,"800",11,"mono");
      ctx.textAlign="center";
      ctx.fillText(point.label,px,py+22);
    }
    ctx.restore();
  });

  ctx.fillStyle="rgba(5,5,7,.72)";
  ctx.fillRect(width*.535,height*.785,width*.37,54);
  ctx.strokeStyle="rgba(159,183,154,.26)";
  ctx.strokeRect(width*.535,height*.785,width*.37,54);
  ctx.fillStyle=state.territory?SC.lime:SC.cream;
  stageFont(ctx,"900",15,"mono");
  ctx.textAlign="center";
  ctx.fillText(state.territory?"TERRITORY SIGNALS BREAK THE MODEL":"MODEL RESIDUALS ARE NOT NOISE",width*.72,height*.813);
  ctx.fillStyle="rgba(242,234,216,.58)";
  stageFont(ctx,"800",11,"mono");
  ctx.fillText("watch what the abstraction cannot preserve",width*.72,height*.84);
  ctx.restore();

  if (state.territory) {
    const sites = [[.58,.67],[.66,.30],[.79,.64],[.90,.31]];
    sites.forEach((site,index) => {
      const x=site[0]*width,y=site[1]*height;
      ctx.save();ctx.translate(x,y);ctx.scale(1,.36);
      for(let r=18;r<62;r+=18){ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.strokeStyle=index%2?"rgba(242,120,99,.52)":"rgba(159,183,154,.48)";ctx.stroke();}
      ctx.restore(); spark(ctx,x,y,SC.ink,7);
    });
  }
}

function drawConsensus(ctx, width, height, state, time) {
  const cx=width*.5,cy=height*.48;
  const gain=state.gain;
  const broken=state.broken;
  const heat=broken?1:Math.max(0,Math.min(1,(gain-1)/2.6));
  const idleFire=.46;

  // Ouroboros — a feedback loop eating its own signal
  // The serpent is built from data packets circling, each one citing the last
  const segments=36;
  const baseR=width*.22;
  const headAngle=time*.0006*gain;

  // Digital fire: the training loop starts burning before it fully runs away.
  const flameHeat=broken?1:Math.max(idleFire,heat);
  if(flameHeat>.08){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.globalCompositeOperation="lighter";
    const hearthY=baseR*.42;
    const hearthW=baseR*(broken?2.05:1.96);
    const blink=.86+Math.sin(time*.014)*.22+Math.sin(time*.027)*.14;
    ctx.save();
    ctx.scale(1,.62);
    const bed=ctx.createRadialGradient(0,hearthY,0,0,hearthY,hearthW*.58);
    bed.addColorStop(0,hexAlpha(SC.coral,.46*flameHeat*blink));
    bed.addColorStop(.42,hexAlpha(SC.blood,.36*flameHeat));
    bed.addColorStop(1,hexAlpha(SC.coral,0));
    ctx.fillStyle=bed;
    ctx.beginPath();
    ctx.ellipse(0,hearthY,hearthW*.72,baseR*.28,0,0,Math.PI*2);
    ctx.fill();
    const tongueCount=broken?62:48;
    for(let i=0;i<tongueCount;i++){
      const seed=seeded(i*61);
      const x=(seed-.5)*hearthW+Math.sin(time*.004+i)*18*flameHeat;
      const y=hearthY+18*seeded(i*67);
      const h=(72+seeded(i*71)*132)*(broken?1.22:.95+flameHeat*.62)*blink;
      const w=(18+seeded(i*73)*34)*(broken?1.24:1.04+flameHeat*.56);
      flameTongue(ctx,x,y,h,w,time*.022+i,flameHeat*(.76+seed*.74));
    }
    ctx.restore();
    for(let bar=0;bar<24;bar++){
      const y=hearthY*.62-baseR*.28+bar*9;
      const jitter=Math.sin(time*.018+bar)*18*flameHeat;
      ctx.fillStyle=hexAlpha(bar%4===0?SC.signal:SC.coral,.18);
      ctx.fillRect(-hearthW*.46+jitter,y,hearthW*(.18+seeded(bar*13)*.18),2);
    }
    for(let px=0;px<58;px++){
      const seed=seeded(px*97);
      const x=(seed-.5)*hearthW*1.12;
      const y=hearthY*.62-baseR*.42+((time*.09+seed*220)%170);
      const alpha=(1-(y-(hearthY*.62-baseR*.42))/170)*flameHeat*.48;
      if(alpha<=0)continue;
      ctx.fillStyle=hexAlpha(px%4===0?SC.signal:SC.cream,px%4===0?alpha:alpha*.72);
      ctx.fillRect(x,y,3+seeded(px*11)*4,3+seeded(px*17)*5);
    }
    ctx.restore();
  }
  if(flameHeat>.18||broken){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(1,.62);
    for(let band=0;band<13;band++){
      const r=baseR+12+band*17+Math.sin(time*.002+band)*14*flameHeat;
      const a0=time*.0012*(band%2?1:-1)+band*.41;
      ctx.beginPath();
      for(let i=0;i<=96;i++){
        const p=i/96;
        const a=a0+p*Math.PI*2;
        const noise=Math.sin(a*5+time*.003+band)*12+Math.sin(a*11-time*.002)*7;
        const lift=-Math.max(0,Math.sin(a))*54*flameHeat;
        const rr=r+noise*flameHeat+lift;
        const x=Math.cos(a)*rr;
        const y=Math.sin(a)*rr;
        i?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle=band%3===0
        ?hexAlpha(SC.cream,.05+flameHeat*.13)
        :band%3===1
          ?hexAlpha(SC.coral,.10+flameHeat*.28)
          :hexAlpha(SC.cream,.045+flameHeat*.13);
      ctx.lineWidth=1.2+flameHeat*3.6;
      ctx.shadowColor=hexAlpha(band%3===0?SC.cream:SC.coral,band%3===0?.24:.58);
      ctx.shadowBlur=12+flameHeat*34;
      ctx.stroke();
    }
    for(let ember=0;ember<86;ember++){
      const seed=seeded(ember*29);
      const a=headAngle+seed*Math.PI*2+time*.001*(seeded(ember*31)>.5?1:-1);
      const rise=((time*.055+seed*520)%310);
      const rr=baseR+seeded(ember*37)*190+Math.sin(time*.002+ember)*22*flameHeat;
      const x=Math.cos(a)*rr;
      const y=Math.sin(a)*rr*.55-rise*flameHeat;
      const alpha=(1-rise/310)*flameHeat*(.20+seed*.58);
      if(alpha<=0)continue;
      ctx.beginPath();ctx.arc(x,y,1.2+seeded(ember*41)*3.4,0,Math.PI*2);
      ctx.fillStyle=hexAlpha(ember%4===0?SC.cream:SC.coral,ember%4===0?alpha*.72:alpha);
      ctx.fill();
    }
    ctx.restore();
  }

  // Feedback trail — the body of the ouroboros
  for(let i=0;i<segments;i++){
    const frac=i/segments;
    const angle=headAngle-frac*Math.PI*2;
    const wobble=(broken?Math.sin(time*.004+i*.5)*28*frac:0)+Math.sin(time*.003+i)*heat*14;
    const r=baseR*(broken?1+frac*.4:1+heat*.05)+wobble;
    const x=cx+Math.cos(angle)*r;
    const y=cy+Math.sin(angle)*r*.55;
    const size=broken?2+frac*3:4+Math.sin(frac*Math.PI)*5-frac*2;
    if(size<.5)continue;

    // Each segment is a "citation" — they get dimmer as they age
    const age=1-frac;
    ctx.beginPath();ctx.arc(x,y,Math.max(.5,size),0,Math.PI*2);
    if(broken){
      // Decaying — segments scatter, turn coral
      ctx.fillStyle="rgba(242,120,99,"+(age*.54*Math.max(0,1-frac*1.2))+")";
    }else{
      // Alive — purple core, seafoam-tipped head
      const headGlow=frac<.08;
      ctx.fillStyle=headGlow
        ?"rgba(242,234,216,"+(age*(.58+heat*.20))+")"
        :heat>.45
          ?"rgba(242,120,99,"+(age*(.28+heat*.34))+")"
          :"rgba(106,53,232,"+(age*.45)+")";
    }
    ctx.fill();

    // Citation lines connecting segments
    if(i>0&&i%3===0&&!broken){
      const prevAngle=headAngle-(i-3)/segments*Math.PI*2;
      const px=cx+Math.cos(prevAngle)*baseR;
      const py=cy+Math.sin(prevAngle)*baseR*.55;
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(px,py);
      ctx.strokeStyle="rgba(106,53,232,"+(age*.12)+")";ctx.lineWidth=.5;ctx.stroke();
    }
  }

  // Head of ouroboros — mouth approaching tail
  if(!broken){
    const hx=cx+Math.cos(headAngle)*baseR;
    const hy=cy+Math.sin(headAngle)*baseR*.55;
    // Head glow
    const grad=ctx.createRadialGradient(hx,hy,0,hx,hy,18);
    grad.addColorStop(0,"rgba(242,234,216,"+(gain*.12)+")");
    grad.addColorStop(1,"transparent");
    ctx.beginPath();ctx.arc(hx,hy,18,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    // "Mouth" — eating its own output
    ctx.beginPath();ctx.arc(hx,hy,6,0,Math.PI*2);
    ctx.fillStyle=SC.lime;ctx.fill();
    // Citation labels orbiting
    const citLabels=["BLOG","AI SUMMARY","TUTORIAL","STACK OVERFLOW","BLOG"];
    citLabels.forEach((label,i)=>{
      const la=headAngle-(.15+i*.18)*Math.PI*2;
      const lx=cx+Math.cos(la)*baseR;
      const ly=cy+Math.sin(la)*baseR*.55;
      ctx.fillStyle="rgba(242,234,216,"+(gain>.5?.32:.15)+")";
      stageFont(ctx,"800",12);ctx.textAlign="center";
      ctx.fillText(label,lx,ly-10);
    });
  }

  // Center — the hollow where original signal should be
  const coreR=24+Math.sin(time*.003)*3;
  ctx.beginPath();ctx.arc(cx,cy,coreR,0,Math.PI*2);
  if(broken){
    // Broken — void revealed, no signal
    ctx.fillStyle="rgba(5,5,7,.9)";ctx.fill();
    ctx.strokeStyle=SC.coral;ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=SC.coral;stageFont(ctx,"900",12);ctx.textAlign="center";
    ctx.fillText("NO ORIGIN",cx,cy+3);
  }else{
    ctx.fillStyle="rgba(5,5,7,.6)";ctx.fill();
    ctx.strokeStyle="rgba(106,53,232,.4)";ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle="rgba(106,53,232,.62)";stageFont(ctx,"800",12);ctx.textAlign="center";
    ctx.fillText("ECHO",cx,cy-2);
    ctx.fillText("CHAMBER",cx,cy+8);
  }

  // Amplification rings — gain makes them pulse wider
  if(gain>1.5&&!broken){
    for(let r=0;r<3;r++){
      const ringR=baseR+30+r*22+Math.sin(time*.003+r)*6;
      ctx.save();ctx.translate(cx,cy);ctx.scale(1,.55);
      ctx.beginPath();ctx.arc(0,0,ringR,0,Math.PI*2);
      ctx.strokeStyle="rgba(242,120,99,"+(gain*.04)+")";ctx.lineWidth=1+gain*.1;ctx.stroke();
      ctx.restore();
    }
  }
  if(heat>.35&&!broken){
    ctx.fillStyle="rgba(242,120,99,"+(.36+heat*.38)+")";stageFont(ctx,"900",14);ctx.textAlign="center";
    ctx.fillText("THERMAL RUNAWAY // RECURSIVE CITATION",cx,height*.79);
  }

  // Break effect — fracture lines radiate
  if(broken){
    ctx.save();
    ctx.translate(cx,cy);
    ctx.scale(1,.56);
    const flameGrad=ctx.createRadialGradient(0,0,baseR*.55,0,0,baseR*1.72);
    flameGrad.addColorStop(0,"rgba(5,5,7,.05)");
    flameGrad.addColorStop(.42,"rgba(242,120,99,.16)");
    flameGrad.addColorStop(.72,"rgba(242,234,216,.12)");
    flameGrad.addColorStop(1,"transparent");
    ctx.beginPath();ctx.arc(0,0,baseR*1.72,0,Math.PI*2);ctx.fillStyle=flameGrad;ctx.fill();
    ctx.restore();
    for(let i=0;i<7;i++){
      const fa=-Math.PI/2+i*Math.PI*2/7;
      const len=40+seeded(i*17)*80;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(fa)*coreR,cy+Math.sin(fa)*coreR*.55);
      ctx.lineTo(cx+Math.cos(fa+.08)*(coreR+len),cy+Math.sin(fa+.08)*(coreR+len)*.55);
      ctx.strokeStyle="rgba(242,120,99,.35)";ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.fillStyle=SC.coral;stageFont(ctx,"900",15);
    ctx.fillText("CONSENSUS LOOP SEVERED",cx,height*.85);
    ctx.fillStyle="rgba(242,234,216,.52)";stageFont(ctx,"800",12);
    ctx.fillText("sources recursively citing each other",cx,height*.89);
  }else{
    ctx.fillStyle="rgba(242,234,216,.48)";stageFont(ctx,"900",13);
    ctx.fillText("GAIN: "+gain.toFixed(2)+"x",cx,height*.85);
  }
  ctx.textAlign="left";
}

function drawHumans(ctx, width, height, state, time) {
  const cx=width*.72,cy=height*.42;
  const trace=state.trace;
  const issueOpen=state.issue;

  // Terminal window — git log / issue thread style
  const tx=cx-150,ty=cy-130,tw=300,th=260;
  // Terminal chrome
  ctx.fillStyle="rgba(5,5,7,.88)";ctx.fillRect(tx,ty,tw,th);
  ctx.strokeStyle="rgba(242,234,216,.15)";ctx.lineWidth=1;ctx.strokeRect(tx,ty,tw,th);
  // Title bar
  ctx.fillStyle="rgba(242,234,216,.06)";ctx.fillRect(tx,ty,tw,18);
  ctx.fillStyle="rgba(242,234,216,.48)";stageFont(ctx,"800",12);ctx.textAlign="center";
  ctx.fillText("git log --follow --format='%an // %s'",cx,ty+12);

  // Commit entries — each represents a human layer of provenance
  const commits=[
    {hash:"a3f7c2d",author:"RFC EDITOR",msg:"tighten browser-client language",file:"oauth-browser-apps-bcp.md",color:SC.lime},
    {hash:"91b0e48",author:"OAUTH WG",msg:"prefer auth code + PKCE",file:"draft-ietf-oauth-security-topics",color:SC.ink},
    {hash:"c22d9f1",author:"THREAD #4817",msg:"why localStorage is attacker-reachable",file:"github.com/owasp/issues",color:SC.hot},
    {hash:"7ea451b",author:"CHANGELOG v5.0",msg:"move JWT storage to L2 verification",file:"ASVS-5.0-CHANGELOG",color:SC.purple},
    {hash:"0f9311a",author:"DEPLOYED CODE",msg:"httpOnly cookie + rotate on use",file:"src/auth/session.ts",color:SC.coral},
  ];

  const lineH=22,startY=ty+30;
  ctx.textAlign="left";
  commits.forEach((commit,i)=>{
    const y=startY+i*lineH*2;
    const active=i<trace;
    const revealing=i===trace-1;

    // Hash
    ctx.fillStyle=active?"rgba(159,183,154,.5)":"rgba(242,234,216,.12)";
    stageFont(ctx,"600",12);
    ctx.fillText(commit.hash,tx+8,y);

    // Author line
    ctx.fillStyle=active?commit.color:"rgba(242,234,216,.10)";
    stageFont(ctx,"900",13);
    ctx.fillText(active?commit.author:"????????",tx+70,y);

    // Commit message
    ctx.fillStyle=active?"rgba(242,234,216,.5)":"rgba(242,234,216,.06)";
    stageFont(ctx,"700",12);
    ctx.fillText(active?commit.msg:"·".repeat(30),tx+8,y+13);

    // File path
    ctx.fillStyle=active?"rgba(106,53,232,.4)":"rgba(242,234,216,.04)";
    stageFont(ctx,"700",12);
    ctx.fillText(active?commit.file:"",tx+8,y+24);

    // Connecting provenance line on the left
    if(i>0){
      const prevY=startY+(i-1)*lineH*2+24;
      ctx.beginPath();ctx.moveTo(tx+4,prevY+4);ctx.lineTo(tx+4,y-4);
      ctx.strokeStyle=active?"rgba(159,183,154,.25)":"rgba(242,234,216,.05)";
      ctx.lineWidth=1;ctx.stroke();
      // Node dot
      ctx.beginPath();ctx.arc(tx+4,y-2,2,0,Math.PI*2);
      ctx.fillStyle=active?SC.lime:"rgba(242,234,216,.08)";ctx.fill();
    }

    // Reveal cursor blink on current entry
    if(revealing){
      const blink=Math.sin(time*.005)>.0;
      if(blink){
        ctx.fillStyle="rgba(159,183,154,.6)";
        ctx.fillRect(tx+70+ctx.measureText(commit.author).width+4,y-9,7,12);
      }
    }
  });

  // Issue context — when opened, a diff-style panel appears
  if(issueOpen){
    const ix=tx+tw+14,iy=ty+20,iw=Math.max(128,Math.min(164,width-(tx+tw+32))),ih=210;
    ctx.fillStyle="rgba(5,5,7,.85)";ctx.fillRect(ix,iy,iw,ih);
    ctx.strokeStyle="rgba(242,120,99,.35)";ctx.lineWidth=1;ctx.strokeRect(ix,iy,iw,ih);
    ctx.fillStyle="rgba(242,120,99,.12)";ctx.fillRect(ix,iy,iw,14);
    ctx.fillStyle=SC.coral;stageFont(ctx,"900",12);ctx.textAlign="center";
    ctx.fillText("ISSUE CONTEXT",ix+iw/2,iy+10);

    // Diff lines
    const diffLines=[
      {text:"- implicit grant",color:"rgba(242,120,99,.5)"},
      {text:"+ auth code + PKCE",color:"rgba(159,183,154,.5)"},
      {text:"  // attacker model:",color:"rgba(242,234,216,.25)"},
      {text:"  // script in origin",color:"rgba(242,234,216,.25)"},
      {text:"- localStorage",color:"rgba(242,120,99,.5)"},
      {text:"+ httpOnly cookie",color:"rgba(159,183,154,.5)"},
      {text:"  Reviewed-by: WG",color:"rgba(106,53,232,.4)"},
      {text:"  ACK: 2 maintainers",color:"rgba(106,53,232,.4)"},
    ];
    ctx.textAlign="left";
    diffLines.forEach((line,i)=>{
      ctx.fillStyle=line.color;stageFont(ctx,"700",12);
      ctx.fillText(line.text,ix+6,iy+28+i*15);
    });

    // Connection from terminal to issue panel
    ctx.beginPath();ctx.moveTo(tx+tw,ty+80);ctx.lineTo(ix,iy+40);
    ctx.strokeStyle="rgba(242,120,99,.25)";ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  }

  // Human fingerprint — rabbit as the researcher
  rabbit(ctx,tx-30,ty+th-30,.38,trace>0?.65:.35);

  // Bottom readout
  ctx.textAlign="center";
  ctx.fillStyle=issueOpen?SC.coral:trace?SC.lime:SC.dim;
  stageFont(ctx,"900",14);
  ctx.fillText(issueOpen?"PROVENANCE CHAIN: HUMAN CONTEXT OPEN":trace?"TRACING: "+trace+" / 5 LAYERS":"PROVENANCE CHAIN: OFFLINE",cx,ty+th+20);
  ctx.textAlign="left";
}

function drawGraph(ctx, width, height, state, time) {
  if (!state.frozen) state.phase += .006 + state.heat*.014;
  state.heat *= .985;
  const nodes = state.nodes;
  for (let i = 1; i < nodes.length; i++) {
    const node = nodes[i];
    const wobble = Math.sin(state.phase * (1.4 + i*.03) + i) * (5 + state.heat*42);
    node.x += (node.tx - node.x) * .042 + wobble / width * .06;
    node.y += (node.ty - node.y) * .042 + Math.cos(state.phase+i) * (.0008+state.heat*.0007);
  }
  ctx.lineWidth = 1;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[0], b = nodes[i];
    ctx.beginPath(); ctx.moveTo(a.x*width,a.y*height); ctx.lineTo(b.x*width,b.y*height);
    ctx.strokeStyle = i%6===0 ? "rgba(242,120,99,.52)" : "rgba(159,183,154,.26)"; ctx.stroke();
    if (i > 2) {
      const c = nodes[(i*7) % nodes.length];
      ctx.beginPath(); ctx.moveTo(b.x*width,b.y*height); ctx.lineTo(c.x*width,c.y*height);
      ctx.strokeStyle = "rgba(106,53,232,.28)"; ctx.stroke();
    }
  }
  state.hit = [];
  nodes.forEach((node,index) => {
    const x=node.x*width, y=node.y*height, r=index===0?18:6+(index%3);
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = node.type==="hub"?SC.purple:node.type==="contested"?SC.coral:node.type==="derived"?SC.hot:SC.ink;
    ctx.fill();
    if(index===0){ ctx.strokeStyle=SC.lime; ctx.lineWidth=1.5; ctx.stroke(); }
    if(index===0 || index%4===0){ ctx.fillStyle="rgba(242,234,216,.72)"; stageFont(ctx,"800",12); ctx.fillText(node.label,x+r+7,y+3); }
    state.hit.push({node,x,y,r:r+8});
  });
  spark(ctx,width*.91,height*.22,SC.ink,12);
}

function drawStack(ctx, width, height, state, time) {
  const cx=width*.72, cy=height*.42;
  const labels=["TUTORIAL / AI","CONFERENCE","MAINTAINER DOCS","VERIFICATION","NORMATIVE SPEC"];
  const weights=[.12,.22,.38,.62,1]; // geological density
  const layerH=58, gap=4;
  const totalH=labels.length*(layerH+gap);
  const baseY=cy-totalH/2;
  const traceX=cx-330;
  const traceTop=baseY+layerH/2;
  const traceBottom=baseY+4*(layerH+gap)+layerH/2;
  const traceProgress=Math.max(0,Math.min(1,state.level/5));

  ctx.setLineDash([4,7]);
  ctx.beginPath();ctx.moveTo(traceX,traceTop);ctx.lineTo(traceX,traceBottom);
  ctx.strokeStyle="rgba(242,234,216,.14)";ctx.lineWidth=1.2;ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(traceX,traceTop);ctx.lineTo(traceX,traceTop+(traceBottom-traceTop)*traceProgress);
  ctx.strokeStyle="rgba(159,183,154,.58)";ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<5;i++){
    const nodeY=baseY+i*(layerH+gap)+layerH/2;
    const lit=i/4<=traceProgress+.001;
    ctx.beginPath();ctx.arc(traceX,nodeY,lit?5:3,0,Math.PI*2);
    ctx.fillStyle=lit?SC.lime:"rgba(242,234,216,.22)";ctx.fill();
  }
  ctx.fillStyle="rgba(242,234,216,.46)";stageFont(ctx,"800",12);ctx.textAlign="center";
  ctx.fillText("CLAIM",traceX,traceTop-18);
  ctx.fillText("ROOT",traceX,traceBottom+24);

  // Geological strata — bottom is heaviest (normative), top is lightest (tutorial)
  for(let i=0;i<5;i++){
    const y=baseY+i*(layerH+gap);
    const depth=i/4; // 0=top(tutorial), 1=bottom(spec)
    const active=i>=4-state.level;
    const w=120+depth*180; // wider at bottom = more weight

    // Sediment layers with pressure effect
    const pressure=Math.sin(time*.0012+i*.8)*2*(1-depth);
    ctx.beginPath();
    ctx.moveTo(cx-w,y+pressure);
    ctx.lineTo(cx-w+20,y-8+pressure);
    ctx.lineTo(cx+w-20,y-8+pressure);
    ctx.lineTo(cx+w,y+pressure);
    ctx.lineTo(cx+w,y+layerH+pressure);
    ctx.lineTo(cx-w,y+layerH+pressure);
    ctx.closePath();

    if(active){
      const grad=ctx.createLinearGradient(cx-w,y,cx+w,y+layerH);
      if(i===4){grad.addColorStop(0,"rgba(159,183,154,.7)");grad.addColorStop(1,"rgba(159,183,154,.5)");}
      else{grad.addColorStop(0,"rgba(242,234,216,.55)");grad.addColorStop(1,"rgba(242,234,216,.35)");}
      ctx.fillStyle=grad;
      ctx.strokeStyle=i===4?SC.lime:"rgba(242,234,216,.6)";
      ctx.lineWidth=1.5;
    }else{
      const grad=ctx.createLinearGradient(cx,y,cx,y+layerH);
      grad.addColorStop(0,"rgba(106,53,232,"+((.08+depth*.22))+")");
      grad.addColorStop(1,"rgba(60,23,155,"+((.12+depth*.28))+")");
      ctx.fillStyle=grad;
      ctx.strokeStyle="rgba(242,234,216,"+((.08+depth*.1))+")";
      ctx.lineWidth=.8;
    }
    ctx.fill();ctx.stroke();

    // Compression lines inside each layer
    for(let j=0;j<3;j++){
      const ly=y+12+j*(layerH-16)/3+pressure;
      const lw=w*.7+j*10;
      ctx.beginPath();ctx.moveTo(cx-lw,ly);ctx.lineTo(cx+lw,ly);
      ctx.strokeStyle="rgba(242,234,216,"+(active?.08:.03)+")";ctx.lineWidth=.5;ctx.stroke();
    }

    // Label
    ctx.fillStyle=active?(i===4?SC.bg:"rgba(5,5,7,.85)"):"rgba(242,234,216,"+((.3+depth*.3))+")";
    stageFont(ctx,"900",12+depth*3);ctx.textAlign="center";
    ctx.fillText(labels[i],cx,y+layerH/2+4+pressure);

    // Weight indicator on right
    if(active){
      const barW=4+weights[i]*24;
      ctx.fillStyle=i===4?SC.lime:"rgba(242,234,216,.4)";
      ctx.fillRect(cx+w+14,y+layerH/2-3+pressure,barW,6);
    }
  }

  // Pressure arrows pointing down along left side
  for(let i=0;i<4;i++){
    const ay=baseY+30+i*80;
    const ax=cx-300;
    ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax,ay+35);ctx.lineTo(ax-5,ay+28);ctx.moveTo(ax,ay+35);ctx.lineTo(ax+5,ay+28);
    ctx.strokeStyle="rgba(242,234,216,.12)";ctx.lineWidth=1;ctx.stroke();
  }

  ctx.fillStyle="rgba(242,234,216,.38)";stageFont(ctx,"800",12);
  ctx.fillText("WEIGHT",cx-300,baseY+10);

  ctx.textAlign="left";
}

function drawProtocol(ctx,width,height,state,time){
  const cx=width*.74,cy=height*.34;
  const labels=["Start","Trace","Assumption","Decision"];
  const icons=["01","02","03","04"];

  // Case file folder background
  const folderW=300,folderH=288;
  const fx=cx-folderW/2,fy=cy-folderH/2+20;
  // Folder tab
  ctx.beginPath();
  ctx.moveTo(fx,fy+16);ctx.lineTo(fx,fy+folderH);ctx.lineTo(fx+folderW,fy+folderH);
  ctx.lineTo(fx+folderW,fy+16);ctx.lineTo(fx+folderW*.55,fy+16);ctx.lineTo(fx+folderW*.48,fy);
  ctx.lineTo(fx+12,fy);ctx.lineTo(fx,fy+16);
  ctx.fillStyle="rgba(242,234,216,.03)";ctx.fill();
  ctx.strokeStyle="rgba(242,234,216,.14)";ctx.lineWidth=1;ctx.stroke();
  // Tab label
  ctx.fillStyle="rgba(242,234,216,.46)";stageFont(ctx,"800",12);ctx.textAlign="center";
  ctx.fillText("CASE FILE",fx+folderW*.25,fy+10);

  // Four sealed sections — crack open sequentially
  const sectionH=52,sectionGap=8;
  const sx=fx+20,sw=folderW-40;
  for(let i=0;i<4;i++){
    const sy=fy+40+i*(sectionH+sectionGap);
    const opened=i<state.open;
    const opening=i===state.open-1;

    // Seal line across top
    if(!opened){
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+sw,sy);
      ctx.strokeStyle="rgba(242,120,99,.3)";ctx.lineWidth=1.5;
      ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);
      // Wax seal
      ctx.beginPath();ctx.arc(sx+sw-20,sy,8,0,Math.PI*2);
      ctx.fillStyle="rgba(242,120,99,.4)";ctx.fill();
      ctx.fillStyle=SC.bg;stageFont(ctx,"900",12);ctx.textAlign="center";
      ctx.fillText(String(i+1),sx+sw-20,sy+3);
    }

    // Section background
    ctx.fillStyle=opened?"rgba(159,183,154,.06)":"rgba(242,234,216,.015)";
    ctx.fillRect(sx,sy+2,sw,sectionH);
    ctx.strokeStyle=opened?"rgba(159,183,154,.25)":"rgba(242,234,216,.06)";
    ctx.lineWidth=opened?1.2:.6;
    ctx.strokeRect(sx,sy+2,sw,sectionH);

    // Big icon on left
    ctx.fillStyle=opened?SC.lime:"rgba(106,53,232,.4)";
    stageFont(ctx,"900",opened?24:20);ctx.textAlign="center";
    ctx.fillText(icons[i],sx+30,sy+34);

    // Label
    ctx.textAlign="left";
    ctx.fillStyle=opened?SC.ink:"rgba(242,234,216,.25)";
    stageFont(ctx,"900",opened?13:12);
    const lines=labels[i].split("\n");
    lines.forEach((line,li)=>{
      ctx.fillText(line,sx+58,sy+26+li*12);
    });

    // Number badge
    ctx.textAlign="center";
    ctx.beginPath();ctx.arc(sx+sw-34,sy+sectionH/2+2,12,0,Math.PI*2);
    ctx.fillStyle=opened?"rgba(159,183,154,.18)":"rgba(242,234,216,.04)";ctx.fill();
    ctx.fillStyle=opened?SC.lime:"rgba(242,234,216,.2)";stageFont(ctx,"900",12);
    ctx.fillText("0"+String(i+1),sx+sw-34,sy+sectionH/2+6);

    // Crack/break effect when opening
    if(opening){
      for(let j=0;j<6;j++){
        const px=sx+seeded(j*17+i*5)*sw;
        const py=sy+seeded(j*17+i*5+1)*4-2;
        spark(ctx,px,py,SC.lime,4+seeded(j*17+2)*4);
      }
    }
  }

  // Progress chain along left
  for(let i=0;i<4;i++){
    const dy=fy+40+i*(sectionH+sectionGap)+sectionH/2;
    if(i>0){
      ctx.beginPath();ctx.moveTo(fx+8,dy-(sectionH+sectionGap)+sectionH/2);ctx.lineTo(fx+8,dy);
      ctx.strokeStyle=i<state.open?"rgba(159,183,154,.4)":"rgba(242,234,216,.08)";
      ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.beginPath();ctx.arc(fx+8,dy,3,0,Math.PI*2);
    ctx.fillStyle=i<state.open?SC.lime:"rgba(242,234,216,.12)";ctx.fill();
  }

  ctx.textAlign="left";
}

function drawJwt(ctx,width,height,state,time){
  const bx=width*.54,by=height*.13,bw=width*.39,bh=height*.66;
  const injected=state.injected;
  const isolated=state.isolated||false;

  // Browser window chrome
  ctx.fillStyle="rgba(242,234,216,.05)";
  ctx.fillRect(bx,by,bw,26);
  ctx.strokeStyle="rgba(242,234,216,.2)";ctx.lineWidth=1;
  ctx.strokeRect(bx,by,bw,bh);
  // Window dots
  [0,1,2].forEach((i)=>{
    ctx.beginPath();ctx.arc(bx+12+i*12,by+13,3,0,Math.PI*2);
    ctx.fillStyle=i===0?"rgba(242,120,99,.5)":i===1?"rgba(159,183,154,.3)":"rgba(242,234,216,.15)";ctx.fill();
  });
  // URL bar
  ctx.fillStyle="rgba(242,234,216,.03)";ctx.fillRect(bx+50,by+5,bw-62,16);
  ctx.fillStyle="rgba(242,234,216,.48)";stageFont(ctx,"800",12);
  ctx.fillText("https://app.example.com",bx+56,by+16);

  // Page content area
  const cx=bx+bw/2,pageTop=by+32;

  // DOM tree — simplified document structure
  const domNodes=[
    {x:cx,y:pageTop+25,w:bw*.78,h:20,label:"document",depth:0},
    {x:cx,y:pageTop+55,w:bw*.58,h:20,label:"app shell",depth:1},
    {x:cx-bw*.19,y:pageTop+88,w:bw*.30,h:20,label:"ui state",depth:2},
    {x:cx+bw*.19,y:pageTop+88,w:bw*.30,h:20,label:"script",depth:2,isScript:true},
  ];
  domNodes.forEach(node=>{
    ctx.fillStyle=node.isScript&&injected?"rgba(242,120,99,.12)":"rgba(242,234,216,.02)";
    ctx.fillRect(node.x-node.w/2,node.y-node.h/2,node.w,node.h);
    ctx.strokeStyle=node.isScript&&injected?SC.coral:node.isScript?"rgba(242,120,99,.2)":"rgba(242,234,216,.1)";
    ctx.lineWidth=node.isScript&&injected?1.5:.6;
    ctx.strokeRect(node.x-node.w/2,node.y-node.h/2,node.w,node.h);
    ctx.fillStyle=node.isScript&&injected?SC.coral:"rgba(242,234,216,.56)";
    stageFont(ctx,node.isScript?"900":"800",13);ctx.textAlign="center";
    ctx.fillText(node.label,node.x,node.y+3);
  });
  // DOM tree connectors
  ctx.strokeStyle="rgba(242,234,216,.08)";ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(cx,pageTop+34);ctx.lineTo(cx,pageTop+41);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,pageTop+59);ctx.lineTo(cx-bw*.18,pageTop+70);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,pageTop+59);ctx.lineTo(cx+bw*.18,pageTop+70);ctx.stroke();

  // localStorage vault
  const vx=cx,vy=pageTop+164,vw=bw*.64,vh=112;
  ctx.fillStyle=injected?"rgba(242,120,99,.06)":isolated?"rgba(159,183,154,.06)":"rgba(242,234,216,.03)";
  ctx.fillRect(vx-vw/2,vy-vh/2,vw,vh);
  ctx.strokeStyle=injected?SC.coral:isolated?SC.lime:"rgba(242,234,216,.22)";
  ctx.lineWidth=injected?2:isolated?1.5:1;
  ctx.strokeRect(vx-vw/2,vy-vh/2,vw,vh);

  // Lock icon
  const lx=vx-vw/2+16,ly=vy-12;
  if(!injected){
    ctx.strokeStyle=isolated?SC.lime:"rgba(242,234,216,.3)";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(lx,ly-5,5,Math.PI,0);ctx.stroke();
    ctx.fillStyle=isolated?SC.lime:"rgba(242,234,216,.2)";
    ctx.fillRect(lx-6,ly,12,10);
  }else{
    // Broken lock
    ctx.strokeStyle=SC.coral;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(lx,ly-5,5,Math.PI,-.3);ctx.stroke();
    ctx.fillStyle="rgba(242,120,99,.4)";
    ctx.fillRect(lx-6,ly,12,10);
  }

  ctx.fillStyle="rgba(5,5,7,.72)";
  ctx.fillRect(vx-vw/2,vy-vh/2,vw,24);
  ctx.fillStyle=isolated?SC.lime:injected?SC.coral:"rgba(242,234,216,.72)";
  stageFont(ctx,"900",14);ctx.textAlign="center";
  ctx.fillText(isolated?"HTTPONLY SESSION COOKIE":"SCRIPT-READABLE STORAGE",vx,vy-vh/2+16);

  // JWT token inside vault
  const tokenParts=[
    {text:"header",color:"rgba(106,53,232,.72)",label:"alg, typ"},
    {text:"payload",color:"rgba(159,183,154,.70)",label:"claims"},
    {text:"signature",color:"rgba(242,120,99,.70)",label:"integrity"},
  ];
  tokenParts.forEach((part,i)=>{
    const pillW=vw*.28,pillH=22,px=vx-vw*.40+i*(pillW+8),py=vy-20;
    ctx.fillStyle=part.color;
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(px,py,pillW,pillH,5);else ctx.rect(px,py,pillW,pillH);
    ctx.fill();
    ctx.fillStyle="rgba(5,5,7,.84)";stageFont(ctx,"900",12);ctx.textAlign="center";
    ctx.fillText(part.text,px+pillW/2,py+15);
    ctx.fillStyle="rgba(242,234,216,.58)";stageFont(ctx,"700",11);
    ctx.fillText(part.label,px+pillW/2,py+39);
  });
  ctx.fillStyle="rgba(242,234,216,.58)";stageFont(ctx,"800",12);ctx.textAlign="center";
  ctx.fillText("JWT = signed bearer material",vx,vy+vh/2-16);

  // XSS attack path — script reaches into localStorage
  if(injected){
    const scriptNode=domNodes[3];
    const attackPath=[
      {x:scriptNode.x,y:scriptNode.y+scriptNode.h/2},
      {x:scriptNode.x+22,y:scriptNode.y+42},
      {x:vx+58,y:vy-vh/2+28},
      {x:vx+14,y:vy-6}
    ];
    // Jagged attack line
    ctx.beginPath();ctx.moveTo(attackPath[0].x,attackPath[0].y);
    for(let i=1;i<attackPath.length;i++){
      const jag=i<attackPath.length-1?Math.sin(time*.006+i*2)*6:0;
      ctx.lineTo(attackPath[i].x+jag,attackPath[i].y);
    }
    ctx.strokeStyle=SC.coral;ctx.lineWidth=2.4;
    ctx.shadowColor="rgba(242,120,99,.5)";ctx.shadowBlur=8;
    ctx.stroke();ctx.shadowColor="transparent";ctx.shadowBlur=0;

    // Data exfiltration particles — tokens being stolen
    for(let i=0;i<7;i++){
      const p=(time*.0004+i/7)%1;
      const idx=Math.min(attackPath.length-2,Math.floor(p*(attackPath.length-1)));
      const sub=p*(attackPath.length-1)-idx;
      const px=attackPath[idx].x+(attackPath[idx+1].x-attackPath[idx].x)*sub;
      const py=attackPath[idx].y+(attackPath[idx+1].y-attackPath[idx].y)*sub;
      ctx.beginPath();ctx.arc(px,py,2.5,0,Math.PI*2);
      ctx.fillStyle="rgba(242,120,99,"+((.4+Math.sin(time*.005+i)*.3))+")";ctx.fill();
    }

    // Alert flash
    const flash=Math.sin(time*.004)*.5+.5;
    ctx.fillStyle="rgba(242,120,99,"+(flash*.15)+")";
    ctx.fillRect(bx,by+26,bw,bh-26);

    // Warning label
    ctx.fillStyle="rgba(5,5,7,.76)";ctx.fillRect(cx-bw*.32,vy+vh/2+10,bw*.64,42);
    ctx.strokeStyle="rgba(242,120,99,.52)";ctx.strokeRect(cx-bw*.32,vy+vh/2+10,bw*.64,42);
    ctx.fillStyle=SC.coral;stageFont(ctx,"900",14);ctx.textAlign="center";
    ctx.fillText("SCRIPT CAN READ TOKEN",cx,vy+vh/2+27);
    ctx.fillStyle="rgba(242,120,99,.68)";stageFont(ctx,"800",12);
    ctx.fillText("bearer credential leaves the boundary",cx,vy+vh/2+43);
  }else if(isolated){
    // httpOnly indicator
    ctx.fillStyle=SC.lime;stageFont(ctx,"900",14);ctx.textAlign="center";
    ctx.fillText("SCRIPT CANNOT READ COOKIE",cx,vy+vh/2+20);
    ctx.fillStyle="rgba(159,183,154,.56)";stageFont(ctx,"800",12);
    ctx.fillText("httpOnly reduces script reachability",cx,vy+vh/2+36);
    // Shield over vault
    ctx.beginPath();
    const sy2=vy-vh/2-18;
    ctx.moveTo(vx,sy2-12);ctx.lineTo(vx+14,sy2-4);ctx.lineTo(vx+12,sy2+10);
    ctx.lineTo(vx,sy2+16);ctx.lineTo(vx-12,sy2+10);ctx.lineTo(vx-14,sy2-4);ctx.closePath();
    ctx.fillStyle="rgba(159,183,154,.12)";ctx.fill();
    ctx.strokeStyle=SC.lime;ctx.lineWidth=1.2;ctx.stroke();
  }else{
    ctx.fillStyle="rgba(242,234,216,.50)";stageFont(ctx,"900",13);ctx.textAlign="center";
    ctx.fillText("REACHABILITY UNTESTED",cx,vy+vh/2+22);
  }

  ctx.textAlign="left";
}

function drawOauth(ctx,width,height,state,time){
  const cx=width*.70,cy=height*.44;
  const trace=state.trace;
  const isFossil=state.action==="fossil";

  // Geological strata — time flows downward, each layer is an era of OAuth
  const layers=[
    {label:"RFC 6749",year:"2012",sub:"implicit grant defined",color:"rgba(106,53,232,.35)",h:50},
    {label:"VENDOR DIAGRAM",year:"2016",sub:"copied into docs without update",color:"rgba(242,120,99,.30)",h:44},
    {label:"SECURITY BCP",year:"2021",sub:"implicit deprecated for browser clients",color:"rgba(159,183,154,.25)",h:44},
    {label:"CURRENT FLOW",year:"2026",sub:"auth code + PKCE",color:"rgba(159,183,154,.35)",h:50},
  ];
  const totalH=layers.reduce((s,l)=>s+l.h+4,0);
  const baseY=cy-totalH/2;
  let yOff=baseY;

  layers.forEach((layer,i)=>{
    const active=i<=trace;
    const layerW=200+i*20;
    const lx=cx-layerW/2;

    // Stratum band
    ctx.fillStyle=active?layer.color:"rgba(242,234,216,.03)";
    ctx.fillRect(lx,yOff,layerW,layer.h);
    ctx.strokeStyle=active?"rgba(242,234,216,.18)":"rgba(242,234,216,.06)";
    ctx.lineWidth=.5;ctx.strokeRect(lx,yOff,layerW,layer.h);

    // Sediment texture — tiny dots
    if(active){
      for(let d=0;d<18;d++){
        const dx=lx+seeded(i*80+d)*layerW;
        const dy=yOff+seeded(i*80+d+1)*layer.h;
        ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);
        ctx.fillStyle="rgba(242,234,216,.08)";ctx.fill();
      }
    }

    // Year on left
    ctx.fillStyle=active?"rgba(242,234,216,.62)":"rgba(242,234,216,.16)";
    stageFont(ctx,"900",12);ctx.textAlign="right";
    ctx.fillText(layer.year,lx-8,yOff+layer.h/2+3);

    // Label in stratum
    ctx.fillStyle=active?"rgba(242,234,216,.78)":"rgba(242,234,216,.16)";
    stageFont(ctx,"900",14);ctx.textAlign="center";
    ctx.fillText(layer.label,cx,yOff+layer.h/2-4);
    ctx.fillStyle=active?"rgba(242,234,216,.46)":"rgba(242,234,216,.10)";
    stageFont(ctx,"700",11);
    ctx.fillText(layer.sub,cx,yOff+layer.h/2+10);

    yOff+=layer.h+4;
  });

  // The fossil — vendor diagram trapped in amber
  if(isFossil||trace>=1){
    const fossilLayer=1;
    const fossilY=baseY+layers[0].h+4;
    const fossilH=layers[1].h;
    const amberGlow=isFossil?.6:.15;

    // Amber overlay
    ctx.fillStyle="rgba(242,120,99,"+(amberGlow*.3)+")";
    ctx.fillRect(cx-100,fossilY,200,fossilH);

    // Fossilized diagram — a simplified flow chart trapped in the layer
    const diagramY=fossilY+fossilH/2;
    const boxes=[[cx-60,diagramY],[cx-20,diagramY],[cx+20,diagramY],[cx+60,diagramY]];
    boxes.forEach((b,i)=>{
      ctx.fillStyle="rgba(242,120,99,"+(amberGlow*.5)+")";
      ctx.fillRect(b[0]-8,b[1]-6,16,12);
      if(i<boxes.length-1){
        ctx.beginPath();ctx.moveTo(b[0]+8,b[1]);ctx.lineTo(boxes[i+1][0]-8,boxes[i+1][1]);
        ctx.strokeStyle="rgba(242,120,99,"+(amberGlow*.4)+")";ctx.lineWidth=1;ctx.stroke();
      }
    });

    // Fossil label
    if(isFossil){
      ctx.strokeStyle=SC.coral;ctx.lineWidth=1.5;
      ctx.strokeRect(cx-105,fossilY-2,210,fossilH+4);
      ctx.fillStyle=SC.coral;stageFont(ctx,"900",13);ctx.textAlign="center";
      ctx.fillText("FOSSIL: STILL IN PRODUCTION DOCS",cx,fossilY-8);
      // Crack lines from fossil
      for(let c=0;c<5;c++){
        const ca=seeded(c*23)*Math.PI*2;
        const cl=20+seeded(c*23+1)*40;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(ca)*30,diagramY+Math.sin(ca)*8);
        ctx.lineTo(cx+Math.cos(ca+.15)*(30+cl),diagramY+Math.sin(ca+.15)*(8+cl*.3));
        ctx.strokeStyle="rgba(242,120,99,.3)";ctx.lineWidth=1;ctx.stroke();
      }
    }
  }

  // Drill core indicator — shows research depth
  const drillX=cx+140;
  ctx.beginPath();ctx.moveTo(drillX,baseY-10);ctx.lineTo(drillX,yOff+10);
  ctx.strokeStyle="rgba(242,234,216,.12)";ctx.lineWidth=1;ctx.stroke();
  const drillDepth=baseY+(yOff-baseY)*(trace/3);
  ctx.beginPath();ctx.moveTo(drillX,baseY-10);ctx.lineTo(drillX,drillDepth);
  ctx.strokeStyle=SC.lime;ctx.lineWidth=2.5;ctx.stroke();
  ctx.beginPath();ctx.arc(drillX,drillDepth,4,0,Math.PI*2);
  ctx.fillStyle=SC.lime;ctx.fill();
  ctx.fillStyle="rgba(159,183,154,.56)";stageFont(ctx,"900",12);ctx.textAlign="left";
  ctx.fillText("DEPTH: "+trace+"/3",drillX+10,drillDepth+3);

  // Bottom readout
  ctx.fillStyle=isFossil?SC.coral:trace===3?SC.lime:SC.dim;
  stageFont(ctx,"900",14);ctx.textAlign="center";
  ctx.fillText(isFossil?"SOURCE DRIFT: FOSSIL PRESERVED IN AMBER":trace===3?"TIMELINE FULLY TRACED":"SOURCE DRIFT: UNEXCAVATED",cx,yOff+28);
  ctx.textAlign="left";
}

function drawModel(ctx,width,height,state,time){
  const p=motionValue(state,"model",time),cx=width*.62,paperY=height*.30,wellY=height*.69;
  ctx.save();ctx.globalAlpha=Math.max(0,1-p*1.45);
  const pageW=372,pageH=438,pageX=cx-pageW/2,pageTop=paperY-196;
  ctx.fillStyle="rgba(242,234,216,.94)";ctx.fillRect(pageX,pageTop,pageW,pageH);
  ctx.strokeStyle="rgba(5,5,7,.62)";ctx.lineWidth=1.2;ctx.strokeRect(pageX,pageTop,pageW,pageH);
  ctx.fillStyle="rgba(5,5,7,.76)";
  stageFont(ctx,"700",10);ctx.textAlign="left";
  ctx.fillText("Internet Engineering Task Force",pageX+24,pageTop+28);
  ctx.fillText("Request for Comments: 10017",pageX+24,pageTop+42);
  ctx.fillText("Category: Field Note",pageX+24,pageTop+56);
  ctx.textAlign="right";
  ctx.fillText("C. Fant",pageX+pageW-24,pageTop+28);
  ctx.fillText("Source of Truth",pageX+pageW-24,pageTop+42);
  ctx.fillText("January 2026",pageX+pageW-24,pageTop+56);
  ctx.textAlign="center";
  ctx.fillStyle="rgba(5,5,7,.88)";
  stageFont(ctx,"900",15);
  ctx.fillText("OAuth 2.0 for Browser-Based Applications",cx,pageTop+96);
  stageFont(ctx,"800",12);
  ctx.fillText("Browser Token Storage Requirements",cx,pageTop+114);
  ctx.textAlign="left";
  const docX=pageX+38;
  ctx.fillStyle="rgba(5,5,7,.86)";stageFont(ctx,"900",12);
  ctx.fillText("Status of This Memo",docX,pageTop+145);
  ctx.fillStyle="rgba(5,5,7,.68)";ctx.font="600 10px monospace";
  [
    "This document specifies an Internet standards track",
    "protocol for browser-based OAuth clients and discusses",
    "threats created by script-reachable bearer material."
  ].forEach((line,i)=>ctx.fillText(line,docX,pageTop+164+i*13));
  ctx.fillStyle="rgba(5,5,7,.86)";stageFont(ctx,"900",12);
  ctx.fillText("6.3.1.  Browser Token Storage",docX,pageTop+222);
  const highlightY=pageTop+254;
  ctx.fillStyle="rgba(242,120,99,.12)";ctx.fillRect(docX-7,highlightY-12,pageW-62,32);
  ctx.strokeStyle="rgba(242,120,99,.62)";ctx.lineWidth=1.2;ctx.strokeRect(docX-7,highlightY-12,pageW-62,32);
  ctx.fillStyle="rgba(5,5,7,.82)";ctx.font="700 10px monospace";
  [
    "A public browser client MUST account for malicious",
    "JavaScript already executing in the origin before",
    "selecting storage for bearer material."
  ].forEach((line,i)=>ctx.fillText(line,docX,highlightY+i*13));
  ctx.fillStyle="rgba(5,5,7,.86)";stageFont(ctx,"900",12);
  ctx.fillText("10.  Security Considerations",docX,pageTop+326);
  ctx.fillStyle="rgba(5,5,7,.68)";ctx.font="600 10px monospace";
  [
    "localStorage is observable by script in the same",
    "origin.  httpOnly cookies reduce script reachability;",
    "they do not remove the need for rotation, binding,",
    "and explicit client threat modeling."
  ].forEach((line,i)=>ctx.fillText(line,docX,pageTop+345+i*13));
  ctx.fillStyle="rgba(5,5,7,.48)";ctx.font="700 10px monospace";ctx.textAlign="center";
  ctx.fillText("Fant                         visual field note                  [Page 37]",cx,pageTop+pageH-22);
  ctx.restore();
  thread(ctx,width*.18,paperY+30,cx-pageW/2,paperY+58,30);thread(ctx,cx+pageW/2,paperY+58,width*.93,paperY+88,-34);
  ctx.save();ctx.translate(cx,wellY);ctx.scale(1,.38);
  for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,116+i*20,0,Math.PI*2);ctx.strokeStyle=i===4?"rgba(242,234,216,.72)":"rgba(191,30,46,.34)";ctx.lineWidth=i===4?12:1.5;ctx.stroke();}
  ctx.restore();
  ctx.fillStyle=SC.coral;
  for(const particle of state.particles){
    const local=Math.max(0,Math.min(1,(p-particle.lag)/(1-particle.lag)));
    const rx=particle.rx*244,ry=particle.ry*282;
    const swirl=(1-local)*rx+Math.cos(particle.spin+local*8)*(70*(1-local));
    const x=cx+swirl*(1-local*.72);
    const y=paperY+ry*(1-local)+local*(wellY-paperY+50+Math.abs(particle.rx)*150);
    ctx.globalAlpha=.14+local*.65;ctx.fillRect(x,y,1.5+local*1.2,1.5+local*1.2);
  }
  ctx.globalAlpha=1;ctx.textAlign="left";
  const slide=document.querySelector("#slide-12");
  if(slide){
    const nextState=p>.82?"DISSOLVED":p>.08?"DRIFTING":"MODELED",nextDrift=(p*9.47).toFixed(2);
    const stateNode=slide.querySelector("[data-state]"),driftNode=slide.querySelector("[data-drift]");
    if(stateNode?.textContent!==nextState)stateNode.textContent=nextState;
    if(driftNode?.textContent!==nextDrift)driftNode.textContent=nextDrift;
  }
}

function drawHash(ctx,width,height,state,time){
  const x=width*.61,y=height*.22,size=22,gap=5,cols=12,rows=9;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const active=(row*cols+col)<state.cost*22;
    ctx.fillStyle=active?(col%3===0?SC.lime:"rgba(106,53,232,.72)"):"rgba(242,234,216,.08)";
    ctx.fillRect(x+col*(size+gap),y+row*(size+gap),size,size);
  }
  ctx.fillStyle=SC.ink;ctx.font="900 64px monospace";ctx.fillText(String(state.cost*19)+"MB",x,y+rows*(size+gap)+78);
  ctx.fillStyle=SC.dim;ctx.font="900 13px monospace";ctx.fillText("MEMORY COST / GUESS",x,y+rows*(size+gap)+104);
  thread(ctx,x-120,y+250,x-12,y+180,-34);
}

function drawCors(ctx,width,height,state,time){
  const wallX=width*.72, wallTop=height*.10, wallBot=height*.88;
  const gateY=height*.38, gateH=state.open?height*.52:72;
  const restricted=!state.open&&state.restricted;

  // Wall — vertical boundary
  const wallColor=state.open?"rgba(242,120,99,.18)":restricted?"rgba(159,183,154,.32)":"rgba(242,234,216,.22)";

  // Bricks / segments
  const brickH=14,brickW=28,gap=3;
  const cols=2;
  for(let by=wallTop;by<wallBot;by+=brickH+gap){
    const inGate=by>gateY-gateH/2&&by<gateY+gateH/2;
    if(state.open&&inGate)continue; // gap where wall crumbled
    for(let c=0;c<cols;c++){
      const offset=(Math.floor(by/(brickH+gap))%2)*(brickW/2);
      const bx=wallX-brickW+c*(brickW+gap/2)+offset;
      // When open, bricks shake/fall
      let dx=0,dy=0;
      if(state.open&&Math.abs(by-gateY)<gateH*.7){
        const shake=Math.sin(time*.004+by*.1+c*3)*3;
        dx=shake;dy=Math.abs(shake)*.5;
      }
      ctx.fillStyle=restricted?"rgba(159,183,154,.12)":state.open?"rgba(242,120,99,.08)":"rgba(242,234,216,.06)";
      ctx.strokeStyle=wallColor;ctx.lineWidth=.8;
      ctx.fillRect(bx+dx,by+dy,brickW,brickH);
      ctx.strokeRect(bx+dx,by+dy,brickW,brickH);
    }
  }

  // Gate opening / checkpoint
  if(!state.open){
    // Solid gate with checkpoint
    ctx.fillStyle=restricted?"rgba(159,183,154,.08)":"rgba(242,234,216,.04)";
    ctx.fillRect(wallX-brickW,gateY-gateH/2,brickW*cols+gap,gateH);
    ctx.strokeStyle=restricted?SC.lime:"rgba(242,234,216,.28)";ctx.lineWidth=1.4;
    ctx.strokeRect(wallX-brickW,gateY-gateH/2,brickW*cols+gap,gateH);
    // Checkpoint label
    ctx.fillStyle=restricted?SC.lime:SC.ink;stageFont(ctx,"900",13);ctx.textAlign="center";
    ctx.fillText(restricted?"VERIFIED":"CHECK",wallX,gateY+3);
  }

  // Origin labels
  stageFont(ctx,"900",15);ctx.textAlign="center";
  ctx.fillStyle="rgba(242,234,216,.5)";
  ctx.fillText("ORIGIN A",width*.55,height*.20);
  ctx.fillText("API / DATA",width*.89,height*.20);

  // Origin A box
  ctx.strokeStyle="rgba(242,234,216,.18)";ctx.lineWidth=1;
  ctx.strokeRect(width*.46,height*.25,width*.18,height*.30);
  // Browser icon suggestion
  ctx.beginPath();ctx.arc(width*.55,height*.38,22,0,Math.PI*2);
  ctx.fillStyle="rgba(106,53,232,.28)";ctx.fill();
  ctx.fillStyle=SC.ink;stageFont(ctx,"900",13);ctx.fillText("BROWSER",width*.55,height*.40);

  // API box
  ctx.strokeStyle="rgba(242,234,216,.18)";ctx.lineWidth=1;
  ctx.strokeRect(width*.80,height*.25,width*.16,height*.30);
  ctx.beginPath();ctx.arc(width*.88,height*.38,22,0,Math.PI*2);
  ctx.fillStyle=state.open?"rgba(242,120,99,.28)":"rgba(159,183,154,.18)";ctx.fill();
  ctx.fillStyle=SC.ink;stageFont(ctx,"900",13);ctx.fillText("SERVER",width*.88,height*.40);

  // Requests — arrows crossing the boundary
  const reqCount=state.open?16:4;
  for(let i=0;i<reqCount;i++){
    const p=(time*(state.open?.0006:.0003)+i/reqCount)%1;
    const fromLeft=i%2===0;
    const sx=fromLeft?width*.64:width*.80;
    const ex=fromLeft?width*.80:width*.64;
    const baseY=height*.30+seeded(i*7+3)*height*.24;
    const x=sx+(ex-sx)*p;
    const y=baseY+Math.sin(p*Math.PI)*8;

    // Check if request hits the wall
    const atWall=Math.abs(x-wallX)<18;

    if(!state.open&&atWall&&!restricted){
      // Blocked — flash at wall
      ctx.beginPath();ctx.arc(wallX,y,5+Math.sin(time*.008+i)*2,0,Math.PI*2);
      ctx.fillStyle="rgba(242,120,99,.5)";ctx.fill();
      continue;
    }
    if(!state.open&&restricted&&atWall){
      // Passing through checkpoint — brief pause effect
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle="rgba(159,183,154,.6)";ctx.fill();
      continue;
    }

    // Request dot
    const color=state.open
      ?(fromLeft?"rgba(242,120,99,.7)":"rgba(242,120,99,.5)")
      :(fromLeft?"rgba(159,183,154,.6)":"rgba(242,234,216,.4)");
    ctx.beginPath();ctx.arc(x,y,state.open?3.5:3,0,Math.PI*2);
    ctx.fillStyle=color;ctx.fill();

    // Arrow trail
    if(state.open){
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-(ex-sx)*.06,y);
      ctx.strokeStyle="rgba(242,120,99,.2)";ctx.lineWidth=2;ctx.stroke();
    }
  }

  // Danger zone when open — flooding visual
  if(state.open){
    // Pulsing danger overlay on API side
    const pulse=Math.sin(time*.003)*.5+.5;
    ctx.fillStyle="rgba(242,120,99,"+(pulse*.06)+")";
    ctx.fillRect(wallX+35,height*.10,width-wallX-35,height*.78);
    // Warning text
    ctx.fillStyle="rgba(242,120,99,"+(pulse*.6+.3)+")";
    stageFont(ctx,"900",14);ctx.textAlign="center";
    ctx.fillText("ACCESS-CONTROL-ALLOW-ORIGIN: *",width*.86,height*.62);
    ctx.fillText("NO AUTHORIZATION CHECK",width*.86,height*.66);

    // Crumbling debris particles
    for(let i=0;i<8;i++){
      const dx=Math.sin(time*.003+i*1.7)*12;
      const dy=(time*.02+seeded(i*31)*200)%height*.4+gateY-gateH*.3;
      ctx.fillStyle="rgba(242,234,216,.12)";
      ctx.fillRect(wallX-4+dx,dy,6,4);
    }
  }

  // Restricted — shield indicator
  if(restricted){
    ctx.beginPath();
    const sx=wallX,sy=height*.68;
    ctx.moveTo(sx,sy-14);ctx.lineTo(sx+12,sy-6);ctx.lineTo(sx+10,sy+8);
    ctx.lineTo(sx,sy+14);ctx.lineTo(sx-10,sy+8);ctx.lineTo(sx-12,sy-6);ctx.closePath();
    ctx.fillStyle="rgba(159,183,154,.14)";ctx.fill();
    ctx.strokeStyle=SC.lime;ctx.lineWidth=1.2;ctx.stroke();
    ctx.fillStyle=SC.lime;stageFont(ctx,"900",13);ctx.textAlign="center";
    ctx.fillText("POLICY",sx,sy+2);
  }

  // Bottom label
  ctx.fillStyle=state.open?SC.coral:restricted?SC.lime:SC.dim;
  stageFont(ctx,"900",15);ctx.textAlign="center";
  ctx.fillText(state.open?"BOUNDARY REMOVED":restricted?"ORIGIN ALLOWLIST + AUTHORIZATION":"CORS BOUNDARY",wallX,height*.94);

  ctx.textAlign="left";
}

function drawAi(ctx,width,height,state,time){
  const cx=width*.72,cy=height*.42;
  const stage=state.stage; // 0=raw answer, 1=oriented, 2=cited, 3=verified

  // Exoskeleton wireframe — skeletal armor around a hollow brain
  // The AI is a tool, not a source; the armor amplifies but the core is empty
  const spineSegments=12;
  const spineH=240;
  const spineTop=cy-spineH/2;
  const headR=32+Math.sin(time*.002)*2;
  const headY=spineTop-headR-8;

  // Ghost of the broken consensus loop: same void, now inside a tool-shaped body.
  const ghostAlpha=Math.max(0,.22-stage*.07);
  if(ghostAlpha>.02){
    ctx.save();ctx.translate(cx,headY);ctx.scale(1,.58);
    for(let i=0;i<3;i++){
      ctx.beginPath();ctx.arc(0,0,headR+18+i*10,.18,Math.PI*1.82);
      ctx.strokeStyle="rgba(242,120,99,"+(ghostAlpha*(1-i*.22))+")";ctx.lineWidth=1;ctx.stroke();
    }
    const biteA=time*.0008;
    ctx.beginPath();ctx.arc(Math.cos(biteA)*(headR+18),Math.sin(biteA)*(headR+18),4,0,Math.PI*2);
    ctx.fillStyle="rgba(242,120,99,"+ghostAlpha+")";ctx.fill();
    ctx.restore();
  }

  // Spine — central neural column
  for(let i=0;i<spineSegments;i++){
    const frac=i/(spineSegments-1);
    const y=spineTop+frac*spineH;
    const w=28+Math.sin(frac*Math.PI)*50;
    const lit=stage>=Math.floor(frac*3);
    // Vertebra
    ctx.beginPath();
    ctx.moveTo(cx-w/2,y);ctx.lineTo(cx-w*.3,y-4);ctx.lineTo(cx+w*.3,y-4);
    ctx.lineTo(cx+w/2,y);ctx.lineTo(cx+w*.3,y+4);ctx.lineTo(cx-w*.3,y+4);ctx.closePath();
    ctx.strokeStyle=lit?"rgba(159,183,154,"+(0.15+frac*.2)+")":"rgba(242,234,216,.06)";
    ctx.lineWidth=lit?1.2:.5;ctx.stroke();
    if(lit){ctx.fillStyle="rgba(159,183,154,.03)";ctx.fill();}
    // Neural pulse traveling down spine
    if(lit){
      const pulse=((time*.002+frac*2)%1);
      const pulseAlpha=Math.max(0,1-Math.abs(pulse-.5)*4);
      if(pulseAlpha>.05){
        ctx.beginPath();ctx.arc(cx,y,3,0,Math.PI*2);
        ctx.fillStyle="rgba(159,183,154,"+(pulseAlpha*.4)+")";ctx.fill();
      }
    }
  }

  // Rib cage — source connections radiating from spine
  const sources=[
    {label:"RFC",row:-2,side:-1,len:126,tier:1},
    {label:"ASVS",row:-1,side:-1,len:108,tier:1},
    {label:"MAINTAINER",row:0,side:-1,len:118,tier:2},
    {label:"CODE",row:0,side:1,len:104,tier:2},
    {label:"CHANGELOG",row:1,side:1,len:116,tier:3},
    {label:"ISSUE",row:2,side:1,len:126,tier:3},
  ];
  sources.forEach((src,i)=>{
    const linked=i<stage*2;
    const ribY=cy+src.row*34;
    const elbowX=cx+src.side*42;
    const endX=cx+src.side*src.len;
    const endY=ribY+src.row*8;

    // Orthogonal source route
    ctx.beginPath();
    ctx.moveTo(cx,ribY);
    ctx.lineTo(elbowX,ribY);
    ctx.lineTo(elbowX,endY);
    ctx.lineTo(endX,endY);
    ctx.strokeStyle=linked?"rgba(159,183,154,.30)":"rgba(242,234,216,.06)";
    ctx.lineWidth=linked?1.5:.5;ctx.stroke();

    // Source node at end
    const nodeSize=linked?14:9;
    ctx.fillStyle=linked?SC.lime:SC.purple;ctx.globalAlpha=linked?.55:.2;ctx.fill();ctx.globalAlpha=1;
    ctx.fillRect(endX-nodeSize/2,endY-nodeSize/2,nodeSize,nodeSize);
    ctx.strokeStyle=linked?"rgba(159,183,154,.4)":"rgba(242,234,216,.08)";ctx.stroke();
    ctx.strokeRect(endX-nodeSize/2,endY-nodeSize/2,nodeSize,nodeSize);

    // Label
    ctx.fillStyle=linked?SC.ink:"rgba(242,234,216,.28)";
    stageFont(ctx,"900",12);ctx.textAlign=src.side>0?"left":"right";
    ctx.fillText(src.label,endX+(src.side>0?14:-14),endY+3);

    // Data flow particles along rib when linked
    if(linked){
      for(let p=0;p<3;p++){
        const t=((time*.001+p*.33+i*.17)%1);
        const seg=t<.42?0:t<.58?1:2;
        let px,py;
        if(seg===0){
          const local=t/.42;
          px=cx+(elbowX-cx)*local;py=ribY;
        }else if(seg===1){
          const local=(t-.42)/.16;
          px=elbowX;py=ribY+(endY-ribY)*local;
        }else{
          const local=(t-.58)/.42;
          px=elbowX+(endX-elbowX)*local;py=endY;
        }
        ctx.fillStyle="rgba(159,183,154,"+(.22+Math.sin(t*Math.PI)*.32)+")";
        ctx.fillRect(px-2,py-2,4,4);
      }
    }
  });

  // Skull / head — the AI brain, hollow
  // Cranium outline
  ctx.beginPath();ctx.arc(cx,headY,headR,0,Math.PI*2);
  ctx.fillStyle="rgba(5,5,7,.8)";ctx.fill();
  ctx.strokeStyle=stage===3?"rgba(159,183,154,.5)":"rgba(106,53,232,.35)";
  ctx.lineWidth=stage===3?2:1;ctx.stroke();

  // Brain pattern inside — neural folds
  for(let f=0;f<5;f++){
    const fa=f*Math.PI*2/5+time*.0003;
    const fr=headR*(.3+f*.1);
    ctx.beginPath();
    ctx.arc(cx+Math.cos(fa)*fr*.3,headY+Math.sin(fa)*fr*.3,fr,fa,fa+Math.PI*.8);
    ctx.strokeStyle="rgba(106,53,232,"+(stage>=2?.20:.08)+")";ctx.lineWidth=.7;ctx.stroke();
  }

  // Stage indicator inside skull
  const stageLabels=["RAW","ORIENT","CITE","VERIFY"];
  ctx.fillStyle=stage===3?SC.lime:stage>=2?SC.ink:stage>=1?"rgba(106,53,232,.6)":"rgba(242,234,216,.3)";
  stageFont(ctx,"900",13);ctx.textAlign="center";
  ctx.fillText(stageLabels[stage],cx,headY+3);

  // Verified glow
  if(stage===3){
    ctx.strokeStyle="rgba(159,183,154,.32)";
    ctx.lineWidth=1.5;
    const box=92;
    ctx.strokeRect(cx-box/2,headY-box/2,box,box);
    for(let i=0;i<4;i++){
      const y=headY-box/2+14+i*18;
      ctx.beginPath();ctx.moveTo(cx-box/2,y);ctx.lineTo(cx+box/2,y);ctx.stroke();
    }
    const p=(time*.00055)%1;
    const railX=cx-box/2+p*box;
    ctx.fillStyle="rgba(159,183,154,.58)";
    ctx.fillRect(railX-2,headY-box/2,4,box);
  }

  // Warning — hollow core reminder
  ctx.fillStyle="rgba(242,234,216,.42)";stageFont(ctx,"800",12);
  ctx.fillText(stage<3?"// TOOL, NOT SOURCE":"// HUMAN-VERIFIED",cx,spineTop+spineH+24);

  // Bottom readout
  ctx.fillStyle=stage===3?SC.lime:SC.dim;stageFont(ctx,"900",14);
  ctx.fillText(["EXOSKELETON: RAW","EXOSKELETON: ORIENTED","EXOSKELETON: CITED","EXOSKELETON: HUMAN-VERIFIED"][stage],cx,spineTop+spineH+42);
  ctx.textAlign="left";
}

function drawChecklistScene(ctx,width,height,state,time){
  const cx=width*.77,cy=height*.37,count=document.querySelectorAll("#slide-19 .check.done").length;
  for(let i=0;i<9;i++){
    const a=-Math.PI/2+i*Math.PI*2/9;
    const r=155;
    const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.72;
    const done=i<count;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle=done?SC.lime:"rgba(242,234,216,.12)";ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,done?10:6,0,Math.PI*2);ctx.fillStyle=done?SC.lime:SC.purple;ctx.fill();
  }
  rabbit(ctx,cx,cy-6,.64,count===9?1:.55);
  ctx.fillStyle=count===9?SC.lime:SC.dim;ctx.font="900 12px monospace";ctx.textAlign="center";ctx.fillText(count+" / 9 RECEIPTS",cx,cy+86);ctx.textAlign="left";
}

function drawScene(canvas,state,time){
  const ctx=canvas.getContext("2d");
  const size=resizeScene(canvas,ctx);
  clearScene(ctx,size.width,size.height,state);
  if(state.kind==="portal") drawPortal(ctx,size.width,size.height,state,time);
  if(state.kind==="whois") drawWhois(ctx,size.width,size.height,state,time);
  if(state.kind==="graph") drawGraph(ctx,size.width,size.height,state,time);
  if(state.kind==="sky") drawSky(ctx,size.width,size.height,state,time);
  if(state.kind==="stack") drawStack(ctx,size.width,size.height,state,time);
  if(state.kind==="cropmap") drawCropMap(ctx,size.width,size.height,state,time);
  if(state.kind==="protocol") drawProtocol(ctx,size.width,size.height,state,time);
  if(state.kind==="machine") drawMachine(ctx,size.width,size.height,state,time);
  if(state.kind==="jwt") drawJwt(ctx,size.width,size.height,state,time);
  if(state.kind==="default") drawDefault(ctx,size.width,size.height,state,time);
  if(state.kind==="oauth") drawOauth(ctx,size.width,size.height,state,time);
  if(state.kind==="model") drawModel(ctx,size.width,size.height,state,time);
  if(state.kind==="hash") drawHash(ctx,size.width,size.height,state,time);
  if(state.kind==="territory") drawTerritory(ctx,size.width,size.height,state,time);
  if(state.kind==="cors") drawCors(ctx,size.width,size.height,state,time);
  if(state.kind==="consensus") drawConsensus(ctx,size.width,size.height,state,time);
  if(state.kind==="ai") drawAi(ctx,size.width,size.height,state,time);
  if(state.kind==="humans") drawHumans(ctx,size.width,size.height,state,time);
  if(state.kind==="checklist") drawChecklistScene(ctx,size.width,size.height,state,time);
}

function setReadout(slide,text){ const node=slide.querySelector("[data-readout]"); if(node) node.textContent=text; }

function syncSceneFromSlide(slide,{instant=false}={}){
  const canvas=slide.querySelector(".scene-canvas");
  if(!canvas)return;
  const state=sceneState.get(canvas);
  const step=Number(slide.dataset.step||0);
  const max=Math.max(1,Number(slide.dataset.maxStep||1));
  const ratio=step/max;
  state.step=step;state.max=max;state.action="step-"+step;

  if(state.kind==="portal"){
    state.target=ratio;
    startMotion(state,"depth",state.target,instant);
  }
  if(state.kind==="whois"){
    state.masked=slide.classList.contains("is-masked");
    state.target=state.masked?0:ratio;
    startMotion(state,"signal",state.target,instant);
    setReadout(slide,state.masked?"IDENTITY MASKED":step?"UAP PLATFORM ENGINEER // TRANSMITTING":"UAP PLATFORM ENGINEER // IDENTIFIED");
  }
  if(state.kind==="graph"){
    state.heat=slide.classList.contains("is-heated") ? .35+ratio*1.25 : .12;
    state.frozen=slide.classList.contains("is-frozen");
    state.nodes.forEach((node,index)=>{
      if(!index)return;
      const rearranged=slide.classList.contains("is-reshuffled")||step>=2;
      const angle=index*2.399+step*.61;
      const ring=.16+(index%5)*.07;
      node.tx=rearranged?.50+seeded(index+step*31)*.44:.67+Math.cos(angle)*ring;
      node.ty=rearranged?.14+seeded(index*3+step*47)*.58:.43+Math.sin(angle)*ring*.8;
      if(instant){node.x=node.tx;node.y=node.ty;}
    });
    setReadout(slide,state.frozen?"SOURCE FIELD // FROZEN":step>=2?"SOURCE FIELD // REORBITED":step?"SOURCE FIELD // HEATED":"SOURCE FIELD // READY");
  }
  if(state.kind==="sky"){
    state.target=Math.min(1,ratio*2);
    startMotion(state,"scan",state.target,instant);
    state.grounded=slide.classList.contains("is-grounded");
    setReadout(slide,state.grounded?"RECEIPT CHAIN // LOCKED":step?"EVIDENCE CHECKS // SCANNING":"RAW FEED // UNCHECKED");
  }
  if(state.kind==="stack"){
    state.level=Math.round(ratio*5);
    setReadout(slide,state.level?"AUTHORITY "+state.level+" / 5":"UNRANKED");
  }
  if(state.kind==="cropmap"){
    state.ranked=slide.classList.contains("is-ranked");
    setReadout(slide,state.ranked?"SOURCE MAP // WEIGHTED":"SOURCE MAP // UNRANKED");
  }
  if(state.kind==="protocol"){
    state.open=Math.round(ratio*4);
    setReadout(slide,state.open?"QUESTION "+state.open+" / 4":"CASE CLOSED");
  }
  if(state.kind==="machine"){
    state.target=1-ratio;
    startMotion(state,"detail",state.target,instant);
    setReadout(slide,step?"ASSUMPTIONS // COLLAPSING":"ASSUMPTIONS // 07");
  }
  if(state.kind==="jwt"){
    state.injected=slide.classList.contains("is-injected");
    state.isolated=slide.classList.contains("is-isolated");
    setReadout(slide,state.isolated?"SCRIPT ISOLATED":state.injected?"TOKEN EXPOSED":"ORIGIN // MODELED");
  }
  if(state.kind==="default"){
    state.chosen=slide.classList.contains("is-chosen");
    setReadout(slide,state.chosen?"DEFAULT // OVERRIDDEN":step?"DEFAULT // ACCEPTED":"DEFAULT // LOADED");
  }
  if(state.kind==="oauth"){
    state.trace=Math.round(ratio*3);
    state.action=slide.classList.contains("is-fossil")?"fossil":"trace";
    setReadout(slide,slide.classList.contains("is-fossil")?"FOSSIL FOUND":state.trace?"SOURCE DRIFT "+state.trace+" / 3":"TIMELINE // UNTRACED");
  }
  if(state.kind==="model"){
    state.target=ratio;
    startMotion(state,"model",state.target,instant);
    setReadout(slide,step?"MODEL // DISSOLVING":"MODEL // STABLE");
  }
  if(state.kind==="hash"){
    state.cost=Math.max(1,Math.round(1+ratio*4));
    setReadout(slide,(state.cost*19)+"MB / GUESS");
  }
  if(state.kind==="territory"){
    state.target=Math.min(1,ratio*2);
    startMotion(state,"bend",state.target,instant);
    state.territory=slide.classList.contains("is-territory");
    setReadout(slide,state.territory?"TERRITORY // SIGNAL SITES":step?"MAP // BENDING":"MAP != TERRITORY");
  }
  if(state.kind==="cors"){
    state.open=slide.classList.contains("is-open");
    state.restricted=slide.classList.contains("is-restricted");
    setReadout(slide,state.restricted?"POLICY RESTRICTED":state.open?"BOUNDARY OPEN":"BOUNDARY // UNTESTED");
  }
  if(state.kind==="consensus"){
    state.broken=slide.classList.contains("is-broken");
    state.gain=state.broken?0:1+ratio*3;
    setReadout(slide,state.broken?"LOOP // BROKEN":"LOOP GAIN // "+state.gain.toFixed(2));
  }
  if(state.kind==="ai"){
    state.stage=Math.min(3,Math.round(ratio*3));
    setReadout(slide,["RAW ANSWER","ORIENTED","CLAIMS CITED","HUMAN VERIFIED"][state.stage]);
  }
  if(state.kind==="humans"){
    state.trace=Math.min(4,Math.round(ratio*4));
    state.issue=slide.classList.contains("is-issue-open");
    setReadout(slide,state.issue?"UAP // ISSUE CONTEXT OPEN":state.trace?"UAP // HUMAN LINK "+(state.trace+1)+" / 5":"UAP // HUMAN CONTEXT OFFLINE");
  }
  if(state.kind==="checklist"){
    state.run=step;
    setReadout(slide,step===max?"DECISION // DEFENSIBLE":step?"RECEIPTS "+step+" / "+max:"UNVERIFIED");
  }

  if(!Number.isFinite(state.motionUntil))state.motionUntil=instant?0:performance.now()+420;
}

function sceneAction(slide,action,button){
  const step=Number(slide.dataset.step||0),max=Number(slide.dataset.maxStep||0),scene=slide.dataset.scene;
  slide.querySelectorAll(".scene-controls button").forEach(node=>node.classList.toggle("active",node===button));
  if(action==="reset"||action==="restore"||action==="flatten"||action==="mask"){
    if(action==="mask")slide.classList.add("is-masked");
    else semanticStateClasses.forEach(name=>slide.classList.remove(name));
    setSlideStep(slide,0,{instant:action!=="mask"});
    return;
  }
  slide.classList.remove("is-masked");
  if(action==="enter")setSlideStep(slide,step===max?0:max);
  else if(action==="transmit"||action==="rank"||action==="simplify"||action==="choose"||action==="dissolve"||action==="territory"||action==="restrict"||action==="break"||action==="verify"||action==="issue"||action==="run")setSlideStep(slide,max);
  else if(action==="freeze"||action==="isolate"||action==="fossil")setSlideStep(slide,max);
  else if(action==="open")setSlideStep(slide,scene==="protocol"?Math.min(max,step+1):1);
  else if(action==="cite")setSlideStep(slide,Math.min(max,2));
  else if(action==="accept"||action==="inject"||action==="scan"||action==="bend"||action==="orient")setSlideStep(slide,1);
  else if(action==="amplify")setSlideStep(slide,step>=max?1:Math.min(max,step+1));
  else if(action==="heat"||action==="trace"||action==="cost")setSlideStep(slide,Math.min(max,step+1));
  else if(action==="ground")setSlideStep(slide,max);
  else if(action==="reshuffle"){
    slide.classList.add("is-reshuffled");
    setSlideStep(slide,Math.min(max,Math.max(2,step+1)));
  }
}

document.querySelectorAll(".scene-controls button").forEach(button=>button.addEventListener("click",()=>sceneAction(button.closest(".slide"),button.dataset.action,button)));

for(const canvas of sceneCanvases){
  const state=sceneState.get(canvas);
  canvas.addEventListener("pointermove",event=>{
    const rect=canvas.getBoundingClientRect();state.pointer.x=(event.clientX-rect.left)/rect.width;state.pointer.y=(event.clientY-rect.top)/rect.height;
    if(state.dragStart&&Math.hypot(event.clientX-state.dragStart.x,event.clientY-state.dragStart.y)>6)window.__deckDragged=true;
    if(state.drag){state.drag.node.x=state.pointer.x;state.drag.node.y=state.pointer.y;state.drag.node.tx=state.pointer.x;state.drag.node.ty=state.pointer.y;}
  });
  canvas.addEventListener("pointerdown",event=>{
    if(state.kind!=="graph")return;
    const hit=(state.hit||[]).find(item=>Math.hypot(event.offsetX-item.x,event.offsetY-item.y)<item.r);
    if(hit){state.drag=hit;state.dragStart={x:event.clientX,y:event.clientY};window.__deckDragged=false;canvas.setPointerCapture(event.pointerId);}
  });
  canvas.addEventListener("pointerup",event=>{state.drag=null;state.dragStart=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);});
}

let posterPointerFrame=0,posterPointerX=.5,posterPointerY=.5;
document.addEventListener("pointermove",event=>{
  if(reducedMotion)return;
  posterPointerX=event.clientX/innerWidth;posterPointerY=event.clientY/innerHeight;
  if(posterPointerFrame)return;
  posterPointerFrame=requestAnimationFrame(()=>{
    posterPointerFrame=0;
    const poster=slides[currentIndex]?.querySelector(".poster-img");
    if(poster){const x=(posterPointerX-.5)*8,y=(posterPointerY-.5)*8;poster.style.transform="translate("+x+"px,"+y+"px) scale(1.008)";}
  });
});

const continuousScenes=new Set(["portal","whois","graph","sky","protocol","jwt","default","model","hash","territory","cors","consensus","ai","humans","oauth","stack","machine","cropmap","checklist"]);
let sceneFrameId=0;

function stopSceneLoop(){
  if(sceneFrameId)cancelAnimationFrame(sceneFrameId);
  sceneFrameId=0;
}

function sceneFrame(time){
  sceneFrameId=0;
  const active=slides[currentIndex];
  const canvas=active?.querySelector(".scene-canvas");
  if(!canvas)return;
  const state=sceneState.get(canvas);
  drawScene(canvas,state,time);
  if(!exportMode&&!reducedMotion&&(continuousScenes.has(state.kind)||time<(state.motionUntil||0)))sceneFrameId=requestAnimationFrame(sceneFrame);
}

function scheduleScene(slide,{instant=false}={}){
  stopSceneLoop();
  const canvas=slide?.querySelector(".scene-canvas");
  if(!canvas)return;
  const state=sceneState.get(canvas);
  drawScene(canvas,state,instant?0:performance.now());
  if(!instant&&!exportMode&&!reducedMotion&&(continuousScenes.has(state.kind)||performance.now()<(state.motionUntil||0)))sceneFrameId=requestAnimationFrame(sceneFrame);
}

window.onDeckStateChange=(slide,options={})=>{
  syncSceneFromSlide(slide,options);
  if(slide.classList.contains("is-current"))scheduleScene(slide,options);
};
window.onDeckSlideChange=(slide,options={})=>{
  syncSceneFromSlide(slide,options);
  scheduleScene(slide,options);
};

window.addEventListener("load",()=>{
  sceneCanvases.forEach(canvas=>{
    const slide=canvas.closest(".slide");
    syncSceneFromSlide(slide,{instant:exportMode||reducedMotion});
    if(exportMode)drawScene(canvas,sceneState.get(canvas),0);
  });
  scheduleScene(slides[currentIndex],{instant:exportMode||reducedMotion});
});

// Memorial live counter counts up from the January snapshot to the current checked source.
(function initMemorialCounter(){
  const countEl=document.querySelector(".memorial-count");
  if(!countEl)return;
  const from=Number(countEl.dataset.countFrom)||71660;
  const to=Number(countEl.dataset.countTo)||73300;
  const liveEl=countEl.querySelector(".count-live");
  if(!liveEl)return;
  if(exportMode){
    liveEl.textContent=fmt(to);
    countEl.classList.add("is-complete");
    return;
  }
  let started=false,startTime=0,duration=4000;
  function fmt(n){return n.toLocaleString("en-US");}
  function tick(now){
    if(!startTime)startTime=now;
    const elapsed=now-startTime;
    const progress=Math.min(1,elapsed/duration);
    // Ease out cubic
    const eased=1-Math.pow(1-progress,3);
    const current=Math.round(from+(to-from)*eased);
    liveEl.textContent=fmt(current);
    if(progress>=1){
      liveEl.textContent=fmt(to);
      countEl.classList.add("is-complete");
    } else {
      requestAnimationFrame(tick);
    }
  }
  // Use IntersectionObserver to start counting when visible
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&!started){
        started=true;
        requestAnimationFrame(tick);
      }
    });
  },{threshold:.5});
  observer.observe(countEl);
})();
`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Source of Truth // Engineering Research Field Guide</title>
  <!-- Visual direction: hard black geometry, cream light, violet structure, orange signal, and blood-red exceptions. -->
  <style>${css}</style>
</head>
<body>
  <div class="progress" aria-hidden="true">
    <div class="progress-track">
      <svg class="progress-maze" viewBox="0 0 1000 20" preserveAspectRatio="none">
        <path class="maze-bed" d="M0 10 H70 V4 H130 V16 H210 V7 H290 V13 H370 V3 H445 V17 H535 V8 H620 V14 H705 V5 H790 V16 H870 V9 H935 V3 H1000" pathLength="100"/>
        <path class="progress-fill" id="progressBar" d="M0 10 H70 V4 H130 V16 H210 V7 H290 V13 H370 V3 H445 V17 H535 V8 H620 V14 H705 V5 H790 V16 H870 V9 H935 V3 H1000" pathLength="100"/>
      </svg>
      <span class="progress-marker" id="progressMarker"></span>
      <span class="progress-void" aria-hidden="true"></span>
    </div>
  </div>
  <header class="topbar">
    <div class="brand">Source of Truth <span>Pipeline Lore // UAPs // RFCs</span></div>
    <select class="jump" id="jump" aria-label="Jump to slide">${optionsMarkup}</select>
    <button class="toggle" id="rabbitToggle" type="button" aria-pressed="false">rabbit hole</button>
  </header>
  <nav class="rail" id="rail" aria-label="Slide navigation">${railMarkup}</nav>
  <p class="rabbit-status" id="rabbitText">Use the source layer to settle conflicts.</p>
  <main id="deck">${slideMarkup}</main>
  <script>${js}\n${sceneJs}</script>
</body>
</html>
`;

const notesHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Speaker Notes // Source of Truth</title>
  <style>
    :root { color-scheme: dark; --bg: #050507; --ink: #f0ede4; --dim: #a1a1aa; --line: #27272a; --signal: #39ff14; }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font: 400 16px/1.5 "Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    main { width: min(980px, calc(100vw - 32px)); margin: 0 auto; padding: 32px 0 64px; }
    h1, h2, p { margin: 0; }
    h1 { font-size: clamp(1.8rem, 4vw, 3.5rem); line-height: 1; letter-spacing: 0; text-transform: uppercase; }
    h2 { font-size: clamp(1rem, 2vw, 1.45rem); line-height: 1.1; text-transform: uppercase; }
    a { color: var(--ink); text-underline-offset: 3px; }
    .deck-link { display: inline-block; margin-top: 14px; color: var(--dim); }
    .note-slide { border-top: 1px solid var(--line); padding: 24px 0; }
    .note-kicker { color: var(--signal); font-size: .78rem; text-transform: uppercase; }
    ul { margin: 14px 0 0; padding-left: 1.2rem; }
    li { margin: .45rem 0; color: var(--ink); }
  </style>
</head>
<body>
  <main>
    <h1>Speaker Notes</h1>
    <p>Source of Truth // Engineering Research Field Guide</p>
    <a class="deck-link" href="./index.html">Open deck</a>
    ${speakerNotesMarkup}
  </main>
</body>
</html>
`;

writeFileSync(path.join(root, "index.html"), html);
writeFileSync(path.join(root, "speaker-notes.html"), notesHtml);
console.log(`Built index.html and speaker-notes.html with ${slides.length} slides and ${Object.keys(assets).length} embedded assets.`);
