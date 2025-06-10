// components/ChartRenderer.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function ChartRenderer({ type, data }: { type: string; data: { labels: string[]; values: number[] } }) {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  if (type === 'bar') {
    return (
      <BarChart width={300} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    );
  }

  if (type === 'line') {
    return (
      <LineChart width={300} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    );
  }

  if (type === 'pie') {
    return (
      <PieChart width={300} height={200}>
        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }

  return null;
}
