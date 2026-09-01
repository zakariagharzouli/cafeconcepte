# TextPressure Animation (React Bits)

Effet typographique interactif de déformation dynamique (Variable Fonts) réagissant à la position de la souris / du toucher.

## 1. Dépendances requises
Aucune dépendance externe (pur React). La police variable (Google Font 'Roboto Flex') est automatiquement importée via URL.

## 2. Structure des fichiers
- `TextPressure.jsx` : Composant React complet

## 3. Exemple d'utilisation
```jsx
import TextPressure from './TextPressure';

export default function TitleBanner() {
  return (
    <div style={{ position: 'relative', height: '250px', background: '#111', overflow: 'hidden' }}>
      <TextPressure
        text="CAFE CONCEPT"
        flex={true}
        alpha={false}
        stroke={false}
        width={true}
        weight={true}
        italic={true}
        textColor="#ffffff"
        strokeColor="#5227FF"
        minFontSize={36}
      />
    </div>
  );
}
```

## 4. Propriétés (Props)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `text` | string | `'Compressa'` | Texte à afficher |
| `textColor` | string | `'#FFFFFF'` | Couleur principale du texte |
| `strokeColor` | string | `'#FF0000'` | Couleur du contour si `stroke` est activé |
| `width` | boolean | true | Animer la largeur des lettres (axe `wdth`) |
| `weight` | boolean | true | Animer la graisse des lettres (axe `wght`) |
| `italic` | boolean | true | Animer l'italique selon la proximité |
| `alpha` | boolean | false | Animer l'opacité selon la proximité |
| `flex` | boolean | true | Répartir équitablement les lettres sur la largeur |
| `stroke` | boolean | false | Afficher un effet d'épaisseur/contour |
| `minFontSize` | number | 24 | Taille minimale de police en pixels |
| `fontFamily` | string | `'Roboto Flex'` | Nom de la police variable |
| `fontUrl` | string | Google Fonts URL | URL de chargement de la police |
