import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const htmlPath = new URL("../index.html", import.meta.url);
const outDir = new URL("../public/assets/receipts/", import.meta.url);

let html = await readFile(htmlPath, "utf8");
let count = 0;

await mkdir(outDir, { recursive: true });

html = html.replace(/(<img\b[^>]*\bsrc=")data:image\/png;base64,([^"]+)("[^>]*>)/g, (match, before, base64, after) => {
  count += 1;
  const buffer = Buffer.from(base64, "base64");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 10);
  const filename = `receipt-${String(count).padStart(2, "0")}-${hash}.png`;
  const relativePath = `public/assets/receipts/${filename}`;
  return `${before}${relativePath}${after}`;
});

if (count === 0) {
  console.log("No inline PNG <img> tags found.");
}

let imageIndex = 0;
const imageBuffers = [];
const originalHtml = await readFile(htmlPath, "utf8");
originalHtml.replace(/<img\b[^>]*\bsrc="data:image\/png;base64,([^"]+)"[^>]*>/g, (_match, base64) => {
  imageIndex += 1;
  const buffer = Buffer.from(base64, "base64");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 10);
  imageBuffers.push({
    filename: `receipt-${String(imageIndex).padStart(2, "0")}-${hash}.png`,
    buffer,
  });
  return _match;
});

for (const image of imageBuffers) {
  await writeFile(new URL(image.filename, outDir), image.buffer);
}

await writeFile(htmlPath, html);
console.log(`Extracted ${imageBuffers.length} inline PNG image(s) to public/assets/receipts/.`);
