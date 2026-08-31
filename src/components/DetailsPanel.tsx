import { Globe, MapPin, Hash, Server, Navigation, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

export type IP = {
  ip: string;
  city: string;
  country: string;
  zip: string;
  isp: string;
  lat: number;
  lon: number;
};

type DetailsPanelProps = {
  data: IP;
  isLoading: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  highlight: boolean;
};

function Row({
  icon: Icon,
  label,
  value,
  isLoading,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLoading: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 ${accent ? "bg-white/5" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-white/60 ${accent ? "border-orange-400/20 bg-orange-400/10 text-orange-400" : "border-white/5 bg-white/5"}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-white/40 uppercase">{label}</p>
        {isLoading ? (
          <div className="mt-1 h-4 w-32 animate-pulse rounded bg-white/10" />
        ) : (
          <p className={`mt-1 truncate text-sm font-medium text-white ${label === "Coordinates" ? "font-mono" : ""}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DetailsPanel({
  data,
  isLoading,
  isExpanded,
  onToggle,
  highlight,
}: DetailsPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        highlight && !shouldReduceMotion
          ? { scale: 1.02, borderColor: "rgba(251,146,60,0.4)" }
          : { scale: 1, borderColor: "rgba(255,255,255,0.1)" }
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border bg-zinc-900/50 shadow-2xl backdrop-blur-xl"
    >
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition hover:bg-white/5"
        aria-expanded={isExpanded}
      >
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">BlackMap</h1>
          <p className="mt-1 text-xs leading-relaxed text-white/40">
            {isExpanded ? "Geolocation details" : `${data.ip || "—"} · ${data.city || "Locating"}`}
          </p>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="overflow-hidden">
              <div className="divide-y divide-white/5 border-t border-white/5">
                <Row icon={Globe} label="IP Address" value={data.ip} isLoading={isLoading} />
                <Row
                  icon={MapPin}
                  label="Location"
                  value={`${data.city}, ${data.country}`}
                  isLoading={isLoading}
                />
                <Row icon={Hash} label="ZIP Code" value={data.zip} isLoading={isLoading} />
                <Row icon={Server} label="ISP" value={data.isp} isLoading={isLoading} />
                <Row
                  icon={Navigation}
                  label="Coordinates"
                  value={`${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`}
                  isLoading={isLoading}
                  accent
                />
              </div>
              <div className="bg-black/20 px-5 py-3">
                <p className="text-center text-xs leading-relaxed text-white/30">
                  Tap to collapse · Updates live on search
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
