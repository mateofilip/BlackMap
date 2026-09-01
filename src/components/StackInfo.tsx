import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

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
        className="animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-[60] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-300 shadow-lg shadow-black/30 ring-1 ring-neutral-200/10 backdrop-blur-md backdrop-saturate-150 transition hover:bg-neutral-800 hover:text-neutral-200 active:scale-95"
        aria-label="View Tech Stack"
        title="View Tech Stack"
      >
        <Info className="h-5 w-5 text-neutral-300" />
      </button>

      {shouldRender && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-200 ${
            isOpen ? "animate-in fade-in" : "animate-out fade-out"
          }`}
          onClick={() => setIsOpen(false)}
          onAnimationEnd={onAnimationEnd}
        >
          <div
            className={`w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-2xl shadow-black/30 ring-1 ring-neutral-200/10 backdrop-blur-md backdrop-saturate-150 duration-200 ${
              isOpen ? "animate-in zoom-in-95" : "animate-out zoom-out-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-neutral-200">Tech Stack</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-full p-1 text-neutral-400 transition-colors duration-200 hover:bg-neutral-200/10 hover:text-neutral-200"
              >
                <X className="h-5 w-5 text-neutral-400" />
              </button>
            </div>
            <ul className="space-y-2">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-800 px-3 py-3 transition-colors hover:border-neutral-700 hover:bg-neutral-700"
                >
                  <span className="font-medium tracking-tight text-neutral-300">
                    {item.name}
                  </span>
                  <span className="rounded-full border border-neutral-700 bg-neutral-900/40 px-2 py-1 text-xs font-medium tracking-tight text-neutral-400">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs tracking-tight text-neutral-500">Built with ❤️ by Mateo</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
