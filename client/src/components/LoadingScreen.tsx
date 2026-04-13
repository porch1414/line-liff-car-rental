/**
 * LoadingScreen – LIFF initialization loading state
 * Design: Coastal Breeze — teal branded loading with animated car
 */
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[oklch(0.42_0.09_200)] flex flex-col items-center justify-center z-50">
      <div className="animate-slide-up text-center">
        {/* Logo mark */}
        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="18" width="40" height="18" rx="4" fill="white" fillOpacity="0.9"/>
            <rect x="10" y="12" width="28" height="10" rx="3" fill="white" fillOpacity="0.7"/>
            <circle cx="13" cy="36" r="5" fill="white"/>
            <circle cx="35" cy="36" r="5" fill="white"/>
            <rect x="2" y="24" width="4" height="6" rx="1" fill="white" fillOpacity="0.6"/>
            <rect x="42" y="24" width="4" height="6" rx="1" fill="white" fillOpacity="0.6"/>
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
          DriveEase
        </h1>
        <p className="text-white/70 text-sm mb-8">Car Rental · Powered by LINE</p>

        {/* Loading dots */}
        <div className="flex items-center gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              style={{
                animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <p className="text-white/50 text-xs mt-4">
          {elapsed < 5 ? "Connecting to LINE…" : "Initializing app..."}
        </p>

        {elapsed > 10 && (
          <div className="mt-8 px-6 text-center">
            <p className="text-white/60 text-xs mb-2">
              Taking longer than expected. Make sure your LIFF ID is configured correctly.
            </p>
            <p className="text-white/40 text-[10px]">
              Check the browser console for details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
