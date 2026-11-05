import { Link } from "@tanstack/react-router";

import { DISCORD_INVITE } from "@/lib/bladetiers";

/**
 * Header matching the reference design: logo left, centered text links,
 * Apply + Discord buttons on the right.
 */
export function HomeNav({ active = "home" }: { active?: "home" | "rankings" | "testers" }) {
  return (
    <header className="home-header">
      <Link to="/home" className="home-brand">
        <img src="/assets/branding/blade_tier_logo.png" alt="Blade Tiers logo" />
      </Link>

      <nav className="home-nav" aria-label="Main navigation">
        <Link to="/home" className={`home-nav-link ${active === "home" ? "active" : ""}`}>
          Home
        </Link>
        <Link to="/" className={`home-nav-link ${active === "rankings" ? "active" : ""}`}>
          Rankings
        </Link>
        <Link to="/testers" className={`home-nav-link ${active === "testers" ? "active" : ""}`}>
          Testers
        </Link>
      </nav>

      <div className="home-actions">
        <a className="home-apply-btn" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
          Apply
        </a>
        <a className="home-discord-btn" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
          <img src="/assets/nav_icons/discord.svg" alt="" />
          Discord
        </a>
      </div>
    </header>
  );
}
