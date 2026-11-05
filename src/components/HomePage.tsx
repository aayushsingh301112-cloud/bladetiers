import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { HomeNav } from "@/components/HomeNav";
import { DISCORD_INVITE, MATRIX_GAMEMODES, getPlayers, skinUrl } from "@/lib/bladetiers";

const FALLBACK_IMG = "/assets/branding/blade_tier_icon.webp";

function tierDigit(tier?: string | null) {
  const m = tier?.match(/(\d)/);
  return m ? m[1]! : null;
}

function TopPlayerRow({
  player,
  rank,
}: {
  player: { name: string; points: number; region?: string | null; skin?: string | null; tiers: Record<string, string> };
  rank: number;
}) {
  const reg = player.region?.toUpperCase() ?? "??";
  const pills = MATRIX_GAMEMODES.map((m) => ({ id: m.id, name: m.name, tier: player.tiers[m.id] }))
    .filter((m) => !!m.tier)
    .slice(0, 3);

  return (
    <Link to="/" className="top-player-row">
      <div className={`top-rank ${rank <= 3 ? `top-rank-${rank}` : ""}`}>
        <span>{rank}</span>
      </div>
      <img
        className="top-avatar"
        src={skinUrl(player.skin) ?? FALLBACK_IMG}
        alt={player.name}
        loading="lazy"
        decoding="async"
        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
      />
      <div className="top-player-info">
        <div className="top-player-name">{player.name}</div>
        <div className="top-player-meta">
          {player.points} pts • {reg}
        </div>
      </div>
      <div className="top-player-pills">
        {pills.map((p) => {
          const d = tierDigit(p.tier);
          return (
            <span key={p.id} className={`mini-pill ${d ? `p${d}` : ""}`} title={`${p.name}: ${p.tier!.toUpperCase()}`}>
              {p.tier!.toUpperCase()}
            </span>
          );
        })}
      </div>
    </Link>
  );
}

export function HomePage() {
  const { data } = useQuery({
    queryKey: ["blade-players"],
    queryFn: getPlayers,
    refetchInterval: 30_000,
  });
  const players = data ?? [];
  const top = players.slice(0, 5);

  const tiersAssigned = players.reduce(
    (sum, p) => sum + Object.values(p.tiers).filter((v) => typeof v === "string" && v.trim()).length,
    0,
  );
  const regions = new Set(players.map((p) => p.region?.toUpperCase()).filter(Boolean)).size;

  return (
    <div className="app-container home-container">
      <HomeNav active="home" />

      <main className="home-main">
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="hero-badge-row">
              <span className="hero-season-pill">Season 1 Active</span>
              <span className="live-tag">
                <span className="live-dot" />
                LIVE
              </span>
            </div>
            <h1 className="hero-title">
              The <span className="gold">#1 Cracked</span>
              <br />
              &amp; Premium Tierlist
            </h1>
            <p className="hero-sub">
              Compete in ranked 1v1s. Get tested by top players. Claim your spot on the global
              leaderboard.
            </p>
            <div className="hero-cta">
              <Link to="/" className="hero-btn hero-btn-primary">
                <img src="/assets/tier_icons/overall.svg" alt="" />
                View Tier List
              </Link>
              <a className="hero-btn hero-btn-ghost" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
                <img src="/assets/nav_icons/discord.svg" alt="" />
                Apply for Testing
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{players.length.toLocaleString()}</div>
                <div className="hero-stat-label">Players Ranked</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{tiersAssigned.toLocaleString()}</div>
                <div className="hero-stat-label">Tiers Assigned</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{regions || "—"}</div>
                <div className="hero-stat-label">Regions</div>
              </div>
            </div>
          </div>

          <aside className="top-players-card">
            <div className="top-players-head">
              <span className="top-players-title">Top Players</span>
              <span className="live-tag">
                <span className="live-dot" />
                LIVE
              </span>
            </div>
            {top.length > 0 ? (
              <>
                {top.map((p, i) => (
                  <TopPlayerRow key={p.name} player={p} rank={i + 1} />
                ))}
                <Link to="/" className="top-players-more">
                  View full leaderboard →
                </Link>
              </>
            ) : (
              <div className="state-box">
                <h3 className="state-title">Loading rankings…</h3>
              </div>
            )}
          </aside>
        </section>
      </main>

      <footer>
        <div>Copyrights © Blade Tiers 2026 • Minecraft PvP Tierlist</div>
      </footer>
    </div>
  );
}
