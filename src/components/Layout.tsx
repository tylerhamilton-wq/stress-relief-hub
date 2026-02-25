import { Link, useLocation } from "react-router-dom";
import { Mail, Heart, Gamepad2, Home, CalendarIcon } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/email-writer", label: "Email Writer", icon: Mail },
  { to: "/stress-coping", label: "Coping Tips", icon: Heart },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/planner", label: "Planner", icon: CalendarIcon },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-primary">
            🌿 StudentZen
          </Link>
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
    </div>
  );
};

export default Layout;
