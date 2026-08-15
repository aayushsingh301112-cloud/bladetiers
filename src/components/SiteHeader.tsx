import { Link } from "@tanstack/react-router";
import { House, Trophy, Gamepad2, ChevronDown, FileText, Search } from "lucide-react";
import logoAsset from "@/assets/blade_tiers_logo.webp.asset.json";

const navItems = [
  { label: "Home", icon: House, to: "/" },
  { label: "Rankings", icon: Trophy, to: "/" },
  { label: "Discords", icon: Gamepad2, to: "/", caret: true },
  { label: "API Docs", icon: FileText, to: "/" },
];

export function SiteHeader() {
  return (
    <header className="px-4 pt-4">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 rounded-2xl border border-border bg-card/60 px-4 py-3 backdrop-blur">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logoAsset.url}
            alt="Blade Tiers logo"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="hidden text-lg font-extrabold tracking-wide text-foreground sm:inline">
            BLADE TIERS
          </span>
        </Link>

        <ul className="mx-auto hidden items-center gap-6 md:flex">
          {navItems.map(({ label, icon: Icon, to, caret }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
                {caret ? <ChevronDown className="h-3.5 w-3.5" /> : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2 md:ml-0">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search player..."
            aria-label="Search player"
            className="w-24 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:w-40"
          />
          <kbd className="hidden rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline">
            /
          </kbd>
        </div>
      </nav>
    </header>
  );
}
