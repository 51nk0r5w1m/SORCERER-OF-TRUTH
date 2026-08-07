import * as Inputs from "@observablehq/inputs";
import * as Plot from "@observablehq/plot";
import {html} from "htl";

export const layers = [
  {key: "standards", label: "Standards", note: "Normative", rank: 1},
  {key: "architecture", label: "Architecture Guidance", note: "Official architecture", rank: 2},
  {key: "docs", label: "Official Docs", note: "Service behavior", rank: 3},
  {key: "samples", label: "Samples / Reference Impls", note: "Illustrative code", rank: 4},
  {key: "community", label: "Community Trackers", note: "Observed change", rank: 5},
  {key: "seo", label: "Search / Tutorials / AI", note: "Copied guidance", rank: 6}
];

export const evidence = [
  {key: "A", label: "Version-pinned"},
  {key: "B", label: "Current official docs"},
  {key: "C", label: "Reproducible behavior"},
  {key: "D", label: "Third-party observation"},
  {key: "E", label: "Limited evidence"}
];

export const layerDomain = layers.map((d) => d.key);
export const layerLabels = new Map(layers.map((d) => [d.key, d.label]));
export const evidenceLabels = new Map(evidence.map((d) => [d.key, `${d.key} · ${d.label}`]));

export function metric(value, label, detail) {
  return html`<div class="card">
    <h2>${value}</h2>
    <p><strong>${label}</strong><br><small>${detail}</small></p>
  </div>`;
}

export function timelinePlot(records, width) {
  const chartWidth = Math.max(width, 320);
  return Plot.plot({
    width: chartWidth,
    height: 280,
    marginLeft: 44,
    x: {label: null, tickRotate: -35},
    y: {label: "Records", grid: true},
    color: {
      domain: layerDomain,
      legend: true
    },
    marks: [
      Plot.rectY(
        records,
        Plot.binX(
          {y: "count"},
          {x: "observedAt", fill: "layer", interval: "6 months", tip: true}
        )
      ),
      Plot.ruleY([0])
    ]
  });
}

export function evidenceMatrix(records, width) {
  const chartWidth = Math.max(width, 420);
  return Plot.plot({
    width: chartWidth,
    height: 300,
    marginLeft: 150,
    marginBottom: 42,
    x: {
      domain: evidence.map((d) => d.key),
      label: "Evidence grade"
    },
    y: {
      domain: layerDomain,
      label: null,
      tickFormat: (d) => layerLabels.get(d)
    },
    color: {
      domain: layerDomain
    },
    marks: [
      Plot.dot(
        records,
        Plot.group(
          {r: "count"},
          {
            x: "evidence",
            y: "layer",
            fill: "layer",
            stroke: "var(--theme-background)",
            strokeWidth: 1.5,
            tip: true
          }
        )
      ),
      Plot.text(
        records,
        Plot.group(
          {text: "count"},
          {x: "evidence", y: "layer", fill: "var(--theme-background)", fontWeight: 900}
        )
      )
    ]
  });
}

export function rankedBar(records, field, width, {limit = 12} = {}) {
  const chartWidth = Math.max(width, field === "relation" ? 420 : 320);
  return Plot.plot({
    width: chartWidth,
    height: Math.max(260, Math.min(limit, new Set(records.map((d) => d[field])).size) * 28 + 58),
    marginLeft: field === "relation" ? 195 : 110,
    x: {label: "Records", grid: true},
    y: {label: null},
    marks: [
      Plot.barX(
        records,
        Plot.groupY(
          {x: "count"},
          {
            y: field,
            fill: field === "relation" ? field : "currentColor",
            sort: {y: "-x", limit},
            tip: true
          }
        )
      ),
      Plot.textX(
        records,
        Plot.groupY(
          {x: "count", text: "count"},
          {y: field, textAnchor: "start", dx: 6, sort: {y: "-x", limit}}
        )
      ),
      Plot.ruleX([0])
    ]
  });
}

export function sourceSignal(records, width) {
  const chartWidth = Math.max(width, 420);
  const nodes = layers.map((layer, index) => ({
    ...layer,
    x: 14 + index * 14.4,
    y: index % 2 ? 62 : 38,
    count: records.filter((d) => d.layer === layer.key).length,
    drift: records.filter((d) => d.layer === layer.key && !d.isAligned).length
  }));
  const lines = nodes.slice(0, -1).map((node, index) => ({
    x1: node.x,
    y1: node.y,
    x2: nodes[index + 1].x,
    y2: nodes[index + 1].y
  }));

  return Plot.plot({
    width: chartWidth,
    height: 230,
    axis: null,
    x: {domain: [0, 100]},
    y: {domain: [0, 100]},
    marks: [
      Plot.link(lines, {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: "currentColor", strokeOpacity: 0.35}),
      Plot.dot(nodes, {x: "x", y: "y", r: (d) => 8 + Math.sqrt(d.count) * 2.6, fill: "key", stroke: "var(--theme-background)", tip: true, title: (d) => `${d.label}\n${d.count} records · ${d.drift} drift signals`}),
      Plot.text(nodes, {x: "x", y: "y", text: "count", fill: "var(--theme-background)", fontWeight: 900}),
      Plot.text(nodes, {x: "x", y: "y", text: "label", dy: 36})
    ]
  });
}

export function registryTable(records) {
  return Inputs.table(records, {
    columns: ["id", "observedAt", "layerLabel", "evidence", "reviewStatus", "topic", "relation", "title", "source"],
    header: {
      id: "ID",
      observedAt: "Observed",
      layerLabel: "Source layer",
      evidence: "Grade",
      reviewStatus: "Review",
      topic: "Topic",
      relation: "Relationship",
      title: "Claim",
      source: "Source"
    },
    format: {
      observedAt: (d) => d.toISOString().slice(0, 7)
    },
    width: {
      id: 55,
      observedAt: 90,
      layerLabel: 155,
      evidence: 55,
      reviewStatus: 95,
      topic: 90,
      relation: 190,
      title: 360,
      source: 220
    },
    rows: 22,
    multiple: false,
    select: true
  });
}
