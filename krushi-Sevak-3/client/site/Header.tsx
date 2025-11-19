import { Link, NavLink, useNavigate } from "react-router-dom";
import { useI18n } from "./i18n";
import { Button } from "@/components/ui/button";
import { Globe2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.03] ${
    isActive
      ? "text-primary after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-primary/10"
      : "text-muted-foreground hover:text-foreground"
  }`;

export default function Header() {
  const { t, locale, setLocale } = useI18n();
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/40 bg-gradient-to-r from-white/70 via-emerald-50/80 to-white/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-lime-500 transform-gpu transition-transform duration-300 ease-out will-change-transform motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-110 motion-safe:group-hover:translate-y-0.5" />
          <span className="text-lg font-bold tracking-tight">{t.brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navClass} end>
            {t.nav_home}
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink to="/crops" className={navClass}>
                {t.nav_crops}
              </NavLink>
              <NavLink to="/finance" className={navClass}>
                {t.nav_finance}
              </NavLink>
            </>
          )}
          <NavLink to="/schemes" className={navClass}>
            {t.nav_schemes}
          </NavLink>
          <NavLink to="/weather" className={navClass}>
            {t.nav_weather}
          </NavLink>
          <NavLink to="/experts" className={navClass}>
            {t.nav_experts}
          </NavLink>
          <NavLink to="/distributors" className={navClass}>
            {t.nav_distributors}
          </NavLink>
          <NavLink to="/admin" className={navClass}>
            {t.nav_admin}
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full border border-emerald-200/60 bg-white/70 p-1 shadow-sm">
            {(["en", "mr", "hi"] as const).map((l) => (
              <Button
                key={l}
                size="sm"
                variant={locale === l ? "default" : "ghost"}
                onClick={() => setLocale(l)}
                className="px-3"
                aria-label={`switch-language-${l}`}
              >
                {l.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="sm:hidden transition-transform duration-300 motion-safe:hover:-translate-y-0.5" aria-label="switch-language">
            <Globe2 className="h-4 w-4" />
          </Button>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{user?.username}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t.logout_button || "Logout"}</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-lime-500 text-white">
                {t.login_button || "Login"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
