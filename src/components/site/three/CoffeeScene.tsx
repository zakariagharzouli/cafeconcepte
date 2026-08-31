"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────
   Fond shader — café liquide animé (fbm noise)
   Palette charte : espresso-deep → espresso → caramel
──────────────────────────────────────────────────────── */

const LIQUID_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LIQUID_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.05 + vec2(17.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 3.2;

    // écoulment lent type surface de café
    float t = uTime * 0.06;
    float n1 = fbm(p + vec2(t, -t * 0.6));
    float n2 = fbm(p * 1.6 + vec2(-t * 0.8, t * 0.4) + n1 * 1.4);
    float swirl = n1 * 0.65 + n2 * 0.35;

    // halo suivant la souris
    vec2 m = uMouse * 0.5 + 0.5;
    float halo = 0.14 / (0.06 + distance(uv, m));

    vec3 deep = vec3(0.235, 0.165, 0.110);   // #3C2A1C
    vec3 esp  = vec3(0.353, 0.247, 0.161);   // #5A3F29
    vec3 cara = vec3(0.706, 0.506, 0.247);   // #B4813F

    vec3 col = mix(deep, esp, smoothstep(0.25, 0.75, swirl));
    col = mix(col, cara, smoothstep(0.72, 0.98, swirl) * 0.45);
    col += cara * halo * 0.11;

    // vignette douce
    float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5, 0.45)));
    col *= mix(0.72, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function LiquidBackground({ isMobile }: { isMobile: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    // parallaxe douce
    mouse.current.lerp(state.pointer, 0.04);
    (mat.current.uniforms.uMouse.value as THREE.Vector2).copy(mouse.current);
  });

  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[isMobile ? 26 : 42, isMobile ? 48 : 26]} />
      <shaderMaterial
        ref={mat}
        vertexShader={LIQUID_VERT}
        fragmentShader={LIQUID_FRAG}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────
   Tasse procédurale — lathe + anse + soucoupe + café
──────────────────────────────────────────────────────── */

function CoffeeCup() {
  const group = useRef<THREE.Group>(null);

  const { outerPts, saucerPts } = useMemo(() => {
    const outerPts: THREE.Vector2[] = [];
    // paroi extérieure → rebord → paroi intérieure
    outerPts.push(new THREE.Vector2(0.001, 0.02));
    outerPts.push(new THREE.Vector2(0.34, 0.0));
    outerPts.push(new THREE.Vector2(0.52, 0.05));
    outerPts.push(new THREE.Vector2(0.62, 0.22));
    outerPts.push(new THREE.Vector2(0.70, 0.52));
    outerPts.push(new THREE.Vector2(0.76, 0.85));
    outerPts.push(new THREE.Vector2(0.77, 1.0));
    outerPts.push(new THREE.Vector2(0.73, 1.02));
    outerPts.push(new THREE.Vector2(0.70, 0.86));
    outerPts.push(new THREE.Vector2(0.63, 0.52));
    outerPts.push(new THREE.Vector2(0.55, 0.24));
    outerPts.push(new THREE.Vector2(0.30, 0.14));
    outerPts.push(new THREE.Vector2(0.001, 0.13));

    const saucerPts: THREE.Vector2[] = [];
    saucerPts.push(new THREE.Vector2(0.001, 0.0));
    saucerPts.push(new THREE.Vector2(0.55, 0.0));
    saucerPts.push(new THREE.Vector2(0.85, 0.035));
    saucerPts.push(new THREE.Vector2(1.12, 0.13));
    saucerPts.push(new THREE.Vector2(1.13, 0.16));
    saucerPts.push(new THREE.Vector2(0.86, 0.10));
    saucerPts.push(new THREE.Vector2(0.56, 0.05));
    saucerPts.push(new THREE.Vector2(0.001, 0.05));

    return { outerPts, saucerPts };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.position.y = Math.sin(t * 0.9) * 0.12;
    group.current.rotation.y = t * 0.22;
    group.current.rotation.z = Math.sin(t * 0.6) * 0.03;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      {/* soucoupe */}
      <mesh position={[0, -0.12, 0]}>
        <latheGeometry args={[saucerPts, 64]} />
        <meshStandardMaterial color="#fbf4ec" roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* tasse */}
      <mesh>
        <latheGeometry args={[outerPts, 64]} />
        <meshStandardMaterial color="#fbf4ec" roughness={0.32} side={THREE.DoubleSide} />
      </mesh>

      {/* anse */}
      <mesh position={[0.82, 0.52, 0]} rotation={[0, 0, -0.25]}>
        <torusGeometry args={[0.30, 0.075, 18, 42, Math.PI * 1.25]} />
        <meshStandardMaterial color="#fbf4ec" roughness={0.32} />
      </mesh>

      {/* surface du café */}
      <mesh position={[0, 0.92, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 48]} />
        <meshStandardMaterial color="#3a2718" roughness={0.12} metalness={0.05} />
      </mesh>

      {/* latte art — rosace caramélisée */}
      <mesh position={[0, 0.925, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.045, 10, 40]} />
        <meshStandardMaterial color="#c89b62" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.925, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.05, 10, 32]} />
        <meshStandardMaterial color="#d9a868" roughness={0.35} />
      </mesh>

      {/* ombre douce sous la soucoupe */}
      <mesh position={[0, -0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35, 40]} />
        <meshBasicMaterial color="#1a110a" transparent opacity={0.32} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────
   Vapeur — particules shader (un seul draw call)
──────────────────────────────────────────────────────── */

const STEAM_VERT = /* glsl */ `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  varying float vAlpha;
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    float t = fract(uTime * aSpeed + aOffset);
    vec3 p = position;
    p.y += t * 2.1;
    p.x += sin(t * 9.0 + aOffset * 12.0) * 0.10 * t;
    p.z += cos(t * 7.0 + aOffset * 9.0) * 0.07 * t;

    vAlpha = (1.0 - t) * smoothstep(0.0, 0.18, t) * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float pxSize = aSize * (0.6 + t * 1.4) * uPixelRatio * (3.5 / -mv.z);
    gl_PointSize = min(pxSize, 110.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const STEAM_FRAG = /* glsl */ `
  precision highp float;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    gl_FragColor = vec4(0.965, 0.914, 0.859, a);
  }
`;

function Steam({ isMobile }: { isMobile: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const count = isMobile ? 26 : 48;

  const { positions, offsets, speeds, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = 0.55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
      offsets[i] = Math.random();
      speeds[i] = 0.16 + Math.random() * 0.14;
      sizes[i] = 22 + Math.random() * 34;
    }
    return { positions, offsets, speeds, sizes };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
  }), []);

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    mat.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points position={[0, 0.55, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={STEAM_VERT}
        fragmentShader={STEAM_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────────────
   Grains de café en orbite
──────────────────────────────────────────────────────── */

function Bean({ seed }: { seed: number }) {
  const mesh = useRef<THREE.Group>(null);
  const orbit = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      radius: 2.1 + rand(1) * 2.2,
      speed: (0.10 + rand(2) * 0.16) * (rand(3) > 0.5 ? 1 : -1),
      height: -1.2 + rand(4) * 2.6,
      tilt: rand(5) * Math.PI,
      phase: rand(6) * Math.PI * 2,
      scale: 0.16 + rand(7) * 0.14,
    };
  }, [seed]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime * orbit.speed + orbit.phase;
    const x = Math.cos(t) * orbit.radius;
    const z = Math.sin(t) * orbit.radius;
    mesh.current.position.set(
      x,
      orbit.height + Math.sin(t * 1.7 + orbit.phase) * 0.25,
      z
    );
    mesh.current.rotation.x = t * 1.4 + orbit.tilt;
    mesh.current.rotation.y = t * 0.9;
  });

  const shade = useMemo(() => {
    const tones = ["#4a3020", "#5a3f29", "#6b4423", "#3c2a1c"];
    return tones[seed % tones.length];
  }, [seed]);

  return (
    <group ref={mesh} scale={orbit.scale}>
      <mesh scale={[1, 0.62, 0.78]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color={shade} roughness={0.55} />
      </mesh>
      {/* sillon du grain */}
      <mesh scale={[1.02, 0.60, 0.045]} position={[0, 0.28, 0]}>
        <torusGeometry args={[0.72, 0.16, 8, 24]} />
        <meshStandardMaterial color="#2a1c11" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────
   Caméra — parallaxe souris
──────────────────────────────────────────────────────── */

function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state;
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.03;
    camera.position.y += (1.1 + pointer.y * 0.5 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.35, 0);
  });
  return null;
}

/* ─────────────────────────────────────────────────────
   Scène complète
──────────────────────────────────────────────────────── */

export default function CoffeeScene() {
  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );
  const beanCount = isMobile ? 6 : 10;

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 1.1, 7.6], fov: isMobile ? 44 : 38 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} color="#f6e9db" />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color="#ffe9c9" />
      <pointLight position={[-5, 2, -3]} intensity={24} color="#d9a868" />
      <pointLight position={[3, -2, 4]} intensity={10} color="#b4813f" />

      <LiquidBackground isMobile={isMobile} />
      <group position={isMobile ? [0, 1.85, 0] : [1.9, 0.15, 0]} scale={isMobile ? 0.62 : 1}>
        <CoffeeCup />
        <Steam isMobile={isMobile} />
      </group>
      {Array.from({ length: beanCount }, (_, i) => (
        <Bean key={i} seed={i + 1} />
      ))}
      <CameraRig />
    </Canvas>
  );
}
