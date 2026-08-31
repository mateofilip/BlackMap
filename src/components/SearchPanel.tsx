import { Search, X } from "lucide-react";
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
      {/* Apple toolbar material — light translucent for interactive chrome */}
      <motion.form
        action="."
        onSubmit={onSubmit}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={
          shouldReduceMotion
            ? { duration: 0.2 }
            : { type: "spring", bounce: 0, duration: 0.45 }
        }
        className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 p-1.5 shadow-lg backdrop-blur-2xl backdrop-saturate-150"
        style={{ willChange: "transform" }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search any IP address"
            aria-label="IP address"
            className="h-10 w-full rounded-full bg-transparent py-2 pr-10 pl-10 text-sm font-medium tracking-wide text-white placeholder:text-white/40 focus:outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs font-medium leading-none tracking-wide text-white sm:inline-flex">
            /
          </kbd>
        </div>
        <motion.button
          type="submit"
          aria-label="Search"
          disabled={isSearching}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold tracking-wide text-zinc-900 shadow-md transition-colors hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-60"
          style={{ willChange: "transform" }}
        >
          <Search className={`h-4 w-4 text-zinc-900 ${isSearching ? "animate-pulse" : ""}`} />
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
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-lg backdrop-blur-2xl backdrop-saturate-150"
          >
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                  Recent
                </span>
                <button
                  onClick={onClear}
                  className="flex cursor-pointer items-center gap-1 text-xs font-semibold tracking-wide text-white hover:text-white/80"
                >
                  <X className="h-3 w-3 text-white" />
                  Clear
                </button>
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
                        : { type: "spring", bounce: 0, duration: 0.35, delay: idx * 0.03 }
                    }
                    className="cursor-pointer rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-xl transition hover:border-orange-400/30 hover:bg-orange-400 hover:text-white"
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
