import {createHash} from "node:crypto";

const sourceUrl = "https://ssd-api.jpl.nasa.gov/fireball.api?req-loc=true";
const response = await fetch(sourceUrl, {
  headers: {"User-Agent": "Sorcerer-of-Truth-UAP-Pipeline-Observatory"}
});
if (!response.ok) throw new Error(`NASA/JPL Fireball API returned ${response.status}`);

const text = await response.text();
const payload = JSON.parse(text);
if (payload.signature?.version !== "1.2") {
  throw new Error(`Unsupported NASA/JPL Fireball API version ${payload.signature?.version ?? "missing"}`);
}
if (!Array.isArray(payload.fields) || !Array.isArray(payload.data)) {
  throw new Error("NASA/JPL Fireball API payload is missing fields or data");
}
const fieldIndex = new Map(payload.fields.map((field, index) => [field, index]));
for (const field of ["date", "lat", "lat-dir", "lon", "lon-dir", "energy", "impact-e"]) {
  if (!fieldIndex.has(field)) throw new Error(`NASA/JPL Fireball API is missing ${field}`);
}

const value = (row, field) => row[fieldIndex.get(field)];
const records = payload.data.map((row, index) => {
  const date = new Date(`${value(row, "date").replace(" ", "T")}Z`);
  const latitude = Number(value(row, "lat")) * (value(row, "lat-dir") === "S" ? -1 : 1);
  const longitude = Number(value(row, "lon")) * (value(row, "lon-dir") === "W" ? -1 : 1);
  const radiatedEnergy = Number(value(row, "energy"));
  const impactEnergyKt = Number(value(row, "impact-e"));
  const altitudeKm = value(row, "alt") == null ? null : Number(value(row, "alt"));
  if (![+date, latitude, longitude, radiatedEnergy, impactEnergyKt].every(Number.isFinite)) {
    throw new Error(`NASA/JPL Fireball API record ${index} failed numeric validation`);
  }
  return {
    id: `CNEOS-${date.toISOString().replaceAll(/[-:.TZ]/g, "")}`,
    date: date.toISOString(),
    latitude,
    longitude,
    altitudeKm,
    radiatedEnergyJ1e10: radiatedEnergy,
    impactEnergyKt
  };
});

process.stdout.write(JSON.stringify({
  provenance: {
    corpus: "NASA/JPL CNEOS Fireball Data",
    role: "Atmospheric context control; not UAP evidence and not an automatic explanation for any UAP record.",
    sourceUrl,
    apiVersion: payload.signature.version,
    source: payload.signature.source,
    retrievedAt: new Date().toISOString(),
    records: records.length,
    sha256: createHash("sha256").update(text).digest("hex")
  },
  records
}));
