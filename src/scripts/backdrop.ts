/**
 * # The live background: a projection room
 *
 * His ask (2026-10-07, `.ai/BRIEF.md` "The website must be animated"): a heavy, living background for a video
 * editing app, with no person standing in it. He rejected the editor-timeline floor (*"kuch or soch"*), then picked
 * the film reel and projector out of five options, at *"1no. ka"* quality.
 *
 * Every frame is drawn by one fragment shader:
 *
 * - **the projector:** a cone of warm light from the top-left corner. Smoke drifts through it, and the beam shows
 *   faint streaks that change on every cut, the way a real beam carries the picture. It flickers slightly at 24 fps,
 *   like a shutter. The pointer pans the projector a little;
 * - **the film:** two strips of horizontal 35 mm film (8-perf, the VistaVision layout) running through the room in
 *   perspective. They curve, twist to show their backs, and have real sprocket holes and frame lines. Each frame
 *   holds an abstract shot (sunset, night bokeh, light trails, ridges, an equaliser, a countdown leader) with no
 *   people in it. Frames are transparencies, so they glow where the beam passes through them, and the light halates
 *   orange around them;
 * - **the beat:** 112 BPM. On every beat the film pulls one half-frame forward (intermittent motion, like the claw
 *   in a projector gate) and the beam pulses. `zera:beat` fires so foreground pieces land on the same beat;
 * - **you:** scrolling feeds film through the room, and each section re-tints the shots (`data-scene`);
 * - **the print:** gate weave, grain that changes every frame, the occasional scratch, and a dark vignette.
 *
 * Cost rules (WebGL is the most expensive pixel on the page): one triangle, one program, no texture, rendered at
 * reduced resolution (half on phones) and 30 fps on phones; stopped when the tab is hidden; a CSS gradient underneath
 * for any device where WebGL never starts or the context is lost; one still frame for reduced motion. It costs less
 * than the shader it replaced (no 5-octave fbm sky).
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uFlow;
uniform float uShape;
uniform float uBeat;
uniform float uBeatF;
uniform float uBeatN;
uniform float uPortrait;
uniform float uPan;
uniform float uDim;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;

const vec3 LAMP = vec3(1.0, 0.86, 0.66);
const vec3 WARM = vec3(1.0, 0.62, 0.32);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// One frame's picture. q is 0..1 inside the frame, n picks the shot. Abstract on purpose: no people.
vec3 shot(vec2 q, float n) {
  float h = hash(vec2(n, 3.7));
  float h2 = hash(vec2(n, 9.1));
  vec3 col;
  if (h < 0.2) {
    // Sun going down over water.
    float hz = 0.4 + 0.12 * h2;
    float sx = 0.25 + 0.5 * h2;
    vec3 sky = mix(WARM * 0.95, uB * 0.55, smoothstep(hz, 1.0, q.y));
    vec2 sd = (q - vec2(sx, hz + 0.1)) * vec2(1.5, 1.0);
    sky += vec3(1.0, 0.88, 0.62) * smoothstep(0.1, 0.085, length(sd));
    vec3 sea = mix(uA * 0.2, WARM * 0.3, 0.5 + 0.5 * sin(q.y * 80.0 + q.x * 5.0));
    sea += vec3(1.0, 0.8, 0.5) * smoothstep(0.07, 0.0, abs(q.x - sx)) * step(0.45, fract(q.y * 36.0)) * 0.6;
    col = q.y > hz ? sky : sea * (0.5 + q.y / hz);
  } else if (h < 0.38) {
    // A street at night, out of focus.
    col = mix(vec3(0.02, 0.02, 0.05), uA * 0.22, q.y);
    vec2 g = q * vec2(5.0, 3.4);
    vec2 c = floor(g);
    vec2 f = fract(g) - 0.5;
    float hc = hash(c + n);
    vec2 o = (vec2(hash(c + n + 1.3), hash(c + n + 2.7)) - 0.5) * 0.45;
    float r = 0.16 + 0.22 * hc;
    float b = smoothstep(r, r - 0.07, length(f - o)) * step(0.25, hc);
    vec3 bc = hc < 0.5 ? uA : (hc < 0.75 ? uC : WARM);
    col += bc * b * (0.75 + 0.25 * sin(hc * 40.0));
  } else if (h < 0.55) {
    // Light trails on a road.
    col = vec3(0.015, 0.014, 0.03) + uB * 0.06 * q.y;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float yy = 0.22 + 0.18 * fi + (q.x - 0.5) * (0.4 - 0.3 * fi) + 0.025 * sin(q.x * 7.0 + n + fi);
      float tr = exp(-abs(q.y - yy) * 75.0);
      vec3 tc = i == 0 ? WARM : (i == 1 ? uC : uA);
      col += tc * tr * 1.15;
    }
  } else if (h < 0.71) {
    // Ridges at dusk.
    col = mix(WARM * 0.7, uB * 0.45, q.y);
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float ridge = 0.64 - 0.17 * fi + 0.13 * noise(vec2(q.x * (3.0 + fi * 2.0) + n * 7.0 + fi * 3.1, fi));
      vec3 layer = mix(uA * 0.32, vec3(0.025, 0.022, 0.04), fi * 0.5);
      col = q.y < ridge ? layer : col;
    }
  } else if (h < 0.9) {
    // The music under the edit: a level meter, moving with the beat.
    col = vec3(0.018, 0.016, 0.035);
    float bi = floor(q.x * 14.0);
    float bx = fract(q.x * 14.0);
    float lvl = 0.12 + 0.62 * noise(vec2(bi * 0.55, n * 3.0 + uTime * 1.6)) * (0.7 + 0.5 * uBeat);
    float on = step(0.16, bx) * step(bx, 0.84) * step(0.12, q.y) * step(q.y, 0.12 + lvl);
    col += mix(uA, uC, q.y) * on * step(0.32, fract(q.y * 26.0)) * 1.1;
  } else {
    // A countdown leader, the frames that open every reel. Its sweep keeps time with the beat.
    vec2 c = (q - 0.5) * vec2(1.5, 1.0);
    float r = length(c);
    float a01 = fract(atan(c.x, c.y) / 6.2832 + 1.0);
    float wedge = step(a01, uBeatF) * step(r, 0.42);
    col = vec3(0.55, 0.53, 0.5) * (1.0 - 0.45 * wedge);
    float ring = smoothstep(0.012, 0.0, abs(r - 0.36)) + smoothstep(0.012, 0.0, abs(r - 0.42));
    float hair = smoothstep(0.008, 0.0, abs(c.x)) + smoothstep(0.008, 0.0, abs(c.y));
    col = mix(col, vec3(0.92), clamp(ring + hair * 0.8, 0.0, 1.0));
  }
  return col * (0.82 + 0.3 * h2);
}

// One strip of film in ribbon space. Returns premultiplied colour and coverage; halo is how near the strip this is.
vec4 film(vec2 r, float amp, float k, float ph, float tilt, float yOff, float w0, float wd,
          float twA, float twK, float twP, float flow, float seed, float px, float beam, out float halo) {
  float X = r.x;
  float arg = k * X + ph;
  float c = amp * sin(arg) + tilt * X + yOff;
  float dc = amp * k * cos(arg) + tilt;
  float w = w0 * exp(-wd * X);
  float d = (r.y - c) * inversesqrt(1.0 + dc * dc);
  float ct = cos(twA * sin(twK * X + twP));
  float hw = w * max(abs(ct), 0.03);
  float ad = abs(d);
  halo = exp(-max(ad - hw, 0.0) / (w * 0.8));
  float alpha = smoothstep(hw + px * 1.3, hw - px * 1.3, ad);
  if (alpha <= 0.0) return vec4(0.0);

  // Across the strip in mm (35 mm wide), mirrored when you see its back; along it in mm (one frame = 38 mm).
  float b = clamp(d / hw, -1.0, 1.0) * sign(ct) * 17.5;
  float fu = exp(wd * X) / (wd * w0) / 2.17 + flow;
  float a = fract(fu) * 38.0;
  float n = floor(fu) + seed * 131.0;
  float pxmm = px / hw * 17.5;

  // Sprocket holes, 8 per frame, both edges, rounded like real perforations.
  float hole = sdBox(vec2(mod(a, 4.75) - 2.375, abs(b) - 14.2), vec2(1.0, 1.35), 0.42);
  float filmM = smoothstep(-pxmm, pxmm, hole);
  // The picture, with a frame line between frames.
  float pic = sdBox(vec2(a - 19.0, b), vec2(18.55, 12.5), 0.5);
  float picM = smoothstep(pxmm, -pxmm, pic);
  vec3 img = shot(clamp(vec2((a - 0.45) / 37.1, b / 25.0 + 0.5), 0.0, 1.0), n);

  // Frames are transparencies: dim in the dark, glowing where the beam goes through them.
  img *= 0.42 + 1.4 * beam;
  vec3 base = vec3(0.07, 0.048, 0.034) * (0.6 + 1.2 * beam);
  // Edge print between the holes and the edge: a key number every frame.
  float edge = step(15.85, abs(b)) * step(abs(b), 16.7) * step(fract(a / 1.15), 0.55) * step(a, 9.0);
  base += vec3(0.95, 0.72, 0.42) * edge * (0.12 + 0.5 * beam);
  vec3 col = mix(base, img, picM);
  if (ct < 0.0) {
    // The back of the strip: you see the emulsion through the base, dull and cool.
    col = mix(col, vec3(dot(col, vec3(0.3, 0.5, 0.2))) * vec3(0.75, 0.8, 0.9), 0.55) * 0.55;
  }
  // Brighter as the ribbon turns to face you, darker as it goes edge-on.
  col *= 0.5 + 0.5 * abs(ct);
  float cov = alpha * filmM;
  // Light coming straight through the holes.
  vec3 through = LAMP * beam * (1.0 - filmM) * alpha * 0.22;
  return vec4(col * cov + through, cov);
}

void main() {
  vec2 uv = vUv;
  float m = min(uRes.x, uRes.y);
  float px = 1.0 / m;
  float f24 = floor(uTime * 24.0);
  // Gate weave: the whole picture settles a little differently every frame.
  vec2 weave = (vec2(hash(vec2(f24, 1.0)), hash(vec2(f24, 2.0))) - 0.5) * 0.0014;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / m + weave;

  // The room.
  vec3 col = vec3(0.03, 0.024, 0.021) * (1.0 - 0.5 * length(p));

  // The projector beam.
  vec2 O = mix(vec2(-1.05, 0.78), vec2(-0.62, 1.22), uPortrait);
  float da = mix(-0.55, -1.02, uPortrait) + uPan;
  vec2 dir = vec2(cos(da), sin(da));
  vec2 vO = p - O;
  float dist = length(vO);
  float ang = atan(vO.x * dir.y - vO.y * dir.x, dot(vO, dir));
  float cone = smoothstep(0.24, 0.03, abs(ang)) * step(0.0, dot(vO, dir));
  float smoke = (0.45 + 0.55 * noise(p * 2.4 + vec2(uTime * 0.045, -uTime * 0.03)))
              * (0.6 + 0.4 * noise(p * 6.5 - vec2(uTime * 0.06, uTime * 0.02)));
  float rays = 0.72 + 0.28 * noise(vec2(ang * 46.0, uBeatN * 1.37));
  float flick = 0.95 + 0.05 * hash(vec2(f24, 7.0)) + 0.12 * uBeat;
  float beam = cone * rays * flick / (1.0 + dist * 0.85);
  col += LAMP * beam * smoke * 0.3;
  col += LAMP * 0.22 * exp(-dist * 3.2);

  // Dust in the light: two layers in focus, one soft and close.
  float dust = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = i == 0 ? 17.0 : (i == 1 ? 26.0 : 5.5);
    vec2 g = p * sc + vec2(uTime * (0.1 + fi * 0.07), uTime * (0.05 + fi * 0.03));
    vec2 cl = floor(g);
    vec2 f = fract(g);
    float h = hash(cl + fi * 17.0);
    vec2 o = 0.5 + 0.3 * vec2(sin(uTime * (0.35 + h) + h * 40.0), cos(uTime * (0.3 + h * 0.6) + h * 23.0));
    float size = i == 2 ? 0.3 : (i == 0 ? 0.11 : 0.16);
    float tw = 0.45 + 0.55 * sin(uTime * (1.0 + 3.0 * h) + h * 90.0);
    dust += smoothstep(size, 0.0, length(f - o)) * step(i == 2 ? 0.8 : 0.55, h) * tw * (i == 2 ? 0.22 : 0.8);
  }
  col += LAMP * dust * beam * 1.5;

  // The film. Ribbon space runs along the long side of the screen.
  float ra = mix(0.2, 1.22, uPortrait);
  float cr = cos(ra);
  float sr = sin(ra);
  vec2 r = vec2(cr * p.x + sr * p.y, -sr * p.x + cr * p.y);

  float haloF;
  // A phone screen is narrow, so the strips are drawn wider there to still read as film.
  float wk = 1.0 + 0.7 * uPortrait;
  vec4 far = film(r, 0.11, 1.3, 2.0 - uShape * 0.8, 0.14, 0.28, 0.03 * wk, -0.35,
                  2.3, 0.9, uShape * 0.5, 3.0 - uFlow * 0.6, 1.0, px, beam, haloF);
  col = col * (1.0 - far.a * 0.8) + far.rgb * 0.55;

  float haloN;
  vec4 near = film(r, 0.17, 1.9, uShape, -0.1, -0.08, 0.085 * wk, 0.7,
                   1.05, 1.3, 1.0 + uShape * 0.7, uFlow, 0.0, px, beam, haloN);
  col = col * (1.0 - near.a) + near.rgb;

  // Halation: lit film bleeds warm light into the air around it.
  col += vec3(1.0, 0.36, 0.14) * (haloN + haloF * 0.5) * beam * 0.16;

  // The print: an occasional scratch, grain that changes every frame, vignette.
  float sh = hash(vec2(floor(uTime * 4.0), 11.0));
  float sx = hash(vec2(floor(uTime * 4.0), 12.0));
  col += LAMP * 0.05 * step(0.9, sh) * exp(-abs(uv.x - sx) * uRes.x * 0.7);
  col *= uDim;
  vec2 vg = uv - 0.5;
  col *= 1.0 - 0.95 * dot(vg, vg);
  col += (hash(gl_FragCoord.xy + f24 * 13.1) - 0.5) * 0.028;
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`;

type Vec3 = [number, number, number];

/**
 * Section tints, by `data-scene`: the colours of the shots on the film. The light itself stays warm. The brand blue
 * and violet live here, inside the pictures, not as glows on the page.
 */
const SCENES: Record<string, { c: [Vec3, Vec3, Vec3]; dim: number }> = {
  hero: { c: [hex("#2F6FD6"), hex("#6A4BE0"), hex("#E0784B")], dim: 1 },
  broll: { c: [hex("#3D7BD9"), hex("#2A9C9C"), hex("#E8A04B")], dim: 0.9 },
  captions: { c: [hex("#D9663D"), hex("#B04A8C"), hex("#F2C14E")], dim: 0.9 },
  reference: { c: [hex("#2A9CB0"), hex("#4A62D9"), hex("#E08A4B")], dim: 0.95 },
  editor: { c: [hex("#3A6FD9"), hex("#4FB0A0"), hex("#D98C3D")], dim: 0.9 },
  pricing: { c: [hex("#5B4BD9"), hex("#2F6FD6"), hex("#E0784B")], dim: 0.75 },
  calm: { c: [hex("#3A4F8A"), hex("#5A4A7E"), hex("#8A6A4A")], dim: 0.72 }
};

function hex(h: string): Vec3 {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];

export const BPM = 112;

export function startBackdrop(canvas: HTMLCanvasElement): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
  if (!gl) return; // the CSS gradient underneath stays

  const prog = program(gl, VERT, FRAG);
  if (!prog) return;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    res: u("uRes"), time: u("uTime"), flow: u("uFlow"), shape: u("uShape"), beat: u("uBeat"), beatF: u("uBeatF"),
    beatN: u("uBeatN"), portrait: u("uPortrait"), pan: u("uPan"), dim: u("uDim"), a: u("uA"), b: u("uB"), c: u("uC")
  };

  const scale = (phone ? 0.5 : 0.75) * Math.min(window.devicePixelRatio || 1, 1.5);
  const resize = () => {
    const w = Math.max(1, Math.round(window.innerWidth * scale));
    const h = Math.max(1, Math.round(window.innerHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  // The pointer pans the projector a little, eased.
  let pan = 0;
  let panTarget = 0;
  window.addEventListener("pointermove", (e) => {
    panTarget = (0.5 - e.clientY / window.innerHeight) * 0.12 + (e.clientX / window.innerWidth - 0.5) * 0.06;
  }, { passive: true });

  // Scroll feeds film; which section is in view sets the tint.
  let scrollFlow = window.scrollY / 320;
  let shapeScroll = 0;
  const sections = () => Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  let sceneEls = sections();
  let cur: [Vec3, Vec3, Vec3] = SCENES.hero.c.map((c) => [...c] as Vec3) as [Vec3, Vec3, Vec3];
  let dim = 1;
  const target = () => {
    const mid = window.innerHeight * 0.5;
    let best = "calm";
    let bestD = Infinity;
    for (const el of sceneEls) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) return SCENES[el.dataset.scene ?? "calm"] ?? SCENES.calm;
      const d = Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
      if (d < bestD) {
        bestD = d;
        best = el.dataset.scene ?? "calm";
      }
    }
    return SCENES[best] ?? SCENES.calm;
  };

  let lost = false;
  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    canvas.style.opacity = "0";
  });

  const start = performance.now();
  let lastBeat = -1;
  let lastFrame = 0;
  let frame = 0;
  const minGap = phone ? 1000 / 31 : 0;
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

  const draw = (now: number) => {
    if (lost) return;
    const t = (now - start) / 1000;
    const beatPos = (t * BPM) / 60;
    const beatN = Math.floor(beatPos);
    const beatF = beatPos - beatN;
    const beat = Math.pow(1 - beatF, 5);
    if (beatN !== lastBeat) {
      lastBeat = beatN;
      if (!reduced) window.dispatchEvent(new CustomEvent("zera:beat", { detail: beatN }));
    }

    const y = window.scrollY;
    const doc = document.documentElement;
    const progress = y / Math.max(1, doc.scrollHeight - window.innerHeight);
    scrollFlow = lerp(scrollFlow, y / 320, 0.14);
    shapeScroll = lerp(shapeScroll, progress * 2.2, 0.05);
    pan = lerp(pan, panTarget, 0.04);
    if (frame++ % 20 === 0) sceneEls = sections();
    const tgt = target();
    cur = [lerp3(cur[0], tgt.c[0], 0.04), lerp3(cur[1], tgt.c[1], 0.04), lerp3(cur[2], tgt.c[2], 0.04)];
    dim = lerp(dim, tgt.dim, 0.04);

    // Film moves three ways: a slow drift, a half-frame pull-down on every beat, and whatever you scroll.
    const pull = reduced ? 0 : beatN * 0.5 + 0.5 * easeOut(Math.min(1, beatF / 0.2));
    const flow = (t * 0.22 + pull + scrollFlow) % 512;

    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.time, t);
    gl.uniform1f(U.flow, flow);
    gl.uniform1f(U.shape, t * 0.045 + shapeScroll);
    gl.uniform1f(U.beat, reduced ? 0 : beat);
    gl.uniform1f(U.beatF, reduced ? 0.3 : beatF);
    gl.uniform1f(U.beatN, beatN % 256);
    gl.uniform1f(U.portrait, canvas.height > canvas.width * 1.15 ? 1 : 0);
    gl.uniform1f(U.pan, pan);
    gl.uniform1f(U.dim, dim);
    gl.uniform3fv(U.a, cur[0]);
    gl.uniform3fv(U.b, cur[1]);
    gl.uniform3fv(U.c, cur[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.style.opacity = "1";
  };

  if (reduced) {
    // One still frame, redrawn only when the section (and so the tint) changes.
    const still = () => requestAnimationFrame(() => draw(start + 4000));
    still();
    window.addEventListener("scroll", () => {
      const tgt = target();
      cur = tgt.c;
      dim = tgt.dim;
      still();
    }, { passive: true });
    return;
  }

  let running = true;
  const loop = (now: number) => {
    if (!running) return;
    if (now - lastFrame >= minGap) {
      lastFrame = now;
      draw(now);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) running = false;
    else if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
}

function program(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[backdrop] shader", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const v = sh(gl.VERTEX_SHADER, vs);
  const f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn("[backdrop] link", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}
