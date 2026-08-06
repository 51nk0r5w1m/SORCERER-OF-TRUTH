import {readFile} from "node:fs/promises";
import {csvParse} from "d3-dsv";

const required = ["id", "layer", "source", "title", "topic", "relation", "evidence", "life", "date", "summary"];
const layers = new Map([
  ["standards", "Standards"],
  ["architecture", "Architecture Guidance"],
  ["docs", "Official Docs"],
  ["samples", "Samples / Reference Impls"],
  ["community", "Community Trackers"],
  ["seo", "Search / Tutorials / AI"]
]);
const evidence = new Set(["A", "B", "C", "D", "E"]);
const reviewStatus = new Map([
  ["A", "Verified"],
  ["B", "Verified"],
  ["C", "Narrower"],
  ["D", "Needs Archive"],
  ["E", "Unverified"]
]);

const csv = await readFile(new URL("./records.csv", import.meta.url), "utf8");
const rows = csvParse(csv);
const ids = new Set();
const errors = [];

const records = rows.map((row, index) => {
  const line = index + 2;
  for (const field of required) {
    if (!row[field]?.trim()) errors.push(`line ${line}: missing ${field}`);
  }
  if (ids.has(row.id)) errors.push(`line ${line}: duplicate id ${row.id}`);
  ids.add(row.id);
  if (!layers.has(row.layer)) errors.push(`line ${line}: unknown layer ${row.layer}`);
  if (!evidence.has(row.evidence)) errors.push(`line ${line}: invalid evidence grade ${row.evidence}`);
  if (!/^\d{4}-\d{2}$/.test(row.date)) errors.push(`line ${line}: date must use YYYY-MM`);

  return {
    ...row,
    layerLabel: layers.get(row.layer) ?? row.layer,
    reviewStatus: reviewStatus.get(row.evidence) ?? "Unverified",
    isAligned: row.relation === "Current Alignment",
    observedAt: `${row.date}-01T00:00:00.000Z`,
    year: Number(row.date.slice(0, 4))
  };
});

if (errors.length) {
  throw new Error(`records.csv validation failed:\n${errors.join("\n")}`);
}

console.error(`validated ${records.length} source-drift records`);
process.stdout.write(JSON.stringify(records));
