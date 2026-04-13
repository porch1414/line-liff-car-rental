/**
 * Profile – LINE user profile page with LIFF SDK info
 * Design: Coastal Breeze — shows liff.getProfile() data prominently
 */
import { useState } from "react";
import {
  User, LogOut, LogIn, ChevronRight, Shield, Bell, HelpCircle,
  Smartphone, Code2, Info, Car, CalendarCheck
} from "lucide-react";
import { useLiffContext } from "@/contexts/LiffContext";
import { useBooking } from "@/contexts/BookingContext";
import { toast } from "sonner";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}

function MenuItem({ icon: Icon, label, value, onClick, danger }: MenuItemProps) {
  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? "bg-red-50" : "bg-[oklch(0.42_0.09_200/0.08)]"}`}>
        <Icon size={18} className={danger ? "text-destructive" : "text-[oklch(0.42_0.09_200)]"} />
      </div>
      <span className={`flex-1 text-sm font-medium text-left ${danger ? "text-destructive" : "text-foreground"}`}
        style={{ fontFamily: "'Noto Sans', sans-serif" }}>
        {label}
      </span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight size={16} className="text-muted-foreground" />
    </button>
  );
}

export default function Profile() {
  const { profile, isLoggedIn, isInClient, liff, login, logout } = useLiffContext();
  const { bookings } = useBooking();
  const [showLiffDebug, setShowLiffDebug] = useState(false);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const totalSpent = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + Math.round(b.totalPrice * 1.05), 0);

  const liffVersion = liff?.getVersion?.() ?? "N/A";
  const liffOS = liff?.getOS?.() ?? "N/A";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-[480px] mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Profile
          </h1>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto">
        {/* Profile Card */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-[oklch(0.42_0.09_200)] to-[oklch(0.35_0.10_210)] p-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {isLoggedIn && profile?.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.displayName}
                    className="w-16 h-16 rounded-2xl object-cover border-3 border-white/30"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      el.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center ${isLoggedIn && profile?.pictureUrl ? "hidden" : ""}`}>
                  <User size={28} className="text-white" />
                </div>
                {isInClient && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[oklch(0.72_0.16_65)] border-2 border-white flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">L</span>
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg leading-tight truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {isLoggedIn && profile ? profile.displayName : "Guest User"}
                </h2>
                {isLoggedIn && profile?.statusMessage && (
                  <p className="text-white/70 text-xs mt-0.5 truncate">{profile.statusMessage}</p>
                )}
                {isLoggedIn && profile?.userId && (
                  <p className="text-white/50 text-[10px] mt-1 font-mono truncate">
                    {profile.userId.substring(0, 20)}…
                  </p>
                )}
                {!isLoggedIn && (
                  <p className="text-white/70 text-xs mt-1">Not connected to LINE</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <CalendarCheck size={16} className="text-[oklch(0.42_0.09_200)]" />
                <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {confirmedBookings}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Active Bookings</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Car size={16} className="text-[oklch(0.72_0.16_65)]" />
                <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {bookings.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Rentals</p>
            </div>
          </div>
        </div>

        {/* LIFF Debug Info */}
        <div className="mx-4 mt-4">
          <button
            className="w-full flex items-center justify-between bg-[oklch(0.42_0.09_200/0.06)] rounded-xl px-4 py-3 mb-1"
            onClick={() => setShowLiffDebug(!showLiffDebug)}
          >
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-[oklch(0.42_0.09_200)]" />
              <span className="text-sm font-semibold text-[oklch(0.42_0.09_200)]" style={{ fontFamily: "'Sora', sans-serif" }}>
                LIFF SDK Info
              </span>
            </div>
            <ChevronRight
              size={16}
              className={`text-[oklch(0.42_0.09_200)] transition-transform ${showLiffDebug ? "rotate-90" : ""}`}
            />
          </button>
          {showLiffDebug && (
            <div className="bg-[oklch(0.18_0.04_200)] rounded-xl p-4 font-mono text-xs animate-slide-up">
              {[
                ["liff.init()", "✅ Initialized"],
                ["liff.isInClient()", isInClient ? "✅ true (LINE app)" : "❌ false (browser)"],
                ["liff.isLoggedIn()", isLoggedIn ? "✅ true" : "❌ false"],
                ["liff.getVersion()", liffVersion],
                ["liff.getOS()", liffOS],
                ["profile.userId", profile?.userId ? profile.userId.substring(0, 16) + "…" : "N/A"],
                ["profile.displayName", profile?.displayName ?? "N/A"],
              ].map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-white/10 last:border-0">
                  <span className="text-[oklch(0.72_0.16_65)]">{key}</span>
                  <span className="text-white/80 ml-2 text-right">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
          <MenuItem
            icon={Bell}
            label="Notifications"
            onClick={() => toast.info("Notification settings coming soon")}
          />
          <MenuItem
            icon={Shield}
            label="Privacy & Security"
            onClick={() => toast.info("Privacy settings coming soon")}
          />
          <MenuItem
            icon={Smartphone}
            label="LINE Environment"
            value={isInClient ? "LINE App" : "Browser"}
            onClick={() => toast.info(`Running in: ${isInClient ? "LINE in-app browser" : "External browser"}`)}
          />
          <MenuItem
            icon={HelpCircle}
            label="Help & Support"
            onClick={() => toast.info("Support coming soon")}
          />
          <MenuItem
            icon={Info}
            label="About DriveEase"
            value="v1.0.0"
            onClick={() => toast.info("DriveEase v1.0.0 — LINE LIFF Car Rental")}
          />
        </div>

        {/* Login/Logout */}
        <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {isLoggedIn ? (
            <MenuItem
              icon={LogOut}
              label="Logout from LINE"
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              danger
            />
          ) : (
            <MenuItem
              icon={LogIn}
              label="Login with LINE"
              onClick={login}
            />
          )}
        </div>
      </div>
    </div>
  );
}
