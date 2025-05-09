import React, { useEffect, useState } from "react";
import { getLogs, onNewLog } from "../DataStore";
import { FaSpinner } from "react-icons/fa";  // Using a spinner icon for loading

export default function LatestSensorData() {
  const [latestData, setLatestData] = useState({
    BMP: { temperature: "-", pressure: "-", altitude: "-" },
    MPU: { accelX: "-", accelY: "-", accelZ: "-" },
    DHT: { temperature: "-", humidity: "-" },
  });
  const [loading, setLoading] = useState(true);

  const updateLatestData = (entry) => {
    setLatestData({
      BMP: entry.BMP280 || latestData.BMP,
      MPU: entry.MPU6050 || latestData.MPU,
      DHT: entry.DHT11 || latestData.DHT,
    });
    setLoading(false);  // Stop loading after data is received
  };

  useEffect(() => {
    const logs = getLogs();
    if (logs.length > 0) {
      updateLatestData(logs[logs.length - 1]);
    }

    onNewLog((entry) => {
      updateLatestData(entry);
    });
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow mt-0 w-full text-sm text-gray-200">
      <h3 className="text-lg font-semibold mb-2 text-white">Latest Sensor Readings</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-white text-3xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
            <h4 className="font-medium text-white">BMP280</h4>
            <p className="text-sm">Temperature: {latestData.BMP.temp} °C</p>
            <p className="text-sm">Pressure: {latestData.BMP.pressure} hPa</p>
            <p className="text-sm">Altitude: {latestData.BMP.altitude} m</p>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
            <h4 className="font-medium text-white">MPU6050</h4>
            <p className="text-sm">Accel X: {latestData.MPU.accX} m/s²</p>
            <p className="text-sm">Accel Y: {latestData.MPU.accY} m/s²</p>
            <p className="text-sm">Accel Z: {latestData.MPU.accZ} m/s²</p>
          </div>

          <div className="p-4 bg-gray-700 rounded-lg shadow-lg">
            <h4 className="font-medium text-white">DHT11</h4>
            <p className="text-sm">Temperature: {latestData.DHT.temp} °C</p>
            <p className="text-sm">Humidity: {latestData.DHT.humidity} %</p>
          </div>
        </div>
      )}
    </div>
  );
}
