---
title: Evidence Registry
toc: false
---

```js
import {
  evidence,
  evidenceLabels,
  layerDomain,
  layerLabels,
  registryTable
} from "./components/source-drift.js";
```

```js
const records = (await FileAttachment("data/records.json").json()).map((d) => ({
  ...d,
  observedAt: new Date(d.observedAt)
}));
const topics = [...new Set(records.map((d) => d.topic))].sort();
const relations = [...new Set(records.map((d) => d.relation))].sort();
```

# Evidence Registry

<p class="lede">A sortable, searchable register of every claim and receipt. Select a row to open its complete record.</p>

```js
const layerInput = Inputs.select(layerDomain, {
  label: "Source layer",
  format: (d) => layerLabels.get(d),
  multiple: true,
  value: layerDomain
});
const selectedLayers = Generators.input(layerInput);
const evidenceInput = Inputs.select(evidence.map((d) => d.key), {
  label: "Evidence grade",
  format: (d) => evidenceLabels.get(d),
  multiple: true,
  value: evidence.map((d) => d.key)
});
const selectedEvidence = Generators.input(evidenceInput);
const topicInput = Inputs.select(topics, {
  label: "Topic",
  multiple: true,
  value: topics
});
const selectedTopics = Generators.input(topicInput);
const relationInput = Inputs.select(relations, {
  label: "Relationship",
  multiple: true,
  value: relations
});
const selectedRelations = Generators.input(relationInput);
```

```js
const faceted = records.filter((d) =>
  selectedLayers.includes(d.layer) &&
  selectedEvidence.includes(d.evidence) &&
  selectedTopics.includes(d.topic) &&
  selectedRelations.includes(d.relation)
);
const searchInput = Inputs.search(faceted, {
  label: "Search registry",
  placeholder: "Search any claim, source, summary, topic, or relationship",
  columns: ["id", "title", "source", "summary", "topic", "relation"]
});
const filtered = Generators.input(searchInput);
```

<div class="filter-rack">
  <div>${layerInput}</div>
  <div>${evidenceInput}</div>
  <div>${topicInput}</div>
  <div>${relationInput}</div>
  <div class="filter-search">${searchInput}</div>
</div>

```js
const registry = registryTable(filtered);
const selected = Generators.input(registry);
const record = selected?.[0];
const csvHref = FileAttachment("data/records.csv").href;
const jsonHref = FileAttachment("data/records.json").href;
const downloads = html`<div class="download-bar">
  <a href=${csvHref} download>Download canonical CSV</a>
  <a href=${jsonHref} download>Download normalized JSON</a>
</div>`;
```

<div class="grid grid-cols-4">
  <div class="card grid-colspan-3">
    <span class="section-label">${filtered.length} / ${records.length} records</span>
    ${registry}
  </div>
  <aside class="detail">
    ${record ? html`
      <span class="section-label">${record.id} · Evidence ${record.evidence}</span>
      <h3>${record.title}</h3>
      <p class="detail-meta">${record.layerLabel} · ${record.topic} · ${record.reviewStatus} · ${record.date}</p>
      <p><strong>${record.relation}</strong></p>
      <p>${record.summary}</p>
      <p class="data-note">Source: ${record.source}<br>Lifecycle: ${record.life}</p>
    ` : html`
      <span class="section-label">Record detail</span>
      <h3>Select a row</h3>
      <p>Selection keeps the claim, source authority, evidence grade, relationship, and summary together.</p>
    `}
  </aside>
</div>

${downloads}
