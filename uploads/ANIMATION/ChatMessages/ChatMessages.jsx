"use client";

import { useState } from "react";
import Chat from "./utils/chat";
import IphoneFrame from "./utils/iphone-frame";

export default function ChatMessagesReverse() {
  const users = [
    {
      name: "Client",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Café Concept",
      avatar: "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=150&auto=format&fit=crop&q=80",
    },
  ];

  const [messages] = useState([
    {
      id: "n1",
      name: "Client",
      message: "Bonjour, est-il possible de réserver pour un buffet traiteur ce samedi ?",
    },
    {
      id: "n2",
      name: "Café Concept",
      message: "Bonjour ! Tout à fait, nous préparons nos formules sur mesure avec des produits frais.",
    },
    {
      id: "n3",
      name: "Client",
      message: "Super ! Et vous proposez aussi vos fameux smash burgers maison ?",
    },
    {
      id: "n4",
      name: "Café Concept",
      message: "Oui absolument ! Double steak, cheddar affiné et sauce secrète maison 👌",
    },
  ]);

  return (
    <main className="relative flex flex-col items-center justify-center p-4">
      {/* Clipping Phone Wrapper */}
      <div className="mx-auto overflow-hidden w-[300px] h-[360px] sm:w-[350px] sm:h-[420px]">
        <IphoneFrame>
          <Chat
            messages={messages}
            currentUser="Client"
            users={users}
          />
        </IphoneFrame>
      </div>

      {/* Fade overlay gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 h-24 sm:h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </main>
  );
}
