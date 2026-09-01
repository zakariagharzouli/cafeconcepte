/* <line-waves> — champ de lignes ondulantes.
   Portage WebGL natif de LineWaves (ogl + React à l'origine). Shader identique,
   avec un uniform de plus : uPaper, la couleur du support en mode clair, pour
   que le motif se pose sur la crème du site et non sur du blanc. */
(() => {
  if (customElements.get("line-waves")) return;

  const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

  const FRAG = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed, uInnerLines, uOuterLines, uWarpIntensity, uRotation;
uniform float uEdgeFadeWidth, uColorCycleSpeed, uBrightness, uMouseInfluence;
uniform vec3 uColor1, uColor2, uColor3, uPaper;
uniform vec2 uMouse;
uniform float uEnableMouse, uLightMode;

#define HALF_PI 1.5707963

float hashF(float n) { return fract(sin(n * 127.1) * 43758.5453123); }

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float r = sin(coord * 2.123) * 0.2;
  r += sin(coord * 3.234 + t * 4.345) * 0.1;
  r += sin(coord * 0.589 + t * 0.934) * 0.5;
  return r;
}

float displaceB(float coord, float t) {
  float r = sin(coord * 1.345) * 0.3;
  r += sin(coord * 2.734 + t * 3.345) * 0.2;
  r += sin(coord * 0.189 + t * 0.934) * 0.3;
  return r;
}

vec2 rotate2D(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse > 0.5) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)), 5.0);

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;
  float cycleT = fullT * uColorCycleSpeed;
  float rC = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gC = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bC = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rC * uColor1 + gC * uColor2 + bC * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  if (uLightMode > 0.5) {
    vec3 w = pow(max(vec3(rC, gC, bC), vec3(0.0)), vec3(3.0));
    float sum = max(w.r + w.g + w.b, 0.0001);
    vec3 chroma = (w.r * uColor1 + w.g * uColor2 + w.b * uColor3) / sum;
    float neutral = min(chroma.r, min(chroma.g, chroma.b));
    chroma = max(chroma - vec3(neutral * 0.92), vec3(0.0));
    float peak = max(chroma.r, max(chroma.g, chroma.b));
    chroma = pow(clamp(chroma / max(peak, 0.0001), 0.0, 1.0), vec3(1.08));
    float ink = clamp(max(rC, max(gC, bC)) * uBrightness * 1.15, 0.0, 0.92);
    gl_FragColor = vec4(mix(uPaper, chroma, ink), 1.0);
  } else {
    gl_FragColor = vec4(col, alpha);
  }
}`;

  const hexRGB = (hex) => {
    const c = String(hex || "").replace("#", "");
    const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return [1, 1, 1];
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  const compile = (gl, type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[line-waves]", gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  };

  class LineWaves extends HTMLElement {
    connectedCallback() {
      if (this.canvas) return;
      const num = (n, d) => {
        const v = parseFloat(this.getAttribute(n));
        return Number.isFinite(v) ? v : d;
      };
      this.cfg = {
        speed: num("speed", 0.3),
        inner: num("inner-lines", 32),
        outer: num("outer-lines", 36),
        warp: num("warp", 1),
        rotation: num("rotation", -45),
        edgeFade: num("edge-fade", 0),
        cycle: num("cycle-speed", 1),
        brightness: num("brightness", 0.4),
        color1: this.getAttribute("color1") || "#b4813f",
        color2: this.getAttribute("color2") || "#1b1209",
        color3: this.getAttribute("color3") || "#d9a868",
        paper: this.getAttribute("paper") || "#f8e7d0",
        light: this.getAttribute("light") !== "false",
        mouse: num("mouse-influence", 2),
        scale: num("quality", 0.55),
      };

      this.style.display = "block";
      this.style.background = this.cfg.paper;
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "display:block;width:100%;height:100%";
      this.appendChild(canvas);
      this.canvas = canvas;

      const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, powerPreference: "low-power" });
      if (!gl) return;
      this.gl = gl;
      gl.clearColor(0, 0, 0, 0);

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.warn("[line-waves]", gl.getProgramInfoLog(prog));
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
      this.u = { time: U("uTime"), res: U("uResolution"), mouse: U("uMouse") };
      const c = this.cfg;
      gl.uniform1f(U("uSpeed"), c.speed);
      gl.uniform1f(U("uInnerLines"), c.inner);
      gl.uniform1f(U("uOuterLines"), c.outer);
      gl.uniform1f(U("uWarpIntensity"), c.warp);
      gl.uniform1f(U("uRotation"), (c.rotation * Math.PI) / 180);
      gl.uniform1f(U("uEdgeFadeWidth"), c.edgeFade);
      gl.uniform1f(U("uColorCycleSpeed"), c.cycle);
      gl.uniform1f(U("uBrightness"), c.brightness);
      gl.uniform1f(U("uMouseInfluence"), c.mouse);
      gl.uniform1f(U("uEnableMouse"), 1);
      gl.uniform1f(U("uLightMode"), c.light ? 1 : 0);
      gl.uniform3fv(U("uColor1"), hexRGB(c.color1));
      gl.uniform3fv(U("uColor2"), hexRGB(c.color2));
      gl.uniform3fv(U("uColor3"), hexRGB(c.color3));
      gl.uniform3fv(U("uPaper"), hexRGB(c.paper));

      this.cur = [0.5, 0.5];
      this.tgt = [0.5, 0.5];
      this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      this.resize();
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this);

      this.onMove = (e) => {
        const r = this.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
          this.tgt = [0.5, 0.5];
          return;
        }
        this.tgt = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
      };
      window.addEventListener("pointermove", this.onMove, { passive: true });

      this.visible = true;
      this.vo = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; }, { rootMargin: "160px" });
      this.vo.observe(this);

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * this.cfg.scale;
      const w = Math.max(2, Math.round(Math.max(1, this.clientWidth) * dpr));
      const h = Math.max(2, Math.round(Math.max(1, this.clientHeight) * dpr));
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      this.gl.uniform3f(this.u.res, w, h, w / h);
    }

    frame(now) {
      const gl = this.gl;
      if (!gl || !this.visible) return;
      gl.uniform1f(this.u.time, this.reduced ? 0 : now * 0.001);
      this.cur[0] += 0.05 * (this.tgt[0] - this.cur[0]);
      this.cur[1] += 0.05 * (this.tgt[1] - this.cur[1]);
      gl.uniform2f(this.u.mouse, this.cur[0], this.cur[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  customElements.define("line-waves", LineWaves);
})();
