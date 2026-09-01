import { Search, X, Clock, Rss } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useRef, useEffect } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if (isInput) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <motion.form
        action="."
        onSubmit={onSubmit}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={
          shouldReduceMotion
            ? { duration: 0.2 }
            : { type: "spring", bounce: 0, duration: 0.4 }
        }
        className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/40 p-1.5 shadow-lg shadow-black/30 ring-1 ring-neutral-200/10 backdrop-blur-md backdrop-saturate-150"
        style={{ willChange: "transform" }}
      >
        <div className="relative flex-1">
          <Rss className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search any IP address"
            aria-label="IP address"
            className="h-10 w-full rounded-full bg-transparent py-2 pr-10 pl-10 text-sm font-medium tracking-tight text-neutral-300 placeholder:text-neutral-500 drop-shadow-sm focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-neutral-700 bg-neutral-800 px-1.5 py-1 text-xs font-medium leading-none tracking-tight text-neutral-400 sm:inline-flex">
            /
          </kbd>
        </div>
        <motion.button
          type="submit"
          aria-label="Search"
          disabled={isSearching}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-6 text-sm font-medium tracking-tight text-neutral-300 shadow-md transition-colors duration-200 hover:border-neutral-600 hover:bg-neutral-700 hover:text-neutral-200 active:bg-neutral-600 disabled:opacity-60"
          style={{ willChange: "transform" }}
        >
          <Search className={`h-4 w-4 text-neutral-300 ${isSearching ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">Track</span>
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, filter: "blur(4px)" }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: "spring", bounce: 0, duration: 0.4 }
            }
            className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 shadow-lg shadow-black/30 ring-1 ring-neutral-200/10 backdrop-blur-md backdrop-saturate-150"
          >
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-medium tracking-tight text-neutral-500">Recent</span>
                <motion.button
                  onClick={onClear}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                  className="inline-flex h-6 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-2.5 text-xs font-medium leading-none tracking-tight text-neutral-400 shadow-sm transition-colors duration-200 hover:border-neutral-600 hover:bg-neutral-700 hover:text-neutral-200"
                  style={{ willChange: "transform" }}
                >
                  <X className="h-3 w-3 shrink-0 translate-y-px text-neutral-400" />
                  Clear
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, idx) => (
                  <motion.button
                    key={item + idx}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, scale: 0.92, filter: "blur(4px)" }
                    }
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)" }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.15 }
                        : { type: "spring", bounce: 0, duration: 0.2, delay: idx * 0.03 }
                    }
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium tracking-tight text-neutral-300 shadow-sm backdrop-blur-md transition-colors duration-200 hover:border-neutral-600 hover:bg-neutral-700 hover:text-neutral-200"
                    style={{ willChange: "transform" }}
                    onClick={() => onSelect(item)}
                  >
                    <Clock className="h-3 w-3 shrink-0 text-neutral-500" />
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
