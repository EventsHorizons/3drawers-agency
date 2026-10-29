import {
  FRAGMENT_SRC,
  VERTEX_SRC,
  hexToRgb01,
  type GradientParams,
  HOME_GRADIENT,
} from "./monopoGradientShader";

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("createShader failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(log || "shader compile failed");
  }
  return sh;
}

export type MonopoGradientHandle = {
  setParams: (p: Partial<GradientParams>) => void;
  resize: () => void;
  draw: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
  gl: WebGL2RenderingContext;
  isRunning: () => boolean;
  getSeed: () => number;
};

export function createMonopoGradient(
  canvas: HTMLCanvasElement,
  initial: GradientParams = HOME_GRADIENT,
  opts: { animateSeed?: boolean; seedSpeed?: number; noRetina?: boolean } = {},
): MonopoGradientHandle {
  // Match live monopo-gradient CE: preserveDrawingBuffer + antialias
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    alpha: false,
    depth: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  if (!gl) throw new Error("WebGL2 unavailable");

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  const program = gl.createProgram();
  if (!program) throw new Error("createProgram failed");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "link failed");
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  const vao = gl.createVertexArray();
  const buf = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // Fullscreen triangle covering clip space
  const verts = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const u = {
    color1: gl.getUniformLocation(program, "color1"),
    color2: gl.getUniformLocation(program, "color2"),
    color3: gl.getUniformLocation(program, "color3"),
    color4: gl.getUniformLocation(program, "color4"),
    colorSize: gl.getUniformLocation(program, "colorSize"),
    colorSpacing: gl.getUniformLocation(program, "colorSpacing"),
    colorRotation: gl.getUniformLocation(program, "colorRotation"),
    colorSpread: gl.getUniformLocation(program, "colorSpread"),
    displacement: gl.getUniformLocation(program, "displacement"),
    zoom: gl.getUniformLocation(program, "zoom"),
    spacing: gl.getUniformLocation(program, "spacing"),
    seed: gl.getUniformLocation(program, "seed"),
    viewportSize: gl.getUniformLocation(program, "viewportSize"),
    colorOffset: gl.getUniformLocation(program, "colorOffset"),
    transformPosition: gl.getUniformLocation(program, "transformPosition"),
    noiseSize: gl.getUniformLocation(program, "noiseSize"),
    noiseIntensity: gl.getUniformLocation(program, "noiseIntensity"),
  };

  let params: GradientParams = { ...initial };
  let raf = 0;
  let running = false;
  let animateSeed = opts.animateSeed ?? false;
  const seedSpeed = opts.seedSpeed ?? 0.07;
  const noRetina = opts.noRetina ?? true;
  let baseSeed = params.seed;
  let basePosition: [number, number] = [...params.position];
  let baseColorRotation = params.colorRotation;
  let t0 = performance.now();

  let cssW = 1;
  let cssH = 1;

  const resize = () => {
    const dpr = noRetina ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    cssW = Math.max(1, canvas.clientWidth || 1);
    cssH = Math.max(1, canvas.clientHeight || 1);
    const w = Math.max(1, Math.floor(cssW * dpr));
    const h = Math.max(1, Math.floor(cssH * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  };

  const draw = () => {
    resize();
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const c1 = hexToRgb01(params.color1);
    const c2 = hexToRgb01(params.color2);
    const c3 = hexToRgb01(params.color3);
    const c4 = hexToRgb01(params.color4);
    gl.uniform3fv(u.color1, c1);
    gl.uniform3fv(u.color2, c2);
    gl.uniform3fv(u.color3, c3);
    gl.uniform3fv(u.color4, c4);
    gl.uniform1f(u.colorSize, params.colorSize);
    gl.uniform1f(u.colorSpacing, params.colorSpacing);
    gl.uniform1f(u.colorRotation, params.colorRotation);
    gl.uniform1f(u.colorSpread, params.colorSpread);
    gl.uniform1f(u.displacement, params.displacement);
    gl.uniform1f(u.zoom, params.zoom);
    gl.uniform1f(u.spacing, params.spacing);
    gl.uniform1f(u.seed, params.seed);
    // Live CE passes CSS content-box size, not buffer pixels
    gl.uniform2f(u.viewportSize, cssW, cssH);
    gl.uniform2fv(u.colorOffset, params.colorOffset);
    gl.uniform2fv(u.transformPosition, params.position);
    gl.uniform1f(u.noiseSize, params.noiseSize);
    gl.uniform1f(u.noiseIntensity, params.noiseIntensity);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  };

  const tick = (now: number) => {
    if (!running) return;
    if (animateSeed) {
      const dt = (now - t0) / 1000;
      // Seed drift morphs IQ displacement noise → visible wave motion
      params.seed = baseSeed + dt * seedSpeed;
      // Slow orbital nudge so bands keep flowing (not a frozen still)
      const wobble = dt * 0.085;
      params.position = [
        basePosition[0] + Math.sin(wobble) * 0.045,
        basePosition[1] + Math.cos(wobble * 0.82) * 0.035,
      ];
      params.colorRotation = baseColorRotation + Math.sin(wobble * 0.35) * 0.04;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    // Starting the loop always enables wave motion (seed + soft orbit)
    animateSeed = true;
    t0 = performance.now();
    baseSeed = params.seed;
    basePosition = [...params.position];
    baseColorRotation = params.colorRotation;
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const setParams = (p: Partial<GradientParams>) => {
    params = { ...params, ...p };
    if (p.seed != null) baseSeed = p.seed;
    if (p.position) basePosition = [...p.position];
    if (p.colorRotation != null) baseColorRotation = p.colorRotation;
    if (!running) draw();
  };

  const dispose = () => {
    stop();
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  resize();
  draw();

  return {
    setParams,
    resize,
    draw,
    start,
    stop,
    dispose,
    gl,
    isRunning: () => running,
    getSeed: () => params.seed,
  };
}
