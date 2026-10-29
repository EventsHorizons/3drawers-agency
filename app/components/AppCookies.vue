<script setup lang="ts">
const { accepted, accept } = useCookiesConsent();
</script>

<template>
  <aside v-if="accepted === null" class="cookies" role="dialog" aria-label="Cookie notice">
    <p>
      This website uses cookies.
      <NuxtLink to="/policy">Learn more.</NuxtLink>
    </p>
    <button type="button" @click="accept">ACCEPT</button>
  </aside>
</template>
