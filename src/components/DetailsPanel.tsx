import { useState, useEffect } from "react";
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
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLoading: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-500">{label}</p>
        <div className="mt-0.5 overflow-visible">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={isLoading ? "loading" : value}
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", bounce: 0, duration: 0.2 }
              }
              className="truncate px-1 -mx-1 py-0.5 -my-0.5 text-sm font-medium leading-relaxed tracking-tight text-neutral-300 drop-shadow-sm"
              style={{ willChange: "filter" }}
            >
              {isLoading ? "—" : value}
            </motion.p>
          </AnimatePresence>
        </div>
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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{
        borderColor: highlight && !shouldReduceMotion ? "rgba(161,161,170,0.2)" : "rgba(64,64,64,0.5)",
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0.2 }
          : { type: "spring", bounce: 0, duration: 0.2 }
      }
      className="w-full overflow-hidden rounded-2xl border bg-neutral-900/40 shadow-lg shadow-black/30 ring-1 ring-neutral-200/5 backdrop-blur-md backdrop-saturate-150"
      style={{ willChange: "transform" }}
    >
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left"
        aria-expanded={isExpanded}
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="text-xl font-bold leading-none tracking-tight text-neutral-200 drop-shadow-sm">BlackMap</h1>
          <div className="mt-2 overflow-visible">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={isExpanded ? "details" : "summary"}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, filter: "blur(4px)", y: 6 }
                }
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, filter: "blur(4px)", y: -6 }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.15 }
                    : { type: "spring", bounce: 0, duration: 0.2 }
                }
                className="block w-full truncate px-1 -mx-1 py-0.5 -my-0.5 text-xs font-medium leading-relaxed tracking-tight text-neutral-500 drop-shadow-sm"
                style={{ willChange: "filter" }}
              >
                {isExpanded ? "Geolocation Details" : `${data.ip || "—"} · ${data.city || "Locating"}`}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <motion.span
          animate={{ rotate: (isDesktop ? isExpanded : !isExpanded) ? 180 : 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0.15 }
              : { type: "spring", bounce: 0, duration: 0.2 }
          }
          className="flex h-7 w-7 shrink-0 items-center justify-center text-neutral-400"
        >
          <ChevronDown className="h-3 w-3 text-neutral-400" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={shouldReduceMotion ? { height: 0 } : { height: 0 }}
            animate={{ height: "auto" }}
            exit={shouldReduceMotion ? { height: 0 } : { height: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: "spring", bounce: 0, duration: 0.2 }
            }
            className="overflow-hidden"
          >
            <div>
              <div>
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
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
