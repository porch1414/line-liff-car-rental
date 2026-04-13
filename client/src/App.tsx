/**
 * App.tsx – DriveEase LINE LIFF Car Rental
 * Design: Coastal Breeze — mobile-first, teal + amber palette
 * Routes: Home, Cars, CarDetail, Bookings, Profile
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LiffProvider } from "./contexts/LiffContext";
import { BookingProvider } from "./contexts/BookingContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { BottomNav } from "./components/BottomNav";
import { useLiffContext } from "./contexts/LiffContext";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isLoading } = useLiffContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cars" component={Cars} />
        <Route path="/cars/:id" component={CarDetail} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LiffProvider>
          <BookingProvider>
            <TooltipProvider>
              <Toaster position="top-center" richColors />
              <AppContent />
            </TooltipProvider>
          </BookingProvider>
        </LiffProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
