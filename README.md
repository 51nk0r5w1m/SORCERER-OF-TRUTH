# Sorcerer of Truth

![Sorcerer of Truth overlooking the UAP Pipeline Observatory](dashboard/src/assets/sorcerer-of-truth.png)

**UAP Pipeline Observatory** is a provenance-first security research control plane built with [Observable Framework](https://observablehq.com/framework/). It turns a reviewable evidence register into linked filters, sortable records, source-authority maps, statistical heatmaps, archival UAP geography, atmospheric context controls, drift timelines, and reproducible public data artifacts.

The application lives in `dashboard/` and deploys as a static site to GitHub Pages. Pushes and a daily scheduled workflow execute build-time data loaders, cache that day’s validated snapshots, and publish static output with no client-side data API dependency. The presentation deck is a separate artifact.

```sh
cd dashboard
npm ci
npm run dev
npm run build
```

The canonical evidence dataset is `dashboard/src/data/records.csv`. The spatial lane adds a curated NARA manifest in `dashboard/src/data/uap-events.csv`, a scheduled NASA/JPL CNEOS fireball loader, and a static world-atlas loader. Observable data loaders validate and normalize every published artifact during the build; invalid records or incompatible upstream schemas stop publication.
