import React from 'react';

export default function ChatMessage({ message, isCurrentUser, avatar }) {
  return (
    <div
      className={`flex items-end gap-2 my-2.5 transition-all duration-300 ${
        isCurrentUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
      }`}
    >
      {/* Avatar */}
      {avatar && (
        <img
          src={avatar}
          alt={message.name}
          className="w-7 h-7 rounded-full object-cover border border-gray-700/60 shadow-sm shrink-0"
        />
      )}

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed shadow-md ${
          isCurrentUser
            ? 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white rounded-br-xs'
            : 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/50 rounded-bl-xs'
        }`}
      >
        <p className="font-medium break-words">{message.message}</p>
      </div>
    </div>
  );
}
