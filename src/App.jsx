import Header from "./components/Header";
import BMPChart from "./components/BMPChart";
import MPUChart from "./components/MPUChart";
import DHTChart from "./components/DHTChart";
import LocationMap from "./components/LocationMap";
import ConnectionStatus from "./components/ConnectionStatus";
import MPUModelViewer from "./components/MPUModelViewer";
import LatestSensorData from "./components/LatestSensorData";
import Footer from "./components/Footer"; 

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white px-4 py-1">
      <Header />

      <div className="mt-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        
        <div className="flex flex-col gap-4">
          <BMPChart />
          <MPUChart />
        </div>

        <div className="flex flex-col items-center gap-4">
          <ConnectionStatus />
          <MPUModelViewer /> 
          <LatestSensorData />
        </div>

        <div className="flex flex-col gap-4">
          <DHTChart />
          <LocationMap />
          <Footer />
        </div>
      </div>
    </div>
  );
}
