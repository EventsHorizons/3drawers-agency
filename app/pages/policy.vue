<script setup lang="ts">
const { site } = useSiteContent();
const policy = site.policy;

useHead({ title: "Cookie policy | monopo london" });
</script>

<template>
  <main id="main" class="policy">
    <header class="hero">
      <MonopoGradient
        class="hero-fx"
        :markup="policy.gradient"
        :show-pause="false"
      />
      <div class="hero-copy">
        <h1>{{ policy.title || "COOKIE POLICY FOR MONOPO LONDON" }}</h1>
        <p class="sub">{{ policy.subtitle }}</p>
      </div>
    </header>
    <div class="content">
      <template v-for="(b, i) in policy.body" :key="i">
        <h2 v-if="b.type?.startsWith('heading')">{{ b.text }}</h2>
        <p v-else>{{ b.text }}</p>
      </template>
      <p class="pdf">
        Cookie policy PDF (external):
        <a
          href="https://monopolondon.cdn.prismic.io/monopolondon/15c780b4-65bd-44e6-affe-2c90529c046c_Cookie-Policy-monopo.london.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Open PDF ↗
        </a>
      </p>
    </div>
  </main>
</template>

<style scoped>
.policy {
  background: #000;
  min-height: 70vh;
}
.hero {
  position: relative;
  padding: 4rem var(--gutter) 1.5rem;
  overflow: hidden;
  min-height: 36vh;
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
  max-width: 18ch;
  font-size: clamp(2rem, 5vw, 3.5rem);
  letter-spacing: -0.03em;
}
.sub {
  margin: 1rem 0 0;
  color: var(--muted);
  max-width: 40rem;
}
.content {
  padding: 1rem var(--gutter) 5rem;
  max-width: 48rem;
}
h2 {
  margin: 2rem 0 0.75rem;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
p {
  color: var(--muted);
  line-height: 1.65;
  white-space: pre-line;
}
a {
  text-decoration: underline;
}
.pdf {
  margin-top: 2.5rem;
}
</style>
