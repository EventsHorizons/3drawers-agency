import fs from "fs";

const j = JSON.parse(fs.readFileSync("research/rea-captures/inspect-home-raw.json", "utf8"));
const n = j.normalized_result;

const scripts = (n.scripts?.items || []).map((s) => ({
  url: s.url || s.source_url || s.request_url,
  bytes: s.byte_length || s.size || s.content?.byte_length,
  has_source: !!(s.source || s.content || s.text),
}));

const resources = n.resources?.items || n.resources || [];
const resArr = Array.isArray(resources) ? resources : resources.items || [];
const byType = {};
for (const r of resArr) {
  const t = r.type || r.resource_type || r.mime_type || "unknown";
  byType[t] = (byType[t] || 0) + 1;
}

const network = n.network?.transactions || n.network?.items || n.network?.requests || [];
const netArr = Array.isArray(network) ? network : [];
const urls = netArr
  .map((t) => t.url || t.request?.url || t.response?.url)
  .filter(Boolean);

const canvasHints = JSON.stringify(n.dom || {}).match(/Pixi|canvas|monopo-gradient|WebGL|c-Pixi|c-Home|c-Header/gi);
const uniqueHints = [...new Set(canvasHints || [])].slice(0, 40);

const a11y = n.accessibility;
const a11yText = typeof a11y === "string" ? a11y.slice(0, 3000) : JSON.stringify(a11y).slice(0, 3000);

const out = {
  operation: j.operation,
  evidence_id: j.evidence_id,
  confidence: j.confidence,
  url: n.target?.url,
  title: n.target?.title,
  script_count: n.scripts?.total ?? scripts.length,
  scripts_sample: scripts.slice(0, 30),
  resource_type_counts: byType,
  network_count: netArr.length,
  network_sample: urls.slice(0, 40),
  dom_class_hints: uniqueHints,
  console_events: (n.console?.items || n.console?.events || []).slice(0, 20),
  limitations: [...(j.limitations || []), ...(n.limitations || [])].slice(0, 30),
  accessibility_excerpt: a11yText,
};

fs.writeFileSync("research/rea-captures/inspect-home-summary.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2).slice(0, 6000));
