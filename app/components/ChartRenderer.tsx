'use client';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart,
  Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import html2canvas from 'html2canvas';
import { useRef, useEffect  } from 'react';
import { TableRow } from '../models/models';
import { Download } from "lucide-react";

export interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'histogram' | 'donut' | 'bubble';
  data: {
    labels: string[];
    values: Record<string, (number | null)[]>;
    table?: TableRow[];
  };
}


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    const dataPoint = payload[0].payload;
    const originalDataKeys = Object.keys(dataPoint).filter(
      key => !['fill', 'cx', 'cy', 'innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'midAngle', 'name', 'stroke', 'payload'].includes(key)
    );

    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p><strong>{label}</strong></p>
        {originalDataKeys.map((key) => (
          <p key={key}>
            <span className="font-medium">{key}:</span> {String(dataPoint[key])}
          </p>
        ))}
      </div>
    );
  }
  return null;
}


export default function ChartRenderer({ type, data }: ChartRendererProps) {
 
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  const numericKeys = Object.keys(data.values).filter(
    k => data.values[k].some(v => typeof v === 'number' && v !== null)
  );

  const chartData = data.labels.map((label, i) => {
    const point: any = { name: label };
    numericKeys.forEach(k => {
      point[k] = data.values[k][i];
    });
    if (data.table?.[i]) {
      Object.entries(data.table[i]).forEach(([key, val]) => {
        if (!(key in point)) point[key] = val;
      });
    }
    return point;
  });

  const downloadChart = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `chart-${type}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const renderChart = () => {
    if (type === 'histogram') {
      const values: number[] = data.values[numericKeys[0]].filter(v => typeof v === 'number') as number[];
      const bucketSize = 10;
      const frequencyMap: Record<string, number> = {};
      for (const val of values) {
        const bucketStart = Math.floor(val / bucketSize) * bucketSize;
        const bucketLabel = `${bucketStart} - ${bucketStart + bucketSize}`;
        frequencyMap[bucketLabel] = (frequencyMap[bucketLabel] || 0) + 1;
      }
      const histogramData = Object.entries(frequencyMap).map(([range, frequency]) => ({ range, frequency }));

      return (
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="range"
            label={{
              value: `${numericKeys[0]} Range`, // show "Performance Range" or whatever the field is
              position: 'insideBottom',
              offset: -5
            }}
          />

          <YAxis
            allowDecimals={false}
            label={{
              value: 'Frequency',
              angle: -90,
              position: 'insideLeft'
            }}
          />

          <Tooltip content={({ active, payload }) => {
            if (active && payload?.length) {
              const dataPoint = payload[0].payload;
              return (
                <div className="bg-white p-2 border rounded shadow text-sm">
                  <p><strong>Range:</strong> {dataPoint.range}</p>
                  <p><strong>Frequency:</strong> {dataPoint.frequency}</p>
                </div>
              );
            }
            return null;
          }} />

          <Bar dataKey="frequency" fill="#8884d8" />
        </BarChart>

      );
    }


    if (type === 'bar') {
      return (
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {numericKeys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {numericKeys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i % COLORS.length]} />
          ))}
        </LineChart>
      );
    }

    if (type === 'pie' || type === 'donut') {
      return (
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Pie
            data={chartData}
            dataKey={numericKeys[0]}
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={type === 'donut' ? 40 : 0}
            label={(entry: any) => `${entry.name}: ${entry[numericKeys[0]]}`}
          >
            {chartData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }

    if (type === 'bubble' && numericKeys.length >= 3) {
      return (
        <ScatterChart>
          <XAxis dataKey={numericKeys[0]} name={numericKeys[0]} />
          <YAxis dataKey={numericKeys[1]} name={numericKeys[1]} />
          <ZAxis dataKey={numericKeys[2]} range={[100, 1000]} name={numericKeys[2]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Legend />
          <Scatter name="Bubbles" data={chartData} fill="#8884d8" />
        </ScatterChart>
      );
    }

    return <p className="text-sm text-gray-500">Chart type not supported.</p>;
  };

  return (
    <div className="mb-12">
      <div ref={chartRef} className="bg-white rounded p-2 shadow">
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
<div className="flex justify-end mt-2">
  <button
    onClick={downloadChart}
    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition-all duration-200"
  >
    ⬇ Download Chart
  </button>
</div>

    </div>
  );
}
