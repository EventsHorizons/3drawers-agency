<script setup lang="ts">
const { projects, categories, site, getProject } = useSiteContent();
const active = ref("All");
const collectionIndex = ref(0);

const counts = computed(() => {
  const map: Record<string, number> = {};
  for (const c of categories) map[c.name] = 0;
  for (const p of projects) {
    for (const cat of p.categories) {
      map[cat] = (map[cat] || 0) + 1;
    }
  }
  return map;
});

const filtered = computed(() => {
  if (active.value === "All") return projects;
  return projects.filter((p) =>
    p.categories.some((c) => c.toLowerCase() === active.value.toLowerCase()),
  );
});

const collections = computed(() => site.worksPage.collections || []);
const currentCollection = computed(() => {
  const list = collections.value;
  if (!list.length) return null;
  return list[collectionIndex.value % list.length];
});
const collectionProjects = computed(() =>
  (currentCollection.value?.projectUids || [])
    .map((uid) => getProject(uid))
    .filter(Boolean),
);

function nextCollection() {
  if (!collections.value.length) return;
  collectionIndex.value = (collectionIndex.value + 1) % collections.value.length;
}

useHead({ title: "Work | monopo london" });
</script>

<template>
  <main id="main" class="work-page">
    <header class="work-hero">
      <MonopoGradient
        class="hero-fx"
        :markup="site.worksPage.gradient"
        :show-pause="false"
      />
      <div class="hero-copy">
        <h1>
          {{ site.worksPage.title || "We choose a different → starting point" }}
        </h1>
        <p>
          {{
            site.worksPage.baseline ||
            "Every project is a chance to try something new. Look at something with a fresh perspective. Do something for the first time."
          }}
        </p>
      </div>
    </header>
    <div class="work-body">
      <ProjectFilters
        v-model="active"
        :categories="categories"
        :counts="counts"
        :total="projects.length"
      />
      <div>
        <p v-if="!filtered.length" class="empty">No projects in this category.</p>
        <ProjectGrid v-else :projects="filtered" />
      </div>
    </div>

    <section v-if="currentCollection" class="collections">
      <p class="sub">{{ currentCollection.subtitle || "What we could do together" }}</p>
      <h2>{{ currentCollection.title }}</h2>
      <ul>
        <li v-for="p in collectionProjects" :key="p!.uid">
          <NuxtLink :to="`/work/${p!.uid}`">
            <img
              v-if="p!.thumbnail?.url || p!.cover?.url"
              :src="(p!.thumbnail || p!.cover)!.url"
              :alt="p!.title"
              loading="lazy"
            />
            <span>{{ p!.title }}</span>
          </NuxtLink>
        </li>
      </ul>
      <button type="button" class="refresh" @click="nextCollection">
        Click here to discover more collections →
      </button>
    </section>
  </main>
</template>

<style scoped>
.work-page {
  background: #f4f2ec;
  color: #111;
  min-height: 100vh;
}
.work-hero {
  position: relative;
  padding: 4rem var(--gutter) 2.5rem;
  color: #fff;
  overflow: hidden;
  min-height: 42vh;
}
.hero-fx {
  position: absolute !important;
  inset: 0;
}
.hero-copy {
  position: relative;
  z-index: 1;
}
h1 {
  margin: 0;
  max-width: 14ch;
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  letter-spacing: -0.04em;
  line-height: 0.98;
  font-weight: 700;
}
.work-hero p {
  max-width: 34rem;
  margin: 1rem 0 0;
  opacity: 0.85;
}
.work-body {
  display: grid;
  gap: 2rem;
  padding: 2rem var(--gutter) 4rem;
  max-width: 1440px;
  margin-inline: auto;
}
.empty {
  color: #666;
}
.collections {
  padding: 3rem var(--gutter) 5rem;
  max-width: 1440px;
  margin-inline: auto;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.sub {
  margin: 0;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #666;
}
.collections h2 {
  margin: 0.5rem 0 1.5rem;
  font-size: clamp(1.8rem, 4vw, 3rem);
  letter-spacing: -0.03em;
}
.collections ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}
.collections a {
  display: grid;
  gap: 0.5rem;
  color: inherit;
}
.collections img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: #ddd;
}
.refresh {
  margin-top: 1.5rem;
  border: 1px solid #111;
  background: transparent;
  border-radius: 999px;
  padding: 0.65rem 1.1rem;
  letter-spacing: 0.04em;
}
@media (min-width: 800px) {
  .collections ul {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 900px) {
  .work-body {
    grid-template-columns: 11rem 1fr;
  }
}
</style>
