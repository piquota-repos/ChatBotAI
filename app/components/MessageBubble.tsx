// components/MessageBubble.tsx
import React from 'react';

export default React.memo(function MessageBubble({ role, content }: { role: 'user' | 'bot'; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-10 mt-12`}>
      <div
        className={`max-w-[85%] min-w-[60px] break-words px-4 py-3 rounded-2xl shadow text-sm whitespace-pre-wrap leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gradient-to-r from-slate-200 to-slate-100 text-gray-900 rounded-bl-none'
          }`}
        style={{ lineHeight: '1.6' }}
      >
        {content.split('\n').map((line, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
        ))}
      </div>
    </div>
  );
});