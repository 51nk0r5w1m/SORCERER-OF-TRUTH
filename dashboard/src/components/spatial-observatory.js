import * as Inputs from "@observablehq/inputs";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

function baseMap(world) {
  return [
    Plot.sphere({fill: "var(--theme-background-alt)", stroke: "var(--theme-foreground-faint)"}),
    Plot.graticule({stroke: "var(--theme-foreground-faintest)"}),
    Plot.geo(world, {fill: "var(--theme-foreground-faintest)", stroke: "var(--theme-background)", strokeWidth: 0.5})
  ];
}

export function officialEventMap(events, world, width, projection = "equal-earth") {
  const uncertainty = {
    type: "FeatureCollection",
    features: events.map((event) => ({
      type: "Feature",
      properties: event,
      geometry: d3.geoCircle()
        .center([event.longitude, event.latitude])
        .radius(event.uncertaintyKm / 111.195)()
    }))
  };
  return Plot.plot({
    width: Math.max(width, 640),
    height: 520,
    projection,
    color: {legend: true, label: "Artifact type"},
    marks: [
      ...baseMap(world),
      Plot.geo(uncertainty, {
        fill: (d) => d.properties.artifactType,
        fillOpacity: 0.28,
        stroke: (d) => d.properties.artifactType,
        tip: true,
        title: (d) => `${d.properties.title}\n${d.properties.locationText}\n±${d.properties.uncertaintyKm} km representative centroid uncertainty`
      }),
      Plot.dot(events, {
        x: "longitude",
        y: "latitude",
        fill: "artifactType",
        stroke: "var(--theme-background)",
        r: 5,
        tip: true,
        title: (d) => `${d.title}\n${d.dateStart.toISOString().slice(0, 10)} · ${d.locationText}\n${d.coordinateMethod} · ±${d.uncertaintyKm} km\nDisposition: ${d.caseDisposition}`
      })
    ]
  });
}

export function officialTimeline(events, width) {
  return Plot.plot({
    width: Math.max(width, 480),
    height: 260,
    marginLeft: 55,
    x: {label: "Official item date"},
    y: {label: null},
    color: {legend: true, label: "Artifact type"},
    marks: [
      Plot.ruleY([0]),
      Plot.tickX(events, {x: "dateStart", stroke: "artifactType", strokeWidth: 5, tip: true, title: (d) => `${d.title}\n${d.locationText}`}),
      Plot.text(events, {x: "dateStart", y: 0, text: (d) => d.locationText.split(",")[0], rotate: -35, dy: -12, textAnchor: "start"})
    ]
  });
}

export function fireballPointMap(records, world, width, projection = "equal-earth") {
  if (!records.length) return Plot.plot({width, height: 420, axis: null, marks: [Plot.text(["No fireballs match the controls."], {frameAnchor: "middle"})]});
  return Plot.plot({
    width: Math.max(width, 640),
    height: 520,
    projection,
    r: {type: "sqrt", range: [2, 18], legend: true, label: "Impact energy (kt)"},
    color: {scheme: "turbo", legend: true, label: "Year"},
    marks: [
      ...baseMap(world),
      Plot.dot(records, {
        x: "longitude",
        y: "latitude",
        r: "impactEnergyKt",
        fill: (d) => d.date.getUTCFullYear(),
        fillOpacity: 0.72,
        stroke: "var(--theme-background)",
        strokeWidth: 0.6,
        tip: true,
        title: (d) => `${d.date.toISOString()}\n${d.latitude.toFixed(1)}, ${d.longitude.toFixed(1)}\n${d.impactEnergyKt} kt estimated impact energy${d.altitudeKm == null ? "" : `\n${d.altitudeKm} km altitude`}`
      })
    ]
  });
}

export function fireballHexbinMap(records, world, width, projection = "equal-earth") {
  if (!records.length) return Plot.plot({width, height: 420, axis: null, marks: [Plot.text(["No fireballs match the controls."], {frameAnchor: "middle"})]});
  return Plot.plot({
    width: Math.max(width, 640),
    height: 520,
    projection,
    color: {scheme: "magma", legend: true, label: "Events per projected hexbin"},
    marks: [
      ...baseMap(world),
      Plot.dot(
        records,
        Plot.hexbin(
          {r: "count", fill: "count"},
          {x: "longitude", y: "latitude", binWidth: 15, stroke: "var(--theme-background)", strokeWidth: 0.5, tip: true}
        )
      )
    ]
  });
}

export function fireballCalendar(records, width) {
  if (!records.length) return Plot.plot({width, height: 300, axis: null, marks: [Plot.text(["No fireballs match the controls."], {frameAnchor: "middle"})]});
  const years = d3.extent(records, (d) => d.date.getUTCFullYear());
  const months = d3.utcMonth.range(
    new Date(Date.UTC(years[0], 0, 1)),
    new Date(Date.UTC(years[1] + 1, 0, 1))
  );
  const counts = d3.rollup(records, (group) => group.length, (d) => +d3.utcMonth(d.date));
  const energy = d3.rollup(records, (group) => d3.sum(group, (d) => d.impactEnergyKt), (d) => +d3.utcMonth(d.date));
  const rows = months.map((date) => ({
    date,
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    count: counts.get(+date) ?? 0,
    energy: energy.get(+date) ?? 0
  }));
  return Plot.plot({
    width: Math.max(width, 520),
    height: Math.max(360, (years[1] - years[0] + 1) * 17 + 90),
    marginLeft: 55,
    x: {domain: d3.range(12), tickFormat: (d) => d3.utcFormat("%b")(new Date(Date.UTC(2000, d, 1))), label: null},
    y: {label: null},
    color: {type: "symlog", scheme: "inferno", legend: true, label: "Estimated impact energy (kt)"},
    marks: [
      Plot.cell(rows, {
        x: "month",
        y: "year",
        fill: "energy",
        inset: 1,
        tip: true,
        title: (d) => `${d3.utcFormat("%B %Y")(d.date)}\n${d.count} events\n${d.energy.toFixed(2)} kt combined estimated impact energy`
      })
    ]
  });
}

export function fireballEnergyPlot(records, width) {
  if (!records.length) return Plot.plot({width, height: 300, axis: null, marks: [Plot.text(["No fireballs match the controls."], {frameAnchor: "middle"})]});
  return Plot.plot({
    width: Math.max(width, 520),
    height: 340,
    x: {label: "Peak brightness date"},
    y: {type: "log", label: "Estimated impact energy (kt)", grid: true},
    color: {scheme: "turbo", legend: true, label: "Altitude (km)"},
    marks: [
      Plot.ruleY([0.01, 0.1, 1, 10, 100], {strokeOpacity: 0.2}),
      Plot.dot(records, {
        x: "date",
        y: "impactEnergyKt",
        fill: "altitudeKm",
        r: 4,
        tip: true,
        title: (d) => `${d.date.toISOString()}\n${d.impactEnergyKt} kt\n${d.altitudeKm == null ? "Altitude unavailable" : `${d.altitudeKm} km altitude`}`
      })
    ]
  });
}

export function officialEventTable(events) {
  return Inputs.table(events, {
    columns: ["dateStart", "locationText", "artifactType", "coordinateMethod", "uncertaintyKm", "caseDisposition", "title", "sourceUrl"],
    header: {
      dateStart: "Date",
      locationText: "Reported location",
      artifactType: "Artifact",
      coordinateMethod: "Coordinate method",
      uncertaintyKm: "± km",
      caseDisposition: "Disposition",
      title: "Official title",
      sourceUrl: "Official artifact"
    },
    format: {
      dateStart: (d) => d.toISOString().slice(0, 10),
      sourceUrl: (d) => d
    },
    rows: 10
  });
}
