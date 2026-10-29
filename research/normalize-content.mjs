import fs from "fs";
import path from "path";

const out = "content";
fs.mkdirSync(out, { recursive: true });

function rich(blocks) {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks.map((b) => b.text || "").filter(Boolean).join("\n");
}

function richHtml(blocks) {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) => {
      const t = (b.text || "").replace(/\n/g, "<br/>");
      if (b.type?.startsWith("heading")) return `<${b.type.replace("heading", "h")}>${t}</${b.type.replace("heading", "h")}>`;
      return `<p>${t}</p>`;
    })
    .join("");
}

function img(field) {
  if (!field?.url) return null;
  return {
    url: field.url,
    alt: field.alt || "",
    width: field.dimensions?.width || null,
    height: field.dimensions?.height || null,
  };
}

const categories = JSON.parse(fs.readFileSync("research/payloads/prismic-category.json", "utf8")).results.map(
  (c) => ({ uid: c.uid, name: rich(c.data.name), id: c.id }),
);
const catByUid = Object.fromEntries(categories.map((c) => [c.uid, c.name]));
const catById = Object.fromEntries(categories.map((c) => [c.id, c.name]));

function cats(data) {
  return (data.categories || [])
    .map((c) => {
      const linked = c.category;
      if (linked?.data?.name) return rich(linked.data.name);
      return catById[linked?.id] || catByUid[linked?.uid] || linked?.uid || null;
    })
    .filter(Boolean);
}

function normalizeSlice(slice, i) {
  const primary = slice.primary || {};
  const items = (slice.items || []).map((it) => ({
    image: img(it.image),
    video: it.video?.url || null,
    caption: rich(it.caption),
  }));
  return {
    index: i,
    type: slice.slice_type,
    subtitle: rich(primary.subtitle),
    title: rich(primary.title1 || primary.title),
    paragraph: rich(primary.paragraph),
    paragraphHtml: richHtml(primary.paragraph),
    images: items.map((x) => x.image).filter(Boolean),
    videos: items.map((x) => x.video).filter(Boolean),
    items,
    primaryImage: img(primary.image),
  };
}

function labels(field) {
  if (typeof field === "string") return field;
  if (!Array.isArray(field)) return rich(field);
  if (field[0]?.label != null) {
    return field
      .map((x) => x.label)
      .filter(Boolean)
      .join(" · ");
  }
  return rich(field);
}

function introText(field) {
  if (!Array.isArray(field) || !field.length) return rich(field);
  if (field[0]?.left || field[0]?.right) {
    return field
      .map((block) => {
        const left = rich(block.left);
        const right = rich(block.right);
        return [left, right].filter(Boolean).join("\n\n");
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return rich(field);
}

const projectsRaw = JSON.parse(fs.readFileSync("research/payloads/prismic-projects.json", "utf8")).results;
const projects = projectsRaw.map((doc) => {
  const d = doc.data;
  return {
    uid: doc.uid,
    title: rich(d.title),
    color: d.color || "#000000",
    categories: cats(d),
    thumbnail: img(d.thumbnail),
    imageHomepage: img(d.image_homepage),
    cover: img(d.cover),
    live: d.live?.url || null,
    client: typeof d.client === "string" ? d.client : rich(d.client),
    roles: labels(d.roles),
    deliverables: labels(d.deliverables),
    date: typeof d.date === "string" ? d.date : rich(d.date),
    intro: introText(d.intro_text),
    introLeft: Array.isArray(d.intro_text) ? rich(d.intro_text[0]?.left) : "",
    introRight: Array.isArray(d.intro_text) ? rich(d.intro_text[0]?.right) : "",
    body: (d.body || []).map(normalizeSlice),
    metaTitle: rich(d.meta_title) || rich(d.title),
    metaDescription: rich(d.meta_description),
  };
});

const homepage = JSON.parse(fs.readFileSync("research/payloads/prismic-homepage.json", "utf8")).results[0].data;
const services = JSON.parse(fs.readFileSync("research/payloads/prismic-services.json", "utf8")).results[0].data;
const teamPage = JSON.parse(fs.readFileSync("research/payloads/prismic-team.json", "utf8")).results[0].data;
const members = JSON.parse(fs.readFileSync("research/payloads/prismic-member.json", "utf8")).results.map((m) => {
  const d = m.data;
  return {
    uid: m.uid,
    name: rich(d.name) || m.uid,
    headline: rich(d.title),
    nameJapanese: rich(d.name_japanese),
    role:
      (d.roles || [])
        .map((r) => r.label)
        .filter(Boolean)
        .join(" · ") || rich(d.title),
    bio: rich(d.introduction_text),
    image: img(d.image || d.portrait || d.photo),
    imageReveal: img(d.image_reveal),
    links: (d.links || [])
      .map((l) => ({ label: l.label, url: l.link?.url }))
      .filter((l) => l.url),
    funFacts: (d.fun_facts || [])
      .map((f) => ({ fact: f.fact || rich(f.fact), emoji: f.emoji || "" }))
      .filter((f) => f.fact),
    questions: (d.questions || []).map((q) => ({
      question: rich(q.question),
      answer: rich(q.answer),
      image: img(q.question_image) || img(q.question_image?.retina) || img(q.question_image?.thumb),
    })),
    relatedWorks: (d.works || [])
      .map((w) => w.project?.uid || w.uid)
      .filter(Boolean),
    metaTitle: rich(d.meta_title) || rich(d.name),
    metaDescription: rich(d.meta_description) || rich(d.introduction_text),
  };
});
const contact = JSON.parse(fs.readFileSync("research/payloads/prismic-contact.json", "utf8")).results[0].data;
const press = JSON.parse(fs.readFileSync("research/payloads/prismic-press.json", "utf8")).results[0].data;
const newsCategories = JSON.parse(fs.readFileSync("research/payloads/prismic-news_category.json", "utf8")).results.map(
  (c) => ({ uid: c.uid, name: rich(c.data.name), id: c.id }),
);
const newsCatById = Object.fromEntries(newsCategories.map((c) => [c.id, c.name]));
const newsCatByUid = Object.fromEntries(newsCategories.map((c) => [c.uid, c.name]));
const news = JSON.parse(fs.readFileSync("research/payloads/prismic-news.json", "utf8")).results.map((n) => {
  const cat = n.data.category;
  const category =
    rich(cat?.data?.name) || newsCatById[cat?.id] || newsCatByUid[cat?.uid] || cat?.uid || cat?.slug || "";
  return {
    uid: n.uid,
    title: rich(n.data.title),
    date: n.data.date || n.first_publication_date,
    category,
    image: img(n.data.image || n.data.cover || n.data.thumbnail),
    link: n.data.link?.url || null,
  };
});
const policy = JSON.parse(fs.readFileSync("research/payloads/prismic-cookie_policy.json", "utf8")).results[0].data;
const layout = JSON.parse(fs.readFileSync("research/payloads/prismic-layout.json", "utf8")).results[0].data;
const works = JSON.parse(fs.readFileSync("research/payloads/prismic-works.json", "utf8")).results[0].data;

const site = {
  reconstructedFrom: "https://monopo.london/",
  cms: "Prismic monopolondon (public API)",
  note: "Local reconstruction for authorized development. Not an official Monopo site.",
  homepage: {
    title: rich(homepage.title),
    titleJapanese: rich(homepage.title_japanese),
    manifesto: rich(homepage.manifesto),
    gradient: homepage.gradient || null,
    featuredUids: (homepage.projects || [])
      .map((p) => p.project?.uid)
      .filter(Boolean),
  },
  worksPage: {
    title: rich(works.title),
    subtitle: rich(works.subtitle),
    baseline: rich(works.paragraph || works.baseline || works.introduction || works.intro),
    japaneseTitle: rich(works.japanese_title),
    gradient: works.gradient || null,
    collections: (works.collections || []).map((c) => ({
      subtitle: rich(c.collection_subtitle),
      title: rich(c.collection_title),
      projectUids: [
        c.collection_project_one?.uid,
        c.collection_project_two?.uid,
        c.collection_project_three?.uid,
      ].filter(Boolean),
    })),
  },
  services: {
    title: rich(services.title),
    baseline: rich(services.baseline),
    introduction: rich(services.introduction_text),
    gradient: services.gradient || null,
    linkWorks: rich(services.link_label_works),
    groups: [
      { title: rich(services.service_one_title), items: rich(services.service_one_list).split("\n").filter(Boolean) },
      { title: rich(services.service_two_title), items: rich(services.service_two_list).split("\n").filter(Boolean) },
      { title: rich(services.service_three_title), items: rich(services.service_three_list).split("\n").filter(Boolean) },
    ],
    calls: [
      {
        title: rich(services.call_us_one_title),
        baseline: rich(services.call_us_one_baseline),
        text: rich(services.call_us_one_text),
        image: img(services.call_us_one_image),
        linkLabel: rich(services.link_label_team),
      },
      {
        title: rich(services.call_us_two_title),
        baseline: rich(services.call_us_two_baseline),
        text: rich(services.call_us_two_text),
        quote: rich(services.call_us_two_quote),
        quoteAuthor: rich(services.call_us_two_quote_author),
        image: img(services.call_us_two_image),
      },
      {
        title: rich(services.call_us_three_title),
        baseline: rich(services.call_us_three_baseline),
        text: rich(services.call_us_three_text),
        quote: rich(services.call_us_three_quote),
        quoteAuthor: rich(services.call_us_three_quote_author),
      },
    ],
    clientsTitle: rich(services.clients_title),
    awardsTitle: rich(services.awards_title),
    awardsBaseline: rich(services.awards_baseline),
    awards: (services.awards || []).map((a) => ({
      date: rich(a.date),
      title: rich(a.title),
      link: a.link?.url || null,
    })),
    contactTitle: rich(services.contact_title),
    contactText: rich(services.contact_text),
    contactEmail: rich(services.contact_email) || "contact@monopo.london",
    linkContact: rich(services.link_label_contact),
  },
  team: {
    titleLines: (() => {
      const block = Array.isArray(teamPage.title) ? teamPage.title[0] : null;
      if (!block) return ["We seek", "unique", "perspectives"];
      return ["line_one", "line_two", "line_three"]
        .map((k) => rich(block[k]))
        .filter(Boolean);
    })(),
    baseline: rich(teamPage.baseline),
    introduction: rich(teamPage.introduction_text),
    membersTitle: rich(teamPage.members_title),
    gradient: teamPage.gradient || null,
    weAre: {
      titleLines: (() => {
        const block = Array.isArray(teamPage.we_are_title) ? teamPage.we_are_title[0] : {};
        return ["line_one", "line_two", "line_three", "line_four"]
          .map((k) => (typeof block[k] === "string" ? block[k] : rich(block[k])))
          .filter(Boolean);
      })(),
      baseline: rich(teamPage.we_are_baseline),
      text: rich(teamPage.we_are_text),
      image: img(teamPage.we_are_image),
    },
    tokyo: {
      date: rich(teamPage.tokyo_founders_date) || String(teamPage.tokyo_founders_date || ""),
      title: rich(teamPage.tokyo_founders_title),
      founders: (teamPage.tokyo_founders || []).map((f) => f.name).filter(Boolean),
      text: rich(teamPage.tokyo_founders_text),
      image: img(teamPage.tokyo_founders_image),
    },
    london: {
      date: rich(teamPage.london_founders_date) || String(teamPage.london_founders_date || ""),
      title: rich(teamPage.london_founders_title),
      founders: (teamPage.london_founders || []).map((f) => f.name).filter(Boolean),
      text: rich(teamPage.london_founders_text),
      image: img(teamPage.london_founders_image),
    },
    places: (teamPage.places || []).map((p) => ({
      text: rich(p.number_of_members),
      link: p.link?.url || null,
      linkLabel: p.link_label || null,
    })),
    community: {
      title: rich(teamPage.community_title),
      text: rich(teamPage.community_text),
      list: (teamPage.community_list || []).map((c) => c.label).filter(Boolean),
      image: img(teamPage.community_image),
    },
    studioTitle: rich(teamPage.studio_title),
    studioGallery: (teamPage.studio_gallery || []).map((g) => img(g.image)).filter(Boolean),
    jobsTitle: rich(teamPage.jobs_title),
    careersTitle: rich(teamPage.careers_title),
    careersParagraph: rich(teamPage.careers_paragraph),
    freelanceTitle: rich(teamPage.freelance_title),
    freelanceParagraph: rich(teamPage.freelance_paragraph),
  },
  members,
  contact: {
    intro: rich(contact.contact),
    email:
      (contact.contact_email || [])
        .map((e) => e.label || e.link?.url?.replace(/^mailto:/, ""))
        .filter(Boolean)[0] || "contact@monopo.london",
    emailUrl:
      (contact.contact_email || []).map((e) => e.link?.url).filter(Boolean)[0] ||
      "mailto:contact@monopo.london",
    address: rich(contact.address),
    mapsLabel: (contact.google_maps || []).map((g) => g.label).filter(Boolean)[0] || "view on google maps",
    mapsUrl: (contact.google_maps || []).map((g) => g.link?.url).filter(Boolean)[0] || null,
    formTitle: rich(contact.form_title),
    formParagraph: rich(contact.form_paragraph),
    careersTitle: rich(contact.careers_title),
    careersParagraph: rich(contact.careers_paragraph),
    freelanceTitle: rich(contact.freelance_title),
    freelanceParagraph: rich(contact.freelance_paragraph),
  },
  press: {
    title: rich(press.title) || "Press & News",
    contactDescription: rich(press.contact_description),
    contactLabel: rich(press.contact_link_label) || "press@monopo.london",
    contactUrl: press.contact_link_url?.url || "mailto:press@monopo.london",
    pressKitLabel: rich(press.contact_press_kit_label) || "DOWNLOAD OUR PRESS KIT",
    pressKitUrl: press.contact_press_kit?.url || null,
    // Series is a UI section on the live site (LinkedIn Pulse), not a Prismic news_category.
    series: [
      {
        title: "Vol 01 — Creative is the powerful fuel to new energy",
        url: "https://www.linkedin.com/pulse/creative-powerful-fuel-new-energy-designing-our-future-series-monopo-/",
      },
      {
        title: "Vol 02 — Sustainability in Fashion",
        url: "https://www.linkedin.com/pulse/sustainability-fashion-designing-our-future-series-monopo-monopo/",
      },
      {
        title: "Vol 03 — Designing for the future of food",
        url: "https://www.linkedin.com/pulse/future-food-designing-our-series-monopo-monopo/",
      },
    ],
  },
  news,
  newsCategories,
  policy: {
    title: rich(policy.title),
    subtitle: rich(policy.subtitle),
    gradient: policy.gradient || null,
    body: Array.isArray(policy.wysiwyg)
      ? policy.wysiwyg.map((b) => ({ type: b.type, text: b.text || "" }))
      : [],
  },
  layout: {
    raw: layout,
  },
  categories,
  projects,
};

fs.writeFileSync(path.join(out, "site.json"), JSON.stringify(site, null, 2));
fs.writeFileSync(path.join(out, "projects.json"), JSON.stringify(projects, null, 2));
fs.writeFileSync(path.join(out, "categories.json"), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(out, "news.json"), JSON.stringify(news, null, 2));

console.log("Wrote content/", {
  projects: projects.length,
  categories: categories.length,
  news: news.length,
  members: members.length,
  featured: site.homepage.featuredUids,
});
