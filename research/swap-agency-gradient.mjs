import fs from "node:fs";
import path from "node:path";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(vue|ts|md)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const files = walk("app");
for (const f of files) {
  let t = fs.readFileSync(f, "utf8");
  const n = t
    .replaceAll("MonopoGradient", "AgencyGradient")
    .replaceAll("createMonopoGradient", "createAgencyGradient")
    .replaceAll("monopoGradientShader", "agencyGradientShader")
    .replaceAll("monopo-gradient", "agency-gradient")
    .replaceAll("__monopoGradient", "__agencyGradient")
    .replace(
      /https:\/\/monopolondon\.cdn\.prismic\.io\/monopolondon\/[^\s"'<>]+/g,
      "#",
    );
  if (n !== t) {
    fs.writeFileSync(f, n);
    console.log("updated", f);
  }
}

for (const f of [
  "app/components/MonopoGradient.vue",
  "app/utils/createMonopoGradient.ts",
  "app/utils/monopoGradientShader.ts",
]) {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log("deleted", f);
  }
}
