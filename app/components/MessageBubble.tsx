// components/MessageBubble.tsx
export default function MessageBubble({ role, content }: { role: 'user' | 'bot'; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl shadow text-sm whitespace-pre-wrap leading-relaxed ${isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gradient-to-r from-slate-200 to-slate-100 text-gray-900 rounded-bl-none'
          }`}
      >
        {content}
      </div>
    </div>
  );
}
