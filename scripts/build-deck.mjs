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
    role: "UAP Platform Engineer // UAP / UFO research",
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
    h1: "73,300+",
    body: "May the music passing through this device somehow help to bring just a little more peace to this troubled world.",
    notes: [
      "This is the human consequence of source drift: every number is a person, and every reported total is a dated claim that must retain its provenance.",
      "The counter animates from the 26 January 2026 reported total to the latest verified count. Each tick represents a documented life.",
      "Say reported, name the date, and do not imply that the figure is complete. Sources checked on 6 August 2026: WAFA reported 71,660 on 26 January; AP reported more than 73,300 in its 1 August story, citing the Gaza Health Ministry.",
      "Update the source and target before the live talk if a newer authoritative report is available.",
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
    return `<div class="frame bio-layout" data-theme-tableau="alien-crew-beam-desk-fragments"><figure class="bio-photo">${image(slide)}</figure><div class="bio-text">${head(slide)}<h2>${esc(slide.h1)}</h2><p class="bio-role">${esc(slide.role)}</p><p>${esc(slide.body)}</p><div class="bio-stats"><p>AppSec · cloud infrastructure · identity · software delivery</p><p>Anomalous signals are questions, not conclusions.</p></div></div></div>`;
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

const css = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");

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
  content: " ";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: 
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
    linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04));
  z-index: 999;
  background-size: 100% 4px, 3px 100%;
  pointer-events: none;
}

::selection {
  background: #ef4444 !important;
  color: #030308 !important;
}

h1:hover, h2:hover, a:hover {
  text-shadow: 2px 0 #ef4444, -2px 0 #3b82f6 !important;
  animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(-5deg); text-shadow: 3px 0 #ef4444, -3px 0 #3b82f6; }
  40% { transform: skew(5deg); text-shadow: -3px 0 #ef4444, 3px 0 #3b82f6; }
  60% { transform: skew(-2deg); }
  80% { transform: skew(2deg); }
  100% { transform: skew(0deg); }
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
  border-radius: 999px;
  background: rgba(0,0,0,.58);
}
.progress-fill {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 999px;
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
  border-radius: 52% 48% 46% 54%;
  background: var(--ink);
  box-shadow: 0 0 16px rgba(242,234,216,.58);
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
  border-radius: 80% 20% 60% 40%;
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
  border-radius: 50%;
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
  backdrop-filter: blur(16px);
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
  border-radius: 6px;
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
  border-radius: 50%;
  background: rgba(5,5,7,.76);
  text-decoration: none;
}
.rail a.active {
  border-color: var(--ink);
  background: var(--ink);
  box-shadow: 0 0 18px rgba(242,234,216,.64);
}
.rabbit-status {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 34;
  max-width: min(24rem, calc(100vw - 2rem));
  padding: .72rem .82rem;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(5,5,7,.82);
  color: var(--ink-dim);
  font: 700 .72rem/1.45 var(--mono);
  transform: translateY(140%);
  transition: transform .2s ease;
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
  opacity: 1;
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
  grid-template-columns: minmax(24rem, 1.08fr) minmax(20rem, .78fr);
  gap: clamp(2rem, 4.5vw, 5rem);
  isolation: isolate;
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
  border-left: 2px solid rgba(106,53,232,.72);
  background: transparent;
}
.bio-text::before {
  display: none;
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
  color: var(--coral);
  font: 700 clamp(.92rem, 1.18vw, 1.08rem)/1.35 var(--sans);
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
.bio-stats {
  display: grid;
  gap: .55rem;
  margin-top: 1.5rem;
  max-width: 42rem;
}
.bio-stats p {
  max-width: none;
  margin: 0;
  color: rgba(229,226,216,.74);
  font: 750 clamp(.88rem, 1.05vw, 1rem)/1.4 var(--sans);
  text-shadow: none;
}
.bio-stats p + p {
  color: rgba(242,120,99,.92);
}
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 3px;
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
  border-radius: 8px;
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
  filter: drop-shadow(0 0 5px rgba(242,234,216,.62));
  transition: stroke-dashoffset .16s linear;
}
.progress-marker {
  width: 20px; height: 16px; border: 1px solid var(--ink);
  box-shadow: 0 0 18px rgba(242,234,216,.82);
  transform-origin: 50% 50%;
  transition: left .18s cubic-bezier(.3,.7,.35,1), top .18s cubic-bezier(.3,.7,.35,1),
              transform .55s cubic-bezier(.5,.05,.6,1), opacity .55s ease;
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
  box-shadow: 0 0 12px 3px rgba(106,53,232,.35), inset 0 0 6px 2px #000;
  pointer-events: none;
  z-index: 3;
}
.progress-void::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(106,53,232,.3);
  animation: void-pulse 2.4s ease-in-out infinite;
}
@keyframes void-pulse {
  0%, 100% { transform: scale(1); opacity: .5; }
  50% { transform: scale(1.4); opacity: 0; }
}
/* At the void: rabbit spirals down into the black hole. */
.progress-marker.at-void {
  transform: translate(-50%, -20%) rotate(220deg) scale(.45);
  opacity: .55;
  filter: blur(.5px);
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
  backdrop-filter: blur(10px);
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
.rail a.active { width: 13px; background: var(--ink); box-shadow: 0 0 14px rgba(242,234,216,.82); }
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
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,.018) 0 1px, transparent 1px 5px),
    repeating-linear-gradient(90deg, rgba(159,183,154,.012) 0 1px, transparent 1px 96px);
  mix-blend-mode: soft-light;
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
  transition: border-color .15s, color .15s, background .15s, transform .15s;
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
  animation: title-event-horizon 2.2s cubic-bezier(.14,.86,.18,1) forwards;
}
@keyframes title-event-horizon {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.10) rotate(0deg); filter: blur(0); }
  34% { opacity: .72; transform: translate(-50%, -50%) scale(1.3) rotate(140deg); filter: blur(.2px); }
  64% { opacity: .62; transform: translate(-50%, -50%) scale(2.25) rotate(300deg); filter: blur(.4px); }
  100% { opacity: .18; transform: translate(-50%, -50%) scale(3.4) rotate(480deg); filter: blur(1px); }
}
[data-reveal] {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 320ms ease, transform 320ms cubic-bezier(.2,.7,.2,1), border-color 320ms ease;
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
  box-shadow: 0 0 18px rgba(242,234,216,.10);
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
  transition: transform .4s cubic-bezier(.2,.7,.2,1);
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
  animation: cover-void-open 1.85s cubic-bezier(.2,.8,.1,1) forwards;
}
#slide-01.is-diving .cover-art img {
  transform-origin: 50% 58%;
  animation: cover-rabbit-vortex 2.1s cubic-bezier(.14,.86,.18,1) forwards;
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
  animation: field-note-blackout 2.2s ease forwards;
}
@keyframes cover-void-open {
  0% { opacity: 0; transform: translate(-50%, 50%) scale(.3) rotate(0deg); }
  28% { opacity: .96; transform: translate(-50%, 50%) scale(1.35) rotate(120deg); }
  100% { opacity: 1; transform: translate(-50%, 50%) scale(2.2) rotate(320deg); }
}
@keyframes field-note-blackout {
  0%, 38% { opacity: 0; filter: blur(3px); }
  54%, 72% { opacity: .86; filter: blur(0); }
  100% { opacity: 0; filter: blur(1px); }
}
@keyframes cover-rabbit-vortex {
  0% { opacity: 1; filter: saturate(1) contrast(1) drop-shadow(0 0 0 transparent); transform: translate3d(0,0,0) rotate(0deg) scale(1); }
  18% { filter: saturate(1.08) contrast(1.06); transform: translate3d(-5vw,-3vh,0) rotate(-18deg) scale(1.03); }
  42% { opacity: .96; transform: translate3d(4vw,5vh,0) rotate(260deg) scale(.82); }
  68% { opacity: .72; filter: saturate(1.2) contrast(1.18); transform: translate3d(-2vw,13vh,0) rotate(680deg) scale(.45); }
  100% { opacity: 0; filter: saturate(2) contrast(1.35) blur(2px); transform: translate3d(0,21vh,0) rotate(1160deg) scale(.04); }
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
  clip-path: inset(0 42% 0 0);
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
  border-radius: 8px;
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
  animation: spoon-meme-loosen 8s cubic-bezier(.45,0,.2,1) infinite alternate;
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
  box-shadow: 0 0 32px rgba(159,183,154,.18);
}
#slide-14 .reference-art img {
  opacity: 1;
  mix-blend-mode: normal;
  filter: saturate(1.08) contrast(1.14) brightness(1.04) drop-shadow(0 0 34px rgba(159,183,154,.22));
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
  mix-blend-mode: screen;
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
  backdrop-filter: blur(12px);
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
  backdrop-filter: blur(10px);
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
.slide-live .case-table div { border-radius: 0; padding: .45rem .56rem; background: rgba(5,5,7,.56); backdrop-filter: blur(4px); }
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
.model-readout b { color: var(--ink); text-shadow: 0 0 10px rgba(242,234,216,.38); }
#slide-17 .ai-layout { min-height: calc(100vh - 76px); grid-template-columns: minmax(0,.92fr) minmax(22rem,.65fr); align-items: end; padding-bottom: 28px; }
#slide-17 .copy { max-height: calc(100vh - 140px); overflow-y: auto; padding: 18px 20px 18px 0; background: linear-gradient(90deg,rgba(5,5,7,.95),rgba(5,5,7,.7),transparent); }
#slide-17 .side-art { display: none; }
#slide-18 .split-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 34px; }
#slide-18 .copy { position: relative; z-index: 3; max-height: calc(100vh - 140px); overflow-y: auto; padding: 18px 20px 18px 0; background: linear-gradient(90deg,rgba(5,5,7,.94),rgba(5,5,7,.7),transparent); text-shadow: 0 8px 28px #050507; }
#slide-18 .side-art { display: none; }
#slide-19 .checklist-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 30px; }
#slide-20 .closing-layout { min-height: calc(100vh - 76px); align-items: end; padding-bottom: 34px; }
#slide-20 .closing-copy { max-height: calc(100vh - 140px); overflow-y: auto; }
#slide-20 .closing-art { opacity: .86; filter: drop-shadow(0 0 60px rgba(106,53,232,.35)); }
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
  animation: circuit-drift 9s ease-in-out infinite alternate;
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
  from { transform: rotate(-2deg) translate3d(-10px, -5px, 0) scale(1.08); filter: blur(.1px); }
  to { transform: rotate(1.5deg) translate3d(12px, 8px, 0) scale(1.12); filter: blur(.7px); }
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
  text-shadow: 0 10px 34px #050507, 0 0 18px rgba(5,5,7,.92);
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
  transition: opacity 320ms ease, transform 320ms cubic-bezier(.2,.7,.2,1), filter 320ms ease;
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
  filter: saturate(1.18) contrast(1.10) brightness(1.04) drop-shadow(0 0 44px rgba(106,53,232,.26));
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
  filter: saturate(1.22) contrast(1.18) brightness(1.08) drop-shadow(0 0 52px rgba(106,53,232,.28));
}
#slide-16.slide-live .scene-canvas {
  z-index: 4;
  mix-blend-mode: screen;
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
  ufoBeam: "#f0ede4", ufoViolet: "#7657d6", ufoOrange: "#f27863"
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

writeFileSync(path.join(root, "index.html"), html);
console.log(`Built index.html with ${slides.length} slides and ${Object.keys(assets).length} embedded assets.`);
