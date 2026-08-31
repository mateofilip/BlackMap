import { useState, useEffect } from "react";
import { Info, X, Rocket, Atom, Palette, Map, Cloud } from "lucide-react";

export default function StackInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  const stack = [
    { name: "Astro", description: "Web Framework", Icon: Rocket },
    { name: "React", description: "UI Library", Icon: Atom },
    { name: "Tailwind CSS", description: "Styling", Icon: Palette },
    { name: "Leaflet", description: "Interactive Maps", Icon: Map },
    { name: "Vercel", description: "Infrastructure", Icon: Cloud },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/5 bg-black/40 text-white shadow-lg backdrop-blur-2xl backdrop-saturate-150 transition hover:scale-105 hover:bg-black/60 active:scale-95"
        aria-label="View Tech Stack"
        title="View Tech Stack"
      >
        <Info className="h-5 w-5" />
      </button>

      {shouldRender && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 ${
            isOpen ? "animate-in fade-in" : "animate-out fade-out"
          }`}
          onClick={() => setIsOpen(false)}
          onAnimationEnd={onAnimationEnd}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border border-white/5 bg-black/50 p-6 shadow-xl backdrop-blur-2xl backdrop-saturate-150 duration-200 ${
              isOpen ? "animate-in zoom-in-95" : "animate-out zoom-out-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white">Tech Stack</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1 text-white transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <ul className="space-y-2">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white">
                    <item.Icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="flex-1 font-medium tracking-wide text-white">
                    {item.name}
                  </span>
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-1 text-xs font-medium tracking-wide text-orange-400">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs text-white/30">Built with care by Mateo</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
