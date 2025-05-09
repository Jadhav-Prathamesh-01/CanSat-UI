import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getLogs, onNewLog } from "../DataStore";

// Fix Leaflet marker icon paths
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define a custom icon for the marker
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Position of the icon relative to the marker's location
  popupAnchor: [1, -34], // Position of the popup relative to the icon
  shadowSize: [41, 41], // Size of the shadow
});

// Component: Recenter map when coordinates change
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [coords, map]);
  return null;
}

const LocationMap = () => {
  const [latestCoords, setLatestCoords] = useState(null);
  const [mapType, setMapType] = useState("satellite"); // 'satellite' or 'dark'

  // Load latest location from logs
  useEffect(() => {
    const logs = getLogs();
    const lastWithLocation = [...logs].reverse().find(
      (log) => log?.GPS?.latitude && log?.GPS?.longitude
    );
    if (lastWithLocation) {
      setLatestCoords({
        lat: lastWithLocation.GPS.latitude,
        lng: lastWithLocation.GPS.longitude,
      });
    }

    // Live updates
    onNewLog((log) => {
      if (log?.GPS?.latitude && log?.GPS?.longitude) {
        setLatestCoords({
          lat: log.GPS.latitude,
          lng: log.GPS.longitude,
        });
      }
    });
  }, []);

  const tileLayerURL =
    mapType === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative bg-gray-900 border border-gray-700 p-4 mt-0 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          🌍 Live GPS Location
          <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
        </h2>
        <button
          onClick={() =>
            setMapType((prev) => (prev === "satellite" ? "dark" : "satellite"))
          }
          className="text-xs bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition"
        >
          {mapType === "satellite" ? "Switch to Dark" : "Switch to Satellite"}
        </button>
      </div>

      {latestCoords ? (
        <div className="rounded-xl overflow-hidden relative z-0">
          <MapContainer
            center={[latestCoords.lat, latestCoords.lng]}
            zoom={16}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={false}
            style={{ height: "300px", width: "100%" }}
            className="rounded-xl contrast-125 brightness-95"
          >
            <TileLayer url={tileLayerURL} />

            {/* Marker with custom icon */}
            <Marker position={[latestCoords.lat, latestCoords.lng]} icon={customIcon}>
              <Popup>
                <div className="text-sm font-semibold text-white bg-gray-800 px-2 py-1 rounded-md shadow">
                  📍 You are here
                  <br />
                  <span className="text-xs text-gray-300">
                    {latestCoords.lat.toFixed(5)}, {latestCoords.lng.toFixed(5)}
                  </span>
                </div>
              </Popup>
            </Marker>

            <RecenterMap coords={latestCoords} />
          </MapContainer>

          {/* Glowing animation over marker */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-[70%] w-6 h-6 bg-blue-500/40 rounded-full animate-ping z-[1000] pointer-events-none" />
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">Waiting for GPS data...</p>
      )}
    </div>
  );
};

export default LocationMap;