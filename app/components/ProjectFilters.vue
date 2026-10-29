<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  categories: { uid: string; name: string }[];
  counts: Record<string, number>;
  total?: number;
}>();
const emit = defineEmits<{ "update:modelValue": [string] }>();

const allCount = computed(() => props.total ?? 0);

function onSelect(e: Event) {
  emit("update:modelValue", (e.target as HTMLSelectElement).value || "All");
}
</script>

<template>
  <aside class="filters">
    <label class="mobile-select">
      <span class="sr-only">Filter by category</span>
      <select :value="modelValue === 'All' ? '' : modelValue" @change="onSelect">
        <option value="">All ({{ allCount }})</option>
        <option v-for="c in categories" :key="c.uid" :value="c.name">
          {{ c.name }}
        </option>
      </select>
    </label>

    <ul class="desktop-list">
      <li>
        <button
          type="button"
          :aria-pressed="modelValue === 'All'"
          :class="{ active: modelValue === 'All' }"
          @click="emit('update:modelValue', 'All')"
        >
          <span v-if="modelValue === 'All'" aria-hidden="true">▸</span>
          All
          <em>({{ allCount || "" }})</em>
        </button>
      </li>
      <li v-for="c in categories" :key="c.uid">
        <button
          type="button"
          :aria-pressed="modelValue === c.name"
          :class="{ active: modelValue === c.name }"
          @click="emit('update:modelValue', c.name)"
        >
          <span v-if="modelValue === c.name" aria-hidden="true">▸</span>
          {{ c.name }}
        </button>
      </li>
    </ul>
    <button
      v-if="modelValue !== 'All'"
      type="button"
      class="reset"
      @click="emit('update:modelValue', 'All')"
    >
      Reset
    </button>
  </aside>
</template>

<style scoped>
.filters {
  position: sticky;
  top: calc(var(--header-h) + 2rem);
  align-self: start;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
.mobile-select select {
  width: 100%;
  border: 1px solid #bbb;
  background: transparent;
  color: #111;
  padding: 0.65rem 0.75rem;
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}
.desktop-list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 0.85rem;
  border-left: 1px dashed rgba(0, 0, 0, 0.25);
  display: none;
  gap: 0.4rem;
}
button {
  border: 0;
  background: transparent;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.72rem;
  text-align: left;
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  padding: 0.15rem 0;
}
button.active {
  color: #111;
  font-weight: 700;
}
em {
  font-style: normal;
  opacity: 0.6;
}
.reset {
  margin-top: 1rem;
  border: 1px solid #ccc !important;
  border-radius: 999px;
  padding: 0.4rem 0.8rem !important;
  color: #111 !important;
  text-transform: none;
  display: none;
}
@media (min-width: 900px) {
  .mobile-select {
    display: none;
  }
  .desktop-list {
    display: grid;
  }
  .reset {
    display: inline-flex;
  }
}
</style>
