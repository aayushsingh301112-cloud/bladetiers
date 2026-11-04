import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { SiteNav } from "@/components/SiteNav";
import {
  DISCORD_INVITE,
  FALLBACK,
  MATRIX_GAMEMODES,
  REGION_NAMES,
  getPlayers,
  skinUrl,
} from "@/lib/blade-pages";

const FALLBACK_IMG = "/assets/branding/blade_tier_icon.webp";

function tierDigit(tier?: string | null) {
  const m = tier?.match(/(\d)/);
  return m ? m[1]! : null;
}

function TopPlayerRow({
  player,
  rank,
  onOpen,
}: {
  player: { name: string; points: number; region?: string | null; skin?: string | null; tiers: Record<string, string> };
  rank: number;
  onOpen?: () => void;
}) {
  const reg = player.region?.toUpperCase() ?? "??";
  const pills = MATRIX_GAMEMODES.map((m) => ({ id: m.id, name: m.name, tier: player.tiers[m.id] }))
    .filter((m) => !!m.tier)
    .slice(0, 3);

  return (
    <div className="top-player-row" onClick={onOpen}>
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
          {player.points} pts • {REGION_NAMES[reg] ?? reg}
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
    </div>
  );
}

const FEATURES = [
  {
    icon: "/assets/nav_icons/discord.svg",
    title: "Get Tested",
    text: "Join the Discord and book a tier test. You'll fight ranked 1v1s on chocomc.net against a tester.",
  },
  {
    icon: "/assets/tier_icons/sword.svg",
    title: "Earn Your Tier",
    text: "Our testers grade every fight and assign a tier per kit — from LT5 all the way up to HT1.",
  },
  {
    icon: "/assets/tier_icons/overall.svg",
    title: "Climb the Board",
    text: "Every tier earns points. Stack them across kits, build your total and climb the global leaderboard.",
  },
];

export function OverviewPage() {
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
    <div className="app-container">
      <SiteNav active="overview" />

      <main className="overview-main">
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
              The <span className="gold">#1 Cracked</span> &amp; Premium Tierlist
            </h1>
            <p className="hero-sub">
              Blade Tiers ranks the best Minecraft PvP players on chocomc.net. Compete in ranked 1v1s,
              get tested by top players and claim your spot on the global leaderboard.
            </p>
            <div className="hero-cta">
              <Link to="/" className="hero-btn hero-btn-primary">
                <img src="/assets/tier_icons/overall.svg" alt="" />
                View Rankings
              </Link>
              <a className="hero-btn hero-btn-ghost" href={DISCORD_INVITE} target="_blank" rel="noreferrer">
                <img src="/assets/nav_icons/discord.svg" alt="" />
                Apply for Testing
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{players.length.toLocaleString()}</div>
                <div className="hero-stat-label">Players ranked</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{tiersAssigned.toLocaleString()}</div>
                <div className="hero-stat-label">Tiers assigned</div>
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

        <section className="feature-section">
          <h2 className="section-heading">
            What is <span className="gold">Blade Tiers</span>?
          </h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <img className="feature-icon" src={f.icon} alt="" loading="lazy" decoding="async" />
                <div className="feature-title">{f.title}</div>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div>Copyrights © Blade Tiers 2026 • Minecraft PvP Leaderboard for chocomc.net</div>
      </footer>
    </div>
  );
}
