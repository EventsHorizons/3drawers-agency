<script setup lang="ts">
const open = ref(false);
const { london, tokyo, nyc } = useClocks();
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);

watch(open, (v) => {
  document.body.classList.toggle("lenis-stopped", v);
});

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/team", label: "team" },
  { to: "/contact", label: "contact" },
  { to: "/press", label: "PRESS & NEWS" },
];

const left = links.slice(0, 3);
const right = links.slice(3);
</script>

<template>
  <header class="site-header" :class="{ overlay: open }">
    <NuxtLink class="logo" to="/" aria-label="3Drawers Agency home">
      <strong>3Drawers</strong>
      <span aria-hidden="true">|</span>
      <em>Agency</em>
    </NuxtLink>

    <nav class="desk-nav" aria-label="Primary">
      <ul class="desk-col">
        <li v-for="l in left" :key="l.to">
          <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
        </li>
      </ul>
      <ul class="desk-col">
        <li v-for="l in right" :key="l.to">
          <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
        </li>
      </ul>
      <ul class="desk-col clocks" aria-label="City clocks">
        <li>
          <NuxtLink to="/" :aria-current="route.path === '/' ? 'page' : undefined">
            {{ london }}
          </NuxtLink>
        </li>
        <li>
          <span>{{ tokyo }}</span>
        </li>
        <li>
          <span>{{ nyc }}</span>
        </li>
      </ul>
    </nav>

    <button
      class="menu-btn"
      type="button"
      :aria-expanded="open"
      aria-controls="site-menu"
      @click="open = !open"
    >
      <span class="sr-only">{{ open ? "Close menu" : "Open menu" }}</span>
      <i /><i />
    </button>
  </header>

  <div v-if="open" id="site-menu" class="nav-overlay">
    <nav aria-label="Mobile primary">
      <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
    </nav>
    <div class="clocks mobile-clocks" aria-label="City clocks">
      <NuxtLink to="/" :aria-current="route.path === '/' ? 'page' : undefined">
        {{ london }}
      </NuxtLink>
      <span>{{ tokyo }}</span>
      <span>{{ nyc }}</span>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.desk-nav {
  display: none;
  align-items: start;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  margin-left: auto;
  margin-right: 1rem;
}
.desk-col {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.2rem;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.desk-col a,
.desk-col span {
  opacity: 0.72;
}
.desk-col a.router-link-active,
.desk-col a[aria-current="page"] {
  opacity: 1;
}
.desk-col a.router-link-active::before,
.desk-col a[aria-current="page"]::before {
  content: "▶ ";
  font-size: 0.65em;
}
.clocks {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.08em;
}

@media (min-width: 880px) {
  .desk-nav {
    display: flex;
  }
  .menu-btn {
    display: none;
  }
}
</style>
