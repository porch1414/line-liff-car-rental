/**
 * useLiff – Custom hook for LINE LIFF SDK integration
 * Design: Coastal Breeze — handles liff.init() and liff.getProfile()
 * Provides: profile, isLoggedIn, isInClient, isLoading, error, liffObject
 *
 * Demo mode: When LIFF_ID is not configured or init fails in dev,
 * the app shows a demo profile so the UI can be previewed.
 */
import { useState, useEffect, useCallback } from "react";

export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface LiffState {
  isLoading: boolean;
  isLoggedIn: boolean;
  isInClient: boolean;
  profile: LiffProfile | null;
  error: string | null;
  liff: typeof import("@line/liff").default | null;
  login: () => void;
  logout: () => void;
}

const LIFF_ID = import.meta.env.VITE_LIFF_ID || "";
const IS_DEMO = !LIFF_ID || LIFF_ID === "YOUR_LIFF_ID_HERE";

const DEMO_PROFILE: LiffProfile = {
  userId: "Udemo12345abcde",
  displayName: "Demo User",
  pictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  statusMessage: "Ready to drive!",
};

export function useLiff(): LiffState {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liffObj, setLiffObj] = useState<typeof import("@line/liff").default | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initLiff() {
      // Demo mode: skip real LIFF init, use mock data
      if (IS_DEMO) {
        await new Promise((r) => setTimeout(r, 1000)); // simulate loading
        if (!cancelled) {
          setProfile(DEMO_PROFILE);
          setIsLoggedIn(true);
          setIsInClient(false);
          setError("Demo mode: Set VITE_LIFF_ID to use real LINE auth");
          setIsLoading(false);
        }
        return;
      }

      try {
        // Dynamically import LIFF SDK (client-side only)
        const liff = (await import("@line/liff")).default;

        await liff.init({
          liffId: LIFF_ID,
          withLoginOnExternalBrowser: true,
        });

        if (cancelled) return;

        const inClient = liff.isInClient();
        const loggedIn = liff.isLoggedIn();

        setIsInClient(inClient);
        setIsLoggedIn(loggedIn);
        setLiffObj(liff);

        if (loggedIn) {
          try {
            const userProfile = await liff.getProfile();
            if (!cancelled) {
              setProfile({
                userId: userProfile.userId,
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage,
              });
            }
          } catch (profileErr) {
            console.warn("Could not fetch LIFF profile:", profileErr);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "LIFF initialization failed";
          console.error("LIFF init error:", err);
          setError(message);
          // Fallback to demo profile on error
          setProfile(DEMO_PROFILE);
          setIsLoggedIn(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initLiff();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(() => {
    if (liffObj) {
      liffObj.login();
    } else if (IS_DEMO) {
      // In demo mode, just set logged in
      setIsLoggedIn(true);
      setProfile(DEMO_PROFILE);
    }
  }, [liffObj]);

  const logout = useCallback(() => {
    if (liffObj) {
      liffObj.logout();
    }
    setIsLoggedIn(false);
    setProfile(null);
  }, [liffObj]);

  return {
    isLoading,
    isLoggedIn,
    isInClient,
    profile,
    error,
    liff: liffObj,
    login,
    logout,
  };
}
