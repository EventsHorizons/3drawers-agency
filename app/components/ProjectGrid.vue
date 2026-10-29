<script setup lang="ts">
import type { Project } from "~/composables/useSiteContent";

defineProps<{ projects: Project[] }>();
</script>

<template>
  <ul class="grid">
    <li v-for="(p, i) in projects" :key="p.uid" :class="`pos-${i % 3}`">
      <NuxtLink :to="`/work/${p.uid}`" class="card">
        <div class="media" :style="{ aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '16/9' }">
          <img
            v-if="p.thumbnail?.url || p.cover?.url"
            :src="p.thumbnail?.url || p.cover?.url || ''"
            :alt="p.title"
            loading="lazy"
          />
          <span class="overlay">{{ p.title.split("‣")[0] }}</span>
        </div>
        <div class="meta">
          <p>{{ p.categories.join(" · ") }}</p>
          <h3>{{ p.title }}</h3>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2.5rem 1.5rem;
}
.card {
  display: block;
  color: inherit;
}
.media {
  position: relative;
  overflow: hidden;
  background: #111;
}
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}
.card:hover img {
  transform: scale(1.04);
}
.overlay {
  position: absolute;
  inset: auto 0 0;
  padding: 1rem;
  font-size: clamp(1.2rem, 2.2vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  opacity: 0;
  transition: opacity 0.35s var(--ease);
}
.card:hover .overlay {
  opacity: 1;
}
.meta {
  margin-top: 0.8rem;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}
.meta p {
  margin: 0;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #777;
}
.meta h3 {
  margin: 0.35rem 0 0;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
  .pos-2 {
    margin-top: 3rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .media img,
  .overlay {
    transition: none;
  }
  .card:hover img {
    transform: none;
  }
}
</style>
