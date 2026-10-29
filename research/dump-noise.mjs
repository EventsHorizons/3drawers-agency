import fs from "node:fs";

const s = fs.readFileSync("research/payloads/Dt-function-raw.txt", "utf8");
const start = s.indexOf('?"') >= 0 ? s.indexOf('?"') : s.indexOf('="');
// Default hash string then full return template
const hashMatch = s.match(/void 0===e\?"([\s\S]*?)":e/);
const bodyMatch = s.match(/return'([\s\S]*?)'\s*;\s*}/);
console.log("hashMatch", !!hashMatch, hashMatch?.[1]?.length);
console.log("bodyMatch", !!bodyMatch, bodyMatch?.[1]?.length);
if (bodyMatch) {
  const glsl = bodyMatch[1].replace(/\\n/g, "\n").replace(/\\'/g, "'");
  fs.writeFileSync("research/payloads/Dt-noise.glsl", glsl);
  const ri = glsl.indexOf("return vec4");
  console.log(glsl.slice(ri, ri + 900));
}
