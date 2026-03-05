import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Heart, Gamepad2, Home, CalendarIcon, Activity, BookOpen, Sparkles, Sun, Headphones } from "lucide-react";
import ThemeCustomizer, { useTheme } from "@/components/ThemeCustomizer";
import logoImg from "@/assets/Logo_Final.png";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/email-writer", label: "Email Writer", icon: Mail },
  { to: "/stress-coping", label: "Coping Tips", icon: Heart },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/planner", label: "Planner", icon: CalendarIcon },
  { to: "/stretching", label: "Stretching", icon: Activity },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/meditation", label: "Meditation", icon: Sparkles },
  { to: "/affirmations", label: "Affirmations", icon: Sun },
  { to: "/sleep-sounds", label: "Sounds", icon: Headphones },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [themeOpen, setThemeOpen] = useState(false);
  const { currentTheme, setCurrentTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            onClick={() => setThemeOpen(true)}
            className="text-lg font-bold text-primary transition-transform hover:scale-105 active:scale-95"
            title="Customize theme"
          >
            🌿 StudentZen
          </button>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <ThemeCustomizer
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />
    </div>
  );
};

export default Layout;
