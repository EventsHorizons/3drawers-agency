<script setup lang="ts">
/** Canvas aurora approximating c-PixiApp background (no full Pixi port). */
const canvas = ref<HTMLCanvasElement | null>(null);
const paused = ref(false);

onMounted(() => {
  const el = canvas.value;
  if (!el) return;
  const ctx = el.getContext("2d");
  if (!ctx) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  let t = 0;
  const palette = ["#1a3a5c", "#c45a2c", "#2a6b6b", "#4a2a6b"];

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    el.width = Math.floor(el.clientWidth * dpr);
    el.height = Math.floor(el.clientHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const hexA = (hex: string, a: number) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  const draw = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    const blobs = [
      { x: 0.25 + Math.sin(t * 0.0006) * 0.08, y: 0.35, r: 0.45, c: palette[0] },
      { x: 0.65 + Math.cos(t * 0.0005) * 0.1, y: 0.42, r: 0.5, c: palette[1] },
      { x: 0.48, y: 0.72 + Math.sin(t * 0.0004) * 0.05, r: 0.4, c: palette[2] },
      { x: 0.8, y: 0.2, r: 0.28, c: palette[3] },
    ];
    for (const b of blobs) {
      const g = ctx.createRadialGradient(
        b.x * w,
        b.y * h,
        0,
        b.x * w,
        b.y * h,
        b.r * Math.max(w, h),
      );
      g.addColorStop(0, hexA(b.c, 0.55));
      g.addColorStop(0.55, hexA(b.c, 0.16));
      g.addColorStop(1, hexA(b.c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
    if (!reduce && !paused.value) {
      t += 16;
      raf = requestAnimationFrame(draw);
    }
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  });
});
</script>

<template>
  <div class="aurora">
    <canvas ref="canvas" aria-hidden="true" />
    <button
      type="button"
      class="pause"
      :aria-pressed="paused"
      :aria-label="paused ? 'Play background' : 'Pause background'"
      @click="paused = !paused"
    >
      <span v-if="!paused">❚❚</span>
      <span v-else>▶</span>
    </button>
  </div>
</template>

<style scoped>
.aurora {
  position: absolute;
  inset: 0;
  z-index: 0;
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
