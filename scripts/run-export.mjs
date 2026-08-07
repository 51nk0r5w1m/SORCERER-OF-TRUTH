import { spawnSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { findNode20 } = require("./node20.js");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const node = findNode20();
const result = spawnSync(node, [path.join(root, "scripts", "export-deck.mjs")], {
  cwd: root,
  env: { ...process.env, TMPDIR: process.env.TMPDIR || "/tmp" },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
