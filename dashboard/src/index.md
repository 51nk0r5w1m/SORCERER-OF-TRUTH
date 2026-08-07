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
const hero = html`<div class="grid grid-cols-2">
  <div class="card">
    <p><strong>UAP Pipeline Observatory · security research control plane</strong></p>
    <h1>Sorcerer of Truth</h1>
    <p>Trace a claim from copied guidance to normative authority. Filter the evidence, expose load-bearing differences, and keep the decision attached to its receipts.</p>
  </div>
  <div class="card"><img src=${heroImage} alt="Sorcerer of Truth standing over a luminous data maze"></div>
</div>`;
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

<div class="grid grid-cols-4">
  <div class="card">${layerInput}</div>
  <div class="card">${evidenceInput}</div>
  <div class="card">${relationInput}</div>
  <div class="card">${topicInput}</div>
</div>

<div class="card">${searchInput}</div>

```js
const verified = filtered.filter((d) => d.reviewStatus === "Verified").length;
const driftSignals = filtered.filter((d) => !d.isAligned).length;
const activeTopics = new Set(filtered.map((d) => d.topic)).size;
const latest = filtered.length
  ? filtered.reduce((a, b) => a.observedAt > b.observedAt ? a : b).observedAt.toISOString().slice(0, 7)
  : "—";
```

<div class="grid grid-cols-4">
  ${metric(filtered.length, "Visible records", `of ${records.length} total`)}
  ${metric(verified, "Verified", "A / B evidence")}
  ${metric(driftSignals, "Drift signals", "non-aligned relationships")}
  ${metric(activeTopics, "Active topics", `latest ${latest}`)}
</div>

## Pipeline integrity

<div class="grid grid-cols-4">
  <div class="card">
    <small>01 · Canonical input</small>
    <h3>Reviewable CSV</h3>
    <p><code>${pipeline.records} records · ${pipeline.fields} fields</code></p>
  </div>
  <div class="card">
    <small>02 · Quality gate</small>
    <h3>Schema validation</h3>
    <p><code>${(pipeline.completeness * 100).toFixed(0)}% required cells populated</code></p>
  </div>
  <div class="card">
    <small>03 · Transform</small>
    <h3>Typed JSON artifact</h3>
    <p><code>${pipeline.sourceLayers} layers · ${pipeline.topics} topics</code></p>
  </div>
  <div class="card">
    <small>04 · Publication</small>
    <h3>GitHub Pages</h3>
    <p><code>revision ${pipeline.revision.slice(0, 8)}</code></p>
  </div>
</div>

${html`<p>Dataset SHA-256: <code>${pipeline.sha256}</code></p>`}

## Signal map

<div class="card">
  <h3>Authority layers</h3>
  <p>The path moves from normative sources to copied guidance. Node area shows visible records; labels and tooltips provide exact counts.</p>
  ${resize((width) => sourceSignal(filtered, width))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Evidence matrix</h3>
    <p>Source layer × evidence grade. Bubble area and the printed value both encode record count.</p>
    ${resize((width) => evidenceMatrix(filtered, width))}
  </div>
  <div class="card">
    <h3>Source drift over time</h3>
    <p>Six-month observation bins, stacked by source layer.</p>
    ${resize((width) => timelinePlot(filtered, width))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Relationship profile</h3>
    <p>The most common ways guidance aligns, omits, diverges, or drifts.</p>
    ${resize((width) => rankedBar(filtered, "relation", width, {limit: 10}))}
  </div>
  <div class="card">
    <h3>Topic pressure</h3>
    <p>Top security domains represented by the current evidence slice.</p>
    ${resize((width) => rankedBar(filtered, "topic", width, {limit: 12}))}
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

The charts and queue are reactive: every filter and search updates all views. Use the Evidence Registry for the full sortable record set and selected-record detail.
