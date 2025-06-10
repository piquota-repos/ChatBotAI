// components/MessageBubble.tsx
export default function MessageBubble({ role, content }: { role: 'user' | 'bot'; content: string }) {
  const isUser = role === 'user';
  return (
    <div className={`max-w-md px-4 py-2 rounded-xl ${isUser ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}>
      {content}
    </div>
  );
}
