# RippleDistortion Animation (React Bits)

Effet de distorsion d'eau / ondulation (Ripple Distortion) avec shaders WebGL (OGL).

## 1. Dépendance requise
Pour utiliser ce composant, il faut installer `ogl` :
```bash
npm install ogl
# ou
yarn add ogl
# ou
pnpm add ogl
```

## 2. Structure des fichiers
- `RippleDistortion.jsx` : Composant React principal
- `RippleDistortion.css` : Styles CSS associés

## 3. Exemple d'utilisation
```jsx
import RippleDistortion from './RippleDistortion';

export default function HeroSection() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <RippleDistortion
        src="/images/hero.jpg"
        brushSize={150}
        strength={0.2}
        swirl={1}
        rings={4}
        grayscale={false}
        spread={5}
        fade={3}
        spacing={15}
        dispersion={0}
        glint={0}
        tint="#a855f7"
        tintAmount={0.1}
        highlightColor="#ffffff"
        trigger="hover" // ou "click"
        clickStrength={2}
        quality="high" // "low" | "medium" | "high"
        enabled={true}
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `src` | string | URL Unsplash | Image de fond à déformer |
| `brushSize` | number | 150 | Taille du pinceau de déformation |
| `strength` | number | 0.2 | Intensité de l'effet de distorsion |
| `swirl` | number | 1 | Effet de tourbillonnement |
| `rings` | number | 4 | Nombre d'anneaux d'onde |
| `spread` | number | 5 | Rayon de propagation de l'onde |
| `fade` | number | 3 | Vitesse de disparition de l'onde |
| `trigger` | string | 'hover' | Déclencheur ('hover' ou 'click') |
| `grayscale`| boolean | true | Appliquer un filtre noir & blanc |
| `quality` | string | 'low' | Résolution de texture ('low', 'medium', 'high') |
