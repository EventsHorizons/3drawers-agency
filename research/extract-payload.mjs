import fs from "fs";

const work = fs.readFileSync("research/payloads/work-payload.js", "utf8");
const home = fs.readFileSync("research/payloads/home-payload.js", "utf8");

const uids = [...new Set([...work.matchAll(/"uid":"([^"]+)"/g)].map((m) => m[1]))];
const slugs = [...new Set([...work.matchAll(/\/work\/([a-z0-9-]+)/gi)].map((m) => m[1]))];

fs.writeFileSync(
  "research/payloads/extracted.json",
  JSON.stringify({ uids, slugs, workBytes: work.length, homeBytes: home.length }, null, 2),
);

console.log("uids", uids.length, uids.slice(0, 40));
console.log("slugs", slugs.length, slugs.slice(0, 40));
