import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
const apiKey = (await import.meta.env.PUBLIC_API_KEY) as string;

type IP = {
  ip: string;
  city: string;
  country: string;
  timeZone: string;
  isp: string;
  lat: number;
  lng: number;
};

export default function Home() {
  const [IPData, setIPData] = useState<IP>({
    ip: "",
    country: "",
    city: "",
    timeZone: "",
    isp: "",
    lat: 0,
    lng: 0,
  });
  const [inputValue, setInputValue] = useState("");
  const [isDark, setIsDark] = useState(
    document.body.classList.contains("dark"),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getData(inputValue);
    setInputValue("");
  };

  async function getData(input: string) {
    const ipParam = input ? input : "";
    try {
      const response = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipParam}`,
      );
      if (!response.ok) {
        toast.error(
          "The IP address couldn't be found, make sure it's written properly!",
        );
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      setIPData({
        ip: data.ip,
        country: data.location?.country || "Unknown",
        city: data.location?.city || "Unknown",
        timeZone: data.location?.timezone || "Unknown",
        isp: data.isp || "Unknown",
        lat: data.location?.lat || 0,
        lng: data.location?.lng || 0,
      });
    } catch (error) {
      toast.error(
        "The IP address couldn't be found, make sure it's written properly!",
      );
    }
  }

  useEffect(() => {
    const selectedTheme = localStorage.getItem("theme");

    if (selectedTheme) {
      document.body.classList.add(selectedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }

    getData("");
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem(
      "theme",
      localStorage.getItem("theme") === "light" ? "dark" : "light",
    );
    document.body.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen z-50 bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full z-50 max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          IP Address Tracker
        </h1>
        <form className="flex gap-2" action="." onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-r-lg font-semibold transition-colors"
          >
            Search
          </button>

          <button onClick={toggleTheme}>{isDark ? "SUN" : "MOON"}</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              IP Address
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {IPData.ip}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Location
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {IPData.city + ", " + IPData.country}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Timezone
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {IPData.timeZone}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              ISP
            </span>
            <span className="text-lg font-medium text-gray-800 mt-1">
              {IPData.isp}
            </span>
          </div>
        </div>
      </div>

      {IPData.lat !== 0 && IPData.lng !== 0 && (
        <MapContainer center={[IPData.lat, IPData.lng]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            // url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            url={
              "https://{s}.basemaps.cartocdn.com/rastertiles/" +
              (isDark ? "dark_all" : "voyager") +
              '/{z}/{x}/{y}{r}.png"'
            }
          />
        </MapContainer>
      )}
    </div>
  );
}
