import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { motion, useReducedMotion } from "motion/react";
import IPMap from "./IPMap.tsx";
import StackInfo from "./StackInfo.tsx";
import SearchPanel from "./SearchPanel.tsx";
import DetailsPanel, { type IP } from "./DetailsPanel.tsx";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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

  function isValidInput(input: string): boolean {
    const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    const ipv6 = /^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/;
    return ipv4.test(input) || ipv6.test(input);
  }

  async function getData(input: string) {
    setIsLoading(true);
    const ipParam = input ? input : "";
    try {
      const response = await fetch(`https://api.ipquery.io/${ipParam}?format=json`);
      if (!response.ok) {
        toast.error("Network error: Unable to reach the IPQuery service.");
        return;
      }
      const data = await response.json();

      if (data.status === "fail") {
        toast.warning("The IP address couldn't be found, make sure it's written properly!");
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
      toast.error("A network error occurred. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
    toast.success("Search history cleared");
  };

  const handleSelectHistory = (item: string) => {
    setInputValue(item);
    getData(item);
  };

  useEffect(() => {
    getData("");
  }, []);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-black text-zinc-100 selection:bg-orange-400/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-full max-w-2xl -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      {IPData.lat !== 0 && IPData.lon !== 0 && (
        <IPMap lat={IPData.lat} lon={IPData.lon} ip={IPData.ip} city={IPData.city} country={IPData.country} />
      )}

      <div className="absolute inset-x-4 top-4 z-50 flex flex-col gap-4 md:inset-x-6 md:top-6 md:flex-row md:items-start md:justify-between">
        <div className="order-2 w-full md:order-1 md:w-80 lg:w-96">
          <DetailsPanel
            data={IPData}
            isLoading={isLoading}
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded((v) => !v)}
            highlight={dataUpdated}
          />
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="order-1 w-full md:order-2 md:w-96"
        >
          <SearchPanel
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isSearching={isSearching}
            history={searchHistory}
            onSelect={handleSelectHistory}
            onClear={clearHistory}
          />
        </motion.div>
      </div>

      <Toaster richColors closeButton />
      <StackInfo />
    </div>
  );
}
