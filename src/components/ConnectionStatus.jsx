import { useEffect, useState } from "react";
import { getLogs, onNewLog } from "../DataStore";

export default function ConnectionStatus() {
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check the latest data on mount
    const logs = getLogs();
    if (logs.length > 0) {
      const latest = logs[logs.length - 1];
      setLastTimestamp(latest.timestamp);
    }

    // Listen for new logs
    onNewLog((newLog) => {
      setLastTimestamp(newLog.timestamp);
    });

    // Periodically check if connected
    const interval = setInterval(() => {
      if (lastTimestamp) {
        const age = Date.now() - new Date(lastTimestamp).getTime();
        setIsConnected(age <= 5000); // 5 seconds threshold
      } else {
        setIsConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTimestamp]);

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md w-full flex items-center justify-center">
      <div className="text-sm flex gap-8">
        <div>
          Status:{" "}
          <span
            className={`font-semibold ${
              isConnected ? "text-green-400" : "text-red-500"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div>
          Last Update:{" "}
          <span className="text-gray-300">
            {lastTimestamp
              ? new Date(lastTimestamp).toLocaleTimeString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
