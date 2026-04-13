/**
 * LiffContext – App-wide LINE LIFF state provider
 * Design: Coastal Breeze — wraps the entire app with LIFF SDK state
 */
import React, { createContext, useContext } from "react";
import { useLiff, LiffState } from "@/hooks/useLiff";

const LiffContext = createContext<LiffState | null>(null);

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const liffState = useLiff();
  return (
    <LiffContext.Provider value={liffState}>
      {children}
    </LiffContext.Provider>
  );
}

export function useLiffContext(): LiffState {
  const ctx = useContext(LiffContext);
  if (!ctx) throw new Error("useLiffContext must be used within LiffProvider");
  return ctx;
}
