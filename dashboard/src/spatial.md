---
title: Spatial Observatory
toc: true
---

```js
import {
  fireballCalendar,
  fireballEnergyPlot,
  fireballHexbinMap,
  fireballPointMap,
  officialEventMap,
  officialEventTable,
  officialTimeline
} from "./components/spatial-observatory.js";
import {observatoryIcon, pixelIcon} from "./components/observatory-icons.js";
import {metric} from "./components/source-drift.js";
```

```js
const officialPayload = await FileAttachment("data/uap-events.json").json();
const officialEvents = officialPayload.records.map((d) => ({
  ...d,
  dateStart: new Date(d.dateStart),
  dateEnd: new Date(d.dateEnd)
}));
const fireballPayload = await FileAttachment("data/fireballs.json").json();
const fireballs = fireballPayload.records.map((d) => ({...d, date: new Date(d.date)}));
const world = await FileAttachment("data/world.json").json();
const externalLink = (url, text) => Object.assign(document.createElement("a"), {
  href: url,
  textContent: text,
  target: "_blank",
  rel: "noreferrer"
});
const officialCards = html`<div>${officialEvents.map((d) => html`<div class="card">
  <h3>${pixelIcon(d.artifactType.includes("graphic") ? "chart" : "radio")} ${d.title}</h3>
  <blockquote>${d.officialQuote}</blockquote>
  <p><strong>${d.locationText}</strong> · ${d.datePrecision} precision · ${d.coordinateMethod} ±${d.uncertaintyKm} km</p>
  <p>Disposition: ${d.caseDisposition}. ${externalLink(d.sourceUrl, "Open official artifact")}.</p>
</div>`)}</div>`;
```

# ${observatoryIcon("observatory")} Spatial Observatory

**Two datasets enter. They do not become one dataset.** NARA Project Blue Book items are official archival UAP records. NASA/JPL fireballs are an atmospheric context control. Proximity in a chart is not identity, causation, or debunking.

<div class="grid grid-cols-4">
  ${metric(officialEvents.length, html`${pixelIcon("alien")} Official UAP items`, "strict NARA manifest")}
  ${metric(fireballs.length, html`${pixelIcon("zap")} Fireball controls`, "NASA/JPL CNEOS with location")}
  ${metric(`${d3.min(officialEvents, (d) => d.uncertaintyKm)}–${d3.max(officialEvents, (d) => d.uncertaintyKm)} km`, html`${pixelIcon("radio")} Spatial uncertainty`, "named-place centroids")}
  ${metric(fireballPayload.provenance.apiVersion, html`${pixelIcon("database")} CNEOS API`, `retrieved ${fireballPayload.provenance.retrievedAt.slice(0, 10)}`)}
</div>

## ${observatoryIcon("ufo")} Official archive lane

The point is a representative centroid for the place named by NARA—not the object’s measured coordinates. The surrounding geometry is the declared uncertainty radius. Case disposition remains **not stated** unless the retrieved official source says otherwise.

```js
const officialProjectionInput = Inputs.select(
  ["equal-earth", "orthographic", "equirectangular", "azimuthal-equidistant"],
  {label: "Official map projection", value: "equal-earth"}
);
const officialProjection = Generators.input(officialProjectionInput);
```

<div class="card">${officialProjectionInput}</div>

<div class="card">
  <h3>${pixelIcon("radio")} NARA Project Blue Book artifact geography</h3>
  ${resize((width) => officialEventMap(officialEvents, world, width, officialProjection))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>${pixelIcon("analytics")} Archive pulse</h3>
    ${resize((width) => officialTimeline(officialEvents, width))}
  </div>
  <div class="card">
    <h3>${pixelIcon("database")} Manifest integrity</h3>
    <p><strong>SHA-256</strong><br><code>${officialPayload.provenance.sha256}</code></p>
    <p>${officialPayload.provenance.coordinatePolicy}</p>
    <p>${externalLink(officialPayload.provenance.sourcePolicyUrl, "NARA source and republication policy")}</p>
  </div>
</div>

<div class="card">
  <h3>${pixelIcon("alien")} Official receipts</h3>
  ${officialEventTable(officialEvents)}
</div>

${officialCards}

## ${observatoryIcon("radar")} Atmospheric context lane

NASA/JPL CNEOS reports peak-brightness locations and estimated energies for fireballs. This layer is useful for understanding the atmospheric-event background, but it is **not UAP evidence** and does not automatically explain any archival UAP item.

```js
const fireballYears = d3.extent(fireballs, (d) => d.date.getUTCFullYear());
const yearInput = Inputs.range(fireballYears, {
  label: "Earliest fireball year",
  step: 1,
  value: Math.max(fireballYears[0], 2000)
});
const earliestYear = Generators.input(yearInput);
const energyInput = Inputs.range([0, Math.ceil(d3.max(fireballs, (d) => d.impactEnergyKt))], {
  label: "Minimum estimated impact energy (kt)",
  step: 0.1,
  value: 0
});
const minimumEnergy = Generators.input(energyInput);
const fireballProjectionInput = Inputs.select(
  ["equal-earth", "orthographic", "equirectangular", "azimuthal-equidistant"],
  {label: "Context map projection", value: "equal-earth"}
);
const fireballProjection = Generators.input(fireballProjectionInput);
```

```js
const visibleFireballs = fireballs.filter((d) =>
  d.date.getUTCFullYear() >= earliestYear &&
  d.impactEnergyKt >= minimumEnergy
);
```

<div class="grid grid-cols-3">
  <div class="card">${yearInput}</div>
  <div class="card">${energyInput}</div>
  <div class="card">${fireballProjectionInput}</div>
</div>

<div class="grid grid-cols-4">
  ${metric(visibleFireballs.length, html`${pixelIcon("zap")} Visible fireballs`, `of ${fireballs.length} located events`)}
  ${metric(`${d3.sum(visibleFireballs, (d) => d.impactEnergyKt).toFixed(1)} kt`, html`${pixelIcon("analytics")} Combined estimate`, "sum of selected impact-energy estimates")}
  ${metric(d3.format(".2f")(d3.median(visibleFireballs, (d) => d.impactEnergyKt) ?? 0), html`${pixelIcon("chart")} Median kt`, "selected events")}
  ${metric(d3.format(".1f")(d3.median(visibleFireballs.filter((d) => d.altitudeKm != null), (d) => d.altitudeKm) ?? 0), html`${pixelIcon("radio")} Median altitude km`, "where altitude is reported")}
</div>

<div class="card">
  <h3>${pixelIcon("alien")} Located fireball point field</h3>
  ${resize((width) => fireballPointMap(visibleFireballs, world, width, fireballProjection))}
</div>

<div class="card">
  <h3>${pixelIcon("database")} Projected hexbin density</h3>
  <p>Hexagons aggregate points in projected screen space. Counts depend on projection and bin width; this is a density overview, not an equal-area rate map.</p>
  ${resize((width) => fireballHexbinMap(visibleFireballs, world, width, fireballProjection))}
</div>

<div class="grid grid-cols-2">
  <div class="card">
    <h3>${pixelIcon("analytics")} Energy calendar heatmap</h3>
    ${resize((width) => fireballCalendar(visibleFireballs, width))}
  </div>
  <div class="card">
    <h3>${pixelIcon("zap")} Energy over time</h3>
    ${resize((width) => fireballEnergyPlot(visibleFireballs, width))}
  </div>
</div>

<p>NASA/JPL payload SHA-256: <code>${fireballPayload.provenance.sha256}</code></p>
