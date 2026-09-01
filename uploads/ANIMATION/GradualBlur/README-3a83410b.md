# GradualBlur Animation (React Bits)

Effet de flou progressif ultra-élégant (Apple-style / iOS Glassmorphism) par superposition de masques dégradés (`backdrop-filter`).

## 1. Dépendances requises
Aucune dépendance externe (100% React & CSS standard).

## 2. Structure des fichiers
- `GradualBlur.jsx` : Composant React
- `GradualBlur.css` : Styles CSS associés

## 3. Exemple d'utilisation

### Dégradé de flou en bas d'une section à défilement
```jsx
import GradualBlur from './GradualBlur';

export default function ScrollableMenu() {
  return (
    <section style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '2rem 1rem' }}>
        {/* Contenu scrollable (cartes plats, boissons, avis...) */}
      </div>

      <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </section>
  );
}
```

### Utilisation avec un Preset (ex: Header ou Footer)
```jsx
<GradualBlur preset="header" />
<GradualBlur preset="footer" />
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `position` | string | `'bottom'` | Position du flou : `'top'`, `'bottom'`, `'left'`, `'right'` |
| `height` | string | `'6rem'` | Hauteur de la zone de flou |
| `strength` | number | `2` | Intensité générale du flou |
| `divCount` | number | `5` | Nombre de couches de dégradé (plus élevé = plus lisse) |
| `exponential`| boolean | `false` | Courbe d'intensité exponentielle |
| `curve` | string | `'linear'` | Courbe d'interpolation : `'linear'`, `'bezier'`, `'ease-in'`, `'ease-out'` |
| `preset` | string | `undefined` | Presets prêts à l'emploi : `'header'`, `'footer'`, `'smooth'`, `'intense'`, etc. |
| `target` | string | `'parent'` | Cible du flou : `'parent'` (position absolute) ou `'page'` (fixed) |
