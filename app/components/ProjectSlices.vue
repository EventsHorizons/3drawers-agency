<script setup lang="ts">
const props = defineProps<{
  body: Array<{
    index: number;
    type: string;
    subtitle: string;
    title: string;
    paragraph: string;
    images: Array<{ url: string; alt: string; width: number | null; height: number | null } | null>;
  }>;
}>();

const prepared = computed(() => {
  let chapter = 0;
  return props.body.map((slice) => {
    const isText = slice.type === "text";
    if (isText) chapter += 1;
    return {
      ...slice,
      chapterLabel: isText ? `/${String(chapter).padStart(2, "0")}` : null,
    };
  });
});
</script>

<template>
  <div class="slices">
    <template v-for="slice in prepared" :key="slice.index">
      <section v-if="slice.type === 'text'" class="slice-text">
        <p class="chap">{{ slice.chapterLabel }}</p>
        <p v-if="slice.subtitle" class="sub">{{ slice.subtitle }}</p>
        <h2 v-if="slice.title">{{ slice.title }}</h2>
        <p v-for="(line, i) in slice.paragraph.split('\n').filter(Boolean)" :key="i">
          {{ line }}
        </p>
      </section>
      <section
        v-else-if="slice.images?.length"
        class="slice-media"
        :class="slice.type"
      >
        <figure v-for="(im, i) in slice.images" :key="i">
          <img
            v-if="im"
            :src="im.url"
            :alt="im.alt || ''"
            :width="im.width || undefined"
            :height="im.height || undefined"
            loading="lazy"
          />
        </figure>
      </section>
    </template>
  </div>
</template>

<style scoped>
.slices {
  display: grid;
  gap: 2.5rem;
  padding: 2rem 0 4rem;
}
.slice-text {
  max-width: 42rem;
  padding-inline: var(--gutter);
}
.chap {
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.sub {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
h2 {
  margin: 0.4rem 0 1rem;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
.slice-media {
  padding-inline: var(--gutter);
}
.slice-media.full-width_image {
  padding-inline: 0;
}
figure {
  margin: 0;
}
img {
  width: 100%;
  height: auto;
}
.two_columns {
  display: grid;
  gap: 1rem;
}
@media (min-width: 900px) {
  .two_columns {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
