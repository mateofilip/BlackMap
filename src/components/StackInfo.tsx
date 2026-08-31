import { useState, useEffect } from "react";

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
    { name: "Astro", description: "Web Framework" },
    { name: "React", description: "UI Library" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "Leaflet", description: "Interactive Maps" },
    { name: "Vercel", description: "Infrastructure" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-xl transition hover:scale-105 hover:bg-white/15 active:scale-95"
        aria-label="View Tech Stack"
        title="View Tech Stack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
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
            className={`w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-xl duration-200 ${
              isOpen ? "animate-in zoom-in-95" : "animate-out zoom-out-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-white">Tech Stack</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-3">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <span className="font-semibold text-white">
                    {item.name}
                  </span>
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2 py-1 text-xs font-medium text-orange-400">
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
