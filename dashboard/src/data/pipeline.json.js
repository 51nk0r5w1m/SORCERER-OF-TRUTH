import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {csvParse} from "d3-dsv";

const file = await readFile(new URL("./records.csv", import.meta.url));
const records = csvParse(file.toString("utf8"));
const values = (field) => [...new Set(records.map((row) => row[field]).filter(Boolean))];
const required = ["id", "layer", "source", "title", "topic", "relation", "evidence", "life", "date", "summary"];
const populated = records.reduce(
  (count, row) => count + required.filter((field) => row[field]?.trim()).length,
  0
);

process.stdout.write(JSON.stringify({
  artifact: "src/data/records.csv",
  transform: "src/data/records.json.js",
  revision: process.env.GITHUB_SHA ?? "local",
  sha256: createHash("sha256").update(file).digest("hex"),
  records: records.length,
  fields: required.length,
  populatedCells: populated,
  expectedCells: records.length * required.length,
  completeness: populated / (records.length * required.length),
  uniqueIds: new Set(records.map((row) => row.id)).size,
  sourceLayers: values("layer").length,
  topics: values("topic").length,
  relationships: values("relation").length,
  evidenceGrades: values("evidence").sort(),
  observationRange: [
    records.map((row) => row.date).sort()[0],
    records.map((row) => row.date).sort().at(-1)
  ]
}));
