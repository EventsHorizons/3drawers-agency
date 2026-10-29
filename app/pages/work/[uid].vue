<script setup lang="ts">
const route = useRoute();
const { getProject, projects } = useSiteContent();
const uid = computed(() => String(route.params.uid));
const project = computed(() => getProject(uid.value));

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

const related = computed(() =>
  projects
    .filter(
      (p) =>
        p.uid !== uid.value &&
        p.categories.some((c) => project.value!.categories.includes(c)),
    )
    .slice(0, 3),
);

useHead({
  title: () => {
    const raw = project.value?.metaTitle || project.value?.title || "Work";
    return /3Drawers/i.test(raw) ? raw : `${raw} | 3Drawers Agency`;
  },
  meta: [
    {
      name: "description",
      content: () => project.value?.metaDescription || project.value?.intro || "",
    },
  ],
});
</script>

<template>
  <main v-if="project" id="main" class="case">
    <p class="back">
      <NuxtLink to="/work">← back to work</NuxtLink>
    </p>
    <section class="hero">
      <img
        v-if="project.cover?.url"
        :src="project.cover.url"
        :alt="project.title"
      />
      <div class="hero-copy">
        <p class="cats">{{ project.categories.join(" · ") }}</p>
        <h1>{{ project.title }}</h1>
      </div>
    </section>

    <section class="meta">
      <dl>
        <div v-if="project.client">
          <dt>Client</dt>
          <dd>{{ project.client }}</dd>
        </div>
        <div v-if="project.roles">
          <dt>Role</dt>
          <dd>{{ project.roles }}</dd>
        </div>
        <div v-if="project.deliverables">
          <dt>Deliverables</dt>
          <dd>{{ project.deliverables }}</dd>
        </div>
        <div v-if="project.date">
          <dt>Date</dt>
          <dd>{{ project.date }}</dd>
        </div>
      </dl>
      <div v-if="project.introLeft || project.introRight" class="intro-split">
        <p v-if="project.introLeft">{{ project.introLeft }}</p>
        <p v-if="project.introRight">{{ project.introRight }}</p>
      </div>
      <p v-else-if="project.intro" class="intro">{{ project.intro }}</p>
      <p v-if="project.live">
        <a :href="project.live" target="_blank" rel="noreferrer">See live ↗</a>
      </p>
    </section>

    <ProjectSlices :body="project.body" />

    <section v-if="related.length" class="related">
      <h2>Discover more</h2>
      <ul>
        <li v-for="r in related" :key="r.uid">
          <NuxtLink :to="`/work/${r.uid}`">{{ r.title }}</NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.case {
  background: #000;
  color: #fff;
}
.back {
  padding: 1rem var(--gutter) 0;
  margin: 0;
}
.hero {
  position: relative;
  min-height: 62vh;
  display: grid;
  align-content: end;
}
.hero img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 35%, rgba(0, 0, 0, 0.8));
}
.hero-copy {
  position: relative;
  z-index: 1;
  padding: 3rem var(--gutter);
  max-width: 1440px;
  width: 100%;
  margin-inline: auto;
}
.cats {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: #d4a574;
}
h1 {
  margin: 0.4rem 0 0;
  font-size: clamp(2rem, 5vw, 4.2rem);
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-weight: 700;
}
.meta {
  padding: 2rem var(--gutter);
  max-width: 1440px;
  margin-inline: auto;
}
dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 1rem;
  margin: 0;
}
dt {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
dd {
  margin: 0.25rem 0 0;
}
.intro {
  max-width: 42rem;
  margin: 1.5rem 0 0;
  font-size: 1.1rem;
}
.intro-split {
  display: grid;
  gap: 1.25rem;
  margin: 1.5rem 0 0;
}
.intro-split p {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  color: #ddd;
}
@media (min-width: 900px) {
  .intro-split {
    grid-template-columns: 1fr 1.2fr;
  }
}
.related {
  padding: 2rem var(--gutter) 4rem;
}
.related ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
</style>
