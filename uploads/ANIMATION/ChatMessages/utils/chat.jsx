import React from 'react';
import ChatMessage from './chat-message';

export default function Chat({ messages = [], currentUser = 'User1', users = [] }) {
  const getUserAvatar = (name) => {
    const user = users.find((u) => u.name === name);
    return user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-end overflow-y-auto px-1 py-2 space-y-1 scrollbar-none">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isCurrentUser={msg.name === currentUser}
          avatar={getUserAvatar(msg.name)}
        />
      ))}
    </div>
  );
}
