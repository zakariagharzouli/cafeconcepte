# ScrollFloat Animation (React Bits)

Effet d'apparition de texte lettre par lettre qui flotte au défilement (Scroll-driven animation) avec GSAP et ScrollTrigger.

## 1. Dépendance requise
```bash
npm install gsap
# ou
yarn add gsap
# ou
pnpm add gsap
```

## 2. Structure des fichiers
- `ScrollFloat.jsx` : Composant React
- `ScrollFloat.css` : Styles CSS

## 3. Exemple d'utilisation
```jsx
import ScrollFloat from './ScrollFloat';

export default function Section() {
  return (
    <div style={{ minHeight: '120vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ScrollFloat
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        textClassName="custom-title"
      >
        CAFÉ CONCEPT
      </ScrollFloat>
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | string | `''` | Texte à animer |
| `animationDuration` | number | `1` | Durée de l'animation |
| `ease` | string | `'back.inOut(2)'` | Type de courbe d'interpolation GSAP |
| `scrollStart` | string | `'center bottom+=50%'` | Point de départ du déclencheur ScrollTrigger |
| `scrollEnd` | string | `'bottom bottom-=40%'` | Point d'arrivée du déclencheur ScrollTrigger |
| `stagger` | number | `0.03` | Décalage temporel entre chaque lettre |
| `containerClassName`| string | `''` | Classe CSS pour le conteneur `h2` |
| `textClassName` | string | `''` | Classe CSS pour le `span` de texte |
| `scrollContainerRef`| ref | `null` | Ref optionnelle d'un conteneur avec overflow scroll si ce n'est pas `window` |
