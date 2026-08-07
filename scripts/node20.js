const { existsSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const path = require("node:path");

function parseMajor(version) {
  const match = String(version).match(/v?(\d+)\./);
  return match ? Number(match[1]) : 0;
}

function versionOf(candidate) {
  try {
    return execFileSync(candidate, ["-v"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function executableCandidates() {
  const home = process.env.HOME || "";
  return [
    process.env.NODE20,
    process.execPath,
    "node20",
    "node",
    path.join(home, ".windsurf-server/bin/cb270b70c3a55fd43530de48988912a8d9cccb20/node"),
    path.join(home, ".antigravity-server/bin/450b6b28083d737992adc5d19637f22c95ffba7b/node"),
    path.join(home, ".cursor-server/bin/adb0f9e3e4f184bba7f3fa6dbfd72ad0ebb8cfd0/node"),
    path.join(home, ".vscode-server/bin/e4c7e7b1d6d060162f4aa7f8225271b67ce1df75/node"),
  ].filter(Boolean);
}

function findNode20() {
  for (const candidate of executableCandidates()) {
    if (candidate.includes("/") && !existsSync(candidate)) continue;
    const version = versionOf(candidate);
    if (parseMajor(version) >= 20) return candidate;
  }

  throw new Error("Playwright requires Node.js 20+. Set NODE20=/path/to/node or install Node 20+.");
}

module.exports = { findNode20 };
