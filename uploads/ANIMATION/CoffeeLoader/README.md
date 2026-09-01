# Coffee Machine Loader (Animation Café Concept)

Superbe animation de machine à expresso qui coule du café chaud avec fumée animée en pure CSS / React.

## 1. Deux versions incluses au choix :
- **Version recommandée (0 dépendance)** : `CoffeeLoader.jsx` + `CoffeeLoader.css`
- **Version styled-components** : `CoffeeLoaderStyled.jsx` (nécessite `npm i styled-components`)

---

## 2. Exemple d'utilisation (Version Pure CSS recommandée)
```jsx
import CoffeeLoader from './CoffeeLoader';

export default function PageLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <CoffeeLoader />
      <p style={{ marginTop: '20px', color: '#c9966b', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Préparation de votre commande en cours...
      </p>
    </div>
  );
}
```

## 3. Idées d'intégration pour Café Concept
- Écran de chargement initial (Splash Screen).
- Loader lors de la validation d'une commande de smash burger ou demande de devis traiteur.
- Animation d'attente pour le formulaire de contact ou réservation.
