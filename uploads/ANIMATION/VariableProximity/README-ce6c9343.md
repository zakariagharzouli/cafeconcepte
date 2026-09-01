# VariableProximity Animation (React Bits)

Effet typographique où les lettres changent d'épaisseur et d'axe variable de façon fluide à l'approche du curseur de la souris (Proximity effect).

## 1. Dépendances requises
```bash
npm install motion
# ou si votre projet utilise framer-motion :
npm install framer-motion
```

## 2. Structure des fichiers
- `VariableProximity.jsx` : Composant React
- `VariableProximity.css` : Styles CSS + Import Google Font 'Roboto Flex'

## 3. Exemple d'utilisation
```jsx
import { useRef } from 'react';
import VariableProximity from './VariableProximity';

export default function ProximityBanner() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '60px 20px',
        textAlign: 'center',
        background: '#0f0f0f',
        color: '#fff',
        fontSize: '2.5rem',
        cursor: 'default'
      }}
    >
      <VariableProximity
        label="CAFÉ CONCEPT — L'art culinaire & convivial"
        className="cafe-proximity-text"
        fromFontVariationSettings="'wght' 300, 'opsz' 9"
        toFontVariationSettings="'wght' 1000, 'opsz' 40"
        containerRef={containerRef}
        radius={120}
        falloff="linear"
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `label` | string | **requis** | Texte complet à afficher |
| `containerRef` | React.Ref | **requis** | Ref du conteneur parent pour détecter la position relative du curseur |
| `fromFontVariationSettings` | string | **requis** | Valeurs initiales des axes de police (ex: `"'wght' 400, 'opsz' 9"`) |
| `toFontVariationSettings` | string | **requis** | Valeurs cibles au plus près du curseur (ex: `"'wght' 1000, 'opsz' 40"`) |
| `radius` | number | `50` | Rayon d'influence du curseur en pixels |
| `falloff` | string | `'linear'` | Décroissance de l'effet (`'linear'`, `'exponential'`, `'gaussian'`) |
| `className` | string | `''` | Classes CSS personnalisées |
