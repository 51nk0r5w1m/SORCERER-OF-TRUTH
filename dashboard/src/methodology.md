---
title: Methodology
toc: true
---

```js
import {evidence, layers} from "./components/source-drift.js";
```

# Methodology

The dashboard separates source authority from evidence quality. A strong relationship label does not upgrade weak evidence, and a high-authority source can still preserve an obsolete or unsafe decision.

## Source hierarchy

```js
Inputs.table(layers, {
  columns: ["rank", "label", "note"],
  header: {rank: "Weight", label: "Source layer", note: "Role"},
  sort: "rank",
  rows: 6
})
```

## Evidence grades

<div class="grid grid-cols-5">
  ${evidence.map((d) => html`<div class="card">
    <strong>${d.key}</strong>
    <h3>${d.label}</h3>
  </div>`)}
</div>

## Relationship model

Each record names the load-bearing relationship between the source and the guidance under review:

- **Current Alignment** — the observed guidance agrees with the stronger source.
- **Normative Conflict** — a claim conflicts with a standard or controlling requirement.
- **Unsafe Default** — valid product behavior creates a weaker outcome unless deliberately overridden.
- **Guidance Drift** — copied or maintained guidance no longer reflects the stronger source.
- **Sample-Code Defect** — illustrative code carries a security-relevant flaw.
- **Editorial Omission** — necessary context is absent from otherwise accurate guidance.
- **Console/API/IaC Divergence** — creation paths produce materially different outcomes.
- **Legacy Compatibility Exposure** — a retained compatibility path can be mistaken for current guidance.
- **Doc/Product Mismatch** — documented and observed behavior differ.
- **Ecosystem Observation** — a repeated pattern is visible outside authoritative guidance.

## Data contract

`src/data/records.csv` is the canonical, reviewable input. During every build, `records.json.js` rejects duplicate IDs, missing required fields, unknown source layers, invalid evidence grades, and malformed observation months. It then emits normalized JSON for the visualizations.

`pipeline.json.js` independently fingerprints the canonical file and publishes completeness, cardinality, observation-range, and revision metadata. The rendered Observatory therefore carries enough lineage to identify the exact input artifact behind every chart.

| Field | Meaning |
|---|---|
| `id` | Stable evidence-record identifier |
| `layer` | Source authority layer |
| `source` | Human-readable source or publication |
| `title` | The claim or observed difference |
| `topic` | Security domain used for filtering |
| `relation` | Load-bearing relationship classification |
| `evidence` | Independent A–E evidence grade |
| `life` | Lifecycle state |
| `date` | Observation month in `YYYY-MM` format |
| `summary` | Decision-relevant context |

## Update pipeline

1. Add or update rows in `src/data/records.csv`.
2. Run `npm run build` from `dashboard/`; validation fails before publication if the data contract is broken.
3. Merge to `main`; the Pages workflow rebuilds the normalized data and static site.
4. Use the workflow’s manual dispatch for a no-code rebuild. Scheduled external ingestion can be added later as a separate pull-request workflow so new evidence remains reviewable before publication.
