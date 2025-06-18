// components/ChatBox.tsx
'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChartRendererProps } from './ChartRenderer';
import ChartRenderer from './ChartRenderer';
import { ChatMessage, ApiResponse, TableRow } from '../models/models';
import React from 'react';

// Memoized chart components
const MemoizedChartRenderer = React.memo(ChartRenderer);

const MemoizedChartWithTypeSwitcher = React.memo(
  function ChartWithTypeSwitcher({ chartType, data }: { 
    chartType: ChartRendererProps['type'], 
    data: ChartRendererProps['data'] 
  }) {
    const [selectedType, setSelectedType] = useState(chartType);

    return (
      <div className="mt-4 w-full bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ChartRendererProps['type'])}
            className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="donut">Donut</option>
            <option value="bubble">Bubble</option>
          </select>
        </div>
        <div className="w-full h-[300px]">
          <MemoizedChartRenderer type={selectedType} data={data} />
        </div>
      </div>
    );
  }
);

// Memoized message item component
const MessageItem = React.memo(
  ({ message }: { message: ChatMessage }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 last:mb-0"
      >
        <MessageBubble role={message.role} content={message.content} />
        {message.chartType && message.data && (
          <div className="mt-3 w-full max-w-3xl mx-auto">
            <MemoizedChartWithTypeSwitcher 
              chartType={message.chartType} 
              data={message.data} 
            />
          </div>
        )}
      </motion.div>
    );
  }
);

const detectChartType = (prompt: string): 'bar' | 'line' | 'pie' | 'donut' | 'histogram' | 'bubble' => {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('pie')) return 'pie';
  if (lowerPrompt.includes('line')) return 'line';
  if (lowerPrompt.includes('bar')) return 'bar';
  if (lowerPrompt.includes('donut')) return 'donut';
  if (lowerPrompt.includes('histogram')) return 'histogram';
  if (lowerPrompt.includes('bubble')) return 'bubble';
  return 'bar';
};

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Memoize rendered messages
  const renderedMessages = useMemo(() => (
    messages.map((msg, idx) => (
      <MessageItem key={`msg-${idx}-${msg.content.substring(0, 10)}`} message={msg} />
    ))
  ), [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: input }),
      });

      if (!res.ok) throw new Error('API error');
      
      const data: ApiResponse = await res.json();
      const result = data?.result;
      const explanation = result?.explanation ?? 'No explanation available.';
      const chartType = detectChartType(input);


      const csvRes = await fetch('http://localhost:8000/chart-data');
      const csvData = await csvRes.json();
            const xAxisKey = result.metadata.x_axis[0];
      const yAxisKeys = result.metadata.y_axis;
      const table = result.table;

      const labels = csvData.map((row: TableRow) => String(row[xAxisKey]));
      const values: Record<string, (number | null)[]> = {};
      
      yAxisKeys.forEach((key) => {
        values[key] = csvData.map((row: TableRow) => {
          const val = row[key];
          return typeof val === 'number' ? val : null;
        });
      });

      const chartData = { labels, values, table };

      setTimeout(() => {
        const botMessage: ChatMessage = {
          role: 'bot',
          content: explanation,
          chartType,
          data: chartData,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1200);

    } catch (error) {
      console.error('Message send error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'An error occurred while processing your request.' },
      ]);
      setIsTyping(false);
    }
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-100 to-white">
      <header className="bg-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          CMI AI Assistant
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
        <div className="max-w-8xl mx-auto space-y-4">
          {renderedMessages}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-200 text-sm text-gray-600 px-4 py-2 rounded-xl animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white p-4 shadow-inner sticky bottom-0 z-10">
        <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
          <input
            type="text"
            className="flex-1 outline-none text-sm"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage} 
            className="text-blue-600 hover:text-blue-800"
          >
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}