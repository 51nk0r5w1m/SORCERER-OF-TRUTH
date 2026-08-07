import * as Inputs from "@observablehq/inputs";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
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

function emptyPlot(width, height = 240) {
  return Plot.plot({
    width: Math.max(width, 320),
    height,
    axis: null,
    marks: [Plot.text(["No records match the active investigation."], {frameAnchor: "middle"})]
  });
}

export function metric(value, label, detail) {
  return html`<div class="card">
    <h2>${value}</h2>
    <p><strong>${label}</strong><br><small>${detail}</small></p>
  </div>`;
}

function entropy(values) {
  if (!values.length) return 0;
  return -d3.sum(
    d3.rollups(values, (group) => group.length / values.length, (d) => d).map(([, probability]) =>
      probability * Math.log2(probability)
    )
  );
}

export function corpusDiagnostics(records) {
  if (!records.length) {
    return {
      verifiedShare: 0,
      driftShare: 0,
      effectiveSources: 0,
      relationshipEntropy: 0,
      topicHhi: 0,
      medianAgeMonths: 0
    };
  }
  const latest = d3.max(records, (d) => d.observedAt);
  const topicShares = d3.rollups(records, (group) => group.length / records.length, (d) => d.topic);
  return {
    verifiedShare: d3.mean(records, (d) => d.reviewStatus === "Verified"),
    driftShare: d3.mean(records, (d) => !d.isAligned),
    effectiveSources: Math.exp(entropy(records.map((d) => d.source)) * Math.LN2),
    relationshipEntropy: entropy(records.map((d) => d.relation)),
    topicHhi: d3.sum(topicShares, ([, share]) => share ** 2),
    medianAgeMonths: d3.median(records, (d) => d3.utcMonth.count(d.observedAt, latest))
  };
}

export function topicRelationshipHeatmap(records, width, mode = "residual") {
  if (!records.length) return emptyPlot(width, 470);
  const topTopics = d3.rollups(records, (group) => group.length, (d) => d.topic)
    .sort((a, b) => d3.descending(a[1], b[1]) || d3.ascending(a[0], b[0]))
    .slice(0, 18)
    .map(([topic]) => topic);
  const relations = [...new Set(records.map((d) => d.relation))].sort();
  const counts = d3.rollup(records, (group) => group.length, (d) => d.topic, (d) => d.relation);
  const rowTotals = d3.rollup(records, (group) => group.length, (d) => d.topic);
  const columnTotals = d3.rollup(records, (group) => group.length, (d) => d.relation);
  const rows = d3.cross(topTopics, relations, (topic, relation) => {
    const count = counts.get(topic)?.get(relation) ?? 0;
    const expected = (rowTotals.get(topic) * columnTotals.get(relation)) / records.length;
    const share = count / rowTotals.get(topic);
    const residual = expected ? (count - expected) / Math.sqrt(expected) : 0;
    return {
      topic,
      relation,
      count,
      expected,
      share,
      residual,
      value: mode === "count" ? count : mode === "share" ? share : residual
    };
  });
  const label = mode === "count" ? "Records" : mode === "share" ? "Within-topic share" : "Pearson residual";
  const maxResidual = d3.max(rows, (d) => Math.abs(d.residual)) || 1;
  return Plot.plot({
    width: Math.max(width, 760),
    height: 500,
    marginLeft: 195,
    marginBottom: 88,
    x: {domain: topTopics, label: "Topic", tickRotate: -45},
    y: {domain: relations, label: null},
    color: mode === "residual"
      ? {type: "diverging", domain: [-maxResidual, maxResidual], pivot: 0, scheme: "rdbu", legend: true, label}
      : {scheme: mode === "share" ? "purples" : "blues", legend: true, label},
    marks: [
      Plot.cell(rows, {
        x: "topic",
        y: "relation",
        fill: "value",
        inset: 1,
        tip: true,
        title: (d) => `${d.topic} × ${d.relation}\n${d.count} records\n${d3.format(".0%")(d.share)} of topic\nExpected ${d.expected.toFixed(2)}\nResidual ${d.residual.toFixed(2)}`
      }),
      Plot.text(rows, {
        x: "topic",
        y: "relation",
        text: (d) => mode === "count" ? d.count || "" : mode === "share" ? d3.format(".0%")(d.share) : d.residual ? d.residual.toFixed(1) : "",
        fill: "var(--theme-foreground)",
        fontSize: 9
      })
    ]
  });
}

export function evidenceRelationshipHeatmap(records, width) {
  if (!records.length) return emptyPlot(width, 390);
  return Plot.plot({
    width: Math.max(width, 540),
    height: 390,
    marginLeft: 195,
    x: {domain: evidence.map((d) => d.key), label: "Evidence grade"},
    y: {label: null},
    color: {scheme: "oranges", legend: true, label: "Records"},
    marks: [
      Plot.cell(records, Plot.group({fill: "count"}, {x: "evidence", y: "relation", inset: 1, tip: true})),
      Plot.text(records, Plot.group({text: "count"}, {x: "evidence", y: "relation", fill: "var(--theme-foreground)"}))
    ]
  });
}

export function sourceTopicHeatmap(records, width) {
  if (!records.length) return emptyPlot(width, 480);
  const sources = d3.rollups(records, (group) => group.length, (d) => d.source)
    .sort((a, b) => d3.descending(a[1], b[1]))
    .slice(0, 14)
    .map(([source]) => source);
  const topics = d3.rollups(records.filter((d) => sources.includes(d.source)), (group) => group.length, (d) => d.topic)
    .sort((a, b) => d3.descending(a[1], b[1]))
    .slice(0, 16)
    .map(([topic]) => topic);
  const rows = records.filter((d) => sources.includes(d.source) && topics.includes(d.topic));
  return Plot.plot({
    width: Math.max(width, 760),
    height: 500,
    marginLeft: 210,
    marginBottom: 82,
    x: {domain: topics, label: "Topic", tickRotate: -45},
    y: {domain: sources, label: null},
    color: {scheme: "greens", legend: true, label: "Records"},
    marks: [
      Plot.cell(rows, Plot.group({fill: "count"}, {x: "topic", y: "source", inset: 1, tip: true})),
      Plot.text(rows, Plot.group({text: "count"}, {x: "topic", y: "source", fill: "var(--theme-foreground)", fontSize: 9}))
    ]
  });
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

export function groupedTimelinePlot(records, width, group = "layer") {
  if (!records.length) return emptyPlot(width, 300);
  const chartWidth = Math.max(width, 420);
  return Plot.plot({
    width: chartWidth,
    height: 300,
    marginLeft: 46,
    x: {label: "Observation month"},
    y: {label: "Records", grid: true},
    color: {legend: true},
    marks: [
      Plot.ruleY([0]),
      Plot.rectY(
        records,
        Plot.binX(
          {y: "count"},
          {x: "observedAt", fill: group, interval: "6 months", tip: true}
        )
      )
    ]
  });
}

export function brushTimelinePlot(records, width, startEnd, setStartEnd) {
  if (!records.length) return emptyPlot(width, 220);
  const chartWidth = Math.max(width, 420);
  const extent = d3.extent(records, (d) => d.observedAt);
  return Plot.plot({
    width: chartWidth,
    height: 220,
    marginLeft: 46,
    x: {label: "Click or drag to select an observation range"},
    y: {label: "Records", grid: true},
    marks: [
      Plot.ruleY([0]),
      Plot.rectY(records, Plot.binX({y: "count"}, {x: "observedAt", interval: "3 months", tip: true})),
      (index, scales, channels, dimensions, context) => {
        const x1 = dimensions.marginLeft;
        const x2 = dimensions.width - dimensions.marginRight;
        const y1 = 0;
        const y2 = dimensions.height;
        const brushed = (event) => {
          if (!event.sourceEvent) return;
          let {selection} = event;
          if (!selection) {
            const radius = 10;
            let [px] = d3.pointer(event, context.ownerSVGElement);
            px = Math.max(x1 + radius, Math.min(x2 - radius, px));
            selection = [px - radius, px + radius];
            group.call(brush.move, selection);
          }
          const selected = selection.map(scales.x.invert);
          setStartEnd([
            d3.max([extent[0], selected[0]]),
            d3.min([extent[1], selected[1]])
          ]);
        };
        const brush = d3.brushX()
          .extent([[x1, y1], [x2, y2]])
          .on("end", brushed);
        const group = d3.create("svg:g").call(brush);
        const range = startEnd?.every((d) => d instanceof Date) ? startEnd : extent;
        if (range.every(Boolean)) group.call(brush.move, range.map(scales.x));
        return group.node();
      }
    ]
  });
}

export function evidenceMatrix(records, width) {
  if (!records.length) return emptyPlot(width, 300);
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

export function aggregateCategories(records, field, sort = "count", limit = 12) {
  const rows = d3.rollups(
    records,
    (values) => ({
      count: values.length,
      latest: d3.max(values, (d) => d.observedAt)
    }),
    (d) => d[field]
  ).map(([key, value]) => ({key, ...value}));

  rows.sort(sort === "alphabetical"
    ? (a, b) => d3.ascending(a.key, b.key)
    : sort === "latest"
    ? (a, b) => d3.descending(a.latest, b.latest)
    : (a, b) => d3.descending(a.count, b.count) || d3.ascending(a.key, b.key));
  return rows.slice(0, limit);
}

export function rankedBar(records, field, width, {limit = 12, sort = "count", selected = null} = {}) {
  if (!records.length) return emptyPlot(width);
  const chartWidth = Math.max(width, field === "relation" ? 420 : 320);
  const rows = aggregateCategories(records, field, sort, limit);
  return Plot.plot({
    width: chartWidth,
    height: Math.max(260, rows.length * 28 + 58),
    marginLeft: field === "relation" ? 195 : 110,
    x: {label: "Records", grid: true},
    y: {label: null, domain: rows.map((d) => d.key)},
    marks: [
      Plot.barX(rows, {
        x: "count",
        y: "key",
        fill: field === "relation" ? "key" : "currentColor",
        opacity: (d) => selected == null || selected === d.key ? 1 : 0.25,
        tip: true,
        title: (d) => `${d.key}\n${d.count} records\nLatest ${d.latest?.toISOString().slice(0, 7)}`
      }),
      Plot.textX(rows, {x: "count", y: "key", text: "count", textAnchor: "start", dx: 6}),
      Plot.ruleX([0])
    ]
  });
}

export function relationshipMatrix(records, width) {
  if (!records.length) return emptyPlot(width, 380);
  return Plot.plot({
    width: Math.max(width, 520),
    height: 380,
    marginLeft: 195,
    x: {label: "Source layer", tickFormat: (d) => layerLabels.get(d)},
    y: {label: null},
    color: {scheme: "blues", legend: true, label: "Records"},
    marks: [
      Plot.cell(
        records,
        Plot.group(
          {fill: "count"},
          {x: "layer", y: "relation", inset: 1, tip: true}
        )
      ),
      Plot.text(
        records,
        Plot.group(
          {text: "count"},
          {x: "layer", y: "relation", fill: "var(--theme-foreground)"}
        )
      )
    ]
  });
}

export function monthMatrix(records, width) {
  if (!records.length) return emptyPlot(width, 250);
  const months = d3.utcMonth.range(
    d3.utcMonth.floor(d3.min(records, (d) => d.observedAt)),
    d3.utcMonth.offset(d3.utcMonth.ceil(d3.max(records, (d) => d.observedAt)), 1)
  );
  const counts = d3.rollup(records, (values) => values.length, (d) => +d3.utcMonth(d.observedAt));
  const rows = months.map((date) => ({
    date,
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    count: counts.get(+date) ?? 0
  }));
  return Plot.plot({
    width: Math.max(width, 420),
    height: 250,
    marginLeft: 46,
    x: {domain: d3.range(12), tickFormat: (d) => d3.utcFormat("%b")(new Date(Date.UTC(2000, d, 1))), label: null},
    y: {label: null},
    color: {scheme: "blues", legend: true, label: "Records"},
    marks: [
      Plot.cell(rows, {x: "month", y: "year", fill: "count", inset: 1, tip: true, title: (d) => `${d3.utcFormat("%B %Y")(d.date)}\n${d.count} records`}),
      Plot.text(rows, {x: "month", y: "year", text: (d) => d.count || "", fill: "var(--theme-foreground)"})
    ]
  });
}

export function recordStrip(records, width) {
  if (!records.length) return emptyPlot(width, 280);
  return Plot.plot({
    width: Math.max(width, 420),
    height: 280,
    marginLeft: 150,
    x: {label: "Observation date"},
    y: {domain: layerDomain, tickFormat: (d) => layerLabels.get(d), label: null},
    color: {legend: true},
    marks: [
      Plot.ruleX(records, {x: "observedAt", y1: "layer", y2: "layer", strokeOpacity: 0.2}),
      Plot.dot(records, {
        x: "observedAt",
        y: "layer",
        fill: "evidence",
        symbol: "evidence",
        r: 5,
        tip: true,
        title: (d) => `${d.id} · ${d.title}\n${d.source}\nEvidence ${d.evidence}`
      })
    ]
  });
}

export function cumulativeCoverage(records, width, group = "layer") {
  if (!records.length) return emptyPlot(width, 300);
  const groups = d3.group(records, (d) => d[group]);
  const rows = [];
  for (const [key, values] of groups) {
    values.sort((a, b) => d3.ascending(a.observedAt, b.observedAt));
    values.forEach((record, index) => rows.push({key, date: record.observedAt, count: index + 1}));
  }
  return Plot.plot({
    width: Math.max(width, 420),
    height: 300,
    x: {label: "Observation date"},
    y: {label: "Cumulative records", grid: true},
    color: {legend: true},
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(rows, {x: "date", y: "count", stroke: "key", tip: "x"})
    ]
  });
}

export function hierarchyPlot(records, width) {
  if (!records.length) return emptyPlot(width, 300);
  const rows = d3.rollups(
    records,
    (values) => values.length,
    (d) => d.layerLabel,
    (d) => d.topic
  ).flatMap(([layer, topics]) => topics.map(([topic, count]) => ({
    path: `Evidence|${layer}|${topic}`,
    count
  })));
  return Plot.plot({
    width: Math.max(width, 560),
    height: 560,
    axis: null,
    marginLeft: 110,
    marks: [
      Plot.tree(rows, {
        path: "path",
        delimiter: "|",
        text: "node:name",
        dot: true,
        strokeOpacity: 0.35
      })
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
