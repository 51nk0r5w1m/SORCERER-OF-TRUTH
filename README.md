# Sorcerer of Truth

**UAP Pipeline Observatory** is a provenance-first security research control plane built with [Observable Framework](https://observablehq.com/framework/). It turns a reviewable evidence register into linked filters, sortable records, source-authority maps, evidence matrices, drift timelines, and reproducible public data artifacts.

The application lives in `dashboard/` and deploys as a static site to GitHub Pages. The presentation deck is a separate artifact.

```sh
cd dashboard
npm ci
npm run dev
npm run build
```

The canonical dataset is `dashboard/src/data/records.csv`. Observable data loaders validate and normalize it during the build; invalid records stop publication.
