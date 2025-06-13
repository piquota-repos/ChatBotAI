import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'histogram';
  data: {
    labels: string[];
    values: Record<string, number[]>;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

const ChartRenderer = ({ type, data }: ChartRendererProps) => {
  const keys = Object.keys(data.values);
  const chartData = data.labels.map((label, i) => {
    const point: any = { name: label };
    keys.forEach((k) => (point[k] = data.values[k][i]));
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'bar' ? (
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      ) : type === 'line' ? (
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} />
          ))}
        </LineChart>
      ) : (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={chartData}
            dataKey={keys[0]}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </ResponsiveContainer>
  );
};

export default ChartRenderer;
