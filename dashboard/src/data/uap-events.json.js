import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {csvParse} from "d3-dsv";

const sourceUrl = new URL("uap-events.csv", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const required = [
  "id",
  "publisher",
  "title",
  "date_start",
  "date_end",
  "date_precision",
  "location_text",
  "latitude",
  "longitude",
  "coordinate_method",
  "uncertainty_km",
  "artifact_type",
  "case_disposition",
  "official_quote",
  "source_url"
];
const rows = csvParse(source);
const ids = new Set();

const records = rows.map((row, index) => {
  const line = index + 2;
  for (const field of required) {
    if (!row[field]?.trim()) throw new Error(`uap-events.csv:${line} missing ${field}`);
  }
  if (ids.has(row.id)) throw new Error(`uap-events.csv:${line} duplicate id ${row.id}`);
  ids.add(row.id);
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  const uncertaintyKm = Number(row.uncertainty_km);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error(`uap-events.csv:${line} invalid latitude`);
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error(`uap-events.csv:${line} invalid longitude`);
  }
  if (!Number.isFinite(uncertaintyKm) || uncertaintyKm <= 0) {
    throw new Error(`uap-events.csv:${line} invalid uncertainty_km`);
  }
  const start = new Date(`${row.date_start}T00:00:00Z`);
  const end = new Date(`${row.date_end}T23:59:59Z`);
  if (!Number.isFinite(+start) || !Number.isFinite(+end) || start > end) {
    throw new Error(`uap-events.csv:${line} invalid date range`);
  }
  const url = new URL(row.source_url);
  if (url.protocol !== "https:") throw new Error(`uap-events.csv:${line} source_url must use HTTPS`);
  return {
    id: row.id,
    publisher: row.publisher,
    title: row.title,
    dateStart: start.toISOString(),
    dateEnd: end.toISOString(),
    datePrecision: row.date_precision,
    locationText: row.location_text,
    latitude,
    longitude,
    coordinateMethod: row.coordinate_method,
    uncertaintyKm,
    artifactType: row.artifact_type,
    caseDisposition: row.case_disposition,
    officialQuote: row.official_quote,
    sourceUrl: url.href
  };
});

process.stdout.write(JSON.stringify({
  provenance: {
    corpus: "NARA Project Blue Book curated manifest",
    records: records.length,
    coordinatePolicy: "Representative named-place centroids; never interpreted as exact observation coordinates.",
    redistribution: "NARA catalog items may be republished with attribution to NARA.",
    sourcePolicyUrl: "https://www.archives.gov/research/topics/uaps",
    sha256: createHash("sha256").update(source).digest("hex")
  },
  records
}));
