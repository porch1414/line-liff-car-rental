/**
 * useLiff – Custom hook for LINE LIFF SDK integration
 * Design: Coastal Breeze — handles liff.init() and liff.getProfile()
 * Provides: profile, isLoggedIn, isInClient, isLoading, error, liffObject
 *
 * Real LIFF ID: 2009783995-5jNmR0fy
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

// Real LIFF ID for DriveEase
const LIFF_ID = "2009783995-5jNmR0fy";
const LIFF_INIT_TIMEOUT = 8000; // 8 second timeout

export function useLiff(): LiffState {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInClient, setIsInClient] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liffObj, setLiffObj] = useState<typeof import("@line/liff").default | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function initLiff() {
      try {
        // Set timeout for LIFF initialization
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.warn("LIFF initialization timeout - proceeding without full init");
            setIsLoading(false);
            setError("LIFF initialization timed out. Some features may be limited.");
          }
        }, LIFF_INIT_TIMEOUT);

        // Dynamically import LIFF SDK (client-side only)
        const liff = (await import("@line/liff")).default;

        console.log("Initializing LIFF with ID:", LIFF_ID);

        await liff.init({
          liffId: LIFF_ID,
          withLoginOnExternalBrowser: true,
        });

        if (cancelled) return;

        // Clear timeout on successful init
        if (timeoutId) clearTimeout(timeoutId);

        const inClient = liff.isInClient();
        const loggedIn = liff.isLoggedIn();

        console.log("LIFF initialized:", { inClient, loggedIn });

        setIsInClient(inClient);
        setIsLoggedIn(loggedIn);
        setLiffObj(liff);

        if (loggedIn) {
          try {
            const userProfile = await liff.getProfile();
            if (!cancelled) {
              console.log("Profile fetched:", userProfile.displayName);
              setProfile({
                userId: userProfile.userId,
                displayName: userProfile.displayName,
                pictureUrl: userProfile.pictureUrl,
                statusMessage: userProfile.statusMessage,
              });
            }
          } catch (profileErr) {
            console.warn("Could not fetch LIFF profile:", profileErr);
            // Non-fatal: app still works without profile
          }
        } else {
          console.log("User not logged in. Prompting login...");
          // User not logged in - they'll need to login
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "LIFF initialization failed";
          console.error("LIFF init error:", err);
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
    }

    initLiff();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const login = useCallback(() => {
    if (liffObj) {
      console.log("Triggering LINE login...");
      liffObj.login();
    }
  }, [liffObj]);

  const logout = useCallback(() => {
    if (liffObj) {
      console.log("Logging out...");
      liffObj.logout();
      setIsLoggedIn(false);
      setProfile(null);
    }
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
