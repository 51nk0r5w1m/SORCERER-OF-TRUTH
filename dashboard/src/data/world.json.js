import {createRequire} from "node:module";
import {readFile} from "node:fs/promises";
import {feature} from "topojson-client";

const require = createRequire(import.meta.url);
const source = require.resolve("world-atlas/countries-110m.json");
const topology = JSON.parse(await readFile(source, "utf8"));
process.stdout.write(JSON.stringify(feature(topology, topology.objects.countries)));
