import {readFileSync, writeFileSync} from "fs";
const html = readFileSync("../dashboard/index.html", "utf8");
const evMatch = html.match(/const events = \[([\s\S]*?)\];/);
const layerMatch = html.match(/const layers = \[([\s\S]*?)\];/);
const relMatch = html.match(/const relColors = \{([\s\S]*?)\};/);
const topicMatch = html.match(/const topicColors = \{([\s\S]*?)\};/);
const evText = html.match(/const evidenceText = \{([\s\S]*?)\};/);
const events = eval("[" + evMatch[1] + "]");
const layers = eval("[" + layerMatch[1] + "]");
const relColors = eval("({" + relMatch[1] + "})");
const topicColors = eval("({" + topicMatch[1] + "})");
const evidenceText = eval("({" + evText[1] + "})");
writeFileSync("src/data/events.json", JSON.stringify(events, null, 2));
writeFileSync("src/data/meta.json", JSON.stringify({
  layers: layers.map(l => ({id: l[0], name: l[1], note: l[2], color: l[3]})),
  relColors, topicColors, evidenceText
}, null, 2));
console.log("Events:", events.length, "Layers:", layers.length, "Rels:", Object.keys(relColors).length, "Topics:", Object.keys(topicColors).length);
