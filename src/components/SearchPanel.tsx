import { Search, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

type SearchPanelProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSearching: boolean;
  history: string[];
  onSelect: (v: string) => void;
  onClear: () => void;
};

export default function SearchPanel({
  value,
  onChange,
  onSubmit,
  isSearching,
  history,
  onSelect,
  onClear,
}: SearchPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-xl">
      <form className="flex items-center gap-2" action="." onSubmit={onSubmit}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search any IP address"
            aria-label="IP address"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 py-2 pr-3 pl-10 text-sm text-white placeholder:text-white/30 focus:border-orange-400/40 focus:bg-white/10 focus:ring-2 focus:ring-orange-400/20 focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <button
          type="submit"
          aria-label="Search"
          disabled={isSearching}
          className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 text-sm font-medium text-white shadow-lg transition hover:bg-orange-500 active:scale-95 disabled:opacity-60"
        >
          <Search className={`h-4 w-4 transition ${isSearching ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">Track</span>
        </button>
      </form>

      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-white/5 pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-white/30 uppercase">
                  Recent
                </span>
                <button
                  onClick={onClear}
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-orange-400 hover:text-orange-300"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, idx) => (
                  <motion.button
                    key={item + idx}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-sm transition hover:border-orange-400/30 hover:bg-orange-400 hover:text-white"
                    onClick={() => onSelect(item)}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
