/**
 * The hero's reveal, in WebGL: two videos of the same moment (the raw clip and Zera's edit), and a brush. Wherever
 * the pointer has been, the edit shows through; the stroke fades like ink drying, its edge is broken by noise, and a
 * thin blue rim with a little colour split marks the seam. Scroll can open the edit fully (`setOpen`).
 *
 * Plain WebGL 1 (works on every phone that has WebGL) and no library. The brush lives in a small offscreen texture
 * drawn into itself each frame (two textures, ping-pong), so its trail costs the same at any length. Videos upload as
 * textures only when they have a new frame. Returns null when WebGL is missing; the caller then shows the edit plainly.
 */

const VERT = `attribute vec2 p; varying vec2 uv; void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

// The brush: last frame's ink, dried a little and nudged along the stroke, plus a soft capsule from the previous
// pointer position to this one (so a fast stroke has no gaps).
const BRUSH = `precision highp float;
varying vec2 uv;
uniform sampler2D prev;
uniform vec2 a, b, vel;
uniform float radius, strength, aspect, dry;
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0); return length(pa - ba * h); }
void main(){
  float v = texture2D(prev, uv - vel * 0.35).r;
  v = max(v * dry - 0.0035, 0.0);
  vec2 s = vec2(aspect, 1.0);
  float d = seg(uv * s, a * s, b * s);
  v = max(v, smoothstep(radius, radius * 0.15, d) * strength);
  gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
}`;

const SHOW = `precision highp float;
varying vec2 uv;
uniform sampler2D raw, edit, ink;
uniform vec2 cover;      // object-fit: cover, as a uv scale
uniform float time, open, aspect;
uniform vec3 rim;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
void main(){
  vec2 v = (uv - 0.5) * cover + 0.5;
  v.y = 1.0 - v.y;
  float t = texture2D(ink, uv).r;
  float g = fbm(uv * vec2(4.0 * aspect, 4.0) + vec2(time * 0.05, -time * 0.08));
  // scroll opens the edit from the centre outward, with the same broken edge
  float c = length((uv - vec2(0.5, 0.45)) * vec2(aspect, 1.0));
  float o = open * 1.6 - c + (g - 0.5) * 0.35;
  float m = max(smoothstep(0.47, 0.55, t + (g - 0.5) * 0.45), smoothstep(0.0, 0.03, o));
  float edge = pow(1.0 - abs(m - 0.5) * 2.0, 3.0);
  vec2 split = vec2(edge * 0.012, edge * 0.004);
  vec3 r = texture2D(raw, v).rgb;
  r = mix(vec3(dot(r, vec3(0.299, 0.587, 0.114))), r, 0.72) * 0.86;   // the raw side, a little flat and dim
  vec3 e = vec3(texture2D(edit, v + split).r, texture2D(edit, v).g, texture2D(edit, v - split).b);
  vec3 col = mix(r, e, m) + rim * edge * 0.55;
  gl_FragColor = vec4(col, 1.0);
}`;

export type Reveal = {
  /** 0 → only what the brush has shown; 1 → the whole edit. */
  setOpen(v: number): void;
  /** Stop drawing while the hero is off screen. */
  setActive(on: boolean): void;
  resize(): void;
};

export function createReveal(canvas: HTMLCanvasElement, raw: HTMLVideoElement, edit: HTMLVideoElement, opts: { idle: boolean }): Reveal | null {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = (frag: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, "p"); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
    const u: Record<string, WebGLUniformLocation | null> = {};
    return { p, u: (name: string) => (u[name] ??= gl.getUniformLocation(p, name)) };
  };
  let brush: ReturnType<typeof prog>, show: ReturnType<typeof prog>;
  try { brush = prog(BRUSH); show = prog(SHOW); } catch { return null; }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = (w = 1, h = 1) => {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return t;
  };
  const tRaw = tex(), tEdit = tex();
  let inkW = 0, inkH = 0;
  let ink = [tex(), tex()], fbo = [gl.createFramebuffer()!, gl.createFramebuffer()!], cur = 0;
  const sizeInk = () => {
    inkW = Math.max(64, Math.round(canvas.width / 4)); inkH = Math.max(64, Math.round(canvas.height / 4));
    ink.forEach((t, i) => {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, inkW, inkH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[i]);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  };

  // Video frames: upload only what is new. requestVideoFrameCallback where there is one, every frame otherwise.
  const fresh = new Set<HTMLVideoElement>([raw, edit]);
  const watch = (v: HTMLVideoElement) => {
    const rv = (v as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number }).requestVideoFrameCallback;
    if (!rv) return false;
    const loop = () => { fresh.add(v); rv.call(v, loop); };
    rv.call(v, loop);
    return true;
  };
  const hasRvfc = watch(raw) && watch(edit);
  const upload = (v: HTMLVideoElement, t: WebGLTexture) => {
    if (v.readyState < 2 || (hasRvfc && !fresh.has(v))) return;
    fresh.delete(v);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
  };

  // Pointer → brush, in canvas uv (y up).
  const pen = { x: 0.5, y: 0.55, px: 0.5, py: 0.55, vx: 0, vy: 0, last: 0, down: false };
  const toUv = (e: PointerEvent) => { const b = canvas.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width, y: 1 - (e.clientY - b.top) / b.height }; };
  const move = (e: PointerEvent) => {
    const p = toUv(e);
    if (p.x < -0.1 || p.x > 1.1 || p.y < -0.1 || p.y > 1.1) return;
    pen.x = p.x; pen.y = p.y; pen.last = performance.now();
  };
  const host = canvas.parentElement!;
  host.addEventListener("pointermove", move, { passive: true });
  host.addEventListener("pointerdown", (e) => { move(e); pen.px = pen.x; pen.py = pen.y; }, { passive: true });

  let open = 0, drawnOpen = -1, lastDraw = 0, active = true, raf = 0, aspect = 1, cover = [1, 1];
  const t0 = performance.now();
  const resize = () => {
    // the clip is 720p on phones and 1080p on desktop; the canvas never needs more pixels than that
    const dpr = Math.min(devicePixelRatio || 1, innerWidth < 900 ? 1.5 : 1.75);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (w < 2 || h < 2) return;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; sizeInk(); }
    aspect = w / h;
    const vr = (raw.videoWidth || 9) / (raw.videoHeight || 16);
    cover = aspect > vr ? [1, vr / aspect] : [aspect / vr, 1];
  };

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!active) return;
    const now = performance.now(), time = (now - t0) / 1000;
    // Nobody steering: the brush wanders on its own, slower and lighter.
    const idle = now - pen.last > 2200;
    // Draw only when there is something new: a video frame, a hand on the brush, or scroll opening the edit. A phone
    // then works at the clip's 30 fps instead of the screen's 60 or 120.
    const steering = !idle || open !== drawnOpen;
    if (!steering && hasRvfc && fresh.size === 0) return;
    if (!steering && !hasRvfc && now - lastDraw < 32) return;
    lastDraw = now; drawnOpen = open;
    if (idle && opts.idle) {
      pen.x = 0.5 + Math.sin(time * 0.55) * 0.3 + Math.sin(time * 1.7) * 0.05;
      pen.y = 0.55 + Math.sin(time * 0.83 + 1.2) * 0.26;
    }
    pen.vx += ((pen.x - pen.px) - pen.vx) * 0.3; pen.vy += ((pen.y - pen.py) - pen.vy) * 0.3;
    const speed = Math.hypot(pen.vx, pen.vy);

    upload(raw, tRaw); upload(edit, tEdit);

    // brush pass
    const src = cur, dst = 1 - cur;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[dst]);
    gl.viewport(0, 0, inkW, inkH);
    gl.useProgram(brush.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ink[src]);
    gl.uniform1i(brush.u("prev"), 0);
    gl.uniform2f(brush.u("a"), pen.px, pen.py);
    gl.uniform2f(brush.u("b"), pen.x, pen.y);
    gl.uniform2f(brush.u("vel"), pen.vx * 0.5, pen.vy * 0.5);
    gl.uniform1f(brush.u("radius"), (idle ? 0.15 : 0.17) + Math.min(speed * 1.6, 0.08));
    gl.uniform1f(brush.u("strength"), idle ? 0.85 : 1);
    gl.uniform1f(brush.u("aspect"), aspect);
    gl.uniform1f(brush.u("dry"), idle ? 0.955 : 0.972);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    cur = dst;
    pen.px = pen.x; pen.py = pen.y;

    // show pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(show.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tRaw); gl.uniform1i(show.u("raw"), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tEdit); gl.uniform1i(show.u("edit"), 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, ink[cur]); gl.uniform1i(show.u("ink"), 2);
    gl.uniform2f(show.u("cover"), cover[0], cover[1]);
    gl.uniform1f(show.u("time"), time);
    gl.uniform1f(show.u("open"), open);
    gl.uniform1f(show.u("aspect"), aspect);
    gl.uniform3f(show.u("rim"), 0.55, 0.75, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  raw.addEventListener("loadedmetadata", resize);
  new ResizeObserver(resize).observe(canvas);
  resize();
  raf = requestAnimationFrame(frame);
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); cancelAnimationFrame(raf); canvas.dispatchEvent(new CustomEvent("reveal:lost")); });

  return {
    setOpen: (v) => { open = v; },
    setActive: (on) => { active = on; },
    resize,
  };
}
