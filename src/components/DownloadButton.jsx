import { getLogs } from '../DataStore';

export default function DownloadButton() {
  const convertToCSV = (data) => {
    const header = [
      'Date',
      'timestamp',
      'altitude', 
      'pressure', 
      'humidity', 
      'accelerationX', 
      'accelerationY', 
      'accelerationZ', 
      'gyroX', 
      'gyroY', 
      'gyroZ', 
      'temperatureMPU', 
      'temperatureBMP', 
      'latitude', 
      'longitude'
    ];

    const rows = data.map(item => {
      const timestamp = new Date(item.timestamp).toLocaleString(); 
      return [
        timestamp,
        item['BMP280']?.altitude || '',
        item['BMP280']?.pressure || '',
        item['DHT11']?.humidity || '',
        item['MPU6050']?.accX || '',
        item['MPU6050']?.accY || '',
        item['MPU6050']?.accZ || '',
        item['MPU6050']?.gyroX || '',
        item['MPU6050']?.gyroY || '',
        item['MPU6050']?.gyroZ || '',
        item['MPU6050']?.temp || '',
        item['BMP280']?.temp || '',
        item['GPS']?.latitude || '',
        item['GPS']?.longitude || ''
      ].join(',');
    });

    // Join the header and rows to generate CSV content
    return [header.join(','), ...rows].join('\n');
  };

  // Trigger the download of the CSV file
  const downloadCSV = () => {
    const logs = getLogs();  // Fetch logs from DataStore.js
    const csvData = convertToCSV(logs);

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = 'firebase_logs.csv';
    link.click();
  };

  return (
    <button
      onClick={downloadCSV}
      className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center"
    >
      <img
        src="/download.png"  // Image reference is correct
        alt="Download"
        className="h-6 w-6"
      />
    </button>
  );
}
