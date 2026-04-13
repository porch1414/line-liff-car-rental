/**
 * BottomNav – Mobile bottom navigation bar
 * Design: Coastal Breeze — sticky bottom nav with teal active state
 */
import { Home, Car, CalendarCheck, User } from "lucide-react";
import { useLocation, Link } from "wouter";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/cars", label: "Cars", icon: Car },
  { path: "/bookings", label: "Bookings", icon: CalendarCheck },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="max-w-[480px] mx-auto flex items-center justify-around">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location === path || (path !== "/" && location.startsWith(path));
          return (
            <Link key={path} href={path}>
              <button className={`bottom-nav-item ${isActive ? "active" : ""}`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-transform duration-200"
                  style={isActive ? { transform: "scale(1.1)" } : {}}
                />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-[oklch(0.42_0.09_200)]" : "text-muted-foreground"}`}
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[oklch(0.42_0.09_200)]" />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
