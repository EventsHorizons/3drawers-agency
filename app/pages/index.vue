<script setup lang="ts">
/**
 * Home layout mirrors live monopo.london:
 * 1) c-PixiIntro — fullscreen gradient + 3-line title + foot columns
 * 2) c-Home sticky recent work — scroll sections drive active title + cover image
 */
const { site, featuredProjects } = useSiteContent();
const featured = computed(() =>
  featuredProjects().map((p) => ({
    uid: p!.uid,
    title: p!.title,
    categories: p!.categories,
    image:
      p!.imageHomepage?.url ||
      p!.cover?.url ||
      p!.thumbnail?.url ||
      "",
  })),
);

const active = ref(0);
const stickyRoot = ref<HTMLElement | null>(null);
const sectionEls = ref<HTMLElement[]>([]);

const manifestoLines = ["We are a brand", "of collective", "creativity"];

function setSectionEl(el: Element | null, i: number) {
  if (!el) return;
  sectionEls.value[i] = el as HTMLElement;
}

function onScroll() {
  const sections = sectionEls.value.filter(Boolean);
  if (!sections.length) return;
  const mid = window.innerHeight * 0.45;
  let best = 0;
  let bestDist = Infinity;
  sections.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    const center = r.top + r.height * 0.35;
    const d = Math.abs(center - mid);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  active.value = best;
}

function scrollToWork() {
  stickyRoot.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});
</script>

<template>
  <main id="main" class="home">
    <!-- INTRO (live: .c-PixiIntro) -->
    <section class="intro" aria-label="Introduction">
      <MonopoGradient
        class="intro-fx"
        :markup="site.homepage.gradient"
        interactive
        :animate="true"
        show-pause
      />
      <div class="intro-inner">
        <h1 class="intro-title">
          <span
            v-for="(line, i) in manifestoLines"
            :key="i"
            class="intro-line"
            :class="`line-${i}`"
          >{{ line }}</span>
        </h1>

        <div class="intro-foot">
          <div class="foot-circles" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div class="foot-cols">
            <p>
              <strong>Based in London</strong>
              <span>Born in Tokyo</span>
            </p>
            <p>
              <strong>Design-driven</strong>
              <span>creative agency</span>
            </p>
            <p>
              <strong>Branding, digital</strong>
              <span>and communications</span>
            </p>
          </div>
          <button type="button" class="scroll-enter" @click="scrollToWork">
            <img src="/img/arrow_scroll.png" alt="Scroll to recent work" width="34" height="105" />
          </button>
        </div>
      </div>
    </section>

    <!-- RECENT WORK sticky (live: .c-Home-content / .c-Home-sticky) -->
    <section ref="stickyRoot" class="recent" aria-label="Recent work">
      <MonopoGradient
        class="recent-fx"
        :markup="site.homepage.gradient"
        :animate="true"
        :show-pause="false"
      />

      <div class="recent-sticky">
        <div class="recent-kicker">
          <span class="ruler" aria-hidden="true">
            <i v-for="n in 12" :key="n" :class="{ on: Math.floor((active / Math.max(featured.length - 1, 1)) * 11) === n - 1 }" />
          </span>
          <span>Recent work</span>
        </div>

        <div class="recent-stage">
          <ul class="recent-titles">
            <li
              v-for="(p, i) in featured"
              :key="p.uid"
              :class="{ active: i === active, next: i === active + 1, past: i < active }"
            >
              <NuxtLink :to="`/work/${p.uid}`">
                <h2>{{ p.title }}</h2>
                <p>{{ p.categories.join(" · ") }}</p>
              </NuxtLink>
            </li>
          </ul>

          <div class="recent-image">
            <Transition name="fade-img" mode="out-in">
              <NuxtLink
                :key="featured[active]?.uid"
                :to="`/work/${featured[active]?.uid}`"
                class="cover-link"
              >
                <img
                  v-if="featured[active]?.image"
                  :src="featured[active].image"
                  :alt="featured[active].title"
                  width="950"
                  height="594"
                />
              </NuxtLink>
            </Transition>
          </div>
        </div>

        <div class="recent-cta">
          <NuxtLink class="ghost" to="/work">Discover all projects →</NuxtLink>
        </div>
      </div>

      <!-- Tall scroll drivers (live: .c-Home-project sections) -->
      <div class="recent-drivers">
        <div
          v-for="(p, i) in featured"
          :key="p.uid"
          :ref="(el) => setSectionEl(el as Element | null, i)"
          class="driver"
          :aria-hidden="true"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  position: relative;
}

/* —— Intro —— */
.intro {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  overflow: hidden;
}
.intro-fx {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.intro-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
  min-height: 100dvh;
  padding: calc(var(--header-h) + 1rem) var(--gutter) 1.5rem;
}
.intro-title {
  margin: 0;
  align-self: center;
  justify-self: center;
  display: grid;
  gap: 0.12em;
  text-align: center;
  font-size: clamp(2.4rem, 7.2vw, 5.4rem);
  line-height: 0.96;
  letter-spacing: -0.045em;
  font-weight: 700;
}
.intro-line.line-2 {
  font-style: italic;
  font-weight: 500;
}
.intro-foot {
  position: relative;
  display: grid;
  gap: 1.25rem;
  padding-bottom: 0.5rem;
}
.foot-circles {
  display: inline-grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
}
.foot-circles span {
  grid-area: 1 / 1;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
}
.foot-circles span:nth-child(1) {
  width: 100%;
  height: 100%;
}
.foot-circles span:nth-child(2) {
  width: 68%;
  height: 68%;
}
.foot-circles span:nth-child(3) {
  width: 36%;
  height: 36%;
}
.foot-cols {
  display: grid;
  gap: 1rem;
}
.foot-cols p {
  margin: 0;
  display: grid;
  gap: 0.15rem;
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  line-height: 1.3;
}
.foot-cols strong {
  font-weight: 700;
}
.foot-cols span {
  color: rgba(255, 255, 255, 0.55);
}
.scroll-enter {
  position: absolute;
  right: 0;
  bottom: 0;
  border: 0;
  background: transparent;
  padding: 0;
  opacity: 0.85;
}

/* —— Recent work —— */
.recent {
  position: relative;
  background: #000;
}
.recent-fx {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.recent-sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  padding: calc(var(--header-h) + 0.5rem) var(--gutter) 1.75rem;
  max-width: 1440px;
  margin-inline: auto;
}
.recent-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.72rem;
}
.ruler {
  display: grid;
  gap: 3px;
}
.ruler i {
  display: block;
  width: 10px;
  height: 1px;
  background: rgba(255, 255, 255, 0.35);
}
.ruler i.on {
  width: 14px;
  background: #fff;
}
.recent-stage {
  display: grid;
  gap: 1.25rem;
  align-content: center;
  min-height: 0;
}
.recent-titles {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  min-height: clamp(7.5rem, 18vw, 11rem);
}
.recent-titles li {
  position: absolute;
  inset: 0 auto auto 0;
  width: min(100%, 28rem);
  opacity: 0;
  transform: translateY(1.1rem);
  pointer-events: none;
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease);
}
.recent-titles li.active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  z-index: 2;
}
.recent-titles li.next {
  opacity: 0.28;
  transform: translateY(4.6rem);
  z-index: 1;
}
.recent-titles li.past {
  opacity: 0;
  transform: translateY(-1rem);
}
.recent-titles h2 {
  margin: 0;
  font-size: clamp(1.45rem, 3.4vw, 2.5rem);
  letter-spacing: -0.03em;
  line-height: 1.02;
  font-weight: 700;
  text-transform: uppercase;
}
.recent-titles p {
  margin: 0.4rem 0 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.recent-image {
  width: min(100%, 42rem);
  justify-self: center;
  aspect-ratio: 950 / 594;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}
.cover-link,
.cover-link img {
  display: block;
  width: 100%;
  height: 100%;
}
.cover-link img {
  object-fit: cover;
}
.fade-img-enter-active,
.fade-img-leave-active {
  transition: opacity 0.35s var(--ease);
}
.fade-img-enter-from,
.fade-img-leave-to {
  opacity: 0;
}
.recent-cta {
  display: flex;
  justify-content: center;
  padding-bottom: 0.25rem;
}
.ghost {
  display: inline-flex;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
}
.recent-drivers {
  position: relative;
  z-index: 0;
  pointer-events: none;
}
.driver {
  height: 85vh;
}

@media (min-width: 640px) {
  .foot-cols {
    grid-template-columns: repeat(3, minmax(9rem, 15rem));
    gap: 1.75rem;
    max-width: 48rem;
  }
  .intro-foot {
    align-items: end;
  }
  .intro-title {
    font-size: clamp(2.8rem, 6.5vw, 5.4rem);
  }
}

@media (min-width: 880px) {
  .recent-stage {
    grid-template-columns: minmax(15rem, 0.9fr) minmax(18rem, 1.2fr);
    align-items: center;
    gap: 2rem;
  }
  .recent-image {
    justify-self: stretch;
    width: 100%;
  }
  .recent-titles {
    min-height: clamp(9rem, 16vw, 13rem);
  }
  .recent-titles h2 {
    max-width: 14ch;
  }
  .recent-titles li.next {
    transform: translateY(5.2rem);
  }
}
</style>
