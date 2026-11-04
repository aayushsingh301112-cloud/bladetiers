import { Link } from "@tanstack/react-router";

import { DISCORD_INVITE } from "@/lib/bladetiers";

/** Shared top navigation for the secondary pages (Overview, Testers). */
export function SiteNav({ active }: { active: "overview" | "testers" }) {
  return (
    <header className="navbar">
      <Link to="/" className="nav-brand">
        <img src="/assets/branding/blade_tier_logo.png" alt="Blade Tiers logo" />
      </Link>

      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">
            <img src="/assets/nav_icons/rankings.svg" alt="" />
            <span>Rankings</span>
          </Link>
        </li>
        <li>
          <Link to="/testers" className={`nav-link ${active === "testers" ? "active" : ""}`}>
            <img src="/assets/nav_icons/rankings.svg" alt="" />
            <span>Testers</span>
          </Link>
        </li>
        <li>
          <Link to="/overview" className={`nav-link ${active === "overview" ? "active" : ""}`}>
            <img src="/assets/nav_icons/home-muted.svg" alt="" />
            <span>Overview</span>
          </Link>
        </li>
        <li>
          <a className="nav-link" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            <img src="/assets/nav_icons/discord.svg" alt="" />
            <span>Discord</span>
          </a>
        </li>
      </ul>

      <div className="nav-search" hidden />
    </header>
  );
}
