import fs from "node:fs";

const j = JSON.parse(
  fs.readFileSync("research/rea-captures/inspect-local-post-intro.json", "utf8"),
);
const n = j.normalized_result;
const a11y = JSON.stringify(n.accessibility || {});
const texts = [...a11y.matchAll(/"name":"([^"]{6,100})"/g)]
  .map((m) => m[1])
  .filter((t) =>
    /Based|collective|Recent|Enter|Born|Design|Branding|Pause|work|London|creativity|brand/i.test(
      t,
    ),
  )
  .slice(0, 50);
const blob = a11y + JSON.stringify(n.dom || {});
const hints = [
  ...new Set(
    blob.match(
      /MonopoGradient|monopo-gradient|canvas|WebGL|Pixi|Pause|RECENT|Based in London|collective|CANVAS/gi,
    ) || [],
  ),
];
console.log(
  JSON.stringify(
    {
      url: n.target?.url,
      confidence: j.confidence,
      hints,
      texts,
      a11y_nodes: n.accessibility?.total_nodes,
    },
    null,
    2,
  ),
);
