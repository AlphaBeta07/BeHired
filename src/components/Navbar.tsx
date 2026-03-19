import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Heart, Briefcase, User, LayoutDashboard, LogOut, Flame, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isJobseeker, isEmployer, logout } = useAuth();
  const [location] = useLocation();

  // Public top bar for unauthenticated users
  if (!isAuthenticated) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Flame className="text-primary w-7 h-7 fill-primary" />
            <span className="font-bold text-xl tracking-tight text-white">BeHired</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white font-semibold">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-5 shadow-lg shadow-primary/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Authenticated: floating bottom dock (Tinder-style)
  return (
    <>
      {/* Minimal top brand mark */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex justify-center pt-4">
          <Link href={isJobseeker ? "/swipe" : "/my-listings"} className="pointer-events-auto flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <Flame className="text-primary w-6 h-6 fill-primary" />
            <span className="font-bold text-base tracking-tight text-white">BeHired</span>
          </Link>
        </div>
      </header>

      {/* Tinder-style floating bottom navigation dock */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-4 py-2 rounded-full glass-card shadow-2xl border border-white/10">
        {isJobseeker && (
          <>
            <NavItem href="/swipe" icon={<Briefcase className="w-5 h-5" />} label="Jobs" active={location === "/swipe" || location === "/"} />
            <NavItem href="/matches" icon={<Heart className="w-5 h-5" />} label="Matches" active={location === "/matches"} />
          </>
        )}

        {isEmployer && (
          <>
            <NavItem href="/my-listings" icon={<LayoutDashboard className="w-5 h-5" />} label="Jobs" active={location === "/my-listings" || location === "/"} />
            <NavItem href="/post-job" icon={<PlusSquare className="w-5 h-5" />} label="Post" active={location === "/post-job"} />
            <NavItem href="/matches" icon={<Heart className="w-5 h-5" />} label="Matches" active={location === "/matches"} />
          </>
        )}

        <div className="w-px h-7 bg-white/10 mx-1" />

        <NavItem href="/profile" icon={<User className="w-5 h-5" />} label="Profile" active={location === "/profile"} />

        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all text-white/40 hover:text-destructive hover:bg-destructive/10"
          title="Log Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Logout</span>
        </button>
      </nav>
    </>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all relative",
        active
          ? "text-primary"
          : "text-white/40 hover:text-white/80 hover:bg-white/5"
      )}
    >
      <span className={cn("transition-transform", active && "scale-110")}>{icon}</span>
      <span className={cn("text-[10px] font-bold tracking-wide", active ? "text-primary" : "text-white/40")}>
        {label}
      </span>
      {active && (
        <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );
}
