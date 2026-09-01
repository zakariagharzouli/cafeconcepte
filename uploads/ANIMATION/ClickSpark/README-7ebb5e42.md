# ClickSpark Animation (React Bits)

Effet d'étincelles / éclats lumineux animés lors d'un clic de souris (Canvas 2D).

## 1. Dépendances requises
Aucune dépendance externe (Pur React & Canvas 2D natif).

## 2. Structure des fichiers
- `ClickSpark.jsx` : Composant React autonome

## 3. Exemple d'utilisation
```jsx
import ClickSpark from './ClickSpark';

export default function App() {
  return (
    <ClickSpark
      sparkColor="#F5A623"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={400}
    >
      <button style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
        Commander au Café Concept
      </button>
    </ClickSpark>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `sparkColor` | string | `'#fff'` | Couleur des étincelles |
| `sparkSize` | number | `10` | Longueur des étincelles en pixels |
| `sparkRadius`| number | `15` | Rayon de projection des étincelles |
| `sparkCount` | number | `8` | Nombre d'étincelles générées au clic |
| `duration` | number | `400` | Durée de l'effet en millisecondes |
| `easing` | string | `'ease-out'` | Type de transition : `'linear'`, `'ease-in'`, `'ease-out'`, `'ease-in-out'` |
| `extraScale` | number | `1.0` | Multiplicateur de distance |
| `children` | ReactNode| `undefined` | Éléments enfants enveloppés |
