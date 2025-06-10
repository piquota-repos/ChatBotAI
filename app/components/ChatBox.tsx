'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChartRenderer from './ChartRenderer';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
  chartType?: string;
  data?: { labels: string[]; values: number[] };
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage: ChatMessage = { role: 'user', content: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput(''); // Clear input immediately

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });

    if (!res.ok) throw new Error('API error');

    const data = await res.json();

    const botMessage: ChatMessage = {
      role: 'bot',
      content: data.summary,
      chartType: data.chartType,
      data: data.data,
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error('Message send error:', error);
    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: '' },
    ]);
  }
};


  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 text-xl font-semibold text-gray-800 sticky top-0 z-10">
        💬 AI Chat Assistant
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-fade-in">
            <MessageBubble role={msg.role} content={msg.content} />
            {msg.chartType && msg.data && (
              <div className="mt-2">
                <ChartRenderer type={msg.chartType} data={msg.data} />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <div className="bg-white p-4 shadow-inner flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl font-medium shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}
