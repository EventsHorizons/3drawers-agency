<script setup lang="ts">
const route = useRoute();
const { site, getProject } = useSiteContent();
const uid = computed(() => String(route.params.uid));
const member = computed(() => site.members.find((m) => m.uid === uid.value));

if (!member.value) {
  throw createError({ statusCode: 404, statusMessage: "Team member not found" });
}

const related = computed(() =>
  (member.value?.relatedWorks || [])
    .map((id) => getProject(id))
    .filter(Boolean),
);

useHead({
  title: () => {
    const raw = member.value?.metaTitle || member.value?.name || "Team";
    return /3Drawers/i.test(raw) ? raw : `${raw} | 3Drawers Agency`;
  },
  meta: [
    {
      name: "description",
      content: () => member.value?.metaDescription || member.value?.bio || "",
    },
  ],
});
</script>

<template>
  <main v-if="member" id="main" class="member">
    <p class="back">
      <NuxtLink to="/team">← back to team</NuxtLink>
    </p>

    <header class="hero">
      <div class="copy">
        <p class="role">{{ member.role }}</p>
        <h1>{{ member.name }}</h1>
        <p v-if="member.headline" class="headline">{{ member.headline }}</p>
        <p v-if="member.nameJapanese" class="jp">{{ member.nameJapanese }}</p>
        <p class="bio">{{ member.bio }}</p>
        <ul v-if="member.links?.length" class="links">
          <li v-for="l in member.links" :key="l.url">
            <a :href="l.url" target="_blank" rel="noreferrer">{{ l.label }} ↗</a>
          </li>
        </ul>
      </div>
      <img
        v-if="member.image?.url"
        :src="member.image.url"
        :alt="member.name"
      />
    </header>

    <section v-if="member.funFacts?.length" class="facts">
      <h2>Fun facts</h2>
      <ul>
        <li v-for="(f, i) in member.funFacts" :key="i">
          <span aria-hidden="true">{{ f.emoji }}</span>
          {{ f.fact }}
        </li>
      </ul>
    </section>

    <section v-if="member.questions?.length" class="qa">
      <article v-for="(q, i) in member.questions" :key="i">
        <h2>{{ q.question }}</h2>
        <p>{{ q.answer }}</p>
      </article>
    </section>

    <section v-if="related.length" class="works">
      <h2>Selected work</h2>
      <ul>
        <li v-for="p in related" :key="p!.uid">
          <NuxtLink :to="`/work/${p!.uid}`">{{ p!.title }}</NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.member {
  background: #000;
  min-height: 100vh;
}
.back {
  margin: 0;
  padding: 1rem var(--gutter) 0;
}
.hero {
  display: grid;
  gap: 2rem;
  padding: 2rem var(--gutter) 3rem;
  max-width: 1440px;
  margin-inline: auto;
}
.role {
  margin: 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: var(--muted);
}
h1 {
  margin: 0.4rem 0;
  font-size: clamp(2.2rem, 5vw, 4rem);
  letter-spacing: -0.04em;
}
.headline {
  font-size: 1.25rem;
  color: #ddd;
}
.jp {
  color: var(--muted);
}
.bio {
  max-width: 40rem;
  white-space: pre-line;
  line-height: 1.55;
  color: #ccc;
}
.links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.links a {
  text-decoration: underline;
  color: var(--muted);
}
.hero img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #1a1a1a;
}
.facts,
.qa,
.works {
  padding: 2rem var(--gutter) 3rem;
  max-width: 1440px;
  margin-inline: auto;
}
.facts ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.facts li {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
}
.qa {
  display: grid;
  gap: 2rem;
}
.qa h2 {
  margin: 0 0 0.75rem;
  font-size: clamp(1.3rem, 3vw, 2rem);
  letter-spacing: -0.03em;
  max-width: 28ch;
}
.qa p {
  margin: 0;
  color: var(--muted);
  max-width: 42rem;
  line-height: 1.6;
  white-space: pre-line;
}
.works ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: start;
  }
}
</style>
