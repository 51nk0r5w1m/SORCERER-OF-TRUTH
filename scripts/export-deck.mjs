import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "build", "exports");
const screenshotDir = path.join(outDir, "slides");
mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const deckUrl = new URL(pathToFileURL(path.join(root, "index.html")).href);
deckUrl.searchParams.set("export", "1");
await page.goto(deckUrl.href, { waitUntil: "load" });
await page.emulateMedia({ media: "screen" });

const slides = await page.locator(".slide").evaluateAll((nodes) => nodes.map((node) => ({
  id: node.id,
  title: node.dataset.title || node.id,
})));

for (const [index, slide] of slides.entries()) {
  await page.evaluate((id) => {
    const jump = document.getElementById("jump");
    jump.value = id;
    jump.dispatchEvent(new Event("change", { bubbles: true }));
  }, slide.id);
  await page.waitForTimeout(260);
  const filename = `${String(index + 1).padStart(2, "0")}-${slide.id}.png`;
  await page.screenshot({ path: path.join(screenshotDir, filename), fullPage: false });
}

await page.pdf({
  path: path.join(outDir, "source-of-truth-defcon34.pdf"),
  printBackground: true,
  width: "16in",
  height: "9in",
  margin: { top: "0", right: "0", bottom: "0", left: "0" },
  pageRanges: `1-${slides.length}`,
});

await browser.close();
console.log(`Exported ${slides.length} slide screenshots and PDF to ${outDir}`);
