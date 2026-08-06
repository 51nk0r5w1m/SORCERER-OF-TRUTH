import * as Inputs from "@observablehq/inputs";
import * as Plot from "@observablehq/plot";
import {html} from "htl";

export const layers = [
  {key: "standards", label: "Standards", note: "Normative", color: "#34d7e8", rank: 1},
  {key: "architecture", label: "Architecture Guidance", note: "Official architecture", color: "#8b8cf8", rank: 2},
  {key: "docs", label: "Official Docs", note: "Service behavior", color: "#bf83ff", rank: 3},
  {key: "samples", label: "Samples / Reference Impls", note: "Illustrative code", color: "#ff9d55", rank: 4},
  {key: "community", label: "Community Trackers", note: "Observed change", color: "#ffd166", rank: 5},
  {key: "seo", label: "Search / Tutorials / AI", note: "Copied guidance", color: "#ff716b", rank: 6}
];

export const evidence = [
  {key: "A", label: "Version-pinned", color: "#b8e62f"},
  {key: "B", label: "Current official docs", color: "#55d6be"},
  {key: "C", label: "Reproducible behavior", color: "#ffd166"},
  {key: "D", label: "Third-party observation", color: "#ff9d55"},
  {key: "E", label: "Limited evidence", color: "#ff716b"}
];

export const relationColors = new Map([
  ["Normative Conflict", "#ff5d5d"],
  ["Unsafe Default", "#ff8a3d"],
  ["Console/API/IaC Divergence", "#f2cc4d"],
  ["Editorial Omission", "#a9b3c1"],
  ["Legacy Compatibility Exposure", "#d5a62a"],
  ["Guidance Drift", "#8b8cf8"],
  ["Sample-Code Defect", "#ff9d55"],
  ["Doc/Product Mismatch", "#bf83ff"],
  ["Ecosystem Observation", "#7e8796"],
  ["Current Alignment", "#55d67b"]
]);

export const layerDomain = layers.map((d) => d.key);
export const layerLabels = new Map(layers.map((d) => [d.key, d.label]));
export const layerColors = new Map(layers.map((d) => [d.key, d.color]));
export const evidenceLabels = new Map(evidence.map((d) => [d.key, `${d.key} · ${d.label}`]));

export function metric(value, label, detail, tone = "cream") {
  return html`<article class=${`metric metric-${tone}`}>
    <span>${label}</span>
    <strong>${value}</strong>
    <small>${detail}</small>
  </article>`;
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
      range: layers.map((d) => d.color),
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
      domain: layerDomain,
      range: layers.map((d) => d.color)
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
            stroke: "#07070b",
            strokeWidth: 1.5,
            tip: true
          }
        )
      ),
      Plot.text(
        records,
        Plot.group(
          {text: "count"},
          {x: "evidence", y: "layer", fill: "#07070b", fontWeight: 900}
        )
      )
    ]
  });
}

export function rankedBar(records, field, width, {limit = 12, color = "#8b8cf8"} = {}) {
  const chartWidth = Math.max(width, field === "relation" ? 420 : 320);
  return Plot.plot({
    width: chartWidth,
    height: Math.max(260, Math.min(limit, new Set(records.map((d) => d[field])).size) * 28 + 58),
    marginLeft: field === "relation" ? 195 : 110,
    x: {label: "Records", grid: true},
    y: {label: null},
    color: field === "relation"
      ? {
          domain: [...relationColors.keys()],
          range: [...relationColors.values()]
        }
      : undefined,
    marks: [
      Plot.barX(
        records,
        Plot.groupY(
          {x: "count"},
          {
            y: field,
            fill: field === "relation" ? field : color,
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
      Plot.link(lines, {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: "#6a35e8", strokeWidth: 2}),
      Plot.dot(nodes, {x: "x", y: "y", r: (d) => 8 + Math.sqrt(d.count) * 2.6, fill: "color", stroke: "#f2ead8", strokeWidth: 1.5, tip: true, title: (d) => `${d.label}\n${d.count} records · ${d.drift} drift signals`}),
      Plot.text(nodes, {x: "x", y: "y", text: "count", fill: "#07070b", fontWeight: 900}),
      Plot.text(nodes, {x: "x", y: "y", text: "label", dy: 36, fill: "#f2ead8", fontSize: 10})
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
