<script setup lang="ts">
import "~/assets/css/layout.css";

onMounted(async () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const Lenis = (await import("lenis")).default;
  const lenis = new Lenis({ autoRaf: true });
  (window as Window & { __lenis?: unknown }).__lenis = lenis;
  onBeforeUnmount(() => {
    delete (window as Window & { __lenis?: unknown }).__lenis;
    lenis.destroy();
  });
});
</script>

<template>
  <div>
    <AppHeader />
    <slot />
    <AppFooter />
    <AppCookies />
  </div>
</template>
