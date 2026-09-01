/* <ripple-bg> — surface liquide réactive au curseur.
   Portage WebGL natif de RippleDistortion : même modèle d'ondes (brush
   exponentiel + anneaux, croissance et décroissance exponentielles, cadence au
   pas de déplacement), mais sans ogl ni React, et sans image source : la surface
   distordue est un grain d'espresso procédural, sinon un aplat de couleur ne
   révélerait aucune déformation. */
(() => {
  if (customElements.get("ripple-bg")) return;

  const MAX = 20;
  const START_SCALE = 1.5;
  const LIFE = Math.log(500);

  const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform vec4 uWaves[${MAX}];
uniform int uCount;
uniform float uRings, uStrength, uSwirl, uTintAmount, uGlint, uGrain;
uniform vec3 uBase, uAccent, uHighlight;

const float PI = 3.141592653589793;
const float EDGE = 0.006737947;
const float TAU = 6.283185307179586;

float amountAt(vec2 px) {
  float a = 0.0;
  for (int i = 0; i < ${MAX}; i++) {
    if (i >= uCount) break;
    vec4 w = uWaves[i];
    vec2 d = (px - w.xy) / max(w.z, 1.0);
    float r = dot(d, d);
    if (r > 1.0) continue;
    float brush = (exp(-r * 5.0) - EDGE) / (1.0 - EDGE);
    brush *= 0.55 + 0.45 * cos(sqrt(r) * PI * 2.0 * uRings);
    a += brush * w.w * w.w;
  }
  return a;
}

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

/* grain de torréfaction : deux octaves + une trame fine, c'est ce que l'onde tord */
float surface(vec2 p) {
  float n = vnoise(p * 0.014) * 0.6 + vnoise(p * 0.045) * 0.3;
  n += sin(p.x * 0.05 + p.y * 0.032) * 0.06;
  return n;
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, gl_FragCoord.y);
  float amount = amountAt(px);

  float theta = amount * uSwirl * TAU;
  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 warped = px + dir * amount * uStrength * min(uRes.x, uRes.y);

  float s = surface(warped);
  vec3 color = uBase * (1.0 - uGrain * 0.5 + s * uGrain);

  if (uTintAmount > 0.001) {
    color = mix(color, uAccent, clamp(amount * 1.5, 0.0, 1.0) * uTintAmount);
  }

  if (uGlint > 0.001) {
    float e = 2.0;
    float ex = amountAt(px + vec2(e, 0.0)) - amountAt(px - vec2(e, 0.0));
    float ey = amountAt(px + vec2(0.0, e)) - amountAt(px - vec2(0.0, e));
    vec3 n = normalize(vec3(-ex * 26.0, -ey * 26.0, 1.0));
    vec3 l = normalize(vec3(-0.35, 0.55, 1.0));
    float raw = pow(max(dot(n, l), 0.0), 22.0);
    float flatSpec = pow(max(l.z, 0.0), 22.0);
    color += uHighlight * clamp((raw - flatSpec) / max(1.0 - flatSpec, 0.0001), 0.0, 1.0) * uGlint;
  }

  gl_FragColor = vec4(color, 1.0);
}`;

  const hexRGB = (hex) => {
    const c = String(hex || "").replace("#", "");
    const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return [0, 0, 0];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  const compile = (gl, type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[ripple-bg]", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };

  class RippleBg extends HTMLElement {
    connectedCallback() {
      if (this.canvas) return;
      const num = (name, dflt) => {
        const v = parseFloat(this.getAttribute(name));
        return Number.isFinite(v) ? v : dflt;
      };
      this.cfg = {
        base: this.getAttribute("base") || "#1b1209",
        accent: this.getAttribute("accent") || "#b4813f",
        highlight: this.getAttribute("highlight") || "#d9a868",
        brush: num("brush-size", 170),
        strength: num("strength", 0.06),
        swirl: num("swirl", 1),
        rings: num("rings", 4),
        spread: num("spread", 5),
        fade: num("fade", 3),
        spacing: num("spacing", 16),
        glint: num("glint", 0.5),
        tintAmount: num("tint-amount", 0.45),
        grain: num("grain", 0.22),
        scale: num("quality", 0.5),
      };

      this.style.display = "block";
      this.style.background = this.cfg.base;
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "display:block;width:100%;height:100%";
      this.appendChild(canvas);
      this.canvas = canvas;

      const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
      if (!gl) return;
      this.gl = gl;

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn("[ripple-bg]", gl.getProgramInfoLog(prog));
        return;
      }
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const U = (n) => gl.getUniformLocation(prog, n);
      this.u = {
        res: U("uRes"), waves: U("uWaves[0]"), count: U("uCount"),
        rings: U("uRings"), strength: U("uStrength"), swirl: U("uSwirl"),
        tint: U("uTintAmount"), glint: U("uGlint"), grain: U("uGrain"),
        base: U("uBase"), accent: U("uAccent"), highlight: U("uHighlight"),
      };
      gl.uniform1f(this.u.rings, this.cfg.rings);
      gl.uniform1f(this.u.strength, this.cfg.strength);
      gl.uniform1f(this.u.swirl, this.cfg.swirl);
      gl.uniform1f(this.u.tint, this.cfg.tintAmount);
      gl.uniform1f(this.u.glint, this.cfg.glint);
      gl.uniform1f(this.u.grain, this.cfg.grain);
      gl.uniform3fv(this.u.base, hexRGB(this.cfg.base));
      gl.uniform3fv(this.u.accent, hexRGB(this.cfg.accent));
      gl.uniform3fv(this.u.highlight, hexRGB(this.cfg.highlight));

      this.waves = Array.from({ length: MAX }, () => ({ x: 0, y: 0, scale: START_SCALE, target: START_SCALE, size: 1, opacity: 0 }));
      this.data = new Float32Array(MAX * 4);
      this.cursor = 0;
      this.prev = { x: 0, y: 0 };
      this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this.resize();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this);

      this.onMove = (e) => this.track(e);
      window.addEventListener("pointermove", this.onMove, { passive: true });

      /* rendu suspendu hors de l'écran, et au repos une fois les ondes éteintes */
      this.visible = true;
      this.vo = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; }, { rootMargin: "120px" });
      this.vo.observe(this);

      this.dirty = true;
      this.last = 0;
      this.tick = (t) => { this.raf = requestAnimationFrame(this.tick); this.frame(t); };
      this.raf = requestAnimationFrame(this.tick);
    }

    disconnectedCallback() {
      cancelAnimationFrame(this.raf);
      if (this.ro) this.ro.disconnect();
      if (this.vo) this.vo.disconnect();
      if (this.onMove) window.removeEventListener("pointermove", this.onMove);
      if (this.gl) {
        const ext = this.gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
      this.gl = null;
      this.canvas = null;
    }

    resize() {
      if (!this.gl || !this.canvas) return;
      const w = Math.max(1, this.clientWidth);
      const h = Math.max(1, this.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * this.cfg.scale;
      this.w = Math.max(2, Math.round(w * dpr));
      this.h = Math.max(2, Math.round(h * dpr));
      this.px = dpr;
      this.canvas.width = this.w;
      this.canvas.height = this.h;
      this.gl.viewport(0, 0, this.w, this.h);
      this.gl.uniform2f(this.u.res, this.w, this.h);
      this.dirty = true;
    }

    spawn(x, y, power) {
      const w = this.waves[this.cursor];
      this.cursor = (this.cursor + 1) % MAX;
      w.x = x;
      w.y = y;
      w.scale = START_SCALE * power;
      w.target = START_SCALE * Math.max(1, this.cfg.spread) * power;
      w.size = Math.max(1, this.cfg.brush) * this.px;
      w.opacity = 1;
      this.dirty = true;
    }

    track(e) {
      if (this.reduced || !this.visible) return;
      const r = this.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const x = (e.clientX - r.left) * this.px;
      const y = (r.height - (e.clientY - r.top)) * this.px;
      const step = Math.max(1, this.cfg.spacing) * this.px;
      if (Math.abs(x - this.prev.x) > step || Math.abs(y - this.prev.y) > step) {
        this.spawn(x, y, 1);
        this.prev.x = x;
        this.prev.y = y;
      }
    }

    frame(now) {
      const gl = this.gl;
      if (!gl || !this.visible || !this.dirty) { this.last = now; return; }
      const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
      this.last = now;

      const growth = 1 - Math.exp(-dt * 1.09);
      const decay = Math.exp((-dt * LIFE) / Math.max(0.15, this.cfg.fade));
      let count = 0;
      for (let i = 0; i < MAX; i++) {
        const w = this.waves[i];
        if (w.opacity <= 0) continue;
        w.opacity *= decay;
        w.scale += (w.target - w.scale) * growth;
        if (w.opacity < 0.002) { w.opacity = 0; continue; }
        const half = (w.scale * w.size) / 2;
        this.data[count * 4] = w.x;
        this.data[count * 4 + 1] = w.y;
        this.data[count * 4 + 2] = half;
        this.data[count * 4 + 3] = w.opacity;
        count++;
      }
      for (let i = count; i < MAX; i++) this.data.fill(0, i * 4, i * 4 + 4);

      gl.uniform4fv(this.u.waves, this.data);
      gl.uniform1i(this.u.count, count);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      /* une dernière image quand tout s'est éteint, puis on se met au repos */
      this.dirty = count > 0;
    }
  }

  customElements.define("ripple-bg", RippleBg);
})();
