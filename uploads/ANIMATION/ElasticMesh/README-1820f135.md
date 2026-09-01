# ElasticMesh Animation (React Bits)

Effet de maillage élastique 3D / grille interactive avec simulation physique WebGL (OGL).

## 1. Dépendance requise
```bash
npm install ogl
# ou
yarn add ogl
# ou
pnpm add ogl
```

## 2. Structure des fichiers
- `ElasticMesh.jsx` : Composant React principal
- `ElasticMesh.css` : Styles CSS associés

## 3. Exemple d'utilisation

### Exemple Dégradé de couleur
```jsx
import ElasticMesh from './ElasticMesh';

export default function App() {
  return (
    <div style={{ width: '480px', height: '320px' }}>
      <ElasticMesh color1="#4F46E5" color2="#0EA5E9" />
    </div>
  );
}
```

### Exemple avec Image & Interaction
```jsx
import ElasticMesh from './ElasticMesh';

export default function HeroCard() {
  return (
    <div style={{ width: '480px', height: '320px' }}>
      <ElasticMesh
        image="https://picsum.photos/seed/elastic/900/600"
        interaction="hover" // ou "drag"
        tilt={14}
        shading={0.5}
        color1="#5227FF"
        color2="#B19EEF"
        showGrid={true}
        gridDensity={20}
        gridOpacity={0.28}
        gridColor="#ffffff"
        highlight="#ffffff"
        borderRadius={25}
        stiffness={0.05}
        damping={0.2}
        grabRadius={0.6}
        pull={0.4}
        wobble={5}
        resolution={25}
        enabled={true}
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `image` | string | `''` | URL de l'image de texture |
| `color1` | string | `'#5227FF'` | Couleur de dégradé supérieure |
| `color2` | string | `'#B19EEF'` | Couleur de dégradé inférieure |
| `interaction` | string | `'hover'` | Mode d'interaction (`'hover'` ou `'drag'`) |
| `tilt` | number | 14 | Inclinaison 3D en degrés |
| `showGrid` | boolean | true | Afficher la grille filaire |
| `gridDensity` | number | 20 | Densité des lignes de la grille |
| `stiffness` | number | 0.05 | Rigidité du ressort élastique |
| `damping` | number | 0.2 | Amortissement des mouvements |
| `pull` | number | 0.4 | Force de déformation du curseur |
| `wobble` | number | 5 | Ondulation élastique résiduelle |
| `resolution` | number | 25 | Nombre de points de calcul (grille NxN) |
