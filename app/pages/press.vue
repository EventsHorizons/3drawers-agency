<script setup lang="ts">
const { news, site } = useSiteContent();
const cats = computed(() => {
  const ordered = (site.newsCategories || []).map((c) => c.name).filter(Boolean);
  const base = ordered.length
    ? ordered
    : [...new Set(news.map((n) => n.category).filter(Boolean))].sort();
  return ["All", "Series", ...base];
});
const active = ref("All");
const visible = ref(12);
const counts = computed(() => {
  const map: Record<string, number> = {};
  for (const n of news) {
    if (!n.category) continue;
    map[n.category] = (map[n.category] || 0) + 1;
  }
  return map;
});

const filtered = computed(() => {
  if (active.value === "All" || active.value === "Series") return news;
  return news.filter((n) => n.category === active.value);
});
const shown = computed(() => filtered.value.slice(0, visible.value));
const showSeries = computed(() => active.value === "All" || active.value === "Series");

watch(active, () => {
  visible.value = 12;
});

useHead({ title: "Press & News | monopo london" });
</script>

<template>
  <main id="main" class="press">
    <header class="hero">
      <h1>{{ site.press.title || "Press & News" }}</h1>
    </header>
    <div class="body">
      <aside>
        <button
          v-for="c in cats"
          :key="c"
          type="button"
          :class="{ active: active === c }"
          :aria-pressed="active === c"
          @click="active = c"
        >
          → {{ c }}
          <em v-if="counts[c]">[{{ counts[c] }}]</em>
        </button>
      </aside>
      <div>
        <section v-if="showSeries && site.press.series?.length" class="series">
          <h2>Series</h2>
          <p class="series-lead">Designing for the future</p>
          <ul>
            <li v-for="s in site.press.series" :key="s.url">
              <a :href="s.url" target="_blank" rel="noreferrer">
                {{ s.title }} ↗
              </a>
            </li>
          </ul>
        </section>

        <ul v-if="active !== 'Series'" class="feed">
          <li v-for="item in shown" :key="item.uid">
            <a
              v-if="item.link"
              :href="item.link"
              target="_blank"
              rel="noreferrer"
            >
              <span>{{ item.date?.slice?.(0, 10) || item.date }}</span>
              <strong>{{ item.title }}</strong>
              <em>{{ item.category }} ↗</em>
            </a>
            <div v-else>
              <span>{{ item.date?.slice?.(0, 10) || item.date }}</span>
              <strong>{{ item.title }}</strong>
              <em>{{ item.category }}</em>
            </div>
          </li>
        </ul>
        <button
          v-if="active !== 'Series' && visible < filtered.length"
          type="button"
          class="more"
          @click="visible += 12"
        >
          ↓↓ LOAD MORE ↓↓
        </button>

        <section class="press-contact">
          <p>{{ site.press.contactDescription }}</p>
          <p>
            <a :href="site.press.contactUrl">{{ site.press.contactLabel }} →</a>
          </p>
          <p v-if="site.press.pressKitUrl">
            <a
              :href="site.press.pressKitUrl"
              target="_blank"
              rel="noreferrer"
            >
              {{ site.press.pressKitLabel }}
            </a>
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.press {
  background: #000;
  min-height: 100vh;
}
.hero {
  padding: 4rem var(--gutter) 2rem;
}
h1 {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 5rem);
  letter-spacing: -0.04em;
}
.body {
  display: grid;
  gap: 2rem;
  padding: 0 var(--gutter) 4rem;
  max-width: 1440px;
  margin-inline: auto;
}
aside {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
aside button {
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 0.2rem 0;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
  text-align: left;
}
aside button.active {
  color: #fff;
}
aside em {
  font-style: normal;
  opacity: 0.55;
  margin-left: 0.25rem;
}
.series {
  margin-bottom: 2.5rem;
}
.series h2 {
  margin: 0 0 0.35rem;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
}
.series-lead {
  color: var(--muted);
  margin: 0 0 1rem;
}
.series ul,
.feed {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}
.feed li a,
.feed li > div,
.series a {
  display: grid;
  gap: 0.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--line);
}
span,
em {
  color: var(--muted);
  font-size: 0.8rem;
  font-style: normal;
}
.more {
  margin-top: 2rem;
  border: 1px solid var(--line);
  background: transparent;
  color: #fff;
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  letter-spacing: 0.1em;
}
.press-contact {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--line);
}
.press-contact a {
  text-decoration: underline;
}
@media (min-width: 900px) {
  .body {
    grid-template-columns: 14rem 1fr;
  }
  aside {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
