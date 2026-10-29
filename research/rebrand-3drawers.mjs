/**
 * Rebrand content strings: monopo london → 3Drawers Agency
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [
  "content/site.json",
  "content/news.json",
  "content/projects.json",
  "content/categories.json",
  "README.md",
  "package.json",
];

function rebrand(text) {
  return text
    .replace(/monopo\s*\|\s*london/gi, "3Drawers | Agency")
    .replace(/MONOPO\s*\|\s*LONDON/g, "3DRAWERS | AGENCY")
    .replace(/monopo\.london/gi, "3drawers.agency")
    .replace(/monopolondon\.cdn\.prismic\.io/gi, "images.prismic.io")
    .replace(/@monopo\.london/gi, "@3drawers.agency")
    .replace(/contact@monopo\.london/gi, "contact@3drawers.agency")
    .replace(/jobs@monopo\.london/gi, "jobs@3drawers.agency")
    .replace(/freelance@monopo\.london/gi, "freelance@3drawers.agency")
    .replace(/press@monopo\.london/gi, "press@3drawers.agency")
    .replace(/monopo london/gi, "3Drawers Agency")
    .replace(/MONOPO LONDON/g, "3DRAWERS AGENCY")
    .replace(/Monopo London/g, "3Drawers Agency")
    .replace(/monopo_london/gi, "3drawers_agency")
    .replace(/<monopo-gradient/gi, "<agency-gradient")
    .replace(/<\/monopo-gradient>/gi, "</agency-gradient>")
    .replace(/\bmonopo\b/gi, (m) =>
      m[0] === "M" ? (m === "MONOPO" ? "3DRAWERS" : "3Drawers") : "3Drawers",
    )
    .replace(/https:\/\/monopo\.co\.jp\/?/gi, "#")
    .replace(/https:\/\/monopo\.nyc\/?/gi, "#")
    .replace(/https:\/\/monopo\.paris\/?/gi, "#")
    .replace(/Local reconstruction for authorized development\. Not an official Monopo site\./g,
      "3Drawers | Agency — design-driven creative studio.")
    .replace(/https:\/\/monopo\.london\//gi, "/")
    .replace(/Prismic monopolondon \(public API\)/gi, "Studio content")
    .replace(/reconstructedFrom":\s*"[^"]*"/, 'brand": "3Drawers | Agency"');
}

for (const rel of targets) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = rebrand(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log("updated", rel);
  } else {
    console.log("unchanged", rel);
  }
}

// package.json name
const pkgPath = path.join(root, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.name = "3drawers-agency";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("package name → 3drawers-agency");
