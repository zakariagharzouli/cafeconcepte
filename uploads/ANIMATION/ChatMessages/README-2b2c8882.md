# ChatMessages (Iphone Mockup Chat Animation)

Composant d'affichage de messagerie instantanée dans un mockup d'iPhone avec effet de dégradé transparent.

## 1. Dépendances requises
Ce composant utilise les classes utilitaires **Tailwind CSS** (ou CSS équivalent). Aucune dépendance JS lourde supplémentaire.

## 2. Structure des fichiers
- `ChatMessages.jsx` : Composant conteneur principal
- `utils/iphone-frame.jsx` : Cadre réaliste d'iPhone avec Dynamic Island
- `utils/chat.jsx` : Conteneur des messages et gestion des avatars
- `utils/chat-message.jsx` : Bulle de message (style utilisateur vs interlocuteur)

## 3. Exemple d'utilisation
```jsx
import ChatMessages from './ChatMessages';

export default function HeroDemo() {
  return (
    <div className="flex min-h-[480px] w-full items-center justify-center bg-zinc-950">
      <ChatMessages />
    </div>
  );
}
```

## 4. Personnalisation des données
Dans `ChatMessages.jsx`, vous pouvez facilement personnaliser la liste des utilisateurs et des messages :
```javascript
const users = [
  { name: "Client", avatar: "https://..." },
  { name: "Support", avatar: "https://..." }
];

const messages = [
  { id: "1", name: "Client", message: "Bonjour !" },
  { id: "2", name: "Support", message: "Comment puis-je vous aider ?" }
];
```
