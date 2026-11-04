import { SiteNav } from "@/components/SiteNav";
import { DISCORD_INVITE } from "@/lib/bladetiers";

export function TestersPage() {
  return (
    <div className="app-container">
      <SiteNav active="testers" />

      <main className="testers-main">
        <section className="rankings-card testers-card">
          <h1 className="section-heading">
            Blade Tiers <span className="gold">Testers</span>
          </h1>
          <p className="testers-intro">
            The testing staff behind Blade Tiers — the players who run tier tests, grade fights and
            assign every tier on the leaderboard.
          </p>

          <div className="state-box testers-state">
            <h3 className="state-title">Tester profiles coming soon.</h3>
            <p className="state-subtitle">
              Testers will be listed here once they are registered — the same way players are loaded
              automatically. Want to become a tester? Apply in the Discord.
            </p>
            <a className="hero-btn hero-btn-primary testers-cta" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
              <img src="/assets/nav_icons/discord.svg" alt="" />
              Apply in Discord
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div>Copyrights © Blade Tiers 2026 • Minecraft PvP Leaderboard for chocomc.net</div>
      </footer>
    </div>
  );
}
