---
title: Source Drift Control Plane
toc: false
---

```js
import {
  evidence,
  evidenceLabels,
  evidenceMatrix,
  layerDomain,
  layerLabels,
  layers,
  metric,
  rankedBar,
  sourceSignal,
  timelinePlot
} from "./components/source-drift.js";
```

```js
const records = (await FileAttachment("data/records.json").json()).map((d) => ({
  ...d,
  observedAt: new Date(d.observedAt)
}));
const pipeline = await FileAttachment("data/pipeline.json").json();
const heroImage = FileAttachment("assets/sorcerer-of-truth.png").href;
const relations = [...new Set(records.map((d) => d.relation))].sort();
const topics = [...new Set(records.map((d) => d.topic))].sort();
const hero = html`<section class="hero">
  <img class="hero-art" src=${heroImage} alt="">
  <div class="hero-copy">
    <span class="eyebrow">UAP Pipeline Observatory · security research control plane</span>
    <h1>Sorcerer of Truth</h1>
    <p>Trace a claim from copied guidance to normative authority. Filter the evidence, expose load-bearing differences, and keep the decision attached to its receipts.</p>
  </div>
</section>`;
```

${hero}

```js
const layerInput = Inputs.checkbox(layerDomain, {
  label: "Source layers",
  format: (d) => layerLabels.get(d),
  value: layerDomain
});
const selectedLayers = Generators.input(layerInput);
const evidenceInput = Inputs.checkbox(evidence.map((d) => d.key), {
  label: "Evidence grades",
  format: (d) => evidenceLabels.get(d),
  value: evidence.map((d) => d.key)
});
const selectedEvidence = Generators.input(evidenceInput);
const relationInput = Inputs.select(relations, {
  label: "Relationships",
  multiple: true,
  value: relations
});
const selectedRelations = Generators.input(relationInput);
const topicInput = Inputs.select(topics, {
  label: "Topics",
  multiple: true,
  value: topics
});
const selectedTopics = Generators.input(topicInput);
```

```js
const faceted = records.filter((d) =>
  selectedLayers.includes(d.layer) &&
  selectedEvidence.includes(d.evidence) &&
  selectedRelations.includes(d.relation) &&
  selectedTopics.includes(d.topic)
);
const searchInput = Inputs.search(faceted, {
  label: "Search claims, sources, relationships, and summaries",
  placeholder: "Try OAuth, CORS, IAM, unsafe default…",
  columns: ["id", "title", "source", "summary", "topic", "relation"]
});
const filtered = Generators.input(searchInput);
```

<div class="filter-rack">
  <div>${layerInput}</div>
  <div>${evidenceInput}</div>
  <div>${relationInput}</div>
  <div>${topicInput}</div>
  <div class="filter-search">${searchInput}</div>
</div>

```js
const verified = filtered.filter((d) => d.reviewStatus === "Verified").length;
const driftSignals = filtered.filter((d) => !d.isAligned).length;
const activeTopics = new Set(filtered.map((d) => d.topic)).size;
const latest = filtered.length
  ? filtered.reduce((a, b) => a.observedAt > b.observedAt ? a : b).observedAt.toISOString().slice(0, 7)
  : "—";
```

<div class="metric-grid">
  ${metric(filtered.length, "Visible records", `of ${records.length} total`, "purple")}
  ${metric(verified, "Verified", "A / B evidence", "lime")}
  ${metric(driftSignals, "Drift signals", "non-aligned relationships", "coral")}
  ${metric(activeTopics, "Active topics", `latest ${latest}`, "cream")}
</div>

## Pipeline integrity

<div class="lineage">
  <div class="lineage-step">
    <span class="section-label">01 · Canonical input</span>
    <b>Reviewable CSV</b>
    <code>${pipeline.records} records · ${pipeline.fields} fields</code>
  </div>
  <div class="lineage-step">
    <span class="section-label">02 · Quality gate</span>
    <b>Schema validation</b>
    <code>${(pipeline.completeness * 100).toFixed(0)}% required cells populated</code>
  </div>
  <div class="lineage-step">
    <span class="section-label">03 · Transform</span>
    <b>Typed JSON artifact</b>
    <code>${pipeline.sourceLayers} layers · ${pipeline.topics} topics</code>
  </div>
  <div class="lineage-step">
    <span class="section-label">04 · Publication</span>
    <b>GitHub Pages</b>
    <code>revision ${pipeline.revision.slice(0, 8)}</code>
  </div>
</div>

<p class="fingerprint">Dataset SHA-256 · ${pipeline.sha256}</p>

## Signal map

<div class="card">
  <h3 class="chart-title">Authority layers</h3>
  <p class="chart-note">The path moves from normative sources to copied guidance. Node area shows visible records; labels and tooltips provide exact counts.</p>
  ${resize((width) => sourceSignal(filtered, width))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3 class="chart-title">Evidence matrix</h3>
    <p class="chart-note">Source layer × evidence grade. Bubble area and the printed value both encode record count.</p>
    ${resize((width) => evidenceMatrix(filtered, width))}
  </div>
  <div class="card">
    <h3 class="chart-title">Source drift over time</h3>
    <p class="chart-note">Six-month observation bins, stacked by source layer.</p>
    ${resize((width) => timelinePlot(filtered, width))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3 class="chart-title">Relationship profile</h3>
    <p class="chart-note">The most common ways guidance aligns, omits, diverges, or drifts.</p>
    ${resize((width) => rankedBar(filtered, "relation", width, {limit: 10}))}
  </div>
  <div class="card">
    <h3 class="chart-title">Topic pressure</h3>
    <p class="chart-note">Top security domains represented by the current evidence slice.</p>
    ${resize((width) => rankedBar(filtered, "topic", width, {limit: 12, color: "#b8e62f"}))}
  </div>
</div>

## Investigation queue

```js
const queue = filtered
  .filter((d) => !d.isAligned)
  .sort((a, b) => b.observedAt - a.observedAt)
  .slice(0, 12);
```

```js
Inputs.table(queue, {
  columns: ["id", "observedAt", "layerLabel", "evidence", "topic", "relation", "title"],
  header: {id: "ID", observedAt: "Observed", layerLabel: "Layer", evidence: "Grade", topic: "Topic", relation: "Relationship", title: "Claim"},
  format: {observedAt: (d) => d.toISOString().slice(0, 7)},
  rows: 12,
  sort: "observedAt",
  reverse: true
})
```

<p class="data-note">The charts and queue are reactive: every filter and search updates all views. Use the Evidence Registry for the full sortable record set and selected-record detail.</p>
