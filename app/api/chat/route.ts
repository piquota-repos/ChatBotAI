import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const lowerPrompt = prompt.toLowerCase();

  // Determine chart type from prompt
  let chartType: 'bar' | 'line' | 'pie' = 'bar'; // default

  if (lowerPrompt.includes('line chart') || lowerPrompt.includes('line')) {
    chartType = 'line';
  } else if (lowerPrompt.includes('pie chart') || lowerPrompt.includes('pie')) {
    chartType = 'pie';
  } else if (lowerPrompt.includes('bar chart') || lowerPrompt.includes('bar')) {
    chartType = 'bar';
  }

  // Sample data
  const data = {
    labels: ['Jan', 'Feb', 'Mar'],
    values: [50000, 70000, 120000],
  };

  const summary = `Here is your ${chartType} chart for Q1 sales.`;

  return NextResponse.json({
    summary,
    chartType,
    data,
  });
}
