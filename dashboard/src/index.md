---
title: Source Drift Control Plane
toc: false
---

```js
import {
  aggregateCategories,
  brushTimelinePlot,
  corpusDiagnostics,
  cumulativeCoverage,
  evidence,
  evidenceLabels,
  evidenceMatrix,
  evidenceRelationshipHeatmap,
  groupedTimelinePlot,
  hierarchyPlot,
  layerDomain,
  layerLabels,
  layers,
  metric,
  monthMatrix,
  rankedBar,
  recordStrip,
  relationshipMatrix,
  sourceSignal,
  sourceTopicHeatmap,
  topicRelationshipHeatmap,
} from "./components/source-drift.js";
import {observatoryIcon, pixelIcon} from "./components/observatory-icons.js";
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
const dateExtent = d3.extent(records, (d) => d.observedAt);
const chartFilterState = Mutable(null);
const setChartFilter = (next) => chartFilterState.value = next;
const hero = html`<div class="grid grid-cols-2">
  <div class="card">
    <p><strong>Sorcerer of Truth // UAP engineer · pipeline chemist · RFC philosopher</strong></p>
    <h1>${observatoryIcon("ufo")} UAP Pipeline Observatory</h1>
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
const fromInput = Inputs.date({label: "Observed from", value: dateExtent[0]});
const fromDate = Generators.input(fromInput);
const toInput = Inputs.date({label: "Observed through", value: dateExtent[1]});
const toDate = Generators.input(toInput);
const queryInput = Inputs.text({
  label: "Search claims, sources, relationships, and summaries",
  placeholder: "Try OAuth, CORS, IAM, unsafe default…"
});
const query = Generators.input(queryInput);
const setDateRange = ([start, end]) => {
  const ordered = start <= end ? [start, end] : [end, start];
  fromInput.value = d3.max([dateExtent[0], ordered[0]]);
  toInput.value = d3.min([dateExtent[1], ordered[1]]);
  fromInput.dispatchEvent(new Event("input", {bubbles: true}));
  toInput.dispatchEvent(new Event("input", {bubbles: true}));
};
const resetInput = Inputs.button("Reset investigation", {
  reduce: () => {
    layerInput.value = layerDomain;
    evidenceInput.value = evidence.map((d) => d.key);
    relationInput.value = relations;
    topicInput.value = topics;
    fromInput.value = dateExtent[0];
    toInput.value = dateExtent[1];
    queryInput.value = "";
    for (const input of [layerInput, evidenceInput, relationInput, topicInput, fromInput, toInput, queryInput]) {
      input.dispatchEvent(new Event("input", {bubbles: true}));
    }
    setChartFilter(null);
    return null;
  }
});
```

```js
const requestedFrom = fromDate == null ? dateExtent[0] : new Date(fromDate);
const requestedTo = toDate == null ? dateExtent[1] : new Date(toDate);
const rangeStart = d3.max([dateExtent[0], d3.min([requestedFrom, requestedTo])]);
const rangeEnd = d3.min([dateExtent[1], d3.max([requestedFrom, requestedTo])]);
```

```js
const faceted = records.filter((d) =>
  selectedLayers.includes(d.layer) &&
  selectedEvidence.includes(d.evidence) &&
  selectedRelations.includes(d.relation) &&
  selectedTopics.includes(d.topic) &&
  d.observedAt >= rangeStart &&
  d.observedAt < d3.utcDay.offset(rangeEnd, 1)
);
```

```js
const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
const filtered = faceted.filter((d) => {
  const text = [d.id, d.title, d.source, d.summary, d.topic, d.relation].join(" ").toLowerCase();
  return terms.every((term) => text.includes(term));
});
```

```js
const visible = filtered.filter((d) =>
  chartFilterState == null ||
  d[chartFilterState.field] === chartFilterState.key
);
```

<div class="grid grid-cols-4">
  <div class="card">${layerInput}</div>
  <div class="card">${evidenceInput}</div>
  <div class="card">${relationInput}</div>
  <div class="card">${topicInput}</div>
</div>

<div class="grid grid-cols-4">
  <div class="card grid-colspan-2">${queryInput}</div>
  <div class="card">${fromInput}</div>
  <div class="card">${toInput}</div>
</div>

<div class="card">
  ${resetInput}
  ${chartFilterState
    ? html`<p role="status" aria-live="polite"><strong>Chart filter:</strong> ${chartFilterState.label} = ${chartFilterState.key}</p>`
    : html`<p role="status" aria-live="polite" class="muted">No chart mark is filtering the investigation.</p>`}
</div>

```js
const verified = visible.filter((d) => d.reviewStatus === "Verified").length;
const driftSignals = visible.filter((d) => !d.isAligned).length;
const activeTopics = new Set(visible.map((d) => d.topic)).size;
const latest = visible.length
  ? visible.reduce((a, b) => a.observedAt > b.observedAt ? a : b).observedAt.toISOString().slice(0, 7)
  : "—";
const diagnostics = corpusDiagnostics(visible);
```

<div class="grid grid-cols-4">
  ${metric(visible.length, html`${pixelIcon("database")} Visible records`, `of ${records.length} total`)}
  ${metric(verified, html`${pixelIcon("zap")} Verified`, "A / B evidence")}
  ${metric(driftSignals, html`${pixelIcon("radio")} Drift signals`, "non-aligned relationships")}
  ${metric(activeTopics, html`${pixelIcon("alien")} Active topics`, `latest ${latest}`)}
</div>

## ${observatoryIcon("alien")} Weird but honest cyberstats

These are descriptive corpus diagnostics, not threat scores. They summarize the current filtered evidence slice and make concentration, diversity, age, and review coverage inspectable.

<div class="grid grid-cols-3">
  ${metric(d3.format(".0%")(diagnostics.verifiedShare), html`${pixelIcon("zap")} Receipt coverage`, "share graded A or B")}
  ${metric(d3.format(".0%")(diagnostics.driftShare), html`${pixelIcon("radio")} Drift rate`, "share not currently aligned")}
  ${metric(diagnostics.effectiveSources.toFixed(1), html`${pixelIcon("database")} Effective sources`, "exp(Shannon entropy)")}
  ${metric(`${diagnostics.relationshipEntropy.toFixed(2)} bits`, html`${pixelIcon("analytics")} Relation entropy`, "diversity of relationship labels")}
  ${metric(diagnostics.topicHhi.toFixed(3), html`${pixelIcon("chart")} Topic HHI`, "1 = concentrated · lower = diffuse")}
  ${metric(`${diagnostics.medianAgeMonths} mo`, html`${pixelIcon("alien")} Median corpus lag`, "relative to latest visible observation")}
</div>

## ${observatoryIcon("radar")} Composition explorer

```js
const groupFieldInput = Inputs.select(
  ["topic", "relation", "source", "layerLabel", "reviewStatus", "evidence"],
  {
    label: "Group bars by",
    value: "topic",
    format: (d) => ({topic: "Topic", relation: "Relationship", source: "Source", layerLabel: "Source layer", reviewStatus: "Review status", evidence: "Evidence grade"})[d]
  }
);
const groupField = Generators.input(groupFieldInput);
const rankSortInput = Inputs.select(
  ["count", "latest", "alphabetical"],
  {
    label: "Sort bars by",
    value: "count",
    format: (d) => ({count: "Record count", latest: "Latest observation", alphabetical: "Alphabetical"})[d]
  }
);
const rankSort = Generators.input(rankSortInput);
```

```js
const topNInput = Inputs.range([5, records.length], {
  label: "Top categories",
  step: 1,
  value: 12
});
const topN = Generators.input(topNInput);
```

```js
const categoryOptions = ["All records", ...aggregateCategories(filtered, groupField, "count", records.length).map((d) => d.key)];
const categoryInput = Inputs.select(categoryOptions, {
  label: "Filter by focused category",
  value: chartFilterState?.field === groupField ? chartFilterState.key : "All records"
});
categoryInput.addEventListener("input", () => {
  setChartFilter(categoryInput.value === "All records"
    ? null
    : {field: groupField, key: categoryInput.value, label: groupFieldInput.querySelector("option:checked")?.textContent ?? groupField});
});
```

```js
const compositionChart = rankedBar(filtered, groupField, Math.min(1200, Math.max(420, innerWidth - 360)), {
  limit: topN,
  sort: rankSort,
  selected: chartFilterState?.field === groupField ? chartFilterState.key : null
});
compositionChart.addEventListener("click", () => {
  const row = compositionChart.value;
  if (!row?.key) return;
  categoryInput.value =
    chartFilterState?.field === groupField && chartFilterState?.key === row.key
      ? "All records"
      : row.key;
  categoryInput.dispatchEvent(new Event("input", {bubbles: true}));
});
```

<div class="grid grid-cols-4">
  <div class="card">${groupFieldInput}</div>
  <div class="card">${rankSortInput}</div>
  <div class="card">${topNInput}</div>
  <div class="card">${categoryInput}</div>
</div>

<div class="card">
  <h3>${groupFieldInput.querySelector("option:checked")?.textContent ?? groupField} composition</h3>
  ${compositionChart}
</div>

## ${observatoryIcon("observatory")} Pipeline integrity

<div class="grid grid-cols-4">
  <div class="card">
    <small>${pixelIcon("database")} 01 · Canonical input</small>
    <h3>Reviewable CSV</h3>
    <p><code>${pipeline.records} records · ${pipeline.fields} fields</code></p>
  </div>
  <div class="card">
    <small>${pixelIcon("zap")} 02 · Quality gate</small>
    <h3>Schema validation</h3>
    <p><code>${(pipeline.completeness * 100).toFixed(0)}% required cells populated</code></p>
  </div>
  <div class="card">
    <small>${pixelIcon("analytics")} 03 · Transform</small>
    <h3>Typed JSON artifact</h3>
    <p><code>${pipeline.sourceLayers} layers · ${pipeline.topics} topics</code></p>
  </div>
  <div class="card">
    <small>${pixelIcon("radio")} 04 · Publication</small>
    <h3>GitHub Pages</h3>
    <p><code>revision ${pipeline.revision.slice(0, 8)}</code></p>
  </div>
</div>

${html`<p>Dataset SHA-256: <code>${pipeline.sha256}</code></p>`}

## ${observatoryIcon("telescope")} Authority observatory

<div class="card">
  <h3>Authority layers</h3>
  <p>The path moves from normative sources to copied guidance. Node area shows visible records; labels and tooltips provide exact counts.</p>
  ${resize((width) => sourceSignal(visible, width))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Evidence matrix</h3>
    <p>Source layer × evidence grade. Bubble area and the printed value both encode record count.</p>
    ${resize((width) => evidenceMatrix(visible, width))}
  </div>
  <div class="card">
    <h3>Source drift over time</h3>
    <p>Six-month observation bins, grouped by ${timelineGroupInput.querySelector("option:checked")?.textContent?.toLowerCase() ?? timelineGroup}.</p>
    ${resize((width) => groupedTimelinePlot(visible, width, timelineGroup))}
  </div>
</div>

```js
const timelineGroupInput = Inputs.select(
  ["layer", "evidence", "relation"],
  {
    label: "Group timeline by",
    value: "layer",
    format: (d) => ({layer: "Source layer", evidence: "Evidence grade", relation: "Relationship"})[d]
  }
);
const timelineGroup = Generators.input(timelineGroupInput);
```

<div class="card">${timelineGroupInput}</div>

<div class="card">
  <h3>Observation range selector</h3>
  <p>Click or drag to update the global date controls and every linked view.</p>
  ${resize((width) => brushTimelinePlot(records, width, [new Date(fromDate), new Date(toDate)], setDateRange))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>Relationship profile</h3>
    <p>The most common ways guidance aligns, omits, diverges, or drifts.</p>
    ${resize((width) => rankedBar(visible, "relation", width, {limit: 10}))}
  </div>
  <div class="card">
    <h3>Topic pressure</h3>
    <p>Top security domains represented by the current evidence slice.</p>
    ${resize((width) => rankedBar(visible, "topic", width, {limit: 12}))}
  </div>
</div>

## ${observatoryIcon("radar")} Heatmap laboratory

```js
const heatmapModeInput = Inputs.radio(["residual", "count", "share"], {
  label: "Topic × relationship encoding",
  value: "residual",
  format: (d) => ({residual: "Pearson residual", count: "Record count", share: "Within-topic share"})[d]
});
const heatmapMode = Generators.input(heatmapModeInput);
```

<div class="card">${heatmapModeInput}</div>

<div class="card">
  <h3>${pixelIcon("analytics")} Topic × relationship collision field</h3>
  <p>Residual mode compares observed cells with independence-model expectations. Positive values are overrepresented and negative values are underrepresented; this is exploratory association, not a significance test.</p>
  ${resize((width) => topicRelationshipHeatmap(visible, width, heatmapMode))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>${pixelIcon("radio")} Layer × relationship heatmap</h3>
    <p>Shows where each form of drift is concentrated across the authority hierarchy.</p>
    ${resize((width) => relationshipMatrix(visible, width))}
  </div>
  <div class="card">
    <h3>${pixelIcon("chart")} Observation calendar heatmap</h3>
    <p>Month-level corpus coverage. Dates represent source observations, not UAP event occurrence.</p>
    ${resize((width) => monthMatrix(visible, width))}
  </div>

  <div class="grid grid-cols-2">
    <div class="card">
      <h3>${pixelIcon("zap")} Evidence × relationship heatmap</h3>
      <p>Where each relationship classification sits across the A–E evidence ladder.</p>
      ${resize((width) => evidenceRelationshipHeatmap(visible, width))}
    </div>
    <div class="card">
      <h3>${pixelIcon("database")} Source × topic heatmap</h3>
      <p>The 14 most represented sources against their 16 most represented topics.</p>
      ${resize((width) => sourceTopicHeatmap(visible, width))}
    </div>
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>${pixelIcon("radio")} Record strip</h3>
    <p>Every visible record positioned by observation date and authority layer; symbol and color redundantly encode evidence grade.</p>
    ${resize((width) => recordStrip(visible, width))}
  </div>
  <div class="card">
    <h3>${pixelIcon("analytics")} Cumulative coverage</h3>
    <p>How the retained evidence corpus accumulated over time.</p>
    ${resize((width) => cumulativeCoverage(visible, width, cumulativeGroup))}
  </div>
</div>

```js
const cumulativeGroupInput = Inputs.select(
  ["layer", "evidence", "reviewStatus"],
  {
    label: "Group cumulative coverage by",
    value: "layer",
    format: (d) => ({layer: "Source layer", evidence: "Evidence grade", reviewStatus: "Review status"})[d]
  }
);
const cumulativeGroup = Generators.input(cumulativeGroupInput);
```

<div class="card">${cumulativeGroupInput}</div>

<div class="card">
  <h3>Authority → topic hierarchy</h3>
  <p>This is a classification tree derived from explicit source-layer and topic fields—not an inferred relationship network.</p>
  ${resize((width) => hierarchyPlot(visible, width))}
</div>

## Investigation queue

```js
const queue = visible
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
