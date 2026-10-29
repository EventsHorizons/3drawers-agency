import fs from "fs";

const t = fs.readFileSync("research/payloads/chunk-aaa3fb1.js", "utf8");
const marker = "uniform vec3 color1;";
const i = t.indexOf(marker);
if (i < 0) throw new Error("color1 not found");
const p = t.lastIndexOf("precision highp float", i);
const slice = t.slice(p, p + 12000);
fs.writeFileSync("research/payloads/gradient-shader-raw.txt", slice);

// Also find Dt() noise helper that gets concat'd
const dtIdx = t.indexOf("function Dt(");
const dtSlice = dtIdx >= 0 ? t.slice(dtIdx, dtIdx + 4000) : "";
fs.writeFileSync("research/payloads/gradient-Dt-raw.txt", dtSlice);

// Find main() of gradient shader after color1
const mainIdx = slice.indexOf("void main");
console.log({ i, p, mainIdx, sliceLen: slice.length, dtIdx });
console.log("--- SHADER HEAD ---");
console.log(slice.slice(0, 4500));
console.log("--- SHADER MID ---");
console.log(slice.slice(4500, 9000));
