# CircularText Animation (React Bits)

Composant de texte circulaire animé en rotation avec interactions au survol (hover).

## 1. Dépendance requise
Ce composant utilise **Motion** (anciennement Framer Motion) :
```bash
npm install motion
# ou si votre projet utilise framer-motion :
npm install framer-motion
```

> **Note :** Si votre projet utilise `framer-motion`, changez la 2ème ligne de `CircularText.jsx` en :  
> `import { motion, useAnimation, useMotionValue } from 'framer-motion';`

## 2. Structure des fichiers
- `CircularText.jsx` : Composant React
- `CircularText.css` : Styles CSS

## 3. Exemple d'utilisation
```jsx
import CircularText from './CircularText';

export default function BadgeSection() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', background: '#1a1a1a' }}>
      <CircularText
        text=".CAFE.CONCEPTE."
        onHover="speedUp"
        spinDuration={7}
        className="cafe-badge"
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `text` | string | `'.CAFE.CONCEPT.'` | Le texte affiché en cercle |
| `spinDuration` | number | `20` | Durée d'une rotation complète (en secondes) |
| `onHover` | string | `'speedUp'` | Effet au survol : `'speedUp'`, `'slowDown'`, `'pause'`, `'goBonkers'` ou `null` |
| `className` | string | `''` | Classes CSS personnalisées |
