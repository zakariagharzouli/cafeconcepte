# GooeyNav Animation (React Bits)

Barre de navigation interactive avec effet "Gooey" / bulles liquides et particules éclatantes lors du changement d'onglet actif.

## 1. Dépendances requises
Aucune dépendance externe (100% React & CSS standard).

## 2. Structure des fichiers
- `GooeyNav.jsx` : Composant React
- `GooeyNav.css` : Styles CSS + Filtres SVG / Blend mode

## 3. Exemple d'utilisation
```jsx
import GooeyNav from './GooeyNav';

const navItems = [
  { label: "Accueil", href: "#" },
  { label: "La Carte", href: "#carte" },
  { label: "Traiteur", href: "#traiteur" },
  { label: "Contact", href: "#contact" }
];

export default function Header() {
  return (
    <header style={{ background: '#0a0a0a', padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <GooeyNav
        items={navItems}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </header>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `items` | Array | Tableau | Liste des onglets `{ label: string, href: string }` |
| `initialActiveIndex` | number | `0` | Index de l'onglet actif au chargement |
| `animationTime` | number | `600` | Durée de base de l'animation en ms |
| `particleCount` | number | `15` | Nombre de particules liquides générées |
| `particleDistances` | Array | `[90, 10]` | Distances min/max des particules |
| `particleR` | number | `100` | Rayon de dispersion |
| `colors` | Array | `[1, 2, 3, 1, 2, 3, 1, 4]` | Index des variables de couleur CSS `--color-X` |
