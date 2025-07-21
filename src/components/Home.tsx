import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Home() {
  return (
    <div className="min-h-screen z-50 bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full z-50 max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          IP Address Tracker
        </h1>
        <form className="flex gap-2">
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-r-lg font-semibold transition-colors"
          >
            Search
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              IP Address
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              192.168.1.1
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Location
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              City, Country
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Timezone
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              UTC +0:00
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              ISP
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              Internet Provider
            </span>
          </div>
        </div>
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
      </MapContainer>
    </div>
  );
}
