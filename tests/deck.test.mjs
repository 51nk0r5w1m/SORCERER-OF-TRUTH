import { readFile, stat } from "node:fs/promises";
import assert from "node:assert/strict";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const slideCount = 21;

test("deck has unique ids and balanced slide sections", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

  assert.equal(html.match(/<section\b/g)?.length ?? 0, html.match(/<\/section>/g)?.length ?? 0);
  assert.deepEqual([...new Set(duplicates)], []);
  assert.equal(html.match(/class="slide /g)?.length, slideCount);
});

test("deck is self-contained at runtime", async () => {
  const refs = [
    ...html.matchAll(/\bsrc="([^"]+)"/g),
    ...html.matchAll(/url\("([^"]+)"\)/g),
    ...html.matchAll(/url\('([^']+)'\)/g),
  ].map((match) => match[1]);

  const invalid = refs.filter((ref) => !ref.startsWith("data:") && !ref.startsWith("#"));
  assert.deepEqual(invalid, []);

  const stats = await stat(new URL("../index.html", import.meta.url));
  assert.ok(stats.size > 1_000_000, "embedded-asset deck should contain data URIs");
});

test("narrative follows the research-methodology thesis", () => {
  const required = [
    /Inception, but RFCs/,
    /When sources disagree, sort the room/,
    /Some receipts weigh more/,
    /Ask four small questions/,
    /Leave with a decision/,
    /Research is how we find the residuals/,
    /What does this force us to ask next\?/,
    /load-bearing difference/i,
  ];

  for (const pattern of required) assert.match(html, pattern);

  assert.doesNotMatch(html, /Web Security 101/i);
  assert.doesNotMatch(html, /ship this instead/i);
});

test("approved surreal visual language is embedded", () => {
  const posterTitles = [
    "Simplification",
    "Default Decision",
    "The Feed",
    "Consensus Engine",
    "The Model",
  ];

  for (const title of posterTitles) {
    assert.match(html, new RegExp(`data-title="${title}"`));
  }

  assert.match(html, /hard black geometry, cream light, violet structure, orange signal, and blood-red exceptions/i);
  assert.match(html, /data:image\/jpeg;base64,/);
  assert.doesNotMatch(html, /cdn\.tailwindcss\.com/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
});

test("prototype playfulness is part of the deck, not an external demo", () => {
  assert.equal(html.match(/class="scene-canvas"/g)?.length, 20);
  for (const label of ["TRANSMIT", "SCAN SKY", "RANK SOURCES", "SIMPLIFY", "CHOOSE", "BEND MAP", "BREAK LOOP", "TRACE AUTHOR", "DISSOLVE", "RUN METHOD"]) {
    assert.match(html, new RegExp(`>${label.replace(/[+*]/g, "\\$&")}<`));
  }
  assert.match(html, /data-scene="graph"/);
  assert.match(html, /data-scene="model"/);
  assert.match(html, /data-scene="portal"/);
  assert.match(html, /data-scene="sky"/);
  assert.match(html, /data-scene="cropmap"/);
  assert.match(html, /data-scene="consensus"/);
});

test("bio scene is an alien tableau rather than a labeled green dashboard", () => {
  const whoisScene = html.match(/function drawWhois[\s\S]*?function drawSky/)?.[0] || "";

  assert.match(html, /data-theme-tableau="alien-crew-beam-desk-fragments"/);
  assert.match(whoisScene, /structure: SC\.ufoViolet/);
  assert.match(whoisScene, /beam: SC\.ufoBeam/);
  assert.match(whoisScene, /information: SC\.cream/);
  for (const fragment of ["laptop", "keyboard", "mouse", "mug", "sticky-note", "monitor-piece"]) {
    assert.match(whoisScene, new RegExp(`kind: "${fragment}"`));
  }
  assert.doesNotMatch(whoisScene, /SC\.signal|JWT|server|packet|curl/);
});

test("feed scene turns raw noise into a locked evidence receipt", () => {
  for (const label of ["RAW FEED", "SOURCE", "DATE", "CONTEXT", "DECISION", "RECEIPT CHAIN", "DEFENSIBLE EVIDENCE"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /EVIDENCE CHECKS \/\/ SCANNING/);
  assert.match(html, /RECEIPT CHAIN \/\/ LOCKED/);
  assert.doesNotMatch(html, /IMPACT = authority x recency x blast radius/);
});

test("every slide participates in the deterministic presenter state machine", () => {
  assert.equal(html.match(/data-slide="\d+" data-step="0" data-max-step="\d+"/g)?.length, slideCount);
  assert.match(html, /function setSlideStep\(slide, nextStep/);
  assert.match(html, /function advance\(\)/);
  assert.match(html, /function reverse\(\)/);
  assert.match(html, /window\.deckState = \{ advance, reverse, resetSlide, setCurrent, setSlideStep \}/);
  assert.doesNotMatch(html, /Date\.now\(\)/);
  assert.doesNotMatch(html, /index\*85/);
});

test("export and reduced-motion modes have static meaningful states", () => {
  assert.match(html, /new URLSearchParams\(location\.search\)\.has\("export"\)/);
  assert.match(html, /prefers-reduced-motion: reduce/);
  assert.match(html, /body\.export-mode \[data-reveal\]/);
  assert.match(html, /continuousScenes/);
  assert.match(html, /cancelAnimationFrame\(sceneFrameId\)/);
});

test("illuminated UI uses cream light rather than multicolor effects", () => {
  assert.doesNotMatch(html, /linear-gradient\(90deg, var\(--lime\), var\(--coral\), var\(--purple-hot\)\)/);
  assert.match(html, /stroke: var\(--ink\);/);
  assert.match(html, /\.scene-hud b \{ color: var\(--ink\);/);
  assert.match(html, /\.model-readout b \{ color: var\(--ink\);/);
});

test("rabbit progress is an orthogonal maze and UAP identity stays intentional", () => {
  assert.match(html, /class="progress-maze"/);
  assert.match(html, /M0 10 H70 V4 H130 V16/);
  assert.match(html, /UAP Platform Engineer/);
  assert.match(html, /UAP Platform Engineer \/\/ signal traced \/\/ decision defensible/i);

  const header = html.match(/<header class="topbar">[\s\S]*?<\/header>/)?.[0] || "";
  assert.doesNotMatch(header, /UAP Platform Engineer/i);
});

test("selected reference material avoids social screenshot chrome as deck content", () => {
  assert.match(html, /There Is No Spoon/);
  assert.match(html, /Find the person behind it/);
  assert.match(html, /Carley Fant/);
  assert.match(html, /UAP Platform Engineer/);
  assert.doesNotMatch(html, /Instagram/);
  assert.doesNotMatch(html, /screencapture-instagram-stories/);
});

test("case-file HUD stays in the live-system footer", () => {
  assert.match(html, /\.slide-live\.slide-case \.scene-hud \{[\s\S]*?inset: auto 30px 12px auto !important;/);
  assert.match(html, /\.slide-live\.slide-case \.case-layout \{[\s\S]*?padding-bottom: 30px;/);
});

test("closing circuit slide has the Moog quote and no counter", () => {
  assert.match(html, /data-title="The Circuit Remembers"/);
  assert.match(html, /May the music passing through/);
  assert.doesNotMatch(html, /data-count-from/);
  assert.doesNotMatch(html, /Palestinians reported/i);
});
