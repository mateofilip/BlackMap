import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import IPMap from "./IPMap.tsx";

type IP = {
  ip: string;
  city: string;
  country: string;
  zip: string;
  isp: string;
  lat: number;
  lon: number;
};

export default function Home() {
  const [IPData, setIPData] = useState<IP>({
    ip: "",
    country: "",
    city: "",
    zip: "",
    isp: "",
    lat: 0,
    lon: 0,
  });
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    if (inputValue && !isValidInput(inputValue)) {
      toast.warning("Please enter a valid IP address.");
      setTimeout(() => setIsSearching(false), 500);
      return;
    }
    if (inputValue) {
      const updatedHistory = [
        inputValue,
        ...searchHistory.filter((item) => item !== inputValue),
      ].slice(0, 4);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    }

    getData(inputValue).finally(() => {
      setTimeout(() => setIsSearching(false), 800);
    });
    setInputValue("");
  };

  // Input validation for IP
  function isValidInput(input: string): boolean {
    // IPv4 regex
    const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 regex (simple)
    const ipv6 = /^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/;
    return ipv4.test(input) || ipv6.test(input);
  }

  async function getData(input: string) {
    const ipParam = input ? input : "";
    try {
      const response = await fetch(
        `https://api.ipquery.io/${ipParam}?format=json`,
      );
      if (!response.ok) {
        toast.error("Network error: Unable to reach the IPQuery service.");
        return;
      }
      const data = await response.json();

      if (data.status === "fail") {
        toast.warning(
          "The IP address couldn't be found, make sure it's written properly!",
        );
        return;
      }

      setIPData({
        ip: data.ip,
        country: data.location.country || "Unknown",
        city: data.location.city || "Unknown",
        zip: data.location.zipcode || "Unknown",
        isp: data.isp.isp || "Unknown",
        lat: data.location.latitude || 0,
        lon: data.location.longitude || 0,
      });

      setDataUpdated(true);
      setTimeout(() => setDataUpdated(false), 750);
    } catch (error) {
      toast.error(
        "A network error occurred. Please check your internet connection and try again.",
      );
    }
  }

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    toast.success("Search history cleared");
  };

  useEffect(() => {
    getData("");
  }, []);

  return (
    <>
      <div className="z-50 flex min-h-dvh flex-col items-center justify-between bg-neutral-800 px-4 text-slate-100">
        <div className="z-50 m-2 flex w-full max-w-xl scale-90 flex-col gap-6 rounded-2xl border border-neutral-700 bg-neutral-400/10 bg-clip-padding p-8 shadow-lg backdrop-blur-sm backdrop-filter md:m-6 md:scale-100">
          <h1 className="mb-2 text-center text-3xl font-bold">
            IP Address Tracker
          </h1>
          <form className="flex gap-2" action="." onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search for any IP address"
              className="flex-1 rounded-l-lg border border-neutral-700 px-4 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="group cursor-pointer rounded-r-lg bg-orange-400 px-6 py-2 text-slate-100 transition-colors duration-300 ease-in-out hover:bg-orange-500"
              disabled={isSearching}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-all duration-300 ease-in-out ${isSearching ? "scale-125" : "scale-100 group-focus:scale-125"}`}
              >
                <path
                  d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </form>
          {searchHistory.length > 0 && (
            <div className="mt-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">Recent searches</span>
                <button
                  onClick={clearHistory}
                  className="cursor-pointer text-xs text-orange-400 transition-colors hover:text-orange-500"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {searchHistory.map((item, idx) => (
                  <button
                    key={item + idx}
                    className="cursor-pointer rounded-full border border-neutral-700 px-3 py-1 text-sm text-gray-400 transition-colors duration-300 ease-in-out hover:border-orange-400 hover:bg-orange-400 hover:text-slate-100"
                    onClick={() => {
                      setInputValue(item);
                      getData(item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {IPData.lat !== 0 && IPData.lon !== 0 && (
          <IPMap
            lat={IPData.lat}
            lon={IPData.lon}
            ip={IPData.ip}
            city={IPData.city}
            country={IPData.country}
          />
        )}
        <Toaster richColors closeButton />

        <div
          className={`z-50 m-6 grid w-full max-w-5xl grid-cols-2 grid-rows-2 justify-center gap-4 rounded-2xl border border-neutral-700 bg-neutral-400/10 bg-clip-padding p-5 text-center shadow-lg backdrop-blur-sm backdrop-filter transition-all duration-500 md:grid-cols-4 md:grid-rows-1 md:justify-between md:rounded-full md:px-16 ${dataUpdated ? "scale-105 border-orange-400" : ""}`}
        >
          <div className="flex flex-col items-center">
            <h3 className="text-xs tracking-wide text-gray-400 uppercase md:text-sm">
              IP ADDRESS
            </h3>
            <span className="mt-1 text-xs font-medium text-gray-100 md:text-base">
              {IPData.ip}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xs tracking-wide text-gray-400 uppercase md:text-sm">
              Location
            </h3>
            <span className="mt-1 text-xs font-medium text-gray-100 md:text-base">
              {IPData.city + ", " + IPData.country}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xs tracking-wide text-gray-400 uppercase md:text-sm">
              ZIP CODE
            </h3>
            <span className="mt-1 text-xs font-medium text-gray-100 md:text-base">
              {IPData.zip}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xs tracking-wide text-gray-400 uppercase md:text-sm">
              ISP
            </h3>
            <span className="mt-1 text-xs font-medium text-gray-100 md:text-base">
              {IPData.isp}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
