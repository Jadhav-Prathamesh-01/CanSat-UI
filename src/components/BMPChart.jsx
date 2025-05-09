import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getLogs, onNewLog } from '../DataStore';

const BMPChart = () => {
  const [data, setData] = useState([]);
  const [enabledLines, setEnabledLines] = useState({
    temperature: true,
    pressure: true,
    altitude: true,
  });

  useEffect(() => {
    const initial = getLogs().map(formatData);
    setData(initial);

    onNewLog(log => {
      const formatted = formatData(log);
      setData(prev => [...prev, formatted]);
    });
  }, []);

  const formatData = (log) => ({
    timestamp: new Date(log.timestamp).toLocaleTimeString(),
    temperature: log?.BMP280?.temp ?? 0,
    pressure: log?.BMP280?.pressure ?? 0,
    altitude: log?.BMP280?.altitude ?? 0,
  });

  const toggleLine = (key) => {
    setEnabledLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">BMP280 Live Graph</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <XAxis dataKey="timestamp" tick={{ fill: '#888' }} />
          <YAxis tick={{ fill: '#888' }} />
          <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
          <Legend onClick={(e) => toggleLine(e.dataKey)} wrapperStyle={{ cursor: 'pointer' }} />
          {['temperature', 'pressure', 'altitude'].map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={
                key === 'temperature'
                  ? '#FF6363'
                  : key === 'pressure'
                  ? '#3B82F6'
                  : '#10B981'
              }
              strokeWidth={2}
              dot={false}
              isAnimationActive
              hide={!enabledLines[key]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BMPChart;
