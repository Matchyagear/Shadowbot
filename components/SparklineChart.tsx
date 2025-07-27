import React from 'react';

interface SparklineChartProps {
  data: number[];
  priceChange: number;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, priceChange }) => {
  if (!data || data.length < 2) {
    return <div className="h-12 w-full bg-gray-900/50 rounded flex items-center justify-center text-xs text-gray-500">Chart data not available</div>;
  }

  const width = 120;
  const height = 48;
  const strokeColor = priceChange >= 0 ? '#34D399' : '#F87171'; // Tailwind's green-400 and red-400

  const yMin = Math.min(...data);
  const yMax = Math.max(...data);
  let yRange = yMax - yMin;
  if (yRange === 0) yRange = 1;
  
  const xStep = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * xStep;
    const y = height - ((d - yMin) / yRange * (height - 2)) + 1; // Add padding from top/bottom
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default SparklineChart;