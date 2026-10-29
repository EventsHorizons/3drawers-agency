<script setup lang="ts">
const { site } = useSiteContent();
const team = site.team;
const members = site.members;
useHead({ title: "Team | monopo london" });
</script>

<template>
  <main id="main" class="team">
    <header class="hero">
      <MonopoGradient
        class="hero-fx"
        :markup="team.gradient"
        :show-pause="false"
      />
      <div class="hero-copy">
        <p v-if="team.baseline" class="baseline">{{ team.baseline }}</p>
        <h1>
          <span v-for="(line, i) in team.titleLines" :key="i">{{ line }}</span>
        </h1>
        <p class="intro">{{ team.introduction }}</p>
      </div>
    </header>

    <section class="members">
      <h2>{{ team.membersTitle || "Meet our london team" }}</h2>
      <div class="grid">
        <article v-for="m in members" :key="m.uid">
          <NuxtLink :to="`/team/${m.uid}`" class="member-link">
            <img
              v-if="m.image?.url"
              :src="m.image.url"
              :alt="m.name"
              loading="lazy"
            />
            <div v-else class="ph" aria-hidden="true" />
            <h3>{{ m.name }}</h3>
            <p>{{ m.role }}</p>
          </NuxtLink>
        </article>
      </div>
    </section>

    <section class="we-are">
      <div>
        <p class="baseline">{{ team.weAre.baseline }}</p>
        <h2>
          <span v-for="(line, i) in team.weAre.titleLines" :key="i">{{ line }}</span>
        </h2>
        <p>{{ team.weAre.text }}</p>
      </div>
      <img
        v-if="team.weAre.image?.url"
        :src="team.weAre.image.url"
        alt=""
        loading="lazy"
      />
    </section>

    <section class="founders tokyo">
      <p class="date">{{ team.tokyo.date }}</p>
      <div class="copy">
        <h2>{{ team.tokyo.title }}</h2>
        <p class="names">{{ team.tokyo.founders.join(" · ") }}</p>
        <p>{{ team.tokyo.text }}</p>
      </div>
      <img
        v-if="team.tokyo.image?.url"
        :src="team.tokyo.image.url"
        alt=""
        loading="lazy"
      />
    </section>

    <section class="founders london">
      <p class="date">{{ team.london.date }}</p>
      <div class="copy">
        <h2>{{ team.london.title }}</h2>
        <p class="names">{{ team.london.founders.join(" · ") }}</p>
        <p>{{ team.london.text }}</p>
      </div>
      <img
        v-if="team.london.image?.url"
        :src="team.london.image.url"
        alt=""
        loading="lazy"
      />
    </section>

    <section class="places">
      <article v-for="(p, i) in team.places" :key="i">
        <p class="place-text">{{ p.text }}</p>
        <a
          v-if="p.link"
          :href="p.link"
          target="_blank"
          rel="noreferrer"
        >
          {{ p.linkLabel || "visit" }} ↗
        </a>
      </article>
    </section>

    <section class="community">
      <div>
        <h2>{{ team.community.title }}</h2>
        <p>{{ team.community.text }}</p>
        <ul>
          <li v-for="(label, i) in team.community.list" :key="i">{{ label }}</li>
        </ul>
      </div>
      <img
        v-if="team.community.image?.url"
        :src="team.community.image.url"
        alt=""
        loading="lazy"
      />
    </section>

    <section class="studio">
      <h2>{{ team.studioTitle }}</h2>
      <div class="gallery">
        <img
          v-for="(g, i) in team.studioGallery"
          :key="i"
          :src="g!.url"
          alt=""
          loading="lazy"
        />
      </div>
    </section>

    <section class="jobs">
      <h2>{{ team.jobsTitle }}</h2>
      <div class="jobs-grid">
        <article>
          <h3>{{ team.careersTitle }}</h3>
          <p>{{ team.careersParagraph }}</p>
        </article>
        <article>
          <h3>{{ team.freelanceTitle }}</h3>
          <p>{{ team.freelanceParagraph }}</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.team {
  background: #000;
}
.hero,
.members,
.we-are,
.founders,
.places,
.community,
.studio,
.jobs {
  padding: 3.5rem var(--gutter);
  max-width: 1440px;
  margin-inline: auto;
}
.hero {
  position: relative;
  overflow: hidden;
  max-width: none;
  min-height: 48vh;
}
.hero-fx {
  position: absolute !important;
  inset: 0;
}
.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 1440px;
  margin-inline: auto;
}
.baseline {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: var(--muted);
}
h1 {
  margin: 0.5rem 0 1rem;
  font-size: clamp(2.4rem, 7vw, 5.2rem);
  letter-spacing: -0.045em;
  line-height: 0.95;
  display: grid;
}
h1 span:nth-child(2) {
  font-style: italic;
  font-weight: 500;
}
.intro {
  max-width: 40rem;
  color: var(--muted);
  line-height: 1.55;
}
.members h2,
.studio h2,
.jobs h2,
.community h2,
.we-are h2,
.founders h2 {
  margin: 0 0 1.5rem;
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  letter-spacing: -0.03em;
}
.we-are h2 {
  display: grid;
  gap: 0.1rem;
}
.grid {
  display: grid;
  gap: 1.5rem;
}
.member-link {
  display: block;
  color: inherit;
}
article img,
.ph,
.we-are img,
.founders img,
.community img,
.gallery img {
  width: 100%;
  display: block;
  object-fit: cover;
  background: #1a1a1a;
}
.grid article img,
.ph {
  aspect-ratio: 4 / 5;
}
.grid h3 {
  margin: 0.75rem 0 0.2rem;
  font-size: 1.05rem;
}
.grid p {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}
.we-are,
.founders,
.community {
  display: grid;
  gap: 1.5rem;
}
.date {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.05em;
  margin: 0;
  opacity: 0.35;
}
.names {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
}
.places {
  display: grid;
  gap: 1.25rem;
}
.place-text {
  white-space: pre-line;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  letter-spacing: -0.03em;
  margin: 0 0 0.35rem;
}
.places a {
  color: var(--muted);
  text-decoration: underline;
  font-size: 0.85rem;
}
.community ul {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.community li {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.gallery {
  display: grid;
  gap: 1rem;
}
.jobs-grid {
  display: grid;
  gap: 1.5rem;
}
.jobs p {
  color: var(--muted);
  white-space: pre-line;
  line-height: 1.55;
}
@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .places {
    grid-template-columns: repeat(4, 1fr);
  }
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
  .jobs-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 900px) {
  .we-are,
  .founders,
  .community {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
  }
  .founders.london {
    grid-template-columns: 0.9fr 1.1fr;
  }
  .founders.london .date {
    order: 2;
  }
  .founders.london .copy {
    order: 1;
  }
  .founders.london img {
    order: 3;
    grid-column: 1 / -1;
  }
}
</style>
