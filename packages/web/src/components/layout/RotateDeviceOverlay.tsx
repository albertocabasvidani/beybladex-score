import { useState, useEffect } from "react";

export function RotateDeviceOverlay() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if portrait (height > width)
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Check on mount
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center gap-6 p-8">
      {/* Rotate icon */}
      <div className="text-8xl animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-yellow-400"
        >
          {/* Phone outline */}
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          {/* Rotation arrow */}
          <path d="M12 18h.01" />
        </svg>
      </div>

      {/* Rotating arrow indicator */}
      <div className="relative w-32 h-32">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-yellow-400 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <path
            d="M50 10 A40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="88,40 95,52 82,52" fill="currentColor" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Ruota il dispositivo
        </h2>
        <p className="text-slate-400">
          Questa app funziona meglio in modalità landscape
        </p>
      </div>
    </div>
  );
}
