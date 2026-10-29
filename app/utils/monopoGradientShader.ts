/**
 * Fragment/vertex GLSL reconstructed from observable monopo-gradient (WebGL2).
 * 3D gradient-noise derivatives: Inigo Quilez, MIT License
 * https://iquilezles.org/articles/gradientnoise/
 */

export const VERTEX_SRC = `#version 300 es
in vec3 position;
out vec2 vPosition;
void main() {
  gl_Position = vec4(position, 1.);
  vPosition = position.xy;
}
`;

/** IQ gradient noise with analytic derivatives (MIT). */
export const NOISE_GLSL = `
// The MIT License
// Copyright © 2017 Inigo Quilez
vec3 gradientDerivativesNoise3DHash(vec3 p) {
  p = fract(p * vec3(.1031, .1030, .0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

vec4 gradientDerivativesNoise3D(in vec3 x) {
  vec3 p = floor(x);
  vec3 w = fract(x);
  vec3 u = w * w * w * (w * (w * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * w * w * (w * (w - 2.0) + 1.0);

  vec3 ga = gradientDerivativesNoise3DHash(p + vec3(0.0, 0.0, 0.0));
  vec3 gb = gradientDerivativesNoise3DHash(p + vec3(1.0, 0.0, 0.0));
  vec3 gc = gradientDerivativesNoise3DHash(p + vec3(0.0, 1.0, 0.0));
  vec3 gd = gradientDerivativesNoise3DHash(p + vec3(1.0, 1.0, 0.0));
  vec3 ge = gradientDerivativesNoise3DHash(p + vec3(0.0, 0.0, 1.0));
  vec3 gf = gradientDerivativesNoise3DHash(p + vec3(1.0, 0.0, 1.0));
  vec3 gg = gradientDerivativesNoise3DHash(p + vec3(0.0, 1.0, 1.0));
  vec3 gh = gradientDerivativesNoise3DHash(p + vec3(1.0, 1.0, 1.0));

  float va = dot(ga, w - vec3(0.0, 0.0, 0.0));
  float vb = dot(gb, w - vec3(1.0, 0.0, 0.0));
  float vc = dot(gc, w - vec3(0.0, 1.0, 0.0));
  float vd = dot(gd, w - vec3(1.0, 1.0, 0.0));
  float ve = dot(ge, w - vec3(0.0, 0.0, 1.0));
  float vf = dot(gf, w - vec3(1.0, 0.0, 1.0));
  float vg = dot(gg, w - vec3(0.0, 1.0, 1.0));
  float vh = dot(gh, w - vec3(1.0, 1.0, 1.0));

  return vec4(
    va + u.x * (vb - va) + u.y * (vc - va) + u.z * (ve - va)
      + u.x * u.y * (va - vb - vc + vd) + u.y * u.z * (va - vc - ve + vg)
      + u.z * u.x * (va - vb - ve + vf)
      + (-va + vb + vc - vd + ve - vf - vg + vh) * u.x * u.y * u.z,
    ga + u.x * (gb - ga) + u.y * (gc - ga) + u.z * (ge - ga)
      + u.x * u.y * (ga - gb - gc + gd) + u.y * u.z * (ga - gc - ge + gg)
      + u.z * u.x * (ga - gb - ge + gf)
      + (-ga + gb + gc - gd + ge - gf - gg + gh) * u.x * u.y * u.z
      + du * (vec3(vb, vc, ve) - va + u.yzx * vec3(va - vb - vc + vd, va - vc - ve + vg, va - vb - ve + vf)
      + u.zxy * vec3(va - vb - ve + vf, va - vb - vc + vd, va - vc - ve + vg)
      + u.yzx * u.zxy * (-va + vb + vc - vd + ve - vf - vg + vh))
  );
}
`;

export const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform float colorSize;
uniform float colorSpacing;
uniform float colorRotation;
uniform float colorSpread;
uniform float displacement;
uniform float zoom;
uniform float spacing;
uniform float seed;
uniform vec2 viewportSize;
uniform vec2 colorOffset;
uniform vec2 transformPosition;
uniform float noiseSize;
uniform float noiseIntensity;

in vec2 vPosition;
out vec4 fragColor;

${NOISE_GLSL}

float hash(vec2 p) {
  p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
  return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
}

float computeNoise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

void main() {
  vec2 position = vPosition;
  // Guard against zero viewport during first layout frame
  float aspectX = viewportSize.y > 0.0 ? min(1., viewportSize.x / viewportSize.y) : 1.0;
  float aspectY = viewportSize.x > 0.0 ? min(1., viewportSize.y / viewportSize.x) : 1.0;
  position.x *= aspectX;
  position.y *= aspectY;
  position /= max(zoom, 0.0001);
  position += transformPosition;

  vec2 noiseLocalPosition = position * .5 + .5;
  // IQ noise drives organic banding; if derivatives explode, fall back to 0 displace
  vec4 n4 = gradientDerivativesNoise3D(vec3(noiseLocalPosition, seed));
  vec3 displacementNoise = n4.xyz;
  if (any(isnan(displacementNoise))) displacementNoise = vec3(0.0);

  float noise = computeNoise(vPosition * viewportSize / max(noiseSize, 0.0001));
  if (isnan(noise)) noise = 0.0;

  position += displacementNoise.xz * displacement;

  vec2 offsetedPosition = position;
  offsetedPosition -= colorOffset;
  offsetedPosition = mod(offsetedPosition - spacing, vec2(spacing * 2.)) - spacing;
  offsetedPosition = rotate(offsetedPosition, -colorRotation);
  offsetedPosition /= vec2(max(colorSize, 0.0001), max(colorSize, 0.0001));
  offsetedPosition *= vec2(1. / max(colorSpread, 0.0001), 1.);

  vec3 color = vec3(0.);
  color = mix(color1, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * 1.5))));
  color = mix(color2, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., colorSpacing * .5))));
  color = mix(color3, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * .5))));
  color = mix(color4, color, smoothstep(0., 1., distance(offsetedPosition, vec2(0., -colorSpacing * 1.5))));

  color += noise * noiseIntensity;
  color = clamp(color, 0., 1.);

  fragColor = vec4(color, 1.);
}
`;

export type GradientParams = {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  colorSize: number;
  colorSpacing: number;
  colorRotation: number;
  colorSpread: number;
  colorOffset: [number, number];
  displacement: number;
  zoom: number;
  spacing: number;
  seed: number;
  position: [number, number];
  noiseSize: number;
  noiseIntensity: number;
};

export const HOME_GRADIENT: GradientParams = {
  color1: "#16254b",
  color2: "#23418a",
  color3: "#aadfd9",
  color4: "#e64f0f",
  colorSize: 0.75,
  colorSpacing: 0.52,
  colorRotation: -0.381592653589793,
  colorSpread: 4.52,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  displacement: 4.66,
  zoom: 0.72,
  spacing: 4.27,
  seed: -0.06,
  position: [-0.2816110610961914, -0.43914794921875],
  noiseSize: 0.5,
  noiseIntensity: 0.04,
};

export function parseMonopoGradientMarkup(
  markup: string | null | undefined,
  fallback: GradientParams = HOME_GRADIENT,
): GradientParams {
  if (!markup) return { ...fallback };
  const doc = typeof DOMParser !== "undefined" ? new DOMParser().parseFromString(markup, "text/html") : null;
  const el = doc?.querySelector("monopo-gradient");
  if (!el) {
    // SSR / node: regex attrs
    const get = (name: string) => {
      const m = markup.match(new RegExp(`${name}="([^"]*)"`, "i"));
      return m?.[1];
    };
    const pair = (v: string | undefined, fb: [number, number]): [number, number] => {
      if (!v) return fb;
      const parts = v.split(",").map(Number);
      return [parts[0] ?? fb[0], parts[1] ?? fb[1]];
    };
    return {
      ...fallback,
      color1: get("color1") || fallback.color1,
      color2: get("color2") || fallback.color2,
      color3: get("color3") || fallback.color3,
      color4: get("color4") || fallback.color4,
      colorSize: Number(get("colorsize") ?? fallback.colorSize),
      colorSpacing: Number(get("colorspacing") ?? fallback.colorSpacing),
      colorRotation: Number(get("colorrotation") ?? fallback.colorRotation),
      colorSpread: Number(get("colorspread") ?? fallback.colorSpread),
      colorOffset: pair(get("coloroffset"), fallback.colorOffset),
      displacement: Number(get("displacement") ?? fallback.displacement),
      zoom: Number(get("zoom") ?? fallback.zoom),
      spacing: Number(get("spacing") ?? fallback.spacing),
      seed: Number(get("seed") ?? fallback.seed),
      position: pair(get("position"), fallback.position),
    };
  }
  const pair = (v: string | null, fb: [number, number]): [number, number] => {
    if (!v) return fb;
    const parts = v.split(",").map(Number);
    return [parts[0] ?? fb[0], parts[1] ?? fb[1]];
  };
  return {
    ...fallback,
    color1: el.getAttribute("color1") || fallback.color1,
    color2: el.getAttribute("color2") || fallback.color2,
    color3: el.getAttribute("color3") || fallback.color3,
    color4: el.getAttribute("color4") || fallback.color4,
    colorSize: Number(el.getAttribute("colorsize") ?? fallback.colorSize),
    colorSpacing: Number(el.getAttribute("colorspacing") ?? fallback.colorSpacing),
    colorRotation: Number(el.getAttribute("colorrotation") ?? fallback.colorRotation),
    colorSpread: Number(el.getAttribute("colorspread") ?? fallback.colorSpread),
    colorOffset: pair(el.getAttribute("coloroffset"), fallback.colorOffset),
    displacement: Number(el.getAttribute("displacement") ?? fallback.displacement),
    zoom: Number(el.getAttribute("zoom") ?? fallback.zoom),
    spacing: Number(el.getAttribute("spacing") ?? fallback.spacing),
    seed: Number(el.getAttribute("seed") ?? fallback.seed),
    position: pair(el.getAttribute("position"), fallback.position),
  };
}

export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
