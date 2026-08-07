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
import {observatoryIcon} from "./components/observatory-icons.js";
```

```js
const records = (await FileAttachment("data/records.json").json()).map((d) => ({
  ...d,
  observedAt: new Date(d.observedAt)
}));
const topics = [...new Set(records.map((d) => d.topic))].sort();
const relations = [...new Set(records.map((d) => d.relation))].sort();
```

# ${observatoryIcon("alien")} Evidence Registry

A sortable, searchable register of every claim and receipt. Select a row to open its complete record.

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

<div class="grid grid-cols-4">
  <div class="card">${layerInput}</div>
  <div class="card">${evidenceInput}</div>
  <div class="card">${topicInput}</div>
  <div class="card">${relationInput}</div>
</div>

<div class="card">${searchInput}</div>

```js
const registry = registryTable(filtered);
const selected = Generators.input(registry);
const record = selected?.[0];
const csvHref = FileAttachment("data/records.csv").href;
const jsonHref = FileAttachment("data/records.json").href;
const downloads = html`<p>
  <a href=${csvHref} download>Download canonical CSV</a>
  ·
  <a href=${jsonHref} download>Download normalized JSON</a>
</p>`;
```

<div class="grid grid-cols-4">
  <div class="card grid-colspan-3">
    <p><strong>${filtered.length} / ${records.length} records</strong></p>
    ${registry}
  </div>
  <aside class="card">
    ${record ? html`
      <small>${record.id} · Evidence ${record.evidence}</small>
      <h3>${record.title}</h3>
      <p>${record.layerLabel} · ${record.topic} · ${record.reviewStatus} · ${record.date}</p>
      <p><strong>${record.relation}</strong></p>
      <p>${record.summary}</p>
      <p>Source: ${record.source}<br>Lifecycle: ${record.life}</p>
    ` : html`
      <small>Record detail</small>
      <h3>Select a row</h3>
      <p>Selection keeps the claim, source authority, evidence grade, relationship, and summary together.</p>
    `}
  </aside>
</div>

${downloads}
