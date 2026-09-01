# 🎨 Collection d'Animations & Composants UI

Ce dossier contient des composants React interactifs prêts à l'emploi.

## 📦 Liste des composants disponibles

| Composant | Type / Effet | Dépendances nécessaires |
|-----------|--------------|-------------------------|
| **`CoffeeLoader`** | Loader machine à café expresso animée avec vapeur | *Aucune (Pur CSS/React)* |
| **`ChatMessages`** | Mockup iPhone avec conversation de chat animée | *Tailwind CSS* |
| **`CircularText`** | Texte circulaire animé en rotation avec interaction au survol | `motion` (ou `framer-motion`) |
| **`ClickSpark`** | Étincelles lumineuses interactives au clic (Canvas 2D) | *Aucune (Pur React)* |
| **`ElasticMesh`** | Maillage élastique 3D déformable au curseur | `ogl` |
| **`Ferrofluid`** | Fluide magnétique organique WebGL interactif | `ogl` |
| **`GooeyNav`** | Barre de navigation avec effet liquide gooey et bulles de particules | *Aucune (Pur CSS/React)* |
| **`GradualBlur`** | Flou progressif fluide style iOS / Apple Glassmorphism | *Aucune (Pur CSS/React)* |
| **`RippleDistortion`** | Effet de distorsion d'onde fluide / liquide sur image | `ogl` |
| **`ScrollFloat`** | Texte apparaissant lettre par lettre au scroll | `gsap` |
| **`TextPressure`** | Déformation dynamique de police variable sous le curseur | *Aucune (Google Fonts)* |
| **`VariableProximity`** | Variation de graisse / taille de texte à l'approche de la souris | `motion` (ou `framer-motion`) |

---

## 🚀 Guide d'installation rapide des dépendances

Pour installer l'ensemble des bibliothèques nécessaires dans votre projet React / Next.js / Vite :

```bash
npm install ogl gsap motion
# ou si vous préférez framer-motion :
npm install ogl gsap framer-motion
```

Chaque sous-dossier contient un `README.md` avec des exemples de code et la liste de toutes les props.
