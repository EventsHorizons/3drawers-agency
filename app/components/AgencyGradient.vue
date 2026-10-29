<script setup lang="ts">
import {
  createAgencyGradient,
  type AgencyGradientHandle,
} from "~/utils/createAgencyGradient";
import {
  HOME_GRADIENT,
  parseAgencyGradientMarkup,
  type GradientParams,
} from "~/utils/agencyGradientShader";

const props = withDefaults(
  defineProps<{
    markup?: string | null;
    params?: Partial<GradientParams>;
    /** Original intro gradient is mostly static; enable soft seed drift for life. */
    animate?: boolean;
    interactive?: boolean;
    noRetina?: boolean;
    showPause?: boolean;
  }>(),
  {
    markup: null,
    animate: true,
    interactive: false,
    noRetina: true,
    showPause: true,
  },
);

const canvas = ref<HTMLCanvasElement | null>(null);
const paused = ref(false);
const failed = ref(false);
const root = ref<HTMLElement | null>(null);
let handle: AgencyGradientHandle | null = null;

const resolved = computed<GradientParams>(() => ({
  ...parseAgencyGradientMarkup(props.markup, HOME_GRADIENT),
  ...props.params,
}));

function syncParams() {
  if (!handle) return;
  const next = { ...resolved.value };
  // Keep RAF-driven wave motion; don't reset seed/position each sync
  if (handle.isRunning()) {
    const { seed: _s, position: _p, colorRotation: _r, ...rest } = next;
    handle.setParams(rest);
    return;
  }
  handle.setParams(next);
}

function onPointer(e: PointerEvent) {
  if (!props.interactive || !handle || !root.value || paused.value) return;
  const rect = root.value.getBoundingClientRect();
  const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  const base = resolved.value.position;
  handle.setParams({
    position: [base[0] + nx * 0.08, base[1] + ny * 0.08],
  });
  if (!props.animate) handle.draw();
}

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    handle = createAgencyGradient(el, resolved.value, {
      animateSeed: props.animate && !reduce,
      noRetina: props.noRetina,
      seedSpeed: 0.07,
    });
    if (props.animate && !reduce) handle.start();
    else handle.draw();
    if (import.meta.dev) {
      (window as Window & { __agencyGradient?: AgencyGradientHandle }).__agencyGradient =
        handle;
    }
  } catch (err) {
    console.warn("[AgencyGradient] WebGL2 failed, CSS fallback", err);
    failed.value = true;
  }

  const onVis = () => {
    if (!handle || failed.value) return;
    if (document.hidden || paused.value) handle.stop();
    else if (props.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      handle.start();
    else handle.draw();
  };
  document.addEventListener("visibilitychange", onVis);

  // Avoid fighting the RAF loop; only resize/redraw when size actually changes
  let lastW = 0;
  let lastH = 0;
  const ro = new ResizeObserver(() => {
    if (!handle || !root.value) return;
    const w = root.value.clientWidth;
    const h = root.value.clientHeight;
    if (w === lastW && h === lastH) return;
    lastW = w;
    lastH = h;
    handle.draw();
  });
  if (root.value) ro.observe(root.value);

  onBeforeUnmount(() => {
    document.removeEventListener("visibilitychange", onVis);
    ro.disconnect();
    handle?.dispose();
    handle = null;
  });
});

watch(
  () => [props.markup, props.params] as const,
  () => syncParams(),
  { deep: true },
);

watch(paused, (v) => {
  if (!handle) return;
  if (v) handle.stop();
  else if (props.animate) handle.start();
  else handle.draw();
});

function togglePause() {
  paused.value = !paused.value;
  if (!handle) return;
  if (paused.value) {
    // Dim overlay feel: stop redraws / pointer
    handle.stop();
  } else {
    handle.draw();
    if (props.animate) handle.start();
  }
}
</script>

<template>
  <div
    ref="root"
    class="agency-gradient"
    :class="{ fallback: failed }"
    :style="
      failed
        ? {
            background: `radial-gradient(ellipse at 30% 40%, ${resolved.color2}aa, transparent 55%), radial-gradient(ellipse at 70% 30%, ${resolved.color4}99, transparent 50%), radial-gradient(ellipse at 50% 80%, ${resolved.color3}66, transparent 45%), ${resolved.color1}`,
          }
        : undefined
    "
    @pointermove="onPointer"
  >
    <canvas v-show="!failed" ref="canvas" aria-hidden="true" />
    <button
      v-if="showPause && !failed"
      type="button"
      class="pause"
      :aria-pressed="paused"
      :aria-label="paused ? 'Play background' : 'Pause background'"
      @click="togglePause"
    >
      <span v-if="!paused">❚❚</span>
      <span v-else>▶</span>
    </button>
  </div>
</template>

<style scoped>
.agency-gradient {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #000;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
.pause {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
}
</style>
