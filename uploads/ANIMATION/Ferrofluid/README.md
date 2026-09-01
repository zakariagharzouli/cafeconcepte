# Ferrofluid Animation (React Bits)

Effet visuel hypnotique de fluide magnétique / Ferrofluide WebGL interactif (OGL).

## 1. Dépendance requise
```bash
npm install ogl
# ou
yarn add ogl
# ou
pnpm add ogl
```

## 2. Structure des fichiers
- `Ferrofluid.jsx` : Composant React WebGL
- `Ferrofluid.css` : Styles CSS

## 3. Exemple d'utilisation
```jsx
import Ferrofluid from './Ferrofluid';

export default function HeroBackground() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', background: '#000' }}>
      <Ferrofluid
        colors={["#ffffff", "#F5A623", "#E056FD"]}
        speed={0.5}
        scale={1.6}
        turbulence={1}
        fluidity={0.1}
        rimWidth={0.2}
        sharpness={2.5}
        shimmer={1.5}
        glow={2}
        flowDirection="down"
        opacity={1}
        mouseInteraction={true}
        mouseStrength={1}
        mouseRadius={0.35}
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `colors` | Array | `['#ffffff', ...]` | Palette de couleurs de la lueur du fluide |
| `speed` | number | `0.5` | Vitesse d'écoulement du fluide |
| `scale` | number | `1.6` | Échelle du motif de turbulence |
| `turbulence` | number | `1` | Degré de chaos / perturbation |
| `fluidity` | number | `0.1` | Viscosité / fusion organique |
| `rimWidth` | number | `0.2` | Épaisseur des reflets de surface |
| `sharpness` | number | `2.5` | Netteté des crêtes magnétiques |
| `shimmer` | number | `1.5` | Effet de scintillement iridescent |
| `glow` | number | `2` | Puissance de lueur lumineuse |
| `flowDirection`| string | `'down'` | Direction : `'up'`, `'down'`, `'left'`, `'right'` |
| `mouseInteraction`| boolean | `true` | Réaction magnétique au passage de la souris |
