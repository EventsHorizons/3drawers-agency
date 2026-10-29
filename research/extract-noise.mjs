import fs from "fs";

const t = fs.readFileSync("research/payloads/chunk-aaa3fb1.js", "utf8");
const start = t.indexOf("Dt=function()");
const end = t.indexOf("precision highp float;", start);
const raw = t.slice(start, end + 50);
fs.writeFileSync("research/payloads/Dt-function-raw.txt", raw);

// Reconstruct Dt() GLSL by evaluating the template structure carefully
// Default hash body:
const hashDefault = `
      p = fract(p * vec3(.1031, .1030, .0973));
      p += dot(p, p.yxz+33.33);
      return fract((p.xxy + p.yxx)*p.zyx);
`;

// Extract the template between return " and ".concat or similar
const retIdx = t.indexOf('return "', start);
const noiseStart = t.indexOf("vec3 gradientDerivativesNoise3DHash", start);
console.log({ start, end, retIdx, noiseStart });
console.log(raw.slice(0, 2500));
console.log("---");
console.log(raw.slice(2500, 5500));
