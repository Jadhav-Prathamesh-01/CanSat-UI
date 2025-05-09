import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getLogs, onNewLog } from '../DataStore';

const MPUChart = () => {
  const [data, setData] = useState([]);
  const [enabledLines, setEnabledLines] = useState({
    xAccel: true,
    yAccel: true,
    zAccel: true,
    xGyro: true,
    yGyro: true,
    zGyro: true,
  });

  useEffect(() => {
    const initial = getLogs().map(formatData);
    setData(initial);

    onNewLog(log => {
      const formatted = formatData(log);
      setData(prev => [...prev, formatted]);
    });
  }, []);

  // ✅ Corrected mapping according to your Firebase data structure
  const formatData = (log) => ({
    timestamp: new Date(log.timestamp).toLocaleTimeString(),
    xAccel: log?.MPU6050?.accX ?? 0,
    yAccel: log?.MPU6050?.accY ?? 0,
    zAccel: log?.MPU6050?.accZ ?? 0,
    xGyro: log?.MPU6050?.gyroX ?? 0,
    yGyro: log?.MPU6050?.gyroY ?? 0,
    zGyro: log?.MPU6050?.gyroZ ?? 0,
  });

  const toggleLine = (key) => {
    setEnabledLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">MPU Sensor Data</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <XAxis dataKey="timestamp" tick={{ fill: '#888' }} />
          <YAxis tick={{ fill: '#888' }} />
          <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
          <Legend onClick={(e) => toggleLine(e.dataKey)} wrapperStyle={{ cursor: 'pointer' }} />
          {['xAccel', 'yAccel', 'zAccel', 'xGyro', 'yGyro', 'zGyro'].map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={
                key === 'xAccel'
                  ? '#FF6363'
                  : key === 'yAccel'
                  ? '#3B82F6'
                  : key === 'zAccel'
                  ? '#10B981'
                  : key === 'xGyro'
                  ? '#FFB832'
                  : key === 'yGyro'
                  ? '#8B5CF6'
                  : '#F59E0B'
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

export default MPUChart;
