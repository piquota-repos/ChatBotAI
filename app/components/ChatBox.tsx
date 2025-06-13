'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChartRenderer from './ChartRenderer';
//import { mockApiResponse } from '../mock/mockData'; // Adjust path as needed
import mockApiResponse from '../mock/mockApiResponse.json';
import { ChatMessage, ApiResponse, TableRow } from '../models/models';

const detectChartType = (prompt: string): 'bar' | 'line' | 'pie' => {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('pie')) return 'pie';
  if (lowerPrompt.includes('line')) return 'line';
  return 'bar'; // default
};
export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {

      // const res = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: input }),
      // });

      // if (!res.ok) throw new Error('API error');
      const chartType = detectChartType(input);

      //const data: ApiResponse = mockApiResponse;
      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_query: input }),
      });

      if (!res.ok) throw new Error('API error');

      const data: ApiResponse = await res.json();
      const result = data?.result;

      const explanation = result?.explanation ?? 'No explanation available.';
      const metadata = data?.result?.metadata ?? { x_axis: [], y_axis: [] };

      const csvRes = await fetch('http://localhost:8000/chart-data');
      const csvData = await csvRes.json();
      const xAxisKey = result.metadata.x_axis[0]; // "Brand/Retailer"
      const yAxisKeys = result.metadata.y_axis;   // All y-axis values
      const table = result.table;

      // Dynamically build chart data
      const labels = csvData.map((row: TableRow) => String(row[xAxisKey]));

      const values: Record<string, number[]> = {};
      yAxisKeys.forEach((key) => {
        values[key] = csvData.map((row: TableRow) => Number(row[key]));
      });

      const chartData = {
        labels,
        values,
      };
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
    }
  };



  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-100 to-white">
      {/* Header */}
      <header className="bg-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          CMI AI Assistant
        </h1>
      </header>
      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageBubble role={msg.role} content={msg.content} />
            {msg.chartType && msg.data && (
              <div className="mt-2 max-w-[600px] w-full h-[300px] mx-auto">
                <ChartRenderer type={msg.chartType} data={msg.data} />
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-200 text-sm text-gray-600 px-4 py-2 rounded-xl animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>


      {/* Input */}
      <footer className="bg-white p-4 shadow-inner">
        <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm">
          <input
            type="text"
            className="flex-1 outline-none text-sm"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="text-blue-600 hover:text-blue-800">
            <SendHorizonal className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
