import fs from "fs";
import path from "path";

const REF = "akvuMxEAAC0A2Qiu";
const BASE = "https://monopolondon.cdn.prismic.io/api/v2/documents/search";
const outDir = "research/payloads";

async function fetchType(type, pageSize = 100) {
  const q = encodeURIComponent(`[[at(document.type,"${type}")]]`);
  const url = `${BASE}?ref=${REF}&q=${q}&pageSize=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${type} ${res.status}`);
  return res.json();
}

function rich(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks.map((b) => b.text || "").filter(Boolean).join("\n");
}

function cats(data) {
  return (data.categories || [])
    .map((c) => {
      const linked = c.category;
      if (linked?.data?.name) return rich(linked.data.name);
      if (linked?.uid) return linked.uid;
      return null;
    })
    .filter(Boolean);
}

function normalizeProject(doc) {
  const d = doc.data;
  const body = (d.body || []).map((slice, i) => ({
    index: i,
    type: slice.slice_type,
    primary: slice.primary || {},
    items: slice.items || [],
  }));
  return {
    uid: doc.uid,
    id: doc.id,
    title: rich(d.title),
    color: d.color || null,
    gradient: d.gradient || null,
    categories: cats(d),
    thumbnail: d.thumbnail?.url || null,
    imageHomepage: d.image_homepage?.url || null,
    cover: d.cover?.url || null,
    live: d.live?.url || null,
    client: rich(d.client),
    roles: rich(d.roles),
    deliverables: rich(d.deliverables),
    date: rich(d.date),
    intro: rich(d.intro_text),
    body,
    metaTitle: rich(d.meta_title) || rich(d.title),
    metaDescription: rich(d.meta_description),
  };
}

const types = [
  "project",
  "category",
  "homepage",
  "services",
  "team",
  "member",
  "contact",
  "press",
  "news",
  "news_category",
  "cookie_policy",
  "layout",
  "works",
];

const bag = {};
for (const type of types) {
  const data = await fetchType(type);
  bag[type] = data.results;
  console.log(type, data.results_size, "/", data.total_results_size);
  fs.writeFileSync(path.join(outDir, `prismic-${type}.json`), JSON.stringify(data, null, 2));
}

const projects = bag.project.map(normalizeProject);
fs.writeFileSync(
  path.join(outDir, "normalized-projects.json"),
  JSON.stringify(projects, null, 2),
);

const categories = bag.category.map((c) => ({
  uid: c.uid,
  name: rich(c.data.name),
}));
fs.writeFileSync(path.join(outDir, "normalized-categories.json"), JSON.stringify(categories, null, 2));

console.log("normalized projects", projects.length);
