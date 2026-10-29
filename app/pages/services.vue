<script setup lang="ts">
const { site } = useSiteContent();
const s = site.services;
useHead({ title: "Services | monopo london" });
</script>

<template>
  <main id="main" class="services">
    <header class="hero">
      <MonopoGradient class="hero-fx" :markup="s.gradient" :show-pause="false" />
      <div class="hero-copy">
        <h1>{{ s.title || "We build expressive brands" }}</h1>
        <p>{{ s.baseline || s.introduction }}</p>
      </div>
    </header>

    <section class="groups">
      <article v-for="g in s.groups" :key="g.title">
        <h2>{{ g.title }}</h2>
        <ul>
          <li v-for="item in g.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>

    <section v-for="(call, i) in s.calls" :key="i" class="call" :class="{ invert: i % 2 === 1 }">
      <div class="call-copy">
        <h2>{{ call.title }}</h2>
        <p class="baseline">{{ call.baseline }}</p>
        <p>{{ call.text }}</p>
        <blockquote v-if="call.quote">
          <p>{{ call.quote }}</p>
          <footer v-if="call.quoteAuthor">{{ call.quoteAuthor }}</footer>
        </blockquote>
        <NuxtLink v-if="i === 0" class="ghost" to="/team">
          {{ call.linkLabel || "Meet the team →" }}
        </NuxtLink>
        <NuxtLink v-else-if="i === 0" class="ghost" to="/work">Discover all projects →</NuxtLink>
      </div>
      <img
        v-if="call.image?.url"
        :src="call.image.url"
        :alt="call.title"
        loading="lazy"
      />
    </section>

    <section class="awards">
      <h2>{{ s.awardsTitle || "Awards & recognition" }}</h2>
      <p>{{ s.awardsBaseline }}</p>
      <ul>
        <li v-for="(a, i) in s.awards" :key="i">
          <a v-if="a.link" :href="a.link" target="_blank" rel="noreferrer">
            {{ a.date }} {{ a.title }} ↗
          </a>
          <span v-else>{{ a.date }} {{ a.title }}</span>
        </li>
      </ul>
      <NuxtLink class="ghost" to="/press">VISIT OUR PRESS PAGE →</NuxtLink>
    </section>

    <section class="cta">
      <h2>{{ s.contactTitle || "Let’s work → together" }}</h2>
      <p>{{ s.contactText }}</p>
      <a :href="`mailto:${s.contactEmail}`">{{ s.contactEmail }}</a>
      <NuxtLink class="ghost" to="/contact">
        {{ s.linkContact || "GO TO THE CONTACT PAGE →" }}
      </NuxtLink>
    </section>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 4rem var(--gutter) 2rem;
  overflow: hidden;
  min-height: 40vh;
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
  max-width: 16ch;
  font-size: clamp(2.4rem, 6vw, 4.8rem);
  letter-spacing: -0.04em;
  line-height: 0.98;
}
.hero p {
  max-width: 40rem;
  margin-top: 1rem;
  color: var(--muted);
}
.groups {
  display: grid;
  gap: 2rem;
  padding: 3rem var(--gutter);
  max-width: 1440px;
  margin-inline: auto;
}
.groups h2 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  letter-spacing: -0.03em;
}
.groups ul {
  list-style: none;
  margin: 0;
  padding: 0;
  color: var(--muted);
  display: grid;
  gap: 0.35rem;
}
.call {
  display: grid;
  gap: 1.5rem;
  padding: 3rem var(--gutter);
  max-width: 1440px;
  margin-inline: auto;
}
.call.invert {
  background: #f4f2ec;
  color: #111;
  max-width: none;
}
.call.invert > * {
  max-width: 1440px;
  margin-inline: auto;
  width: 100%;
}
.call h2 {
  margin: 0 0 0.75rem;
  font-size: clamp(1.8rem, 4vw, 3rem);
}
.baseline {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--muted);
}
blockquote {
  margin: 1.5rem 0;
  font-size: 1.2rem;
  font-style: italic;
}
.ghost {
  display: inline-flex;
  margin-top: 1rem;
  padding: 0.65rem 1.1rem;
  border: 1px solid currentColor;
  border-radius: 999px;
}
.awards,
.cta {
  padding: 3rem var(--gutter);
  max-width: 1440px;
  margin-inline: auto;
}
.awards ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.65rem;
}
@media (min-width: 900px) {
  .groups {
    grid-template-columns: repeat(3, 1fr);
  }
  .call {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
}
</style>
